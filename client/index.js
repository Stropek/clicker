const siteDomain = "http://localhost:8000";
const functionsDomain = "http://localhost:7071";

// const siteDomain = "https://clickerpc.z19.web.core.windows.net";
// const functionsDomain = "https://clicker-pc.azurewebsites.net";

var playerId;
var playerName;
var publicId;
var countdownId;

$(document).ready(function () {

    playerId = cookies.get('clicker.playerId');
    playerName = cookies.get('clicker.playerName');
    publicId = cookies.get('clicker.publicId');

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

            if (publicId) {
                var playerFound = false;
                $.each(data.players, function (_, player) {
                    if (player.publicId == publicId) {
                        playerFound = true;
                    }
                });

                if (playerFound) {
                    $('#joinGameForm input').val(playerName);

                    disableForm();
                    showBoard(playerName, data.game);
                }
            }
        },
        error: function (_, textStatus) {
            console.log(textStatus)
        }
    });
});

$('#joinGameForm').submit(function (event) {
    event.preventDefault();

    if ($.trim($('#playerName').val()) != '') {
        $('#addingPlayer').collapse('show');

        disableForm();

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
                playerName = data.playerName;
                publicId = data.publicId;

                cookies.set('clicker.playerId', data.id);
                cookies.set('clicker.playerName', data.name);
                cookies.set('clicker.publicId', data.publicId);
            },
            error: function (_, textStatus) {
                console.log(textStatus)
            }
        });
    }
});

$('#clicker').click(function (event) {
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

const disableForm = () => {
    $('#joinGameForm input').prop('disabled', true);
    $('#joinGameForm button').prop('disabled', true);
};

const showBoard = (playerName, game) => {
    // display player's board
    $('#playerBoard .card-header').text(`${playerName}'s board`);
    if (game.numberOfPlayers < game.minPlayers) {
        $('#waitingInfo').html(`Waiting for more players to join - at least ${game.minPlayers} players are required.`);
    } else {
        $('#waitingInfo').collapse('hide');
        $('#clicker').collapse('show');
    }

    $('#playerBoard').collapse('show');
};

const connect = () => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${functionsDomain}/api`)
        .build();

    connection.onclose(() => {
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
    });

    connection.on('playerJoined', (player, game) => {
        console.log('playerJoined');

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

        if (player["publicId"] == publicId) {
            $('#addingPlayer').collapse('hide');

            showBoard(player["name"], game);
        }

        if (game.numberOfPlayers >= game.minPlayers) {
            $('#waitingInfo').collapse('hide');
            $('#clicker').collapse('show');
        }
    });

    connection.on('announceWinner', player => {
        console.log('announceWinner');
        console.log(player);
    });

    connection.on('updateScore', player => {
        console.log('updateScore');
        console.log(player);
    });

    connection.start().then(() => {
        console.log("SignalR connection established");
    });
};

connect();