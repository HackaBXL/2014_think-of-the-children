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
            zoom: 12,
            scrollwheel: false,
            // navigationControl: false,
            mapTypeControl: false,
            // scaleControl: false,
            // draggable: false,
            styles: config.map_style
        });

        // DISPLAY INFO
        $rootScope.map.data.addListener('mouseover', function(event) {
            $("#info-box .name").text(event.feature.getProperty('Name1') + ' - ');
            $("#info-box .info").text(event.feature.getProperty('INS'));
        });

        // HOVER OPTIONS
        $rootScope.map.data.addListener('mouseover', function(event) {
            $rootScope.map.data.revertStyle();
            $rootScope.map.data.overrideStyle(event.feature, {strokeWeight: 2, strokeColor: '#555555'});
        });

            $rootScope.map.data.addListener('mouseout', function(event) {
            $rootScope.map.data.revertStyle();
        });

        // STYLE
        $rootScope.map.data.setStyle(function(feature) {
            var ins = feature.getProperty('INS');

            // COLOR LOGIC
            var color = Colors.toColor(1);

            return {
              fillColor: color,
              strokeWeight: 0
            };
        });

    };

    // GET MODEL
    $rootScope.get_model = function () {
        $http.get("data/model.json")
        .then(function(r){
            //console.log(r);
            $rootScope.data_model = r.data;
            $rootScope.DATA_model = angular.copy($rootScope.data_model);
            $rootScope.get_data();
        });
    };

    // GENERATE ARRAY FOR INPUT
    $rootScope.get_data = function () {
        $http.get("data/dbplus.json")
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

            setTimeout(function() {
                $rootScope.engine();
            }, 500);
        });
    };

    // GET SELECTION ARRAY
    $rootScope.engine = function () {
        $rootScope.initialize_map();
        $rootScope.data_model.features = [];
        if($("#tagsimput").val()) {
            $("#tagsimput").val().split(',').forEach(function (e) {
                if($rootScope.SQUARE && $rootScope.SQUARE[e] && $rootScope.SQUARE[e].data){
                    $rootScope.data_model.features.push($rootScope.SQUARE[e].data);
                }
                else{
                    console.log($rootScope.SQUARE[e]);
                }
            });
            $rootScope.set_data($rootScope.data_model);
        }
    };

    // SET JSON DATA
    $rootScope.set_data = function (data) {
        // JSON
        $rootScope.map.data.addGeoJson(data);

        // console.log(data);
        $rootScope.sum_poly(data);
    };

    // GET SUM POLYGON
    $rootScope.sum_poly = function (data) {
        var x1 = data.features[0].geometry.coordinates[0][0][0],
            x2 = data.features[0].geometry.coordinates[0][0][0],
            y1 = data.features[0].geometry.coordinates[0][0][1],
            y2 = data.features[0].geometry.coordinates[0][0][1];
        data.features.forEach(function (e) {

            e.geometry.coordinates[0].forEach(function (k) {
                if (x1 > k[0]) {
                    x1 = k[0];
                }
                if (x2 < k[0]) {
                    x2 = k[0];
                }
                if (y1 > k[1]) {
                    y1 = k[1];
                }
                if (y2 < k[1]) {
                    y2 = k[1];
                }
            });

        });

        // Construct the polygon.
        var SUMPOLY = new google.maps.Polygon({
            paths: [
                new google.maps.LatLng(x1,y1),
                new google.maps.LatLng(x2,y1),
                new google.maps.LatLng(x1,y2),
                new google.maps.LatLng(x2,y2)
            ],
            strokeWeight: 0,
            fillOpacity: 0
        });
        
        SUMPOLY.setMap($rootScope.map);
    };

    // CONSTRUCTOR
    $rootScope.init=function(){
        $rootScope.params = {
            school: 'primary', // kindergarten, primary, secondary
            lang: 'fr' // eng, fr, nl
        };

        $rootScope.get_model();

        $rootScope.lang = "eng";
        $rootScope.get_txt();
    };
    $rootScope.init();
    
}]);