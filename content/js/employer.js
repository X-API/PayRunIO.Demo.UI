$(function() {
    var hash = window.location.hash;
    
    if (hash) {
        $('ul.nav a[href="' + hash + '"]').tab("show");
    }

    $(".nav-tabs a").on("click", function (e) {
        $(this).tab("show");
            
        window.location.hash = this.hash;
    });

    $(".btn-delete-pay-schedule").on("click", function(result) {
        var $self = $(this);
        var id = $self.attr("data-pay-schedule-id");
        var employerId = $self.attr("data-employer-id");

        bootbox.confirm({
            title: "Are you sure?",
            message: "Are you sure you want to delete this pay schedule?",
            callback: function (result) {
                if (result) {
                    $.post("/employer/" + employerId + "/paySchedule/" + id + "/delete")
                        .done(function(data) {
                            var $tr = $self.closest("tr");

                            $tr.find("td").fadeOut("fast", function() { 
                                $tr.remove();                    
                            });
                        });
                }
            }
        });        
    });

    $(".btn-delete-pay-run").on("click", function(result) {
        var $self = $(this);
        var id = $self.attr("data-pay-run-id");
        var scheduleId = $self.attr("data-pay-schedule-id");
        var employerId = $self.attr("data-employer-id");

        bootbox.confirm({
            title: "Are you sure?",
            message: "Are you sure you want to delete this payrun?",
            callback: function (result) {
                if (result) {
                    $.post("/employer/" + employerId + "/paySchedule/" + scheduleId + "/PayRun/" + id + "/delete")
                        .done(function() {
                            var $tr = $self.closest("tr");
                             $tr.find("td").fadeOut("fast", function() { 
                                 $tr.remove();                    
                             });
                        })
                        .fail(function(xhr, status, error) {
                            alert(error);
                        });
                }
            }
        });        
    });
});