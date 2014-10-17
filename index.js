angular.module ("app", ['ngRoute'])
.run(['$rootScope','$http', function ($rootScope, $http) {
    
	$rootScope.message = 'Hello Ulysse !';
    
    $http.get("data/text.json")
    .then(function(r){
        //console.log(r);
        $rootScope.data = r.data;
    });
     
    $rootScope.setLang = function(l){
        $rootScope.lang = l;
    }
    
    $rootScope.init=function(){
        $rootScope.lang = "eng";
    };
    $rootScope.init();
    
}]);