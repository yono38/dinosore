window.SymptomListItemView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize: function(){
		this.template = _.template(tpl.get('symptom-list-item'));
		this.model.bind('remove', this.destroy);
	}, 
	
	events: {
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete",
		"swipeleft" : "setSeverity",
		"slidestop" : "changeSeverity",
		"click #cancel-change-severity" : "cancelSeverity",
		"click #symptom-detail" : "goToSymptomDetail"
	},
	
	// temporarily disabled
	goToSymptomDetail: function(e){
		e.preventDefault();
	},
	
	cancelSeverity: function(e, isAdding){
		if (e) e.preventDefault();
		var title = this.$(".symptom-title").text();
	//	var itemHtml = ;
		this.$("h3").html('<span class="symptom-title">'+title+'</span><span data-count-theme="b" class="ui-li-count ui-btn-up-e ui-btn-corner-all added-bubble">Added</span>');
		this.$(".added-bubble").fadeToggle(3000);
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
			this.deleteDialog = new DialogDeleteView({model: this.model});
			console.log(this.$el);
			this.deleteDialog.render();
			$(this.el).append(this.deleteDialog);
			this.deleteDialog.open();
		}
	},

	clickPlus: function(e){
		e.preventDefault();
		if (!this.added){
			var that = this;
			if (this.alreadyClicked) return;
			this.model.increment("count", 1);
			this.model.save(); 
			//create a new plusOne object when someone clicks plusOne
			var plusOne = new PlusOne();
			console.log(this.model.id);
			var severityLvl = this.settingSeverity ? parseInt(this.$("#severity").val()) : null;
			plusOne.save({
				item: this.model.id,
				severity: severityLvl,
				user: Parse.User.current()
			}, {
			success: function(item){
				console.log('added plusone successfully!');
				that.$(".plus-one").addClass("symptom-added");
				that.cancelSeverity();
				that.added = true;
			}
			});
		}
	},
	
	destroy: function(){
		this.unbind();
		this.remove();
	},
	
	render:function(eventName){
		$(this.el).html(this.template(this.model.toJSON()));
        return this;
	}
	
});