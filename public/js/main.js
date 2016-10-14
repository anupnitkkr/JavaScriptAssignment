// simple immediatly invoking funtion to restrict scope of variables and reduce the global scope
//more than one module then use Define.js for writing the module , we can use that module in other module ,where required
(function(win,treeLookup, $, HB){
	var $body = $(window.document.body);

	/*
	 * Function to covnert jqery form serailixe object to notmat key value pair object
	 * @param: { Array } -  JQuery Form serialized Object.
	 * @return: { Object }  - Key Value Paired Object.
	 */
	function srlizdToKeyVal(data){
		var obj = {};
		data.forEach(function(val, inx, arr){
			obj[val.name] = val.value;
		});
		return obj;
	}

	// Function to Bind the events to the components of app
	function bindEvents(){
		/*
		 * Using Data Attributes to bind Events to Clearly separate logic from styles.
		 * Using Jquery's "On" function for Event Delegation
		 * Binding all events at one place Documents object(here on body element) and will catch it on bubbling - on body
		 */


		// pre-Caching important references of DOM
		var showNodeList = $("[data-show-searchResults]"),
			tmplt = win.ONE.templates;

		// Trigger on clicking "Search Node" Button.
		$body.on("submit", "[data-search-form]", function(evt){
			evt.preventDefault();
			var $target = $(evt.target),
					data = srlizdToKeyVal($target.serializeArray()); // seralize and convert forma data into Object

			var input = ''+$('#js-search-input').val();
			function findGoodPathBfs(root,searchNode,callback){
			    var result = null;
			    var nodesToVisit = [{data: root, path:''}];
			    async.whilst(
			        function(){
			            return nodesToVisit.length>0 && result==null ;
			        },
			        function(next) {
			            var currentNode = nodesToVisit.shift();
			            if (currentNode.data || currentNode.data ==''){
										var newPath;
										if(currentNode.path=='/'){
											newPath = currentNode.path.concat(currentNode.data);
										}else{
											newPath = currentNode.path.concat('/'+currentNode.data);
										}
		                if(searchNode ==currentNode.data){
		                    result = newPath;
		                    next();
		                } else {
											treeLookup.getChildrenAsPromise(newPath)
													.then(function (children) {
		                        var childrenNodes = children.map(function(child){
		                            return {data: child, path: newPath};
		                        });
		                        nodesToVisit = nodesToVisit.concat(childrenNodes);
		                        next();
		                    });
		                }
			            } else {
			                next();
			            }
			        },
			        function(err) {
			            callback(err, result);
			        }
			    );
			}
			findGoodPathBfs('',input,function(err,results){
				console.log('final results : ',results);
				if(results){
					data.nodesList = [results];
				}else{
					data.nodesList = [];
				}
				showNodeList.html(tmplt.searchedResult(data)); // Showing Result
			})
		});
	}

	// Function will compile all template with attribute "[data-template]"
	// value of data-template will become name of the tempalte
	// and Templates can be accesssed using win.ONE.templates Object
	function compileHBTmplts(){
		var jqtmpltobj = $("[data-template]");
		win.ONE={};

		if(win.ONE){ // Global Shared Object
			win.ONE.templates = {};
		}
		jqtmpltobj.each(function(indx, val){
			var $val = $(val),
					name = $val.data("template");
			win.ONE.templates[name] = HB.compile($val.html()); // Compiling Handelbar teampltes
		});
	}

	// Inilize Application
	function init(){
		compileHBTmplts();
	}

	/*
	 * App Initilize Point
	 */
	$(function() {
		init();
		bindEvents();
	});
}(window, new TreeLookup(),jQuery, window.Handlebars));
