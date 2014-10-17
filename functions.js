function addToTags(elem){
    console.log($(elem).val());
    window.att = $(elem);
    $(elem).parent().parent().find('#tagsimput').val($(elem).val())
}
function isInArray(v, a){
	var in_array = false;
	for (var e in a) {
		if(v.toLowerCase() == a[e].toLowerCase()){
			in_array = true;
			break;
		}
	}

	return in_array;
};