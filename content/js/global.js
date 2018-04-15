$(function() {
    var openAPICallsOnLoad = $("input[type=hidden]#open-api-calls").val().toLowerCase() === "true";

    if (openAPICallsOnLoad) {
        openAPICalls();
    }

    $(".view-api-calls").on("click", function() {
        openAPICalls();

        $.post("/api-calls/is-open", { open: true });
    });

    $(".close-api-calls").on("click", function() {
        $("body").removeClass("api-calls-open");
        $(".api-calls").hide();

        $.post("/api-calls/is-open", { open: false });
    });

    function openAPICalls() {
        $("body").addClass("api-calls-open");
        $(".api-calls").show();
    }
});