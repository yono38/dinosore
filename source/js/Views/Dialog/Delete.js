window.$dino.DialogDeleteView = Backbone.View.extend({
	initialize: function(options){
		this.template = _.template(tpl.get('delete-confirm'));
		this.$el.attr("data-theme", "none");
		this.parentView = options.parentView;
	},
	
	events: {
		"click #cancel" : "destroy",
		"click #yes" : "deleteItem"
	},
	
	deleteItem: function(){
		var that = this;
		this.model.destroy({
			success: function(){
				// fixed problem where sometimes itemview isn't removed
				// on model destroy
				if (that.parentView) {
					console.log('parentview for symptom item still exists');
					that.parentView.destroy();
				}
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
		this.unbind();
		this.remove();	
	},
	
	render: function(){
		$(this.el).html(this.template());
	}
});