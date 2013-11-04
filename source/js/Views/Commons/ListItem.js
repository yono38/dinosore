window.$dino.ListItemView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize: function(opts) {
		this.name = opts.name;
		this.template = _.template(tpl.get('list-item'));
		this.model.bind('remove', this.destroy, this);
		var status = this.model.get("status");
		if (status == "In Remission" || status == "Retired"){
			console.log('changing theme');
			this.$el.attr("data-theme", "d");
		}
		_.bindAll(this, 'remove', 'destroy', 'hidePlus');
	}, 
/*	 Currently unused
	fetchBugColor: function(){
		var bug = new $dino.Bug();
		bug.id = this.model.get("bug");
		var that = this;
		bug.fetch({
			success: function(bug){
				that.color = $dino.colors.get(bug.get("color"));
			}
		});
		
	},
*/	
	events: {
		"click" : "dontclick",
		"click .plus-one" : "clickPlus",
		"dblclick #item-detail" : "openDetails",
		"indom" : "makeSwiper",
		"click .removeItem" : "confirmDelete",
		"click .retireItem" : "retireItem"
	},
	
	retireItem: function(e){
		e.preventDefault();
		var that = this;
		if (this.$(".retireItem").data("retired") == true){
			console.log('reactivate this item')	;
			this.model.set("retired", false);
			this.model.save();
		} else {
			console.log('retire this item');
			this.model.set("retired", true);
		}
		this.model.save(null, {
			success: function(data) {
				console.log('model saved')
				that.trigger('renderlist');
			}
		});
	},
	
	makeSwiper: function(e){
		console.log("test indom on list item");
		this.mySwiper = this.$('.swiper-container').swiper({
			'noSwiping' : true,
			'onSlideChangeEnd': this.hidePlus
		});
	},
	
	hidePlus: function(swiper){
		if (swiper.activeIndex == 1){
			this.$(".plus-one").hide();
		} else {
			this.$(".plus-one").show();
		}
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
			this.$el.append(this.deleteDialog);
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
			type: that.name,
			user: Parse.User.current().id
		}, {
		success: function(item){
			that.addBubble('.item-title', '+1');
		}
		});
	},
	
	destroy: function(){
		console.log('calling destroy on listitem');
		this.unbind();
		if (this.remove){
			console.log('removing');
			this.remove();
			this.model.trigger('refreshList');
		}
//		if (this.deleteDialog) this.deleteDialog.destroy();
	},
	
	render:function(eventName){
		var that = this;
		this.$el.html(this.template(
			_.extend(
				this.model.toJSON(), 
				{
					type: this.name,
					retired: this.model.get("retired") || false
				}
			)
		));
		console.log(this.model);
		if (this.model.get("retired") === true){
			this.$el.attr("data-theme", "d");
		}
        return this;
	}
	
});