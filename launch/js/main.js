$(document).ready(function(){
	$("#submitBtn").click(function(){
		var data = {
			name: $("#name").val(),
			email: $("#email").val(),
			device: $("#device").val()
		};
		$.post('/beta', data, function (data) {
			$("#alpha").html("Thanks for signing up!");
		});
	});
});
