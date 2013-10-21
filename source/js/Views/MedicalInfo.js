window.$dino.MedicalInfoView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template(tpl.get('medical-info'));
	},
	events : {
		'click #logout' : 'logout',
		'click #modify' : 'modify'
	},
	
	// not implemented yet
	modify: function(e) {
		e.preventDefault();
	},

	logout : function() {
		Parse.User.logOut(null, {
			success : function() {
				localStorage.clear();
				$dino.app.navigate("", {
					trigger : true
				});
			}
		});
	},
	
	render : function(eventName) {
		var usr = Parse.User.current();
		var data = {
			"name" : usr.get("name"),
			"age" : moment.unix(usr.get("birthday")).fromNow(true),
			"last_checkup" : moment.unix(usr.get("last_checkup")).format("MM/YYYY")
		};
		this.$el.html(this.template(data));
		this.$(".new-group").show();
		return this;
	}
}); 
