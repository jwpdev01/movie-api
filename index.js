const OMDBAPI = 'https://www.omdbapi.com/?apikey=15e15451&t=';
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/channel/";
const YOUTUBE_API_KEY = "AIzaSyAFrScEUoPW6ZBrHIvuAeEDsplHAqS_gl0";
let pageToken;
let prevPageToken;
let nextPageToken;
let query;

$(document).ready(function () {
    $('.form-submit').on('submit', function (e) {
        e.preventDefault();
        clearAllDivs();
        getAPIs($('input[name=search-types]:checked').val());
    });

});

getFieldValue = (fieldName) => $(fieldName).val();

function getAPIs(apiSearch) {
    query = getFieldValue('.search-bar');
    if (apiSearch === 'ajax') {
        queryOMDBAPI_AJAX(query);
    } else {
        queryOMDABPI_GETJQUERY(query);
    }
}

function queryOMDBAPI_AJAX(searchText) {
    $.ajax({
        url: OMDBAPI + searchText,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            updateMovieResults(data);
        }
    });
}

function queryOMDABPI_GETJQUERY(searchText) {
    $.getJSON(OMDBAPI + searchText, function (data) {
        updateMovieResults(data);
    });
}

function updateMovieResults(data) {
    console.log(data);
    if (data.Response !== "False") {
        $('.movie-information').html(`Movie Synopsis`);
    
        clearErrorMessage();
        setMovieTitle(data.Title, data.Year);
        setMoviePosterImage(data.Poster);
        setMoviePlot(data.Plot);
        setMovieActorsList(buildActorList(data.Actors.split(', ')));
        setupGAPIClient(); /* display youtube video */
    } else {
        console.log(data.Error);
        setErrorMessage(data.Error);
    }
}

function clearAllDivs(){
    $('.movie-misc').empty();
    $('.movie-title').empty();
    $('.js-poster').empty();
    $('.movie-actors').empty();
    $('.movie-description').empty();
    $('.video-container').empty();
    $('.movie-poster').empty();
    $('.movie-actors').empty();
    $('.vid').empty();
    $('.img-link').empty();
    $('.thumb').empty();
}

function setErrorMessage(errorMessage) {
    $('.movie-misc').html(`<div class='error'>${errorMessage}</div>`);
}

function clearErrorMessage() {
    $('.movie-misc').html(`<div class='error'></div>`);
}

function setMovieTitle(title, year) {
    $('.movie-title').html(`${title}  (${year})`);
}

function setMoviePosterImage(posterImage) {
    $('.js-poster').html(`<img src='${posterImage} alt='movie poster' class='movie-poster'>`);
}

function setMoviePlot(moviePlot) {
    $('.movie-description').html(`<h4>Movie Plot</h4><div class='movie-plot'>${moviePlot}</div>`);
}

function buildActorList(actors) {
    let htmlText = "<ul><li><h4>Lead Actors</h4></li>";

    for (let x = 0; x < actors.length; x++) {
        htmlText = htmlText + "<li>" + actors[x] + "</li>";
    }

    htmlText = htmlText + "</ul>";
    return htmlText;
}

function setMovieActorsList(actorsList) {
    $('.movie-actors').html(`<div class='movie-actors'>${actorsList}</div>`);
}



/* YOUTUBE API CODE BELOW */
function setupGAPIClient(e) {
    gapi.client.setApiKey(YOUTUBE_API_KEY);
    gapi.client.load('youtube', 'v3', function () {
        makeRequest();
    });
}

function makeRequest() {
    getResponse(getRequest(query, 'snippet, id', 3, pageToken));
}

function getRequest(q, paramPart, paramMaxResults, paramPageToken) {
    return gapi.client.youtube.search.list({
        q: q + " trailer" + " official",
        part: paramPart,
        pageToken: paramPageToken,
        maxResults: paramMaxResults
    });
}


function getResponse(request) {
    $('.video-container').empty();
    let counter = 0;

    request.execute(function (response) {
        let searchResults = response.result.items;
        let vidtag = "";
        console.log(searchResults);
        resetVideoContainers();

        for (let counter = 0; counter < searchResults.length; counter++) {
            let item = searchResults[counter];
             $('.video-container').append(`
             <div class="vid">
                <div class='img-link'>
                    <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">
                        <img class="thumb" src="${item.snippet.thumbnails.high.url}" alt=${item.snippet.description}">
                    </a>
                </div>
                <div class='title'>${item.snippet.title}</div>
                </div>
                `);
        }
    });
}

function resetVideoContainers() {
    $('.vid').empty();
}