// var siteDomain = "https://" + document.domain;
var siteDomain = "http://localhost:7071";

var gameId;

$(document).ready(function () {

    gameId = $.urlParam('id');

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = $('.needs-validation');
    Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    $.ajax({
        url: siteDomain + "/getgame",
        type: "GET",
        data: {
            id: gameId
        },
        dataType: "json",
        success: function (data) {

            $('#gameName').text(`Join ${data.name}`);
            $('#main').collapse('show');

            console.log(data);
        },
        error: function (_, textStatus) {
            console.log(textStatus)
        }
    });
});

$('#joinGameForm').submit(function (event) {
    event.preventDefault();

    if ($.trim($('#playerName').val()) != '') {

        var joinGameData = {
            "playerName": $('#playerName').val(),
            "gameId": gameId
        };

        $.ajax({
            url: siteDomain + "/joingame",
            type: "POST",
            data: JSON.stringify(joinGameData),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                $('#yourGameLink a').attr('href', `/answer.html?playerId=${data.playerId}`);

                $('#joinGameForm input').prop('disabled', true);
                $('#joinGameForm button').prop('disabled', true);

                // display URL to game's site
                $('#yourGameLink').collapse('show');
            },
            error: function (_, textStatus) {
                console.log(textStatus)
            }
        });
    }
});

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
}