$(function() {
    $(".view-api-calls").on("click", function() {
        $("body").addClass("api-calls-open");
        $(".api-calls").show();
    });

    $(".close-api-calls").on("click", function() {
        $("body").removeClass("api-calls-open");
        $(".api-calls").hide();        
    });
});