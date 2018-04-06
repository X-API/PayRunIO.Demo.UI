$(function() {
    var hash = window.location.hash;
    
    if (hash) {
        $('ul.nav a[href="' + hash + '"]').tab("show");
    }

    $(".nav-tabs a").on("click", function (e) {
        $(this).tab("show");
            
        window.location.hash = this.hash;
    });
});