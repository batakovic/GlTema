$(function () {
	$('input[name="typeNewEmail"]').change(function() {
		if ($('input[name="typeNewEmail"]:checked').attr('id') == "emailFromTemplate") {
			$("p.tempalteP").show();
		} else {
			$("p.tempalteP").hide();
		}
	});
})

