angular.module ("app", ['ngRoute'])
.run(['$rootScope','$http', function ($rootScope, $http) {

    // GET TEXT
    $rootScope.get_txt = function () {
        $http.get("data/text.json")
        .then(function(r){
            //console.log(r);
            $rootScope.data = r.data;
        });
    };
    
    // INIT MAP
    $rootScope.initialize_map = function () {

        // GENERATE MAP
        $rootScope.map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: 50.854975, lng: 4.3753899},
            zoom: 12
        });

        // STYLE
        var featureStyle = {
            fillColor: '#F92772',
            strokeWeight: 1
        }
        $rootScope.map.data.setStyle(featureStyle);

    };

    // GET MODEL
    $rootScope.get_model = function () {
        $http.get("data/model.json")
        .then(function(r){
            //console.log(r);
            $rootScope.data_model = r.data;
            $rootScope.get_data();
        });
    };

    // GENERATE ARRAY FOR INPUT
    $rootScope.get_data = function () {
        $http.get("data/db.json")
        .then(function(r){
            // console.log(r.data);
            $rootScope.SQUARE_ARRAY = [];
            $rootScope.SQUARE = {};
            $rootScope.RAW_SQUARE = r.data.features;
            $rootScope.RAW_SQUARE.forEach(function(e){
                // KEEP NAME AND ZIP
                $rootScope.SQUARE_ARRAY.push(e.properties.Name1);
                // $rootScope.SQUARE_ARRAY.push(e.properties.INS.toString());
                // SET OBJECT
                $rootScope.SQUARE[e.properties.Name1] = {
                    name:e.properties.Name1,
                    ins:e.properties.INS,
                    data:e
                };
            });
            window.availableTags = $rootScope.SQUARE_ARRAY;
            $( ".test" ).autocomplete({
              source: window.availableTags
            });

            google.maps.event.addDomListener(window, 'load', $rootScope.initialize_map);
        });
    };

    // GET SELECTION ARRAY
    $rootScope.engine = function () {
        $("#tagsimput").val().split(',').forEach(function (e) {
            $rootScope.data_model.features.push($rootScope.SQUARE[e].data);
        });
        $rootScope.set_data($rootScope.data_model);
    };

    // SET JSON DATA
    $rootScope.set_data = function (data) {
        // JSON
        $rootScope.map.data.addGeoJson(data);
    };

    // CONSTRUCTOR
    $rootScope.init=function(){
        $rootScope.get_model();

        $rootScope.lang = "eng";
        $rootScope.get_txt();
    };
    $rootScope.init();
    
}]);