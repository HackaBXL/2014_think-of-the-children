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