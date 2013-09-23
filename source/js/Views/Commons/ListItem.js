window.$dino.ListItemView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize: function(opts) {
		this.name = opts.name;
		this.template = _.template(tpl.get('list-item'));
		this.model.bind('remove', this.destroy);
		_.bindAll(this, 'remove', 'destroy');
	}, 
	
	events: {
		"click" : "dontclick",
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete",
		"dblclick #item-detail" : "openDetails",
	},
	
	dontclick: function(e){
		e.preventDefault();
	},
	
	openDetails: function(e){
		e.preventDefault();
		console.log('opening detail page');
	},
	
	addBubble: function(selector, text){
		if (this.$(".added-bubble").length < 1) {this.$(selector).append('<span data-count-theme="c" class="ui-li-count ui-btn-up-c ui-btn-corner-all added-bubble">'+ text +'</span>');}
		this.$(".added-bubble").show();
		this.$(".added-bubble").fadeToggle(3000);
	},
	
	confirmDelete: function(){
		if (!this.settingSeverity){		
			this.deleteDialog = new $dino.DialogDeleteView({model: this.model, parentView: this});
			this.deleteDialog.render();
			$(this.el).append(this.deleteDialog);
			this.deleteDialog.open();
		}
	},

	clickPlus: function(e){
		if (e) e.preventDefault();

		var that = this;
		this.model.set("count", (this.model.get("count") + 1));
		this.model.save(); 
		//create a new plusOne object when someone clicks plusOne
		this.plusOne = new $dino.PlusOne();
		this.plusOne.save({
			item: that.model.id,
			type: that.model.urlRoot.substr(8, that.model.urlRoot.length-9),
			user: Parse.User.current().id
		}, {
		success: function(item){
			that.addBubble('h3', '+1');
		}
		});
	},
	
	destroy: function(){
		if (this.deleteDialog) this.deleteDialog.destroy();
		this.unbind();
		this.remove();
	},
	
	render:function(eventName){
		$(this.el).html(this.template(_.extend(this.model.toJSON(), {type: this.name})));
        return this;
	}
	
});