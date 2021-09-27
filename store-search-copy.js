// Declare variables

let _0xee6d=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x70\x72\x6F\x64\x2D\x31\x38\x2E\x75\x6B\x73\x6F\x75\x74\x68\x2E\x6C\x6F\x67\x69\x63\x2E\x61\x7A\x75\x72\x65\x2E\x63\x6F\x6D\x3A\x34\x34\x33\x2F\x77\x6F\x72\x6B\x66\x6C\x6F\x77\x73\x2F\x62\x30\x32\x35\x64\x63\x66\x66\x31\x62\x35\x64\x34\x66\x38\x64\x39\x32\x63\x65\x66\x32\x64\x63\x35\x61\x61\x33\x37\x32\x62\x37\x2F\x74\x72\x69\x67\x67\x65\x72\x73\x2F\x6D\x61\x6E\x75\x61\x6C\x2F\x70\x61\x74\x68\x73\x2F\x69\x6E\x76\x6F\x6B\x65\x3F\x61\x70\x69\x2D\x76\x65\x72\x73\x69\x6F\x6E\x3D\x32\x30\x31\x36\x2D\x30\x36\x2D\x30\x31\x26\x73\x70\x3D\x25\x32\x46\x74\x72\x69\x67\x67\x65\x72\x73\x25\x32\x46\x6D\x61\x6E\x75\x61\x6C\x25\x32\x46\x72\x75\x6E\x26\x73\x76\x3D\x31\x2E\x30\x26\x73\x69\x67\x3D\x43\x68\x47\x46\x4F\x57\x35\x64\x71\x51\x79\x6C\x53\x44\x6B\x75\x30\x5A\x79\x68\x50\x4B\x6E\x35\x33\x6D\x55\x50\x53\x6C\x62\x6C\x59\x4D\x39\x58\x61\x65\x76\x44\x36\x4C\x51"];const url=_0xee6d[0]

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

function searchJobsInLocationOrCategory(key, location) {
    sessionStorage.setItem(key, location);
    showSearchResultsPage();
}

// location filter buttons
document.getElementById("search-scotland").addEventListener("click", () => searchJobsInLocationOrCategory('location','scotland'));
document.getElementById("search-wales").addEventListener("click", () => searchJobsInLocationOrCategory('location','wales'));
document.getElementById("search-northern-ireland").addEventListener("click", () => searchJobsInLocationOrCategory('location','northern-ireland'));
document.getElementById("search-england").addEventListener("click", () => searchJobsInLocationOrCategory('location','england'));
// category filter buttons
document.getElementById("search-housing-maintenance").addEventListener("click", () => searchJobsInLocationOrCategory('category','housing-repairs-maintenance'));
document.getElementById("search-care").addEventListener("click", () => searchJobsInLocationOrCategory('category','care'));
document.getElementById("search-housing-management").addEventListener("click", () => searchJobsInLocationOrCategory('category','housing-management'));

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