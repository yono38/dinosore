window.$dino.SymptomListItemView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize: function(){
		this.template = _.template(tpl.get('symptom-list-item'));
		this.debounceSaveSeverity =  _.debounce(this.saveSeverity, 2000);
		this.model.bind('remove', this.destroy);
		_.bindAll(this, 'destroy', 'saveSeverity', 'debounceSaveSeverity');
	}, 
	
	events: {
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete",
	//	"swipeleft" : "setSeverity",
		"slidestop" : "changeSeverity",
		"keyup #symptom-notes" : "debounceSaveSeverity",
		"click #cancel-change-severity" : "resetTitle",
		"click #symptom-detail" : "goToSymptomDetail"
	},
	
	// temporarily disabled
	goToSymptomDetail: function(e){
		e.preventDefault();
	},
	
	// resets the title (removes severity slider)
	// can place added bubble on plusOne
	resetTitle: function(e){
		if (e) e.preventDefault();
		var title = this.model.get("title");
		var itemHtml = '<span class="symptom-title">'+title+'</span>';
		this.$("h3").html(itemHtml);
		this.settingSeverity = false;
	},
	
	addBubble: function(selector, text){
		if (this.$(".added-bubble").length < 1) {this.$(selector).append('<span data-count-theme="b" class="ui-li-count ui-btn-up-e ui-btn-corner-all added-bubble">'+ text +'</span>');}
		this.$(".added-bubble").show();
		this.$(".added-bubble").fadeToggle(3000);
	},
	
	changeSeverity: function(){
		this.$(".ui-slider div a span .ui-btn-text").html(this.$("#severity").val());		
	},
	
	setSeverity: function(){
		if (!this.settingSeverity){
			this.$("h3").append('<label for="severity">Ouch Level:</label><input type="range" name="severity" id="severity" value="0" min="0" max="5" /><input type="text" placeholder="Notes" id="symptom-notes" value="" />');
			this.$("#symptom-notes").textinput();
			this.$("#severity").slider({
				trackTheme: 'b',
				stop: this.debounceSaveSeverity
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
			this.deleteDialog.render();
			$(this.el).append(this.deleteDialog);
			this.deleteDialog.open();
		}
	},

	clickPlus: function(e){
		if (e) e.preventDefault();
		if (!this.added){
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
				console.log('test');
				that.added = true;
				that.setSeverity();
				that.$(".ui-icon").removeClass("ui-icon-plus");
				that.$(".ui-icon").addClass("ui-icon-check");
				that.$(".plus-one span .ui-btn").css("background", "purple");
				that.$(".ui-slider-track").css("background", "purple");
			}
			});
		} else {
			this.saveSeverity();
			this.$(".plus-one").addClass("symptom-added");
			this.resetTitle();
		}
	},
	
	saveSeverity: function(){
			var severityLvl = this.settingSeverity ? parseInt(this.$("#severity").val()) : null;
			var sympNotes = this.$("#symptom-notes").val();
			
			if (this.added){
				this.plusOne.save({
					notes: sympNotes,
					severity: severityLvl,
				});				
				this.addBubble(".symptom-title", "Saved");
			}
	},
	
	destroy: function(){
		if (this.deleteDialog) this.deleteDialog.destroy();
		this.unbind();
		this.remove();
	},
	
	render:function(eventName){
		$(this.el).html(this.template(this.model.toJSON()));
        return this;
	}
	
});