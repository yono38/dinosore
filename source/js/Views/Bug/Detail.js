window.$dino.BugDetailView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template(tpl.get('bug-details'));
	},

	events : {
		'click #deleteBug' : 'deleteBug'
	},

	deleteBug : function(e) {
		e.preventDefault();
		console.log(window.location);
		var route = window.location.hash + "/delete";
		$dino.app.navigate(route, {
			trigger : true
		});
	},

	render : function(eventName) {
		var model = _.defaults(this.model.toJSON(), {
			"bugDetails" : "",
			"symptoms" : [],
			"medications" : [],
			"tests" : [],
			"assignedTo" : "Not Assigned"
		});

		$(this.el).html(this.template(model));
		return this;
	}
});
