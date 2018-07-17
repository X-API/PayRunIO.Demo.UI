$(function() {
    $("#add-keep-in-touch-day").on("click", function() {
        var $container = $("#keep-in-touch-days-container");

        var content = Templates["keepInTouchDayTemplate"]();

        $container.append(content);
    });

    $(document).on("click", ".remove-keep-in-touch-day", function () {
        var $keepInTouchDay = $(this).closest(".keep-in-touch-day");

        $keepInTouchDay.remove();

        updateKeepInTouchDaysHiddenField();
    });

    $(document).on("change", "input[type=date].keep-in-touch-day", function () {
        updateKeepInTouchDaysHiddenField();
    });
});

function updateKeepInTouchDaysHiddenField() {
    var $hiddenField = $("input[type=hidden]#KeepInTouchDays");

    var values = $("input[type=date].keep-in-touch-day").toArray().map(el => $(el).val());

    $hiddenField.val(values.join("|"));
}