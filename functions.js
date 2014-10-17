

$( document ).ready(function() {
    $(function() {
    window.availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
    $( ".test" ).autocomplete({
      source: window.availableTags
    });
  });
    //console.log("avai");
});

function addToTags(elem){
    console.log($(elem).val());
    window.att = $(elem);
    $(elem).parent().parent().find('#tagsimput').val($(elem).val())
}

//class="ui-autocomplete-input" autocomplete="off"