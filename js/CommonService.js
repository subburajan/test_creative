'use strict';

(function() {
	app.service("CommonService", function() {
		
		var queryStringToMap = function() {
		    var pairs = location.search.slice(1).split('&');
		    
		    var result = {};
		    pairs.forEach(function(pair) {
		        pair = pair.split('=');
		        result[pair[0]] = decodeURIComponent(pair[1] || '');
		    });

		    return result;			
		}
		
		return {
			getUrlArg: function(param) {
				var qry = queryStringToMap();
				return qry[param];
			}
		}	
	});	
})();


