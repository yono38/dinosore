window.$dino.StartTutorialView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('start-tutorial'));
		this.currId = 1;
	},

	events : {
		"click .new-item" : "noClick",
		"click #skip" : "goToStart",
		"click #next" : "goToStart",
		"pageinit" : "Test"
	},
	
	noClick: function(e) {
		e.preventDefault();
	},
	
	checkEnd: function(swiper) {
		console.log('swipe changed complete');
		console.log(swiper);
		if (swiper.realIndex == 18){
			this.$("#finish").show();
			this.$("#skip").hide();
		}
	},
	
	goToStart: function(e){
		e.preventDefault();
		$dino.app.navigate("symptom", {
			trigger: true 
		});
	},
	
	render: function() {
		this.$el.html(this.template());
	//	this.mySwiper = this.$('.swiper-container').swiper();		this.$("#finish").hide();
		return this;
	}
});