$(function() {
    var openAPICallsOnLoad = $("input[type=hidden]#open-api-calls").val().toLowerCase() === "true";
    var apiCallsHeight = $("input[type=hidden]#api-calls-height").val();

    var resizeable = $(".api-calls").resizable({
        handleSelector: ".row.resize-handle",
        resizeWidth: false,
        resizeHeight: true,
        resizeHeightFrom: "top",
        onDrag: function (e, $el, newWidth, newHeight, opt) {
            setAPICallsHeight(newHeight);
       }                      
    });

    if (openAPICallsOnLoad) {
        openAPICalls();
        setAPICallsHeight(apiCallsHeight);
    }

    $(".view-api-calls").on("click", function() {
        openAPICalls();

        $.post("/api-calls/is-open", { open: true });
    });

    $(".close-api-calls").on("click", function() {
        $("body").removeClass("api-calls-open");
        $("body").removeAttr("style");
        $(".api-calls").hide();

        $.post("/api-calls/is-open", { open: false });
    });

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
        var errorMessages = this.$element.find(".parsley-error").map(function() { 
            return $(this).attr("data-required-message");
        }).toArray();

        showValidationErrors(errorMessages);
    });          
});

function openAPICalls() {
    $("body").addClass("api-calls-open");
    $(".api-calls").show();
}

function setAPICallsHeight(height) {
    if (height < 50) {
        height = 50;
    }

    $(".api-calls").height(height);
    $("body.api-calls-open").css("margin-bottom", height + "px");
    $(".api-calls-container").css("height", height - 36 + "px");

    $.post("/api-calls/size", { size: height });

    return false;
}

function showValidationErrors(errors) {
    // hide any successful status messages that are currently being shown
    $(".alert-success").hide();
    
    var errorMessages = errors.map(function(error) { 
        return "<li>" + error + "</li>";
    });
    var $validationErrors = $("#validation-errors");

    $validationErrors.find("ul").html(errorMessages);
    $validationErrors.show();

    $("html, body").animate({
        scrollTop: $validationErrors.offset().top
    }, 500);    
}

function getUrlVars() {
    var output = [];
    var parts = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for (var i = 0; i < parts.length; i++) {
        var qsParts = parts[i].split('=');

        if (qsParts.length === 1) {
            continue;
        }

        var name = qsParts[0];
        var value = qsParts[1].split('#')[0];

        if (value) {
            // get the query string value without the hash value
            value = value.split('#')[0];
        }

        output[name] = value;
    }

    return output;
}