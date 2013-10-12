window.$dino.StartSignupView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('signup'));
	},

	events : {
	},

	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
}); 
