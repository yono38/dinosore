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
});
