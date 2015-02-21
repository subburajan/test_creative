'use strict';

(function() {

	app.controller("PropertiesCntrl", [ "$scope", PropertiesCntrl ]);

	function PropertiesCntrl($scope) {
		
		var self = this;
		
		self.propWatch = $scope.$watch("current", function(newValue, oldValue) {
			if(!$scope.current) {
				return;
			}
			$scope.applyProperties($scope.current);
		}, true);
		
		
		$scope.$on("destroy", function() {
			self.propWatch();
			self.textWatch();
		});
	}
	
})();


