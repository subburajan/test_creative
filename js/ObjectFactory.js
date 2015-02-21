'use strict';

(function() {

app.factory("ObjectFactory", function() {
	
	var id = new Date().getTime();
	
	var CFG = { 
		image: {
			type: "image",
			id: id,
			index: 1,
			suffix: "Image", 
			style: {
				border: "1px solid #AEAEAE",
				background: "#EEE",
				height: "121px",
				width: "140px",
				margin: "0px",
				padding: "10px"
			},
			templates: [ 
			     { name: "Url", id: "image",
			    	 template: function(id) {
			    		 return '<image id="image" src="{{= args[\'' + id + '\'] }}">';
			    	 }	
			     }
			],
			clazz: 'comp-img'
		},
		text: {
			type: "text",
			id: id, 
			index: 1,
			suffix: "Text", 
			style: {
				border: "1px solid #AEAEAE",
				background: "#EEE",
				height: "40px",
				width: "140px",
				margin: "0px",
				padding: "10px",
				"font-size": "14px",
				"color": "#000"
			},
			templates: [ 
			    { name: "Text", id: "text",
			    	template: function(id) {
			    		return '<span id="text">{{= args["' + id + '"] }}</span>';
			    	}
			   }
			],
			texts: [ 
			     {
					id: "suffix",
					name: "Text Suffix",
					value: "$"
				}, {
					id: "prefix",
					name: "Text Prefix",
					value: "$"
				}
			],
			clazz: 'comp-text'
		},
		button: {
			type: "button",
			id: id,
			index: 1,
			suffix: "Button", 
			style: {
				border: "1px solid #AEAEAE",
				background: "#EEE",
				height: "40px",
				width: "140px",
				margin: "0px",
				padding: "10px",
				"font-size": "16px",
				"color": "#000"
			},
			texts: [ {
				id: "button",
				name: "Button Name"
			}],
			clazz: 'comp-button'
		}
	}
	
	var container = {
		id: "template",
		name: "Container",
		type: "container",
		props: [
			{ name: "border", id: "border", value : "none" },
			{ name: "background", id: "background", value: "#AEAEAE" }
		]
	}
	
	var create = function(name) {
		var cfg = CFG[name];
		
		var id = cfg.id++;
		var index = cfg.index++;
		
		var props = [];
		var style = cfg.style;
		for(var k in style) {
			if(style.hasOwnProperty(k)) {
				props.push({ name: k, id: k, value: style[k] });
			}
		}
		
		var texts = [];
		angular.forEach(cfg.texts, function(text) {
			texts.push({ name: text.name, value: text.value || (cfg.suffix + "-" + index), id: text.id })
		})
		
		var object = {
			id: cfg.suffix + "_" + id,
			name: cfg.suffix + "-" + index,
			type: cfg.type,
			props: props,
			texts: texts
		}
		
		return object;
	}
	
	var configureType = function(e, type) {
		var cfg = CFG[type];
		var templates = cfg.templates;
		if(!templates) {
			return;
		}
		
		var list = e.find("." + cfg.clazz);
		list.each(function(j, ce) {
			ce = $(ce);
			var l = templates.length;
			for(var i = 0; i < l; i++) {
				var temp = templates[i];
				var html = temp.template(ce.attr("id"));				
				ce.find("#" + temp.id).replaceWith(html);
			}		
		});
	}
	
	var configureTemplate = function(e) {
		configureType(e, "image");
		configureType(e, "text");
		configureType(e, "button");
		
		var html = $("<div></div>").append(e).html();
		
		//html = html.replace("{{", "<%=").replace("}}", "%>");
		
		var css = "<style>body{ font-family: \"Helvetica Neue\",Helvetica,Arial,sans-serif; font-size: 14px; " + 
			"line-height: 1.42857143; color: #333;background-color: #fff; } " + 
			".temp_300_250 { margin: 10px 10px; width: 300px; height: 250px; overflow: hidden; background-color: #AEAEAE;position: relative; } " + 
			".component { display: inline-block; overflow: hidden; cursor: pointer; position: absolute !important; } " +
			" .component img { width: 100%; border: none } .comp-button { text-align: center; }</style>";

		html = "<!Doctype html><html><head><title>Ad</title></head>" + 
	    	'<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">' +
			'<meta name="viewport" content="width=device-width, initial-scale=1">' +
			"<link href='/bower_components/bootstrap/dist/css/bootstrap.min.css' rel='stylesheet'>" + 
			"<body>" + css + html + "</body></html>";
		
		return html;
	}
	
	return {
		
		container: function() {
			return container;
		},
		
		get: function(name) {
			return CFG[name];
		},
		
		create: function(name) {
			return create(name);
		},
		
		configureTemplate: function(html) {
			return configureTemplate(html)
		}
	}
	
});

})();
