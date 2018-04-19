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
        var form = $('#myModal form');
        //if (form.valid()) {
            form.submit();
        //}
    });

    window.Parsley.on("form:success", function(e) {
        $("#validation-errors").hide();
    }); 

    window.Parsley.on("form:error", function() {
        // hide any successful status messages that are currently being shown
        $(".alert-success").hide();

        var errorMessages = this.$element.find(".parsley-error").map(function() { 
            return "<li>" + $(this).attr("data-required-message") + "</li>"; 
        }).toArray();

        var $validationErrors = $("#validation-errors");

        $validationErrors.find("ul").html(errorMessages);
        $validationErrors.show();
    });          
});