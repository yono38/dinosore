window.SymptomListNewView = Backbone.View.extend({
	
	tagName:"li",
	
	initialize:function(){
		this.template = _.template(tpl.get("symptom-list-new"));
	},
	
	events: {
		'click .add-one': 'createNew'
	},
	
	createNew: function(e){
		e.preventDefault();
		var symp = new Symptom({
			user: Parse.User.current(),
			title: this.$("#newSymptomInput").val()
		});
		var that = this;
		symp.save(null, {
			success: function(item){
				console.log('symptom saved! great job!');
				that.trigger('newItem');
				that.remove();
			},
			error: function(err, item){
				console.log('symptom failed to save');
			}
		});
	},
	
	render:function(){
		$(this.el).html(this.template());
		return this;
	}
});
