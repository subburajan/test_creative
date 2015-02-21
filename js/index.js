'use strict';

var app = angular.module("app", [ "LocalStorageModule" ]);

(function() {

	app.controller("CreativeCntrl", [ "$scope",  'ObjectFactory', 'PreviewService', '$window', CreativeCntrl ]);

	function CreativeCntrl($scope, ObjectFactory, PreviewService, $window) {
		
		initialize();
		
		function initialize() {
			
			$scope.saveButtName = "Save";
			$scope.templateName = "Name";
			
			$scope.objects = [ ObjectFactory.container() ]
			
			$scope.selected = null;
			
			$("#components .comp-drag").draggable({
				helper: "clone",
				zIndex: 100
			});
			
			$("#template").droppable({
				accept: ".comp-drag",
				drop: function(event, ui) {
					if(ui.draggable.hasClass("comp-drag")) {
						var e = $(ui.draggable).clone();
						$(this).append(e);

						var comp = create(e);
						if(!comp) {
							return;
						}
						
						configureComp(comp);
						
						var parPos = $("#template").offset();
						var pos = ui.helper.offset();
						comp.css("left", pos.left - parPos.left);
						comp.css("top", pos.top - parPos.top);
					}
				}
			});

			function create(comp) {
				var name;
				if(comp.hasClass("comp-img")) {
					name = "image";
				} else if(comp.hasClass("comp-text")) {
					name = "text";
				} else if(comp.hasClass("comp-button")) {
					name = "button"
				} else {
					return;
				}
				
				var object = ObjectFactory.create(name);

				comp.attr("id", object.id)
				
				$scope.objects.push(object);
				$scope.selected = object.id;
				$scope.$apply("objects");
				
				return comp;
			}
			
			var selectedWatch = $scope.$watch("selected", function(newValue, oldValue) {
				var current = $scope.current;
				if(current) {
					$("#" + current.id).removeClass("comp-sel");
				}
				if(!$scope.selected) {
					$scope.current = null;
				}
				current = $scope.current = $scope.getObjectById($scope.selected);

				if(current) {
					var e = $("#" + current.id);
					e.addClass("comp-sel");
					$("#template").append(e);	
				}
			});
			
			$scope.$on("$destroy", function () {
				selectedWatch();
			})
		}
		
		$scope.preview = function() {
			PreviewService.show($scope.templateName);
		}
		
		$scope.redraw = function(objects) {			
			var map = {};
			var arr = $("#components .component");
			var l = arr.length;
			for(var i = 0; i < l; i++) {
				var e = arr[i];
				var type = e.getAttribute("data-type");
				map[type] = $(e);
			}
			
			$scope.objects = objects;
			var l = objects.length;
			var cntr = $("#template");
			
			for(var i = 0; i < l; i++) {
				var obj = objects[i];
				if(obj.type == "container") {
					$scope.applyProperties(obj)
					continue;					
				}
				var e = map[obj.type];
				
				var comp = e.clone();
				configureComp(comp);
				cntr.append(comp);
				
				comp.attr("id", obj.id);
				$scope.applyProperties(obj);
				
				comp.css({
					left: obj.pos.left,
					top: obj.pos.top
				});
			}
		}
		
		$scope.applyProperties = function(object) {
			var e = $("#" + object.id);
			
			var props = object.props;
			var styles = {};
			var l = props.length;
			for(var i = 0; i < l; i++) {
				var prop = props[i];
				styles[prop.id] = prop.value
			}
			
			e.css(styles);
						
			var texts = object.texts;
			if(texts) {
				var pid = "#" + object.id;
				var styles = {};
				var l = texts.length;
				for(var i = 0; i < l; i++) {
					var prop = texts[i];
					var e = $(pid + " #" + prop.id);
					e.html(prop.value);
				}
			}
		}
		
		$scope.getObjectById = function(id) {
			var arr = $scope.objects;
			var l = arr.length;
			for(var i = 0; i < l; i++) {
				var obj = arr[i];
				if(obj.id == id) {
					return obj;
				}
			}
		}
		
		$scope.deleteCurrent = function() {
			var arr = $scope.objects;
			var curr = $scope.current;
			var l = arr.length;
			for(var i = 0; i < l; i++) {
				var obj = arr[i];
				if(obj.id == curr.id) {
					arr.splice(i, 1);
					$scope.current = null;
					$scope.selected = null;
					$("#" + obj.id).remove();
					return;
					
				}
			}
		}
		
		var configureComp = function(comp) {
			comp.removeClass("comp-drag");
			comp.addClass("comp-added");

			comp.on("mousedown", function(e) {
				var id = $(this).attr("id");
				$scope.selected = id;
				$scope.$apply("selected")
			});
			
			comp.removeClass("ui-draggable comp-drag");
			comp.draggable({
				containment: "parent"
			});
		}

	}
	
	
})();
