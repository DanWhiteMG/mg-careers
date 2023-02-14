// POST URL for Relevance Search in Microsoft Power Apps

let _0xee6d = ["\x68\x74\x74\x70\x73\x3a\x2f\x2f\x70\x72\x6f\x64\x2d\x32\x33\x2e\x75\x6b\x73\x6f\x75\x74\x68\x2e\x6c\x6f\x67\x69\x63\x2e\x61\x7a\x75\x72\x65\x2e\x63\x6f\x6d\x3a\x34\x34\x33\x2f\x77\x6f\x72\x6b\x66\x6c\x6f\x77\x73\x2f\x63\x61\x61\x34\x31\x38\x63\x37\x35\x34\x34\x34\x34\x37\x33\x36\x62\x33\x64\x34\x35\x64\x65\x33\x65\x34\x65\x32\x61\x66\x39\x33\x2f\x74\x72\x69\x67\x67\x65\x72\x73\x2f\x6d\x61\x6e\x75\x61\x6c\x2f\x70\x61\x74\x68\x73\x2f\x69\x6e\x76\x6f\x6b\x65\x3f\x61\x70\x69\x2d\x76\x65\x72\x73\x69\x6f\x6e\x3d\x32\x30\x31\x36\x2d\x30\x36\x2d\x30\x31\x26\x73\x70\x3d\x25\x32\x46\x74\x72\x69\x67\x67\x65\x72\x73\x25\x32\x46\x6d\x61\x6e\x75\x61\x6c\x25\x32\x46\x72\x75\x6e\x26\x73\x76\x3d\x31\x2e\x30\x26\x73\x69\x67\x3d\x41\x63\x79\x47\x66\x33\x65\x6d\x35\x31\x7a\x58\x74\x47\x53\x68\x49\x6b\x62\x64\x53\x35\x72\x65\x38\x39\x53\x32\x62\x70\x5f\x73\x43\x55\x6e\x44\x62\x53\x4e\x70\x5f\x73\x73"];
const url = _0xee6d[0]

// Use wildcard query to retrieve all results for initial load

const DEFAULT_QUERY = {
    'search': "*"
};

// Override default browser behaviour and use Enter key to submit search

