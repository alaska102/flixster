// GLOBAl CONSTANTS
const API_KEY = "8fb52c5ec6da0eeeaf25da9b9268f83e"
const BASE_API_URL  = "https://api.themoviedb.org/3"
const API_KEY_QUERY = "?api_key=" + API_KEY
 
let searchTerm = "";
let currentPage = 1;
let latestApiCall = ""
 
const moviesGrid = document.querySelector("#movies-grid");
const searchBtn = document.querySelector("#clicker");
const closeSearchBtn = document.querySelector("#close-search-btn");
const loadMoreBtn = document.querySelector("#load-more-movies-btn");
const popupContainer = document.querySelector("#popup-container");
const popupEl = document.querySelector("#popup");

searchBtn.addEventListener("click", handleSearchFormSubmit);
closeSearchBtn.addEventListener("click", closeSearch);
loadMoreBtn.addEventListener("click", loadMoreMovies);
popupContainer.addEventListener("click", hidePopup);


async function callAPI (apiRequestURL){
    let response = await fetch(apiRequestURL);
    let responseData = await response.json();
    return responseData;
}

async function getResults (apiRequestURL){
    latestApiCall = apiRequestURL
    results = await callAPI(apiRequestURL)
    return results
}

function displayMovieResults (resultsData){
    movieResults = resultsData.results; 
    movieResults.forEach( movie => createMovieCard(movie))
}

async function displayNowPlaying (){
    movieResults = await getResults(BASE_API_URL + "/movie/now_playing" + API_KEY_QUERY);
    displayMovieResults(results);
 }

function createMovieCard (movieObject){
    movieCardID = "movie-"+movieObject.id;

    let movieCardDiv = document.createElement('div');
    movieCardDiv.className = "movie-card";
    document.getElementById("movies-grid").appendChild(movieCardDiv);

    let posterPath = movieObject.poster_path
    posterDisplayURL = (posterPath ? "https://image.tmdb.org/t/p/original"+posterPath : "https://fl-1.cdn.flockler.com/embed/no-image.svg") 
    
    movieCardDiv.innerHTML = `
        <img class="movie-poster"
            src="${posterDisplayURL}"
            alt="${movieObject.title} (${movieObject.year}) poster image"
            movieid="${movieCardID}"
            >
        <div class="half-overlay" movieid="${movieCardID}"}">
            <div class="movie-card-info" movieid="${movieCardID}">
                <h3 class="movie-votes" movieid="${movieCardID}">★ ${movieObject.vote_average}</h3>
                <h2 class="movie-title" movieid="${movieCardID}">${movieObject.title}</h2>
            </div>
        </div>`;

    movieCardDiv.addEventListener('click', handleMovieCardClick)
}

 async function handleSearchFormSubmit (event){
    event.preventDefault();
    moviesGrid.innerHTML = "";
    currentPage = 1;
    
    searchTerm = document.getElementById('search-input').value;
    movieResults = await getResults(BASE_API_URL + "/search/movie" + API_KEY_QUERY + "&query=" + searchTerm)
    displayMovieResults(movieResults)
    closeSearchBtn.classList.remove("hidden");
 }

 function closeSearch (event){
    moviesGrid.innerHTML = "";
    currentPage = 1;
    displayNowPlaying();
    closeSearchBtn.classList.add("hidden");
 }
 


 async function handleMovieCardClick (event) {
    movieID = (event.target.attributes.movieid.value).slice(6);
    movieObject = await callAPI(BASE_API_URL + "/movie/" + movieID + API_KEY_QUERY);
    movieVideoObject = await callAPI(BASE_API_URL + "/movie/" + movieID + "/videos" + API_KEY_QUERY);
    let trailerKey = movieVideoObject.results.filter(video => video.type === "Trailer" && video.site === "YouTube")[0]
    popupEl.innerHTML = `
        <img class="movie-header" src="https://image.tmdb.org/t/p/w500${movieObject.poster_path}">
        <div id = "more-info">
        <h1>${movieObject.title}</h1>
        <span>★ ${movieObject.vote_average}/10</span>
        <br><br>
        <p>${movieObject.overview}</p>
        <br><br>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailerKey.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        
        </div>
    `
    console.log(movieObject.poster_path)
    showPopup();
}

function showPopup (event) {
    popupContainer.classList.remove("hidden");
    popupEl.classList.remove("hidden");
}

function hidePopup (event) {
    popupContainer.classList.add("hidden");
    popupEl.classList.add("hidden");
}
 
async function loadMoreMovies (){
    console.log('clicked')
    currentPage += 1
    results = await getResults(latestApiCall+"&page=" + currentPage)
    displayMovieResults(results)
 }

 window.onload = function () {
    currentPage = 1;
    displayNowPlaying();
   }