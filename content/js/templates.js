Templates = {};

$(function() {
    $.ajax({
        url: "/js/templates.htm",
        cache: true,
        success: function(data) {
            source = data;
            
            $("body").append(data);
            
            templatesLoaded();
        }
    });

    Templates.onLoaded = function() {}
    Templates.loaded = false;
});

function templatesLoaded() {
    $('script[type="text/x-handlebars-template"]').each(function(){
        var $self = $(this);
        var name = $self.attr("name");
    	var src = $self.html();
        var partialName = $self.attr("partial-name");
        
    	if (partialName) {
    		Handlebars.registerPartial(partialName, src);
        }
    	
    	Templates[name] = Handlebars.compile(src);
        Templates.loaded = true;
        Templates.onLoaded();
    });
}