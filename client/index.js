// var siteDomain = "https://" + document.domain;
var siteDomain = "http://localhost:7071";

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
});

$('#joinGameForm').submit(function (event) {
    event.preventDefault();

    if ($.trim($('#playerName').val()) != '') {

        var joinGameData = {
            "playerName": $('#playerName').val()
        };

        $.ajax({
            url: siteDomain + "/join",
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