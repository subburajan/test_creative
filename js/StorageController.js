"use strict";

(function() {

	app.controller("StorageCntrl", [ "$scope", "localStorageService", 'CommonService', 'ObjectFactory', "$window", StorageCntrl ]);

	function StorageCntrl($scope, localStorageService, CommonService, ObjectFactory, window) {
		
		var self = this;

		var init = function() {
			var name = CommonService.getUrlArg("name");
			if(!name) {
				$scope.$parent.templateName = "Name-" + new Date().getTime();
				return;
			}
			$scope.$parent.templateName = name;
			
			load();
		}
		
		var load = function() {
			var arr = localStorageService.get("objects_" + $scope.templateName);
			if(arr) {
				$scope.redraw(arr);				
			}
		}
		
		$scope.save = function() {
			$scope.saveButtName = "Storing..."
			try {
				var arr = angular.fromJson(angular.toJson($scope.objects));
				var l = arr.length;
				for(var i = 0; i < l; i++) {
					var obj = arr[i];
					if(obj.type != "container") {
						var pos = $("#" + obj.id).position();
						obj.pos = { left: pos.left, top: pos.top };						
					}
				}
				
				localStorageService.set("objects_" + $scope.templateName, arr);
				
				storeTemplate();
				
				$scope.saveButtName = "...Stored"				
			} catch(e) {
				$scope.saveButtName = "...Failed";
			}

			setTimeout(function() {
				$scope.saveButtName = "Save";
				$scope.$apply("saveButtName");
			}, 200)
		}
		
		var storeTemplate = function() {
			var html = ObjectFactory.configureTemplate($("#template").clone());
			var key = "template_" + $scope.templateName;			
			localStorageService.set(key, html);
		}
		
		init();
	}
	
})();


