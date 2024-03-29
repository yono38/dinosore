window.$dino.SymptomListItemView = $dino.ListItemView.extend({
	
	initialize: function(){
		// calling super.constructor
		$dino.SymptomListItemView.__super__.initialize.call(this, {name: "symptom"});
		_.bindAll(this, 'saveSymptom');
	}, 
	
	events: {
		"click" : "dontclick",
		"click .plus-one" : "clickPlus",
		"click #confirm-plus" : "saveSymptom",
		"slidestop" : "changeSeverity",
		"keypress #symptom-notes" : "addOnEnter",
		"indom" : "makeSwiper",
		"click #cancel-plus" : "resetTitle",
		"click #item-title-slide" : "goToSymptomDetail",
		"click .removeItem" : "confirmDelete",
		"click .retireItem" : "retireItem"
	},

	// resets the title (removes severity slider)
	// can place added bubble on plusOne
	resetTitle: function(e){
		if (e) e.preventDefault();
		this.$(".check-items").hide();
		this.$(".plus-one").show();
		this.$(".set-severity").hide();
		this.$(".swiper-slide").removeClass('swiper-no-swiping');
		this.$(".swiper-slide").css("height", "100%");
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
		this.setSeverity();
		this.$(".plus-one").hide();
		this.$(".check-items").show();
		this.$(".swiper-slide").css("height", "auto");
	},
	
	saveSymptom: function(){
		var that = this;
		var severityLvl = this.settingSeverity ? parseInt(this.$("#severity").val(), 10) : null;
		var sympNotes = this.$("#symptom-notes").val();
		var plusOne = new $dino.PlusOne();
		plusOne.save({
				item: this.model.id,
				type: this.name,
				user: Parse.User.current().id,
				notes: sympNotes,
				severity: severityLvl,
			}, {
			success: function(item){ 
				that.resetTitle();
				that.addBubble('.item-title', 'Saved');		
				that.model.set("count", (this.model.get("count") + 1));
				that.model.save(); 
			}
		});
	}
	
});
