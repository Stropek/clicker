const siteDomain = "http://localhost:8000";
const functionsDomain = "http://localhost:7071";

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
        url: functionsDomain + "/getgame",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data.id);
            $('#liveStandings').bootstrapTable({data: data.players});
            console.log(data.players);
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
            "playerName": $('#playerName').val()
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

                // display URL to game's site
                $('#clicker').collapse('show');
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

// function refreshPlayers();

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
        console.log('players updated');
    });

    connection.start().then(() => {
        console.log("SignalR connection established");
    });
};

connect();