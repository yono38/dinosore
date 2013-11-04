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
		"slidestop" : "changeSeverity",
		"keypress #symptom-notes" : "addOnEnter",
		"indom" : "makeSwiper",
		"click #cancel-change-severity" : "resetTitle",
		"click #item-title-slide" : "goToSymptomDetail",
		"click .removeItem" : "confirmDelete",
		"click .retireItem" : "retireItem"
	},

	// resets the title (removes severity slider)
	// can place added bubble on plusOne
	resetTitle: function(e){
		if (e) e.preventDefault();
		this.$(".set-severity").hide();
		this.$(".swiper-slide").removeClass('swiper-no-swiping');
		this.$("#symptom-notes").val("");
		this.$("#severity").val("0");
		this.$("#severity").slider("refresh");
		this.changeSeverity();
		//var title = this.model.get("title");
		//var itemHtml = '<span class="symptom-title">'+title+'</span>';
		//this.$("h3").html(itemHtml);
		this.settingSeverity = false;
	},
	
	goToSymptomDetail: function(e){
		if (e) e.preventDefault();
		if (!this.settingSeverity){
			$dino.app.navigate("symptoms/"+this.model.id+"/graph", {
				trigger: true
			});
		}
	},
	
	changeSeverity: function(){
		this.$(".ui-slider div a span .ui-btn-text").html(this.$("#severity").val());		
	},
	
	addOnEnter: function(e){
	  if (e.keyCode == 13) this.clickPlus();
	},

	setSeverity: function(){
		if (!this.settingSeverity){
			this.$(".set-severity").show();
			this.$(".swiper-slide").addClass('swiper-no-swiping');
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
				type: this.name,
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
		this.addBubble('.item-title', 'Saved');		
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
