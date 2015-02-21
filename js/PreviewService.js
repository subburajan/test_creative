'use strict';


(function() {

	app.service("PreviewService", [ "localStorageService",  "$window", PreviewService ]);

	function PreviewService(localStorageService, window) {
		
		_.templateSettings = {
		    interpolate: /\{\{=(.+?)\}\}/g,
		    evaluate: /\{\{(.+?)\}\}/g,
		};
		
		var show = function(name) {
			var template = localStorageService.get("template_" + name);
			if(!template) {
				alert("Template not found. Please create it and try");
				return;
			}
			
			var feeds = localStorageService.get("feed_" + name);
			if(!feeds) {
				feeds = getFeed(name)
			}
			
			if(!feeds) {
				return;
			}
			
			var args = {};
			var l = feeds.length;
			for(var i = 0; i < l; i++) {
				var feed = feeds[i];
				args[feed.id] = feed.value;
			}
			
			var temp = _.template(template);
			var html = temp({ args: args });
			
			var win = window.open("about:blank");
			win.document.write(html);
		}
		
		var getFeed = function(name) {
			var objects = localStorageService.get("objects_" + name);
			if(!objects) {
				alert("Template not. Please create it and try");
				return;
			}

			var fields = [];
			var l = objects.length;
			for(var i = 0; i < l; i++) {
				var object = objects[i];
				if(object.type != "container") {
					var value = object.type == "image" ? "/images/image.png": object.name;
					fields.push({ id: object.id, value: value, name: object.name });
				}
			}
			return fields;
		}
		
		return {
			
			show: function(name) {
				show(name);
			}
		}
	}
	
})();
