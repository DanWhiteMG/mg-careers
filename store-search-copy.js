// Declare variables

const url = "https://prod-18.uksouth.logic.azure.com:443/workflows/b025dcff1b5d4f8d92cef2dc5aa372b7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ChGFOW5dqQylSDku0ZyhPKn53mUPSlblYM9XaevD6LQ";

let numberOfJobs = 0; 
let storedQuery = "";

// Use wildcard query to retrieve all results for initial load

const DEFAULT_QUERY = {'search': "*"};

// Override default browser behaviour and use Enter key to submit search

document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        getJobPostings(getInputValue(), showSearchResultsPage);
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

// Function to store the results of query in sessionStorage to be used on Find a Job page

function storeQueryData(array) {
    let str = JSON.stringify(array);
    sessionStorage.setItem('query', str);
}

// Function to set a location in sessionStore to be used as a filter on Find a Job page

function searchJobsInLocation(location) {
    sessionStorage.setItem('location', location);
    showSearchResultsPage();
}

document.getElementById("search-scotland").addEventListener("click", () => searchJobsInLocation('scotland'));
document.getElementById("search-wales").addEventListener("click", () => searchJobsInLocation('wales'));
document.getElementById("search-northern-ireland").addEventListener("click", () => searchJobsInLocation('northern-ireland'));
document.getElementById("search-england").addEventListener("click", () => searchJobsInLocation('england'));

// Callback function to parse JSON results from API

function getSearchResults() {
    const queryResponse = JSON.parse(xhttp.responseText);
    jsonString = queryResponse.value;
    storeQueryData(jsonString);   
}

// Ajax call to API to retrieve search results based on search input with variable callback function

const xhttp = new XMLHttpRequest();

function getJobPostings(query, cFunction) {

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(query));
    xhttp.onload = function () {
        cFunction();
    }
}

// Callback function to navigate to new page

function showSearchResultsPage() {
    getSearchResults();
    // window.location.assign("/find-a-job");
    window.location.assign("file:///Users/leesquires/Desktop/Websites/Careers/search-query.html");
}

// Retrieve initial results using wildcard query or retrieve stored results in sessionStorage

init()

function init() {
    getJobPostings(DEFAULT_QUERY, getSearchResults);
    setTimeout(function () {
        storedQuery = sessionStorage.getItem('query');
        storedQuery = JSON.parse(storedQuery);
        numberOfJobs = storedQuery.length;
        let counter = document.getElementById("counter");
        counter.innerHTML = numberOfJobs;
    }, 2000);
}