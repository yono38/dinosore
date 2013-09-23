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

$dino.MockBugList = Backbone.Collection.extend({
	model: $dino.MockBug
});

$dino.MockColor= Backbone.Model.extend({});

$dino.MockAppointment = Backbone.Model.extend({
	defaults: function() {
	    return {
	    	date: new Date(),
	    	title: "New Appointment"
	    };
   }
});

$dino.MockAppointmentList = Backbone.Collection.extend({
	model: $dino.MockAppointment
});
