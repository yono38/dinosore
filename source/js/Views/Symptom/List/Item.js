window.$dino.SymptomListItemView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize: function(){
		this.template = _.template(tpl.get('symptom-list-item'));
		this.model.bind('remove', this.destroy);
		_.bindAll(this, 'destroy');
	}, 
	
	events: {
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete",
		"swipeleft" : "setSeverity",
		"slidestop" : "changeSeverity",
		"click #cancel-change-severity" : "resetTitle",
		"click #symptom-detail" : "goToSymptomDetail"
	},
	
	// temporarily disabled
	goToSymptomDetail: function(e){
		e.preventDefault();
	},
	
	// resets the title (removes severity slider)
	// can place added bubble on plusOne
	resetTitle: function(e, type){
		if (e) e.preventDefault();
		var title = this.$(".symptom-title").text();
		var itemHtml = '<span class="symptom-title">'+title+'</span>';
		if (type == "added"){
			console.log("adding bubble");
			itemHtml += '<span data-count-theme="b" class="ui-li-count ui-btn-up-e ui-btn-corner-all added-bubble">Added</span>';			
		}
		this.$("h3").html(itemHtml);
		if (type == "added") this.$(".added-bubble").fadeToggle(3000);
		this.settingSeverity = false;
	},
	
	changeSeverity: function(){
		this.$(".ui-slider div a span .ui-btn-text").html(this.$("#severity").val());		
	},
	
	setSeverity: function(){
		if (!this.settingSeverity){
			this.$("h3").append('<label for="severity">Ouch Level:</label><input type="range" name="severity" id="severity" value="3" min="1" max="5" /><a data-inline="true" data-theme="b" data-mini="true" id="cancel-change-severity" class="cancelBtn ui-mini">Cancel</a>').css("padding-top", "10px");
			this.$("#severity").slider({
				trackTheme: 'b'
			});
			this.$("#severity").hide();
			this.$("#cancel-change-severity").button({
				mini: true
			});
			this.changeSeverity();
			this.settingSeverity = true;	
		}
	},
	
	confirmDelete: function(){
		if (!this.settingSeverity){		
			this.deleteDialog = new $dino.DialogDeleteView({model: this.model, parentView: this});
			console.log(this.$el);
			this.deleteDialog.render();
			$(this.el).append(this.deleteDialog);
			this.deleteDialog.open();
		}
	},

	clickPlus: function(e){
		if (e) e.preventDefault();
		if (!this.added){
			var that = this;
			if (this.alreadyClicked) return;
			this.model.increment("count", 1);
			this.model.save(); 
			//create a new plusOne object when someone clicks plusOne
			this.plusOne = new $dino.PlusOne();
			var severityLvl = this.settingSeverity ? parseInt(this.$("#severity").val()) : null;
			this.plusOne.save({
				item: this.model.id,
				severity: severityLvl,
				user: Parse.User.current()
			}, {
			success: function(item){
				console.log('added plusone successfully!');
				that.$(".plus-one").addClass("symptom-added");
				that.resetTitle(null, "added");
				that.added = true;
			}
			});
		}
	},
	
	destroy: function(){
		console.log('destroying itemview');
		if (this.deleteDialog) this.deleteDialog.destroy();
		this.unbind();
		this.remove();
	},
	
	render:function(eventName){
		$(this.el).html(this.template(this.model.toJSON()));
        return this;
	}
	
});