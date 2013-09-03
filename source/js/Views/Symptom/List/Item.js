window.SymptomListItemView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize: function(){
		
		this.template = _.template(tpl.get('symptom-list-item'));
//		this.model.bind("change", this.render, this);
				
	}, 
	
	events: {
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete"
	},
	
	confirmDelete: function(){
		this.deleteDialog = new DialogDeleteView({model: this.model});
		console.log(this.$el);
		this.deleteDialog.render();
		$(this.el).append(this.deleteDialog);
		this.deleteDialog.open();
	},

	clickPlus: function(e){
		e.preventDefault();
		this.model.increment("count", 1);
		this.model.save(); 
		//create a new plusOne object when someone clicks plusOne
		var plusOne = new PlusOne();
		console.log(this.model.id);
		plusOne.save({
			item: this.model.id,
			user: Parse.User.current()
		}, {
		success: function(item){
			console.log('added plusone successfully!');
		}
		});
		console.log("tried to plus one but bearzo playin with himself");
	},
	
	render:function(eventName){
		$(this.el).html(this.template(this.model.toJSON()));
        return this;
	}
	
});