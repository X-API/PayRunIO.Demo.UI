$(function() {
    $("#add-p45-pay-instruction").on("click", function() {
        var $self = $(this);
        var $container = $("#p45-pay-instruction-container");

        $self.closest(".row").hide();
        $container.removeClass("display-none").addClass("display-block");
    });

    $("#delete-p45-pay-instruction").on("click", function() {
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

                        $("#add-p45-pay-instruction-container").removeClass("display-none").addClass("display-block");
                        $("#p45-pay-instruction-container").removeClass("display-block").addClass("display-none");

                        showStatus("Instruction successfully deleted", "success");
                    });
                }
            }
        });        
    });
});