$dino.MockBug = Backbone.Model.extend({

	// Default attributes for the todo item.
	defaults : function() {
		return {
			bugStatus : "Open",
			bugPriority : 1,
			title : "New Bug",
			symptoms : [],
			doctor : "",
			medications : [],
			tests : []
		};
	},

	save : function() {
		return this.toJSON();
	}
}); 

$dino.MockColor= Backbone.Model.extend({});