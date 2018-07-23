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

    $(document).on("click", ".summary", function () {
        var $self = $(this);
        var id = $self.attr("data-id");
        var apiCall = previousCallData.find(x => x.id.toString() === id.toString());

        if (apiCall) {
            var content = Templates["apiCallDetailsTemplate"](apiCall);
            var $apiCallsContainer = $(".api-calls-container");

            $apiCallsContainer.find(".request-and-response").html(content);

            $apiCallsContainer.animate({ scrollTop: 0 }, 500);                
        }
    });    
});

function getLogs() {
    $.get("/api-calls/data").then(function(data) {
        var context = { 
            data: data
        };

        if (previousCallData.length !== data.length) {
            $(".api-calls-container").html(Templates["apiCallsTemplate"](context));

            tippy(".btn");
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
  
    document.body.removeChild(textArea);
}  