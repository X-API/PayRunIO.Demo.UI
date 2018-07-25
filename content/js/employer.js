$(function() {
    var hash = window.location.hash;
    
    if (hash) {
        $(`ul.nav a[href="${hash}"]`).tab("show");
    }

    if (getUrlVars().jobId) {
        bindJobInfo();
    }

    $(".nav-tabs a").on("click", function() {
        $(this).tab("show");
            
        window.location.hash = this.hash;
    });

    $(".btn-default-for-ae").on("click", function() {
        var $self = $(this);
        var id = $self.attr("data-id");
        var employerId = $self.attr("data-employer-id");

        $.post(`/employer/${employerId}/pension/${id}/ae-default`).done(function() {
            showStatus("Pension defaulted for auto enrolment", "success");

            $self.fadeOut();
        });
    });

    $(".btn-delete-pay-schedule").on("click", function() {
        var $self = $(this);
        var id = $self.attr("data-pay-schedule-id");
        var employerId = $self.attr("data-employer-id");

        bootbox.confirm({
            title: "Are you sure?",
            message: "Are you sure you want to delete this pay schedule?",
            callback: function(result) {
                if (result) {
                    $.post("/employer/" + employerId + "/paySchedule/" + id + "/delete")
                        .done(function(data) {
                            if (data.errors) {
                                showValidationErrors(data.errors);
                                return;
                            }

                            var $tr = $self.closest("tr");

                            $tr.find("td").fadeOut("fast", function() { 
                                $tr.remove();                    
                            });
                        });
                }
            }
        });        
    });

    $(".btn-delete-pay-run").on("click", function() {
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

    $(".btn-delete-pension").on("click", function() {
        var $self = $(this);
        var employerId = $self.attr("data-employer-id");        
        var id = $self.attr("data-id");

        bootbox.confirm({
            title: "Are you sure?",
            message: "Are you sure you want to delete this pension record?",
            callback: function(result) {
                if (result) {
                    $.post(`/employer/${employerId}/pension/${id}/delete`)
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

    $(document).on("click", ".job-info-container .close", function () {
        closeJobInfo();
    });    
});

function bindJobInfo() {
    var jobId = getUrlVars().jobId;
    var employerId = $("input[type=hidden]#employer-id").val();

    var url = "/employer/" + employerId + "/job/" + jobId + "/payrun";

    $.getJSON(url, function(data) {
        if (!window.hideJobInfo) {
            // if the job has completed and there are no errors to display then start increasing the 
            // completed job count. Once the completed job count has reached 3 (3 seconds based on the setTimeout further down) 
            // then close the job info panel. This is so that users can see that a job has been run (esp. where the job is v. small)
            if (data.Progress === 100 && (data.Errors === null || data.Errors.length === 0)) {
                if (window.completedJobCount === undefined) {
                    window.completedJobCount = 0;
                }

                window.completedJobCount++;

                if (window.completedJobCount === 3) {
                    closeJobInfo();

                    var url = window.location.href;
                    var urlWithoutQs = $.trim(url.split("?")[0]);
                    var urlWithStatus = urlWithoutQs + "?status=Pay run ran successfully&statusType=success#runs";

                    window.location.href = urlWithStatus;
                }
            }

            $(".job-info-container").html(Templates["jobInfoTemplate"](data));

            setTimeout(bindJobInfo, 1000);    
        }
    });
}

function closeJobInfo() {
    var $jobInfoContainer = $(".job-info-container");

    $jobInfoContainer.slideUp(); // todo: may be good to change this animation. 
    window.hideJobInfo = true;    
}