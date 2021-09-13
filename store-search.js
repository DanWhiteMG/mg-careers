// Declare variables

const xhttp = new XMLHttpRequest();

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

// Function to get input value and use for search

function getInputValue() {

    let input = document.getElementById("job-search-input").value;
    
    let queryData = {
        'search': input + "*"
    };

    return queryData;
}

function storeQueryData(array) {

    let str = JSON.stringify(array);

    sessionStorage.setItem('query', str);

}

// Callback function to parse JSON results from API

function getSearchResults() {

    const queryResponse = JSON.parse(xhttp.responseText);

    jsonString = queryResponse.value;

    storeQueryData(jsonString);   
    
}

// Ajax call to API to retrieve search results based on search input with variable callback function

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

    window.location.assign("/search-query");

}