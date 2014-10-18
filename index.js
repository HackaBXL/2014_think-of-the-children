angular.module ("app", ['ngRoute', 'ui.slider'])
.run(['$rootScope','$http', function ($rootScope, $http) {

    // GET TEXT
    $rootScope.get_txt = function () {
        $http.get("data/text.json")
        .then(function(r){
            //console.log(r);
            $rootScope.data = r.data;
        });
    };

    // GET PROVINCES
    
    
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
            var p = {
                ins: event.feature.getProperty('INS'),

                mat_cap: event.feature.getProperty('pyramid').preschool,
                pri_cap: event.feature.getProperty('pyramid').primary,

                mat_ppl: event.feature.getProperty('pyramid').j,
                pri_ppl: event.feature.getProperty('pyramid').k,

                mat_ppl_origin: event.feature.getProperty('pyramid').j2k,
                pri_ppl_origin: event.feature.getProperty('pyramid').k2k

            };

            $("#info-box .name").text(event.feature.getProperty('Name1') + ' - ');
            $("#info-box .info").text($rootScope.process_ratio(p, 'ratio')).css({
                color:$rootScope.process_ratio(p, 'color'),
                textShadow: '1px 1px 2px #555'
            });
        });
        
        // PROCESS RATIO
        $rootScope.process_ratio = function (p, feedback) {

            var cap = p[$rootScope.params.school + '_cap'],
                ppl = p[$rootScope.params.school + '_ppl'];

            // COLOR
            if(feedback == 'color'){
                if(cap > 0 && ppl && cap){
                    return Colors.toColor(cap/ppl);
                }
                else {
                    return '#000000'
                }
            }

            // STR X/Y (Z%)
            else if(feedback == 'ratio'){
                if(cap > 0 && ppl && cap){
                    return cap + '/' + ppl + ' (' + Math.floor((cap / ppl)*100) + '%)'
                }
                else {
                    return 'missing data'
                }
            }

            // FLOAT X/Y
            else {
                if(cap > 0 && ppl && cap){
                    return cap/ppl
                }
                else {
                    return 0
                }
            }

            

        };

        // HOVER OPTIONS
        $rootScope.map.data.addListener('mouseover', function(event) {
            $rootScope.map.data.revertStyle();
            $rootScope.map.data.overrideStyle(event.feature, {
                strokeWeight: 2,
                strokeColor: '#555555',
                fillOpacity: 0.6
            });
        });

            $rootScope.map.data.addListener('mouseout', function(event) {
            $rootScope.map.data.revertStyle();
        });

        // STYLE
        $rootScope.map.data.setStyle(function(feature) {
            var pyramid = {
                ins: feature.getProperty('INS'),

                mat_cap: feature.getProperty('pyramid').preschool,
                pri_cap: feature.getProperty('pyramid').primary,

                mat_ppl: feature.getProperty('pyramid').j,
                pri_ppl: feature.getProperty('pyramid').k

            };

            // COLOR LOGIC
            var color = $rootScope.process_ratio(pyramid, 'color');

            return {
              fillColor: color,
              strokeWeight: 0,
              fillOpacity: 0.5
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
            $rootScope.FULL_SQUARE = r.data;
            $rootScope.RAW_SQUARE = r.data.features;
            $rootScope.RAW_SQUARE.forEach(function(e){
                // KEEP NAME AND ZIP
                $rootScope.SQUARE_ARRAY.push(e.properties['Name1']);
                // $rootScope.SQUARE_ARRAY.push(e.properties.INS.toString());
                // SET OBJECT
                $rootScope.SQUARE[e.properties.Name1] = {
                    name:e.properties.Name1,
                    ins:e.properties.INS,
                    data:e
                };
            });

            // GET PROVINCES
            $rootScope.PROVINCES = getProvince(r.data.features);
            // console.log($rootScope.PROVINCES);

            // SET TAGS AUTOCOMPETE
            window.availableTags = $rootScope.SQUARE_ARRAY;

            $( ".test" ).autocomplete({
              source: window.availableTags.concat(config.provinces_names)
            });

            // INIT MAP
            google.maps.event.addDomListener(window, 'load', $rootScope.initialize_map);

            // PREVENT TOO FAST INITIALIZATION
            setTimeout(function() {
                $rootScope.engine(true);
            }, 500);
        });
    };

    // SET SCHOOLS ON MAP
    $rootScope.display_schools = function (data) {

        var schools = [];

        data.forEach(function(e){
            
            if(e.properties && e.properties.pyramid && e.properties.pyramid.schools) {
                e.properties.pyramid.schools.forEach(function(s){
                    if (s.language == $rootScope.params.lang) {
                        schools.push(s);
                    }
                });
            }

        });

        schools.forEach(function(spot){
            $rootScope.mark_map(spot);
        });

    };
    $rootScope.mark_map = function (s) {

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(s.lat), parseFloat(s.lon)),
            map: $rootScope.map,
            //icon: 'marker.png'
        });

    }

    // GET SELECTION ARRAY
    $rootScope.engine = function (_empty) {

        // CLEAR INFO
        $("#info-box .name, #info-box .info").text('');

        $rootScope.initialize_map();
        $rootScope.data_model.features = [];

        if(_empty){
            
        }
        else if($("#tagsimput").val()) {
            $("#tagsimput").val().split(',').forEach(function (e) {
                if (isInArray(e, config.provinces_names)) {
                    // PROVINCE
                    var ins_list = $rootScope.PROVINCES[config.provinces_values[config.provinces_names.indexOf(e)]];
                    for (var i in $rootScope.SQUARE) {
                        if(isInArray($rootScope.SQUARE[i].ins.toString(), ins_list)){
                            $rootScope.data_model.features.push($rootScope.SQUARE[i].data);
                        }
                    }

                }
                else if($rootScope.SQUARE && $rootScope.SQUARE[e] && $rootScope.SQUARE[e].data){
                    $rootScope.data_model.features.push($rootScope.SQUARE[e].data);
                }
                else{
                    // console.log($rootScope.SQUARE[e]);
                }
            });
            $rootScope.set_data($rootScope.data_model);
        }
        else {
            $rootScope.set_data($rootScope.FULL_SQUARE);
        }
    };

    // SET JSON DATA
    $rootScope.set_data = function (data) {
        // JSON
        $rootScope.map.data.addGeoJson(data);

        // SCHOOLS ON MAP
        if ($rootScope.params.display) {
            $rootScope.display_schools(data.features);
        }

        // console.log(data);
        $rootScope.sum_poly(data);
    };

    // GET SUM POLYGON
    $rootScope.sum_poly = function (data) {
        if(data.features && data.features[0] && data.features[0].geometry && data.features[0].geometry.coordinates && data.features[0].geometry.coordinates[0]){
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

            // CONSTRUCT THE POLYGON
            var SUMPOLY = [
                new google.maps.LatLng(y1,x1),
                new google.maps.LatLng(y2,x1),
                new google.maps.LatLng(y2,x2),
                new google.maps.LatLng(y1,x2)
            ];

            // CENTER OF POLYGON
            var center = {
                x: x1 + ((x2 - x1) / 2),
                y: y1 + ((y2 - y1) / 2)
            }

            var bounds = new google.maps.LatLngBounds();

            SUMPOLY.forEach(function (e) {
                bounds.extend(e);
            });

            $rootScope.map.fitBounds(bounds);
        }
    };

    // CONSTRUCTOR
    $rootScope.init=function(){
        $rootScope.params = {
            school: 'mat', // mat, pri
            lang: 'FR', // FR, NL
            display: false,
            time_travel: new Date().getFullYear()
        };

        $rootScope.get_model();

        $rootScope.lang = "eng";
        $rootScope.get_txt();
    };
    $rootScope.init();
    
}]);