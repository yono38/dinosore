window.$dino.StartSignupView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('signup'));
	},

	events : {
		"click #signupBtn" : "signup"
	},

	validateFieldsExist : function(inputs) {
		var valid = true;
		$("#error").empty();
		_(inputs).each(function(val, key, arr){
			if (!val || val == ""){
				$("#error").html("You forgot some info!");
				$("#"+key).addClass('input-error');
				valid = false;
			} else {
				$("#"+key).removeClass('input-error');
			}
		});
		return valid;
	},
	
	validatePasswords: function(inputs){
		if (inputs.password != inputs['confirm-password']){
			$("#error").html("Passwords do not match");
			$("#password").addClass('input-error');
			$("#confirm-password").addClass('input-error');
			return false;
		} else {
			return true;
		}
		
	},

	signup : function() {
		var inputs = {
			"name" : this.$("#name").val(),
			"email" : this.$("#email").val(),
			"password" : this.$("#password").val(),
			"confirm-password" : this.$("#confirm-password").val(),
			"birthday" : moment(this.$("#birthday").val()).unix(),
			"gender" : this.$('input[name="select-gender"]:checked').val(),
		};
		var valid = this.validateFieldsExist(inputs);
		if (!valid) return;
		valid = this.validatePasswords(inputs);
		if (!valid) return;
		var that = this;
		Parse.User.signUp(inputs.email, inputs.password, {}, {
			success : function(user) {
				var User = Parse.User.current();
				User.set({
					birthday: inputs.birthday,
					name: inputs.name,
					gender: inputs.gender
				});
				User.save(null,{ 
					success: function(){
						$dino.app.navigate("tutorial", {
							trigger : true
						});
					},
					error : function(err) {
						that.$("#error").html(err.error.toTitleCase());
					}
				});
			}, 
			error: function(err){
				that.$("#error").html(err.error.toTitleCase());
			}
		});
	},
	
	createMenstrationSymptoms: function() {
		var isReadySymptoms = [false, false, false];
		var readyState = [true, true, true];
		
		// save the symptoms (flow, cramps, mood) & check for readyState in callback, if ready, call createMenstrationCondition
	},

	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
});
