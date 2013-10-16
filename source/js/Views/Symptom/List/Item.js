window.$dino.SymptomListItemView = $dino.ListItemView.extend({
	
	initialize: function(){
		// calling super.constructor
		$dino.SymptomListItemView.__super__.initialize.call(this, {name: "symptom"});
		this.debounceSaveSeverity =  _.debounce(this.saveSeverity, 2000);
		_.bindAll(this, 'saveSeverity', 'debounceSaveSeverity');
	}, 
	
	events: {
		"click" : "dontclick",
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete",
		"dblclick #item-detail" : "openDetails",
		"slidestop" : "changeSeverity",
		"keypress #symptom-notes" : "addOnEnter",
		"click #cancel-change-severity" : "resetTitle",
		"click #symptom-detail" : "goToSymptomDetail"
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
	
	changeSeverity: function(){
		this.$(".ui-slider div a span .ui-btn-text").html(this.$("#severity").val());		
	},
	
	addOnEnter: function(e){
	  if (e.keyCode == 13) this.clickPlus();
	},

	setSeverity: function(){
		if (!this.settingSeverity){
			this.$("h3").append('<label for="severity">Ouch Level:</label><input type="range" name="severity" id="severity" value="0" min="0" max="5" /><input type="text" placeholder="Notes" id="symptom-notes" value="" />');
			this.$("#symptom-notes").textinput();
			this.$("#severity").slider({
				trackTheme: 'a',
			});
			this.$("#severity").hide();
			this.$("#cancel-change-severity").button({
				mini: true
			});
			this.changeSeverity();
			this.settingSeverity = true;	
		}
	},
	
	clickPlus: function(e){
		if (e) e.preventDefault();
		console.log('clicking plus');
		if (!this.added){
			var that = this;
			this.model.set("count", (this.model.get("count") + 1));
			this.model.save(); 
			//create a new plusOne object when someone clicks plusOne
			this.plusOne = new $dino.PlusOne();
			this.plusOne.save({
				item: this.model.id,
				type: that.model.urlRoot.substr(8, that.model.urlRoot.length-9),
				user: Parse.User.current().id
			}, {
			success: function(item){
				that.added = true;
				that.setSeverity();
				that.$(".ui-icon").removeClass("ui-icon-plus");
				that.$(".ui-icon").addClass("ui-icon-check");
			}
			});
		} else {
			this.clickCheck();
		}
	},
	
	clickCheck: function(){
		this.saveSeverity();
		// reset added button
		this.added = false;
		this.$(".ui-icon").removeClass("ui-icon-check");
		this.$(".ui-icon").addClass("ui-icon-plus");
		this.resetTitle();
		this.addBubble('h3', 'Saved');		
	},
	
	saveSeverity: function(){
			var severityLvl = this.settingSeverity ? parseInt(this.$("#severity").val()) : null;
			var sympNotes = this.$("#symptom-notes").val();
			
			if (this.added){
				this.plusOne.save({
					notes: sympNotes,
					severity: severityLvl,
				});				
			}
	}
	
});
