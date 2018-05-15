$(function() {
    var hash = window.location.hash;
    
    if (hash) {
        $('ul.nav a[href="' + hash + '"]').tab("show");
    }

    $(".nav-tabs a").on("click", function (e) {
        $(this).tab("show");
            
        window.location.hash = this.hash;
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
                    var postUrl = "/employer/" + employerId + "/employee/" + employeeId + "/payInstruction/" + id + "/delete";

                    $.post(postUrl).done(function(data) {
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
});