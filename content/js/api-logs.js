$(function() {
    if (!Templates.loaded) {
        Templates.onLoaded = getLogs();
    }
    else {
        getLogs();
    }
});

function getLogs() {
    $.get("/api-calls/data").then(function(data) {
        var context = { 
            data: data
        };

        $(".api-calls-container").html(Templates["apiCallsTemplate"](context));                

        setTimeout(getLogs, 1000);
    });
}