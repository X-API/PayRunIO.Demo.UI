var previousCallData = [];

$(function() {
    if (!Templates.loaded) {
        Templates.onLoaded = getLogs();
    }
    else {
        getLogs();
    }

    $(document).on("click", ".btn-copy", function () {
        var $self = $(this);
        var $code = $self.parent().find("code");
        var text = $code.text();

        copyTextToClipboard(text);
    });
});

function getLogs() {
    $.get("/api-calls/data").then(function(data) {
        var context = { 
            data: data
        };

        if (previousCallData.length !== data.length) {
            $(".api-calls-container").html(Templates["apiCallsTemplate"](context));
        }

        previousCallData = data;

        setTimeout(getLogs, 1500);
    });
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';

    console.log('Fallback: Copying text command was ' + msg);
  
    document.body.removeChild(textArea);
}  