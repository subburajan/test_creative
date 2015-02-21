'use strict';

var app = angular.module("app", [ "LocalStorageModule" ]);

(function() {
	app.controller("ListCntrl", [ "$scope", "localStorageService", 'CommonService', 'PreviewService', "$window", ListCntrl ]);

	function ListCntrl($scope, localStorageService, CommonService, PreviewService, window) {
		
		var self = this;
		
		var init = function() {
			var keys = localStorageService.keys();
			
			var list = [  ];
			
			var sfx = "objects_";
			
			var l = keys.length;
			for(var i = 0; i < l; i++) {
				var k = keys[i];
				if(k.indexOf(sfx) >= 0) {
					list.push(k.substring(sfx.length));					
				}
			}
			
			$scope.list = list;
			
			$scope.preview = function(name) {
				PreviewService.show(name);
			}

		}
		
		$scope.loadTest = function() {
			var l = _Test.length;
			var lss = localStorageService;
			for(var i = 0; i < l; i++) {
				var test = _Test[i];
				lss.set("objects_" + test.name, test.objects);
				lss.set("feed_" + test.name, test.feed);
				lss.set("template_" + test.name, test.template);
				$scope.list.push(test.name);
			}
		}
		
		$scope.deleteTemplate = function(name) {
			var lss = localStorageService;
			lss.remove("objects_" + name);
			lss.remove("feed_" + name);
			lss.remove("template_" + name);
			
			var list = $scope.list;
			var l = list.length;
			for(var i = 0; i < l; i++) {
				var k = list[i];
				if(k == name) {
					list.splice(i, 1);
					return;
				}
			}
		}
		
		init();
		
	}
	
})();

