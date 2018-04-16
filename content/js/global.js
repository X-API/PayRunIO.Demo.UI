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

    $('.launch-modal').on('click', function(e){
        e.preventDefault();

        if (this.hasAttribute("data-modal-title")) {
            var title = this.getAttribute("data-modal-title");
            $('#myModal').find('h4.modal-title').text(title);
        }

        $('#myModal').modal('show').find('.modal-body').load($(this).attr('href'));
    });

    $('#myModal button[type=submit]').on('click', function(e) {
        e.preventDefault();
           
        var form = $('#myModal form');
        form.submit();
    });

});