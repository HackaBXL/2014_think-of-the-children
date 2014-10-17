angular.module ("app", ['ngRoute'])
.run(['$rootScope','$http', function ($rootScope, $http) {
	$rootScope.message = 'Hello Ulysse !';
}]);