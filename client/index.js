const siteDomain = "http://localhost:8000";
const functionsDomain = "http://localhost:7071";

// const siteDomain = "https://clickerpc.z19.web.core.windows.net";
// const functionsDomain = "https://clicker-pc.azurewebsites.net";

var playerId;

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
            $('#liveStandings').bootstrapTable({data: data.players, formatNoMatches: function() { return "Waiting for players to join..."; }});
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

                $('#joinGameForm input').prop('disabled', true);
                $('#joinGameForm button').prop('disabled', true);

                // display player's board
                $('#playerBoard .card-header').text(`${data.name}'s board`);
                $('#playerBoard').collapse('show');
            },
            error: function (_, textStatus) {
                console.log(textStatus)
            }
        });
    }
});

$('#readyButton').click(function (event) {

    var readyData = {
        "playerId": playerId
    };

    $.ajax({
        url: functionsDomain + "/ready",
        type: "POST",
        data: JSON.stringify(readyData),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            
            if (!data.ready) {
                $('#readyButton').collapse('hide');
                $('#waitingInfo').collapse('show');
            } else {
                
            }
        },
        error: function (_, textStatus) {
            console.log(textStatus)
        }
    });
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

    connection.onclose(()  => {
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
    });

    connection.on('playersUpdated', players => {
        $('#liveStandings').bootstrapTable({data: players});
    });

    connection.on('countdownReset', time => {
        console.log('Countdown reset to ' + time);
    });

    connection.start().then(() => {
        console.log("SignalR connection established");
    });
};

connect();