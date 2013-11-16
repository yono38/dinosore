window.$dino.DialogDeleteView = Backbone.View.extend({
	initialize : function(options) {
		this.template = _.template(tpl.get('delete-confirm'));
		this.$el.attr("data-theme", "a");
		this.parentView = options.parentView;
	},

	events : {
		"click #cancel" : "destroy",
		"click #yes" : "deleteItem"
	},

	deleteItem : function() {
		var that = this;
		this.model.destroy({
			success : function() {
//				that.trigger('deleteItem');
				that.destroy();
			},
			error : function(data, err) {
				if (err.statusText == "OK"){
//					that.trigger('deleteItem');
					that.destroy();
				} else {
					console.log('error ', err, data);
				}
			}
		});

	},

	className : 'ui-content',

	id : 'confirm',

	open : function() {
		this.$el.popup();
		this.$el.popup('open');
		this.$("#yes").button();
		this.$("#cancel").button();
	},

	destroy : function() {
		this.$("#yes").remove();
		this.$("#cancel").remove();
		//this.$el.popup("close");
		this.unbind();
		this.remove();
		console.log('triggering delete on dialog');
	},

	render : function() {
		this.$el.html(this.template());
	}
}); 