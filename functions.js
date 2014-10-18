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

function extrapolateLinearly(pastValue, currentValue, yearsBetweenValues, numberOfYearsInTheFuture) {
    return currentValue + numberOfYearsInTheFuture * (currentValue - pastValue) / yearsBetweenValues;
}

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

var getProvince = function (data){
    
    var province = {
        bruxelles: [],
        brabantFlamand: [],
        brabantWallon: [],
        anvers: [],
        flandreOccidentale: [],
        flandreOrientale: [],
        limbourg: [],
        hainaut: [],
        liege: [],
        luxembourg: [],
        namur: []
    }
    
    data.forEach(function(e){

        if (e.properties.INS.toString().charAt(0) == '2' && e.properties.INS.toString().charAt(1) == '1'){
            //$rootScope.myProviceArray.push(e);
            province.bruxelles.push(e.properties.INS.toString());
        }
        else if ((e.properties.INS.toString().charAt(0) == '2' && e.properties.INS.toString().charAt(1) == '3') || (e.properties.INS.toString().charAt(0) == '2' && e.properties.INS.toString().charAt(1) == '4')){
            province.brabantFlamand.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '2' && e.properties.INS.toString().charAt(1) == '5'){
            province.brabantWallon.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '1'){
            province.anvers.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '3'){
            province.flandreOccidentale.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '4'){
            province.flandreOrientale.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '5'){
            province.hainaut.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '6'){
            province.liege.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '7'){
            province.limbourg.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '8'){
            province.luxembourg.push(e.properties.INS.toString());
        }
        else if (e.properties.INS.toString().charAt(0) == '9'){
            province.namur.push(e.properties.INS.toString());
        }

    });

    return province;
    
};

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
        console.log("slider")
        console.log($slider.slider())
    }
    
});