window.$dino.StartPrivacyView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template(tpl.get('privacy'));
	},

	events : {
		"change input[type='radio']" : "bringOnZeeJargon",
		"click #next" : "nextPage"
	},
	
	nextPage: function(){
		$dino.app.navigate("symptoms", {
			trigger : true
		});
	},

	bringOnZeeJargon : function(e){
		if ($(e.target).attr('id') == 'privacy-cloud') {
			$("#jargon").html("By storing your data in the cloud you absolve Dinosore of all fault in case anything terrible happens.");	
		} else {
			$("#jargon").empty();
		}
	},
	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
}); 
