window.$dino.StartTutorialView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('start-tutorial'));
		this.currId = 1;
	},

	events : {
		"click .new-item" : "noClick",
		"click #skip" : "skip",
		"click #next" : "next"
	},
	
	noClick: function(e) {
		e.preventDefault();
	},
	
	skip: function(e){
		e.preventDefault();
		$dino.app.navigate("symptom", {
			trigger: true 
				
		});
		
	},
	
	finish: function(e){
		e.preventDefault();
	},
	
	next: function(e){
		e.preventDefault();

		this.$("#tut"+this.currId).hide();
		this.currId++;
		this.$("#tut"+this.currId).show();
		if (this.currId == 19){
			this.$("#finish").show();
			this.$(".ui-grid-a").hide();
			return;
		}
	},
	
	
	render: function() {
		this.$el.html(this.template());
		this.$("#finish").hide();
		return this;
	}
});