window.$dino.MedicationListItemView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize: function(){
		this.template = _.template(tpl.get('list-item'));
		this.debounceSaveSeverity =  _.debounce(this.saveSeverity, 2000);
		this.model.bind('remove', this.destroy);
		_.bindAll(this, 'destroy');
	}, 
	
	events: {
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete",
		"dblclick #medication-detail" : "openMedicationDetails",
	},
	
	openMedicationDetails: function(e){
		e.preventDefault();
		console.log('opening detail page');
	},
	
	// resets the title (removes severity slider)
	// can place added bubble on plusOne
	resetTitle: function(e){
		if (e) e.preventDefault();
		var title = this.model.get("title");
		var itemHtml = '<span class="medication-title">'+title+'</span>';
		this.$("h3").html(itemHtml);
		this.settingSeverity = false;
	},
	
	addBubble: function(selector, text){
		if (this.$(".added-bubble").length < 1) {this.$(selector).append('<span data-count-theme="b" class="ui-li-count ui-btn-up-e ui-btn-corner-all added-bubble">'+ text +'</span>');}
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
		console.log('clickcing');
		if (this.alreadyClicked) return;
		this.model.increment("count", 1);
		this.model.save(); 
		//create a new plusOne object when someone clicks plusOne
		this.plusOne = new $dino.PlusOne();
		this.plusOne.save({
			item: this.model.id,
			user: Parse.User.current()
		}, {
		success: function(item){
			that.addBubble('h3', 'added');
		}
		});
	},
	
	destroy: function(){
		if (this.deleteDialog) this.deleteDialog.destroy();
		this.unbind();
		this.remove();
	},
	
	render:function(eventName){
		$(this.el).html(this.template(_.extend(this.model.toJSON(), {type: "medication"})));
        return this;
	}
	
});