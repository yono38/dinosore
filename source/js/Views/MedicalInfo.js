window.$dino.MedicalInfoView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template(tpl.get('medical-info'));
	},

	events : {
		'click #logout' : 'logout'
	},

	logout : function() {
		Parse.User.logOut(null, {
			success : function() {
				$dino.app.navigate("", {
					trigger : true
				});
			}
		});
	},
	
	render : function(eventName) {
		var usr = Parse.User.current();
		var data = {
			"username" : usr.get("username"),
			"age" : moment(usr.get("birthday")).fromNow(true),
			"last_checkup" : moment(usr.get("last_checkup")).format("MM/YYYY")
		};
		this.$el.html(this.template(data));
		return this;
	}
}); 