document.addEventListener('keypress', function(e) {
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

function stringToDate(_date, _format, _delimiter) {
    let formatLowerCase = _format.toLowerCase();
    let formatItems = formatLowerCase.split(_delimiter);
    let dateItems = _date.split(_delimiter);
    let monthIndex = formatItems.indexOf("mm");
    let dayIndex = formatItems.indexOf("dd");
    let yearIndex = formatItems.indexOf("yyyy");
    let month = parseInt(dateItems[monthIndex]);
    month -= 1;
    let formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}

// Function to print array to DOM

const searchResults = document.getElementById("search-results-wrapper");
const numberOfResults = document.getElementById("results");

function printArrayToDOM(array) {
    searchResults.innerHTML = "";

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
            newLink.href = `/find-a-job/${array[i].cr24b_jobrequisitionid}`;
            jobTitle.textContent = array[i].cr24b_jobpostingtitle;
            jobReqId.textContent = array[i].cr24b_jobrequisitionid;
            jobType.textContent = array[i].cr24b_workersubtype;
            jobLocation.textContent = `${array[i].cr24b_primaryjobpostinglocation} - ${array[i].cr24b_primaryjobpostinglocationhierarchy}`;
            jobSalary.textContent = array[i].cr24b_pay_text + array[i].cr24b_pay_to + array[i].cr24b_pay_from + array[i].cr24b_pay_rate + array[i].cr24b_jobsalary;
            // amend date format to UK date format for Last Updated Date
			
			
			
            let lastUpdated = stringToDate(array[i].cr24b_recruitingstartdate, "yyyy-mm-dd", "-"); //Updated
            lastUpdated = lastUpdated.toLocaleDateString(lastUpdated);
            jobDate.textContent = `Recruiting Start Date: ${lastUpdated}`; //Updated
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
        numberOfResults.textContent = `Showing ${array.length} jobs`
    } else {
		numberOfResults.textContent = "No results found";
        searchResults.textContent = "Your search returned no results. Try something else, like 'plumber'.";
	}
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

const walesCheckbox = document.getElementById("wales");
const scotlandCheckbox = document.getElementById("scotland");
const niCheckbox = document.getElementById("northern-ireland");

let checkboxValuesRegion = [];
let checkboxValuesCategory = [];

// Execute filterCheckboxes() when checkbox is clicked

checkboxes.forEach((box)=>{
    box.checked = false;
    box.addEventListener("change", ()=>filterCheckboxes());
}
);

// Add checked checkbox value to array

function getCheckboxValues(checkboxValues, checkboxes) {
    checkboxValues = [];
    checkboxes.forEach((checkbox)=>{
        if (checkbox.checked)
            checkboxValues.push(checkbox.value);
    }
    );
    return checkboxValues;
}

// Apply filter based on passed values from homepage
// Applies the necessary checkboxes based on the category or location selected

function applyLocationOrCategoryQuery() {
    let locationQuery = sessionStorage.getItem('location');
    let categoryQuery = sessionStorage.getItem('category');
    if (locationQuery) {
        console.log(locationQuery);
        if (locationQuery === "england") {
            regionCheckboxes.forEach((box)=>{
                box.checked = true;
            }
            )
            walesCheckbox.checked = false;
            scotlandCheckbox.checked = false;
            niCheckbox.checked = false;
        } else {
            let locationCheckbox = document.getElementById(locationQuery);
            locationCheckbox.checked = true;
        }
        filterCheckboxes();
        sessionStorage.removeItem('location');
    } else if (categoryQuery) {
        let categoryCheckbox = document.getElementById(categoryQuery);
        categoryCheckbox.checked = true;
        filterCheckboxes();
        sessionStorage.removeItem('category');
    }
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
            filteredRegion = unfilteredJobs.filter(e=>e.cr24b_primaryjobpostinglocationhierarchy === checkboxValuesRegion[i]);
            sumFilter.push(...filteredRegion)
        }
        // Run printArrayToDOM function but using the filtered array
        printArrayToDOM(sumFilter);
    }// Filter if only a category filter is defined and pass to sumFilter
    else if (checkboxValuesRegion.length < 1 && checkboxValuesCategory.length > 0) {
        for (let i = 0; i < checkboxValuesCategory.length; i++) {
            filteredCategory = unfilteredJobs.filter(e=>e.cr24b_job_category === checkboxValuesCategory[i]);
            sumFilter.push(...filteredCategory)
        }
        // Run printArrayToDOM function but using the filtered array
        printArrayToDOM(sumFilter);
    }// Filter only if both a region and category filter are assigned. Pass to filteredCategory first and then to sumFilter.
    else if (checkboxValuesRegion.length > 0 && checkboxValuesCategory.length > 0) {
        for (let i = 0; i < checkboxValuesRegion.length; i++) {
            filteredRegion = unfilteredJobs.filter(e=>e.cr24b_primaryjobpostinglocationhierarchy === checkboxValuesRegion[i]);
            filteredCategory.push(...filteredRegion)
        }
        // Now that the array is filtered by region, filter the array further using the category filter
        for (let i = 0; i < checkboxValuesCategory.length; i++) {
            filteredBoth = filteredCategory.filter(e=>e.cr24b_job_category === checkboxValuesCategory[i]);
            sumFilter.push(...filteredBoth)
        }
        // Run printArrayToDOM function but using the filtered array
        printArrayToDOM(sumFilter);
    }
    else {
        // Run printArrayToDOM using no filters
        printArrayToDOM(unfilteredJobs);
    }

}

function clearCheckboxes() {
    checkboxes.forEach((box)=>{
        box.checked = false;
    }
    );
}

// Ajax call to API to retrieve search results based on search input

const xhttp = new XMLHttpRequest();

function getJobPostings(query, cFunction) {
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(query));
    xhttp.onload = function() {
        cFunction();
    }
}

const searchInput = document.getElementById("job-search-input");

function clearSearchArray() {
    clearCheckboxes();
    searchInput.value = "";
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
    } else {
        storedQuery = JSON.parse(storedQuery);
        printArrayToDOM(storedQuery);
    }
    applyLocationOrCategoryQuery();
}
