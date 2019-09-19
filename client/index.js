const siteDomain = "http://localhost:8000";
const functionsDomain = "http://localhost:7071";

// const siteDomain = "https://clickerpc.z19.web.core.windows.net";
// const functionsDomain = "https://clicker-pc.azurewebsites.net";

var playerId;
var publicId;

$(document).ready(function () {

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
        url: functionsDomain + "/game",
        type: "GET",
        dataType: "json",
        success: function (data) {
            $('#liveStandings').bootstrapTable({
                data: data.players,
                formatNoMatches: function () {
                    return "Waiting for players to join...";
                }
            });
        },
        error: function (_, textStatus) {
            console.log(textStatus)
        }
    });
});

$('#joinGameForm').submit(function (event) {
    event.preventDefault();

    $('#addingPlayer').collapse('show');

    if ($.trim($('#playerName').val()) != '') {
        $('#joinGameForm input').prop('disabled', true);
        $('#joinGameForm button').prop('disabled', true);

        var joinGameData = {
            "name": $('#playerName').val()
        };

        $.ajax({
            url: functionsDomain + "/join",
            type: "POST",
            data: JSON.stringify(joinGameData),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                playerId = data.id;
                publicId = data.publicId;
            },
            error: function (_, textStatus) {
                console.log(textStatus)
            }
        });
    }
});

$('#clickerButton').click(function (event) {
    console.log('click')
});

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    } else {
        return results[1] || 0;
    }
}

const connect = () => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${functionsDomain}/api`)
        .build();

    connection.onclose(() => {
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
    });

    connection.on('playerJoined', player => {
        console.log('playerJoined');

        if (player["publicId"] == publicId) {
            $('#addingPlayer').collapse('hide');

            // display player's board
            $('#playerBoard .card-header').text(`${player["name"]}'s board`);
            $('#playerBoard').collapse('show');
        }

        if ($('.no-records-found').length > 0) {
            $('.no-records-found').addClass('collapse');
        }

        var rowNumber = $('#liveStandings tbody tr').length;
        var newPlayerRow = $(`<tr data-index='${rowNumber}'>`);
        var cols = "";

        cols += `<td class="collapse">${player["publicId"]}</td>`;
        cols += `<td>${player["name"]}</td>`;
        cols += `<td>${player["clicks"]}</td>`;

        newPlayerRow.append(cols);
        $('#liveStandings').append(newPlayerRow);
        console.log(player);
    });

    connection.on('announceWinner', player => {
        console.log('announceWinner');
        console.log(player);
    });

    connection.on('updateScore', player => {
        console.log('updateScore');
        console.log(player);
    });

    connection.on('startGame', time => {
        console.log('startGame');
        console.log('Starting the game in ' + time);
    });

    connection.start().then(() => {
        console.log("SignalR connection established");
    });
};

connect();