$(document).ready(function(){
	$("#submitBtn").click(function(){
		var data = {
			name: $("#name").val(),
			email: $("#email").val(),
			device: $("#device").val()
		};
		$.post('/beta', data, function (data) {
			$("#alpha").html("<h2>Thanks!</h2>You should be hearing from us early next month.");
			$(".form-group").hide();
		});
	});
	var clicked = false;
	$(".bubble").click(function(){
		if (!clicked){
			$(".bubble").removeClass("bubble-initial");
			$(".bubble").addClass("bubble-animated");
			$(".bubble.bubble-animated:after").css("display", "none !important");
			$(".bubble.bubble-animated:before").css("display", "none !important");
			$( "#hidden-bubble-text" ).delay(2750).fadeIn(500, function() {
				$(".bubble").addClass("bubble-final");
				clicked = true;
		//		$(".bubble.bubble-animated:after").fadeIn(250);
			    // Animation complete
			});	
		} else {
			$( ".bubble" ).fadeOut(150, function() {
				$( "#hidden-bubble-text" ).hide();
				$(".bubble").removeClass("bubble-animated bubble-final").addClass("bubble-initial").fadeIn(250);
				clicked = false;
			});
		}
		
	});
});
