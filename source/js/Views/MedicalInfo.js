window.$dino.MedicalInfoView = $dino.NewFormView.extend({

	afterInitialize : function(opts) {
		this.template = _.template(tpl.get('medical-info'));
		// extend child events on to parent's - inheritance ftw
		this.events = _.extend({}, $dino.NewFormView.prototype.events, this.events);
		this.model = Parse.User.current();
		this.visualize = {
			"medication" : [],
			"symptom" : [],
		};
	},

	events : {
		'click #logout' : 'logout',
		'click #visualize-items' : 'visualizeItems',
		'click #visualize-condition' : 'visualizeCondition'
	},

	// not implemented yet
	visualizeItems : function(e) {
		e.preventDefault();
		console.log(this.visualize);
	},

	// not implemented yet
	visualizeCondition: function(e) {
		e.preventDefault();
		console.log(this.$("#select-condition").val());
	},

	logout : function() {
		Parse.User.logOut(null, {
			success : function() {
				localStorage.clear();
				$dino.app.navigate("", {
					trigger : true
				});
			}
		});
	},

	addItem : function(e, opts) {
		var itemType, itemVal, itemTitle;
		if (e) {
			itemType = $(e.currentTarget).data('type'), itemVal = this.$("#select-" + itemType).val(), itemTitle = this.$("#select-" + itemType + " option:selected").text();
		} else if (opts) {
			itemType = opts.type, itemVal = opts.id, itemTitle = opts.title;
		} else {
			console.log("Error: invalid addItem call");
			return;
		}
		console.log(itemVal);
		console.log(itemType);
		console.log(_.contains(this.visualize[itemType], itemVal));
		if (itemVal != "default" && !_.contains(this.visualize[itemType], itemVal)) {
			
			console.log('test');
			this.visualize[itemType].push(itemVal);
			this.$("#"+itemType+"-list").append('<li>'
			+ '<a href="#" data-role="button" data-inline="true" data-corners="true" data-icon="delete" data-id="'+itemVal+'" class="ui-icon-alt ui-icon-nodisc delete_detail_item" data-type="'+itemType+'" data-iconpos="notext">X</a>'
			+ '<span class="fancyFont itemName"><span data-id="'+itemVal+'" class="itemName">'+itemTitle+'</span></span></li>');
			this.$(".delete_detail_item").button();
		}
	},

	// uses id to find and remove item from the array of its type in the model
	deleteItem : function(model, type, itemId, unlink) {
		this.visualize[type] = _.without(this.visualize[type], itemId);
		this.$("a[data-id='"+itemId+"']").parent().remove();
	},

	filterCollection : function(coll, selector, modelType) {

	},

	render : function(eventName) {
		this.$el.html(this.template());
		this.symptomList = new $dino.SymptomList();
		this.loadList(this.symptomList, "#select-symptom", "symptom", true);
		this.medicationList = new $dino.MedicationList();
		this.loadList(this.medicationList, "#select-medication", "medication", true);
		this.conditionList = new $dino.BugList();
		try {
			this.loadList(this.conditionList, "#select-condition", "condition", true);
		} catch (err){
			console.log("fix this later:");
			console.log(err);
		}
		//	makeList : function(collection, selector, modelType, noAddNew, noFilter) {

		return this;
	}
});
