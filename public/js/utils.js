(function(win, $, HB){
	// HandleBar Helper for finding stringify
	HB.registerHelper( "stringify",function(obj, options){
		return JSON.stringify(obj);
	});
}(window, jQuery, window.Handlebars));
