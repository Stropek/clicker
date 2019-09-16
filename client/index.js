// var siteDomain = "https://" + document.domain;
var siteDomain = "http://localhost:7071";

$(document).ready(function () {

});

$('#newGame').click(function (event) {
    event.preventDefault();

    $.ajax({
        url: siteDomain + "/creategame",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            $('#newGameLink a').attr('href', `/game.html?id=${data.id}`);

            // display URL to game's site
            $('#newGameLink').collapse('show');
        },
        error: function (_, textStatus) {
            console.log(textStatus)
        }
    });
});