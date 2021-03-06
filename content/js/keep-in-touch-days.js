$(function() {
    bindListOfKeepInTouchDays();

    $("#add-keep-in-touch-day").on("click", function() {
        var $container = $("#keep-in-touch-days-container");
        var obj = { Date: "" };
        var content = Templates["keepInTouchDayTemplate"](obj);

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

function bindListOfKeepInTouchDays() {
    var $hiddenField = $("input[type=hidden]#KeepInTouchDays");
    var values = $hiddenField.val().split("|");
    var $container = $("#keep-in-touch-days-container");

    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        var obj = { Date: value };
        var content = Templates["keepInTouchDayTemplate"](obj);

        $container.append(content);        
    }
}

function updateKeepInTouchDaysHiddenField() {
    var $hiddenField = $("input[type=hidden]#KeepInTouchDays");

    var values = $("input[type=date].keep-in-touch-day").toArray().map(el => $(el).val());

    $hiddenField.val(values.join("|"));
}