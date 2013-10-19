window.$dino.PlusListBugItemView = $dino.ListItemView.extend({

	initialize : function() {
		// calling super.constructor
		$dino.PlusListBugItemView.__super__.initialize.call(this, {
			name : "condition"
		});
		this.template = _.template(tpl.get('condition-list-item'));
		this.debounceSaveSeverity = _.debounce(this.saveSeverity, 2000);
		_.bindAll(this, 'saveSeverity', 'debounceSaveSeverity');
		this.$el.data('theme', 'b');
	},

	events : {
		"click" : "dontclick",
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete",
		"dblclick #item-detail" : "openDetails",
		"slidestop" : "changeSeverity",
		"keypress #item-notes" : "addOnEnter",
		"click #symptom-detail" : "goToSymptomDetail",
		"click #condition-detail" : "goToConditionDetail"
	},

	goToConditionDetail: function(e){
		if (e) e.preventDefault();
		if (!this.settingSeverity){
			$dino.app.navigate("bug/"+this.model.id, {
				trigger: true
			});
		}
	},
	
	changeSeverity : function() {
		console.log('change severity');
		//	this.$(".ui-slider div a span .ui-btn-text").html(this.$("#severity").val());
	},

	addOnEnter : function(e) {
		if (e.keyCode == 13)
			this.clickPlus();
	},

	severityTpl : function(data) {
		return _.template(tpl.get('severity-slider'), data);
	},

	setSeverity : function() {
		var that = this;
		if (!this.settingSeverity) {
			var symptoms = this.model.get("symptom");
			_(symptoms).each(function(el, idx, arr) {
				console.log(idx);
				var endVal = false;
				if (idx == arr.length - 1)
					endVal = true;
				that.$("#symptomSliders").append(that.severityTpl({
					elId : el.id,
					title : el.title,
					end : endVal
				}));
			});
			this.$("#item-notes").textinput();
			this.$("#severity").slider({
				trackTheme : 'b',
			});
			this.$("#severity").hide();
			this.$("#cancel-change-severity").button({
				mini : true
			});
			this.changeSeverity();
			this.settingSeverity = true;
		}
	},

	clickPlus : function(e) {
		if (e)
			e.preventDefault();
		console.log(this.model.toJSON());
		console.log('clicked plus');
		if (!this.added) {
			var that = this;
			this.model.set("count", (this.model.get("count") + 1));
			this.model.save();
			//create a new plusOne object when someone clicks plusOne
			this.plusOne = new $dino.PlusOne();
			this.plusOne.save({
				item : this.model.id,
				type : that.model.urlRoot.substr(8, that.model.urlRoot.length - 9),
				user : Parse.User.current().id
			}, {
				success : function(item) {
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

	clickCheck : function() {
		this.saveSeverity();
		// reset added button
		this.added = false;
		this.$(".ui-icon").removeClass("ui-icon-check");
		this.$(".ui-icon").addClass("ui-icon-plus");
		this.$("#symptomSliders").empty();
		// TODO change this to use render
		// currently loses formatting on refresh
		// this.render();
		this.addBubble('h3', 'Saved');
	},
	
	saveSymptomSeverity: function(id, severityLvl) {
		//create a new plusOne object when someone clicks plusOne
			var plusOne = new $dino.PlusOne();
			plusOne.save({
				item : id,
				type : 'symptom',
				user : Parse.User.current().id,
				severity: severityLvl
			}, {
				success : function(item) {
					console.log('Saved plusone severity '+severityLvl+' for symptom', id);
				}
			});
	},

	saveSeverity : function() {
		var that = this;
		_(this.$(".symptom-severity")).each(function(el, idx, arr) {
			var symp_id = $(el).data('id');
			var symp_severity = $(el).val();
			that.saveSymptomSeverity(symp_id, symp_severity);
		});
		this.settingSeverity = false;
		var sympNotes = this.$("#item-notes").val();
		if (this.added) {
			this.plusOne.save({
				notes : sympNotes,
			});
		}
	}
});
