'use strict';

var app = angular.module("app", [ "LocalStorageModule" ]);

(function() {
	app.controller("FeedCntrl", [ "$scope", "localStorageService", 'CommonService', 'PreviewService', "$window", FeedCntrl ]);

	function FeedCntrl($scope, localStorageService, CommonService, PreviewService, window) {
		
		var self = this;
		
		var init = function() {
			$scope.templateName = "";
			
			var name = CommonService.getUrlArg("name");
			if(!name) {
				$scope.error = "Missing Argument ?name="
				return
			}
			var objects = localStorageService.get("objects_" + name);
			if(!objects) {
				$scope.error = "No template found for " + name;
				return;
			}
			
			$scope.templateName  = name;
			
			var fields = localStorageService.get("feed_" + name);

			if(!fields) {
				var fields = [];
				var l = objects.length;
				for(var i = 0; i < l; i++) {
					var object = objects[i];
					if(object.type != "container" && object.type != "button") {
						var value = object.type == "image" ? "/images/image.png": object.name;
						fields.push({ id: object.id, value: value, name: object.name });
					}
				}	
			}
			$scope.fields = fields;
			
			$scope.save = function() {
				$scope.saveButtName = "Storing..."
				try {
					localStorageService.set("feed_" + $scope.templateName, $scope.fields)
					
					$scope.saveButtName = "...Stored"				
				} catch(e) {
					$scope.saveButtName = "...Failed";
				}

				setTimeout(function() {
					$scope.saveButtName = "Save";
					$scope.$apply("saveButtName");
				}, 200);
			}
			
			$scope.saveButtName = "Save";
			
			$scope.preview = function() {
				PreviewService.show($scope.templateName);
			}
		}
		
		init();
		
	}
	
})();

