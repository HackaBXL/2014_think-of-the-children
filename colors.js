var Colors = (function() {
  var a = 8, b = 8, c = 0.5, d = 1.5
  var green = function(x) {
    return Math.floor(1 / (1 + Math.exp(-a * (x - c))) * 255);
  }
  var red = function(x) {
    return Math.floor(1 / (1 + Math.exp(-b * (d - x))) * 255);
  }
  return {
    toColor : function(x) {
      return 'rgb(' + red(x) + ', ' + green(x) + ', 0)';
    }
  }
})();