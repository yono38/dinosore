window.$dino.ConditionNewView = Backbone.View.extend({
	initialize : function(opts) {
		this.template = _.template(tpl.get('condition-new'));
		this.first = true;
		this.header = opts.header || "Condition";
		this.model = this.model || new $dino.Bug();
		this.debounceSaveTextInput = _.debounce(this.saveTextInput, 2000);
		_(this).bindAll("addCondition", "deleteItem", 'makeList', "render");
	},
	events : {
		"click .add_detail_item" : "addItem",
		"click .delete_detail_item" : "deleteItemEvent",
		"click #addBtn" : "addCondition",
		"click .ui-radio" : "changePriority",
		"click .new-item" : "preventDefault",
		"keyup .text-input" : "debounceSaveTextInput",
		"change select" : "checkForAddNew",
		"change #select-doctor" : "setDoctor",
		"change #select-status" : "setStatus",
		"click .add-btn-padding" : "addNewItem",
		"click .cancel-btn-padding" : "cancelNewItem",
		"pageinit" : "setMenu"
	},
	
	setMenu: function(){
		console.log('setting status menu to proper item');
		var val = this.model.get("status");
		this.resetMenu("#select-status", val);
	},

	setDoctor: function() {
		var $doc = this.$("#select-doctor option:selected");
		if ($doc.val() != "add-new-item"){
			var docItem = {
				id: $doc.val(),
				title: $doc.text()
			};
			this.model.set("doctor", docItem);
		}
	},
	
	setStatus: function() {
		var $stat = this.$("#select-status option:selected");
		this.model.set("status", $stat.val());
	},
		
	addNewItem : function(e, type) {
		if (e) e.preventDefault();
		var that = this;
		var type = type || $(e.currentTarget).data('type');
		var val = this.$("#new-" + type + "-input").val();
		console.log(type, val);
		if (val != "" & _.contains(['symptom', 'doctor', 'medication'], type)) {
			console.log("Add to collection: ", type, val);
			var item = new $dino[type.toTitleCase()]();
			item.set({
				title : val,
				user : Parse.User.current().id
			});
			item.save(null, {
				success : function(item) {
					console.log(item.id);
					// adds newly created doctor to the menu and selects them
					// TODO this is a hack and I should change it to autorender
					if (type == "doctor"){
						that.loadList(that.doctorList, "#select-doctor", "doctor");
					}
					var opts = {
						"id" : item.id,
						"title" : item.get("title"),
						"type" : type
					};
					console.log(opts);
					that.addItem(null, opts);
				}
			});

		}

	},

	cancelNewItem : function(e, type) {
		if (e) e.preventDefault();
		var type = type || $(e.currentTarget).data('type');
		if (_.contains(['symptom', 'doctor', 'medication'], type)) {
			this.resetMenu("#select-"+type);
			this.$('#' + type + '-new-group').hide();
			this.$('#' + type + '-list-bar').show();
		}
	},

	resetMenu : function(selector, valToSelect) {
		valToSelect = valToSelect || 'default';
		console.log('reset',selector);
		// Grab a select field
		var el = this.$(selector);

		// Select the relevant option, de-select any others
		el.val(valToSelect).attr('selected', true).siblings('option').removeAttr('selected');

		// jQM refresh
		el.selectmenu("refresh", true);
	},

	preventDefault : function(e) {
		e.preventDefault();
	},

	// save the text input and add a Saved bubble to the item
	saveTextInput : function(e) {
		this.model.set({
			"title" : $("#condition-title").val(),
			"details" : $("#condition-details").val()
		});
		if (this.liveSave) {
			this.model.save({}, {
				success : function() {
					console.log('text input saved');
					$("#savePopup").show().delay(2000).fadeOut();
				}
			});
		} else {
			console.log('model updated');
			//	console.log(this.model.toJSON());
		}
	},

	// reads the type and id off data attributes in the add button tag
	deleteItemEvent : function(e) {
		e.preventDefault();
		console.log(this);
		var type = $(e.currentTarget).attr("data-type");
		var id = $(e.currentTarget).attr("data-id");
		this.deleteItem(this.model, type, id, true);
	},

	// uses id to find and remove item from the array of its type in the model
	deleteItem : function(model, type, itemId, unlink) {
		console.log(type, itemId);
		var typeItemArr = model.get(type);
		typeItemArr = _.filter(typeItemArr, function(item) {
			return item.id != itemId;
		});
		model.set(type, typeItemArr);
		this.render(true);
	},

	// adds title and id to array of the item's type in the model'
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
		// doctors are handled differently
		if (itemType =="doctor") {
			this.addNewDoctor(itemVal, itemTitle);
			return;
		}
		if (itemVal && itemVal != "") {
			var typeItemArr = this.model.get(itemType);
			// defaults to false
			if (!typeItemArr) {
				typeItemArr = [];
			}
			var that = this;
			typeItemArr.push({
				"title" : itemTitle,
				"id" : itemVal
			});
			this.model.set(itemType, typeItemArr);
			console.log(this.model.toJSON());
			// TODO this is a hack should understand and change it
			that.first = true;
			that.render();
		}
	},
	
	addNewDoctor: function(id, title){
		var doctorItem = {
			"title" : title,
			"id" :  id
		};
		this.model.set("doctor", doctorItem);
		this.cancelNewItem(null, "doctor");
		console.log(id);
		this.resetMenu("#select-doctor", id);
	},

	addCondition : function(e) {
		e.preventDefault();
		//this.$("#error-msg").hide();
		if (!this.validateCondition())
			return;
		console.log(this.model.toJSON());
		this.model.set("user", Parse.User.current().id);
		this.model.save(null, {
			success : function(condition) {
				console.log("New condition saved: " + condition.id);
				$dino.app.navigate("bugs", {
					trigger : true
				});
			},
			error : function(condition, error) {
				console.log("Failed to save condition, error: " + error.description);
				console.log(error);
			}
		});
	},

	// condition must have a title and at least one symptom
	validateCondition : function() {
		if (this.$("#condition-title").val() == "") {
			this.$("#error-msg").html("Don't forgot to make a title!");
			this.$("#error-msg").show();
			return false;
		} else if (this.model.get("symptom").length == 0) {
			this.$("#error-msg").html("Add a symptom to start tracking this condition");
			this.$("#error-msg").show();
			return false;
		} else {
			return true;
		}
	},

	// fetches passed in item collection and appends to selector
	loadList : function(coll, selector, modelType) {
		var that = this;
		coll.fetch({
			data : {
				user : Parse.User.current().id
			},
			success : function(collection) {
				if (modelType == "doctor") console.log(collection);
				that.makeList(collection, selector, modelType);
			},
			error : function(collection, error) {
				// The collection could not be retrieved.
				console.log(error);
			}
		});
	},
	checkForAddNew : function(e) {
		var $sel = $("option:selected", e.currentTarget);
		if ($sel.val() == "add-new-item" && $sel.data("type") != "" && $sel.data("new") == true) {
			this.showNewItemInput($sel.data("type"));
		}
	},
	showNewItemInput : function(type) {
		if (_.contains(['symptom', 'doctor', 'medication'], type)) {
			$('#new-' + type + '-input').val("");
			$('#' + type + '-new-group').show();
			$('#' + type + '-list-bar').hide();
		}
	},

	// builds list from fetched collection filtering from an
	// optional modelType that removes item already attached to the model from the modelType list
	makeList : function(collection, selector, modelType) {
		modelType = modelType || "";
		var that = this;
		console.log('running makelist on ' + selector);
		if (modelType && modelType != "doctor" && this.model.get(modelType) && this.model.get(modelType).length != 0) {
			console.log(this.model.toJSON());
			console.log(modelType);
			try {
				var type_ids = _.map(this.model.get(modelType), function(item) {
					return item.id;
				});
				console.log(type_ids);
				var filteredColl = collection.filter(function(item) {
					return !_.contains(type_ids, item.id);
				});
				_(filteredColl).each(function(item, idx, models) {
					that.$(selector).append('<option value="' + item.id + '">' + item.get("title") + '</li>');
				});
			} catch (err) {
				console.log(err);
			}
		} else if (modelType == "doctor"){
			var selected;
			var modelDoctor = that.model.get("doctor").id;
			collection.each(function(item, idx, models) {
				that.$(selector).append('<option '+selected+' value="' + item.id + '">' + item.get("title") + '</li>');
			});
			this.resetMenu("#select-doctor", modelDoctor);
		} else {
			collection.each(function(item, idx, models) {
				that.$(selector).append('<option value="' + item.id + '">' + item.get("title") + '</li>');
			});
		}
		// special li at end for adding new items to db
		this.$(selector).append('<option data-new="true" data-type="'+modelType+'" value="add-new-item">Add New</li>');
	},

	// loads model info into form and creates item lists
	render : function(reload) {
		console.log(this.header);
		$(this.el).html(this.template(_.extend(this.model.toJSON(), {
			"header" : this.header
		})));
		var that = this;
		if (this.first) {
			this.first = false;
			$(this.el).find("input[type='radio']").checkboxradio({
				//		create : that.changePriority
			});
			this.symptomList = new $dino.SymptomList();
			this.loadList(this.symptomList, "#select-symptom", "symptom");
			this.medicationList = null;
			this.medicationList = new $dino.MedicationList();
			this.loadList(this.medicationList, "#select-medication", "medication");
			this.doctorList = new $dino.DoctorList();
			this.loadList(this.doctorList, "#select-doctor", "doctor");
		} else if (reload) {
			this.makeList(this.medicationList, "#select-medication", "medication");
			this.makeList(this.symptomList, "#select-symptom", "symptom");
			this.makeList(this.doctorList, "#select-doctor", "doctor");
		}
		// TODO figure out how to not need this
		$(".ui-page").trigger("pagecreate");
		return this;
	}
});
