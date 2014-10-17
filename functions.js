function addToTags(elem){
    console.log($(elem).val());
    window.att = $(elem);
    $(elem).parent().parent().find('#tagsimput').val($(elem).val())
}