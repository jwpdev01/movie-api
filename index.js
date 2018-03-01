$(document).ready(function () {
    $('.form-submit').on('submit', function (e) {
        e.preventDefault();
        let query = getFieldValue('.search-bar');
        queryOMDBAPI_AJAX(query);

    });

});

function getFieldValue(fieldName) {
    return $(fieldName).val();

}

function queryOMDBAPI_AJAX(searchText) {
    $.ajax({
        url: 'https://www.omdbapi.com/?apikey=15e15451&t=' + searchText,
        dataType: 'json',
        type: 'GET',
        success: function (data) {
            let actors = data.Actors.split(', ')    ;
            $('.movie-title').html(`
                ${data.Title}
            `);
            $('.js-poster').html(`
            <img src='${data.Poster} alt='movie poster'>`);
            $('.movie-description').html(`<div class='movie-plot'>${data.Plot}</div>`);

            let actorsResult = buildActorList(actors);
            console.log(actorsResult);
            $('.movie-actors').html(`                
                <div class='movie-actors'>${actorsResult}</div>
            `);
        }
    });
}


function buildActorList(actors) {
    let htmlText = "<ul>";

    for (let x = 0; x < actors.length; x++) {
        htmlText = htmlText + "<li><a href='#'>" + actors[x] + "</a></li>";
    }

    htmlText = htmlText + "</ul>";
    return htmlText;
}