window.$dino.StartPrivacyView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template(tpl.get('privacy'));
	},

	events : {
		"change input[type='radio']" : "bringOnZeeJargon"
	},

	bringOnZeeJargon : function(e){
		if ($(e.target).attr('id') == 'privacy-cloud') {
			$("#jargon").html("I am here to tell you technical jargon about lots of important things and the drawbacks and other bullshit in hopes you stop reading and let me take all your privacy away muahahahahahahahahahahahahahahahaha. Good day sir.");	
		} else {
			$("#jargon").empty();
		}
	},
	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
}); 
