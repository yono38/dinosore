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
			"birthday" : moment(this.$("#birthday").val()),
			"gender" : this.$('input[name="select-gender"]:checked').val(),
		};
		var valid = this.validateFieldsExist(inputs);
		if (!valid) return;
		valid = this.validatePasswords(inputs);
		if (!valid) return;
		var that = this;
		Parse.User.signUp(usr, pw, {}, {
			success : function(user) {
				var User = $dino.User(Parse.User.current().toJSON());
				User.set("id", Parse.User.current().id);
				User.save();
				$dino.app.navigate("symptoms", {
					trigger : true
				});
			},
			error : function(err) {
				that.$("#error").html(err.message.toTitleCase());
			}
		});
	},

	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
});