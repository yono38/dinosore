window.$dino.BugListItemView = Backbone.View.extend({

	tagName : "li",

	initialize : function() {
		this.template = _.template(tpl.get('bug-list-item'));
		this.model.bind("change", this.render, this);
		var color = this.model.get("color");
		if (color)
			this.setColor(color);
		this.model.bind("destroy", this.close, this);
		_.bindAll(this, "setColor", 'destroy');
	},

	setColor : function(color_id) {
		var itemColor = $dino.colors.get(color_id);
		this.$el.attr("style", "background:#" + itemColor.get("hex"));
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