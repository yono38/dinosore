window.DialogDeleteView = Backbone.View.extend({
	initialize: function(){
		this.template = _.template(tpl.get('delete-confirm'));
		this.$el.attr("data-theme", "none");
	},
	
	events: {
		"click #cancel" : "destroy",
		"click #yes" : "deleteItem"
	},
	
	deleteItem: function(){
		console.log('deleted');
		var that = this;
		this.model.destroy({
			success: function(){
				console.log('item successfully destroyed');
				that.destroy();
			}			
		});
	},
	
	className: 'ui-content',
	
	id: 'confirm',
	
	open: function(){
		$(this.el).popup({
			"positionTo" : $(this.el)
		});
		$(this.el).popup('open');
		this.$("#yes").button();
		this.$("#cancel").button();
	},
	
	destroy: function(){
		this.$("#yes").remove();
		this.$("#cancel").remove();	
		$(this.el).popup("close");
		this.remove();	
	},
	
	render: function(){
		$(this.el).html(this.template());
	}
});