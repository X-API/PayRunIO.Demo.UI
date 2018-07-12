$(function() {
    var hash = window.location.hash;
    
    if (hash) {
        $('ul.nav a[href="' + hash + '"]').tab("show");
    }

    $(".nav-tabs a").on("click", function (e) {
        $(this).tab("show");
            
        window.location.hash = this.hash;
    });

    $(document).on("submit", "form.pay-instruction", function(e) {
        e.preventDefault();

        var action = this.action;
        var data = {};

        $(this).serializeArray().forEach(function(x) {
            data[x.name] = x.value;
        });

        var it = data.InstructionType.toLowerCase();

        $.post(action, data).done(function(data) {
            if (data.Errors.length > 0) {
                showValidationErrors(data.Errors, true);
                return;
            }

            var baseUrlWithoutQueryString = window.location.href.split('?')[0];
            var baseUrlWithoutHash = baseUrlWithoutQueryString.split('#')[0];
            var rand = Math.random();
            var hash = it.indexOf("ytd") !== -1 ? "#year-to-date-instructions" : "#instructions";
            var urlToRedirectTo = baseUrlWithoutHash + "?status=Pay instruction saved&statusType=success&rand=" + rand + hash;

            window.location.replace(urlToRedirectTo);
        });
    });    

    $(".btn-delete-instruction").on("click", function(result) {
        var $self = $(this);
        var id = $self.attr("data-id");
        var employeeId = $self.attr("data-employee-id");
        var employerId = $self.attr("data-employer-id");

        bootbox.confirm({
            title: "Are you sure?",
            message: "Are you sure you want to delete this pay instruction?",
            callback: function(result) {
                if (result) {
                    var postUrl = `/employer/${employerId}/employee/${employeeId}/payInstruction/${id}/delete`;

                    $.post(postUrl).done(function(data) {
                        if (data.errors) {
                            showValidationErrors(data.errors);
                            return;
                        }

                        var $tr = $self.closest("tr");

                        $tr.find("td").fadeOut("fast", function() { 
                            $tr.remove();
                            showStatus("Instruction successfully deleted", "success");
                        });
                    });
                }
            }
        });
    });    
});