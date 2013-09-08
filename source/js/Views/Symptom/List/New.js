window.SymptomListNewView = Backbone.View.extend({
	
	tagName:"li",
	
	initialize:function(){
		this.template = _.template(tpl.get("symptom-list-new"));
	//	_.bindAll(this, 'createNew');
	},
	
	events: {
		'click .add-one': 'createNew',
		'keypress #newSymptomInput' : 'addOnEnter'
	},
	
	addOnEnter: function(e){
	  if (e.keyCode == 13) this.createNew();
	},
	
	focus: function(){
		$(this.el).focus();
	},
	
	createNew: function(e){
		if (e) e.preventDefault();
		if (this.$("#newSymptomInput").val() != ""){
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
		}
	},
	
	render:function(){
		$(this.el).html(this.template());
		return this;
	}
});
