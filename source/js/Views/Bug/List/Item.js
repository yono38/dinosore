window.$dino.BugListItemView = Backbone.View.extend({

	tagName : "li",

	initialize : function() {
		this.template = _.template(tpl.get('bug-list-item'));
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
		_.bindAll(this, "destroy");
	},

	events: {
		"swiperight" : "confirmDelete",
	},
	
	deleteBug : function(e) {
		var route = window.location.hash + bug.id + "/delete";
		$dino.app.navigate(route, {
			trigger : true
		});
	},

	destroy : function() {
		this.unbind();
		this.remove();
	},

	render : function(eventName) {
		var t = this.model.toJSON();
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
}); 