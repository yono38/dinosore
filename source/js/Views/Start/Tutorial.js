window.$dino.StartTutorialView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('signup'));
	},

	events : {
		"click #signupBtn" : "signup"
	},
});