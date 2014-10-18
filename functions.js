function addToTags(elem) {
    console.log($(elem).val());
    window.att = $(elem);
    $(elem).parent().parent().find('#tagsimput').val($(elem).val())
}

function isInArray(v, a) {
    var in_array = false;
    for (var e in a) {
        if (v.toLowerCase() == a[e].toLowerCase()) {
            in_array = true;
            break;
        }
    }

    return in_array;
};
var Colors = (function() {
    var a = 7,
        b = 7,
        c = 0.8,
        d = 1.5;
    var green = function(x) {
        return Math.floor(1 / (1 + Math.exp(-a * (x - c))) * 255);
    }
    var red = function(x) {
        return Math.floor(1 / (1 + Math.exp(-b * (d - x))) * 255);
    }
    return {
        toColor: function(x) {
            return 'rgb(' + red(x) + ', ' + green(x) + ', 0)';
        }
    }
})();

/*$rootScope.SQUARE_ARRAY.push('Bruxelles');
              
                // SET OBJECT
                $rootScope.SQUARE['Bruxelles'] = {
                    name:'Bruxelles',
                    array:$rootScope.bruxelles
                };
*/
function getProvince(){
    
    //$rootScope.bruxelles = [];
    console.log("getProvince");
    
    var bruxelles = [],
        brabantFlammand = [],
        brabantWallon = [],
        anvers = [],
        flandreOccidental = [],
        flandreOriental = [],
        limobourg = [],
        hainaut = [],
        liege = [],
        luembourg = [],
        namur = [];
    
    var rootscope = angular.element($("html")).scope();
    
    rootscope.RAW_SQUARE.forEach(function(e){
        if (e.properties.INS.toString().charAt(0) == '2' && e.properties.INS.toString().charAt(1) == '1'){
            //$rootScope.myProviceArray.push(e);
            console.log(e.properties['Name1']);
            bruxelles.push(e);
        } else if ((e.properties.INS.toString().charAt(0) == '2' && e.properties.INS.toString().charAt(1) == '3') || (e.properties.INS.toString().charAt(0) == '2' && e.properties.INS.toString().charAt(1) == '4')){
            console.log(e.properties['Name1']);
            brabantFlammand.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '2' && e.properties.INS.toString().charAt(1) == '5'){
            console.log(e.properties['Name1']);
            brabantWallon.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '1'){
            console.log(e.properties['Name1']);
            anvers.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '3'){
            console.log(e.properties['Name1']);
            flandreOccidental.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '4'){
            console.log(e.properties['Name1']);
            flandreOriental.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '5'){
            console.log(e.properties['Name1']);
            hainaut.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '6'){
            console.log(e.properties['Name1']);
            liege.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '7'){
            console.log(e.properties['Name1']);
            limobourg.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '8'){
            console.log(e.properties['Name1']);
            luembourg.push(e);
        } else if (e.properties.INS.toString().charAt(0) == '9'){
            console.log(e.properties['Name1']);
            namur.push(e);
        }
            //console.log("not in brussels region");
    });
    
    //console.log(bruxelles);
}

$( document ).ready(function() {
    var $slider = $("#slider");
    if ($slider.length > 0) {
      $slider.slider({
        min: 0,
        max: 10,
        value: 0,
        orientation: "horizontal",
        range: "min"
      })/*.addSliderSegments($slider.slider("option").max)*/;
    }
});