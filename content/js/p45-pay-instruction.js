$(function() {
    $("#add-p45-pay-instruction").on("click", function() {
        var $self = $(this);
        var $container = $("#p45-pay-instruction-container");

        $self.closest(".row").hide();
        $container.removeClass("display-none").addClass("display-block");
    });
});