window.$dino.StartSplashView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template($dino.tpl.get('start-splash'));
	},
	events : {
		'click #splash-login' : 'login',
		'click #splash-signup' : 'signup'
	},

	login: function(e) {
		e.preventDefault();
		$dino.app.navigate("login", {
			trigger : true
		});
	},
	
	signup: function(e) {
		e.preventDefault();
		$dino.app.navigate("signup", {
			trigger : true
		});
	},

	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
}); 
