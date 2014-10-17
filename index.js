angular.module ("app", ['ngRoute'])
.run(['$rootScope','$http', function ($rootScope, $http) {
    
    // GET DATA
    $rootScope.get_txt = function () {
        $http.get("data/text.json")
        .then(function(r){
            //console.log(r);
            $rootScope.data = r.data;
        });
    };

    // GENERATE ARRAY FOR INPUT
    

    // CONSTRUCTOR
    $rootScope.init=function(){
        $rootScope.lang = "eng";
        $rootScope.get_txt();
    };
    $rootScope.init();
    
}]);