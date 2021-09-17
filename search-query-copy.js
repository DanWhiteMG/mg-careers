// POST URL for Relevance Search in Microsoft Power Apps

const url = "https://prod-18.uksouth.logic.azure.com:443/workflows/b025dcff1b5d4f8d92cef2dc5aa372b7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ChGFOW5dqQylSDku0ZyhPKn53mUPSlblYM9XaevD6LQ";

// Use wildcard query to retrieve all results for initial load

const DEFAULT_QUERY = {'search': "*"};

// Override default browser behaviour and use Enter key to submit search

document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        getJobPostings(getInputValue(), getSearchResults);
    }      
});

// Function to get input value and use for search

function getInputValue() {
    let input = document.getElementById("job-search-input").value;
    let queryData = {
        'search': input + "*"
    };
    return queryData;
}

// Function to store results of query in session storage

let storedQuery;

function storeQueryData(array) {
    let str = JSON.stringify(array);
    sessionStorage.setItem('query', str);
    storedQuery = sessionStorage.getItem('query');
}

// Function to format date to UK date format

function stringToDate(_date,_format,_delimiter) {
    let formatLowerCase=_format.toLowerCase();
    let formatItems=formatLowerCase.split(_delimiter);
    let dateItems=_date.split(_delimiter);
    let monthIndex=formatItems.indexOf("mm");
    let dayIndex=formatItems.indexOf("dd");
    let yearIndex=formatItems.indexOf("yyyy");
    let month=parseInt(dateItems[monthIndex]);
    month-=1;
    let formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

// Function to print array to DOM

const searchResults = document.getElementById("search-results-wrapper");
const numberOfResults = document.getElementById("results");

function printArrayToDOM(array) {
    searchResults.innerHTML = "";
    // sort array by last updated so that when filtered, the most recent results are shown
    array.sort((a, b) => {
        let dateA = new Date(a.cr24b_lastupdateddate);
        let dateB = new Date(b.cr24b_lastupdateddate);
        return dateB - dateA;
    });
    console.log(array);
    if (array.length > 0) {
        // loop through JSON array and print search results to DOM
        for (let i = 0; i < array.length; i++) {
            // create div wrapper for each job
            let newDiv = document.createElement("div");
            newDiv.classList.add("job-wrapper");
            //put a link around each div
            let newLink = document.createElement("a");
            newLink.classList.add("job-link-wrapper");
            // create job title and add class
            let jobTitle = document.createElement("h2");
            jobTitle.classList.add("job-heading")
            // create job req id and add class
            let jobReqId = document.createElement("p");
            jobReqId.classList.add("job-req-id");
            // create job type and add class
            let jobType = document.createElement("p");
            jobType.classList.add("job-type");
            // create job location and add class
            let jobLocation = document.createElement("p");
            jobLocation.classList.add("job-location");
            // create job salary and add class
            let jobSalary = document.createElement("p");
            jobSalary.classList.add("job-salary");
            // create job salary and add class
            let jobDate = document.createElement("p");
            jobDate.classList.add("job-date");
            // add content to created elements
            newLink.href = `https://mears-careers.webflow.io/find-a-job/${array[i].cr24b_jobrequisitionid}`;
            jobTitle.textContent = array[i].cr24b_jobpostingtitle;
            jobReqId.textContent = array[i].cr24b_jobrequisitionid;
            jobType.textContent = array[i].cr24b_workersubtype;
            jobLocation.textContent = `${array[i].cr24b_primaryjobpostinglocation} - ${array[i].cr24b_primaryjobpostinglocationhierarchy}`; 
            jobSalary.textContent = array[i].cr24b_pay_text;
            // amend date format to UK date format for Last Updated Date
            let lastUpdated = stringToDate(array[i].cr24b_lastupdateddate,"MM/dd/yyyy","/");
            lastUpdated = lastUpdated.toLocaleDateString(lastUpdated);
            jobDate.textContent = `Last updated: ${lastUpdated}`;
            // append content to parent elements
            newLink.appendChild(jobReqId);
            newLink.appendChild(jobTitle);
            newLink.appendChild(jobType);
            newLink.appendChild(jobLocation);
            newLink.appendChild(jobSalary);
            newLink.appendChild(jobDate);
            newDiv.appendChild(newLink);
            searchResults.appendChild(newDiv);
        }
        numberOfResults.textContent = `Showing ${array.length} results`
    }
    else searchResults.textContent = "Your search returned no results. Try something else, like 'plumber'.";
}

// Callback function to parse JSON results from API

function getSearchResults() {
    const queryResponse = JSON.parse(xhttp.responseText);
    storedQuery = queryResponse.value;
    printArrayToDOM(storedQuery);
    storeQueryData(storedQuery);
}

// Target checkboxes for filtering

const checkboxes = document.querySelectorAll("div.mc-filter-wrapper > div > div.mc-checkbox > input[type='checkbox']");
const regionCheckboxes = document.querySelectorAll("div.mc-region-filter-wrapper > div > input[type='checkbox']");
const categoryCheckboxes = document.querySelectorAll("div.mc-category-filter-wrapper > div > input[type='checkbox']");

let checkboxValuesRegion = [];
let checkboxValuesCategory = [];

// Execute filterCheckboxes() when checkbox is clicked

checkboxes.forEach((box) => {
    box.checked = false;
    box.addEventListener("change", () => filterCheckboxes());
});

// Add checked checkbox value to array

function getCheckboxValues(checkboxValues, checkboxes) {
    checkboxValues = [];
    checkboxes.forEach((checkbox) => {
          if (checkbox.checked) checkboxValues.push(checkbox.value);
    });
    return checkboxValues;
}

// Filter stored array based on value of checkboxes

function filterCheckboxes() {
    let unfilteredJobs = sessionStorage.getItem('query');
    unfilteredJobs = JSON.parse(unfilteredJobs);
    checkboxValuesRegion = getCheckboxValues(checkboxValuesRegion, regionCheckboxes);
    checkboxValuesCategory = getCheckboxValues(checkboxValuesCategory, categoryCheckboxes);
    // Define arrays to filter values into
    let filteredRegion = [];
    let filteredCategory = [];
    let filteredBoth = [];
    let sumFilter = [];
    // Filter if only a region filter is defined and pass to sumFilter
    if (checkboxValuesRegion.length > 0 && checkboxValuesCategory.length < 1) {
        for (let i = 0; i < checkboxValuesRegion.length; i++) {
            filteredRegion = unfilteredJobs.filter(e => e.cr24b_primaryjobpostinglocationhierarchy === checkboxValuesRegion[i]);
            sumFilter.push(...filteredRegion)
        }
        // Run printArrayToDOM function but using the filtered array
        printArrayToDOM(sumFilter);
    }
    // Filter if only a category filter is defined and pass to sumFilter
    else if (checkboxValuesRegion.length < 1 && checkboxValuesCategory.length > 0) {
        for (let i = 0; i < checkboxValuesCategory.length; i++) {
            filteredCategory = unfilteredJobs.filter(e => e.cr24b_job_category === checkboxValuesCategory[i]);
            sumFilter.push(...filteredCategory)
        }
        // Run printArrayToDOM function but using the filtered array
        printArrayToDOM(sumFilter);
    }
    // Filter only if both a region and category filter are assigned. Pass to filteredCategory first and then to sumFilter.
    else if (checkboxValuesRegion.length > 0 && checkboxValuesCategory.length > 0) {
        for (let i = 0; i < checkboxValuesRegion.length; i++) {
            filteredRegion = unfilteredJobs.filter(e => e.cr24b_primaryjobpostinglocationhierarchy === checkboxValuesRegion[i]);
            filteredCategory.push(...filteredRegion)
        }
        // Now that the array is filtered by region, filter the array further using the category filter
        for (let i = 0; i < checkboxValuesCategory.length; i++) {
            filteredBoth = filteredCategory.filter(e => e.cr24b_job_category === checkboxValuesCategory[i]);
            sumFilter.push(...filteredBoth)
        }
        // Run printArrayToDOM function but using the filtered array
        printArrayToDOM(sumFilter);
    }   else {
        // Run printArrayToDOM using no filters
        printArrayToDOM(unfilteredJobs);
    }
        
}

function clearCheckboxes() {
    checkboxes.forEach((box) => {
        box.checked = false;
    });
}

// Ajax call to API to retrieve search results based on search input

const xhttp = new XMLHttpRequest();

function getJobPostings(query, cFunction) {
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(query));
    xhttp.onload = function () {
        cFunction();
    }
}

function clearSearchArray() {
    clearCheckboxes();
    sessionStorage.clear();
    searchResults.innerHTML = "";
    init();
}

// Retrieve initial results using wildcard query or retrieve stored results in sessionStorage

init()

function init() {
    let storedQuery = sessionStorage.getItem('query');
    if (!storedQuery) {
        getJobPostings(DEFAULT_QUERY, getSearchResults);
    }
    else {
        storedQuery = JSON.parse(storedQuery);
        printArrayToDOM(storedQuery);
    }        
}