window.$dino.NewFormView = Backbone.View.extend({
	initialize : function(opts) {
		opts = opts || {};
		this.template = (opts.tpl) ? _.template(tpl.get(opts.tpl)) : _.template(tpl.get('condition-new'));
		this.header = opts.header || "New";
		this.model = this.model;
		this.debounceSaveTextInput = _.debounce(this.saveTextInput, 2000);
		_(this).bindAll("deleteItem", 'makeList');
		if (this.afterInitialize)
			this.afterInitialize(opts);
	},
	events : {
		"click .add_detail_item" : "addItem",
		"click .delete_detail_item" : "deleteItemEvent",
		"click .new-item" : "preventDefault",
		"keyup .text-input" : "debounceSaveTextInput",
		"change select" : "checkForAddNew",
		"click .add-btn-padding" : "addNewItem",
		"click .cancel-btn-padding" : "cancelNewItem",
	},

	validTypes : ['condition', 'symptom', 'doctor', 'medication'],

	addNewItem : function(e, type) {
		if (e)
			e.preventDefault();
		var that = this;
		var type = type || $(e.currentTarget).data('type');
		var val = this.$("#new-" + type + "-input").val();
		console.log(type, val);
		if (val != "" & _.contains(this.validTypes, type)) {
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
					if (type == "doctor") {
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
		if (e)
			e.preventDefault();
		var type = type || $(e.currentTarget).data('type');
		if (_.contains(this.validTypes, type)) {
			this.resetMenu("#select-" + type);
			this.$('#' + type + '-new-group').hide();
			this.$('#' + type + '-list-bar').show();
		}
	},

	resetMenu : function(selector, valToSelect) {
		valToSelect = valToSelect || 'default';
		console.log('reset', selector);
		// Grab a select field
		var el = this.$(selector);

		// Select the relevant option, de-select any others
		el.val(valToSelect).attr('selected', true).siblings('option').removeAttr('selected');

		// jQM refresh
		try {
			el.selectmenu("refresh", true);
		} catch (err) {
			console.log(err);
		}
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
		if (itemType == "doctor") {
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

	addNewDoctor : function(id, title) {
		var doctorItem = {
			"title" : title,
			"id" : id
		};
		this.model.set("doctor", doctorItem);
		this.cancelNewItem(null, "doctor");
		console.log(id);
		this.resetMenu("#select-doctor", id);
	},

	// fetches passed in item collection and appends to selector
	loadList : function(coll, selector, modelType, noAddNew) {
		var that = this;
		coll.fetch({
			data : {
				user : Parse.User.current().id
			},
			success : function(collection) {
				if (modelType == "doctor")
					console.log(collection);
				that.makeList(collection, selector, modelType, noAddNew);
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

	filterCollection : function(collection, selector, modelType) {
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
	},

	// builds list from fetched collection filtering from an
	// optional modelType that removes item already attached to the model from the modelType list
	makeList : function(collection, selector, modelType, noAddNew) {
		modelType = modelType || "";
		var that = this;
		console.log('running makelist on ' + selector);
		that.$(selector).empty();
		if (modelType && modelType != "doctor" && modelType != "condition" && this.model.get(modelType) && this.model.get(modelType).length != 0) {
			console.log(this.model.toJSON());
			console.log(modelType);
			this.filterCollection(collection, selector, modelType);

		} else if (modelType == "doctor") {
			var selected;
			var modelDoctor = that.model.get("doctor").id;
			collection.each(function(item, idx, models) {
				that.$(selector).append('<option ' + selected + ' value="' + item.id + '">' + item.get("title") + '</li>');
			});
			this.resetMenu("#select-doctor", modelDoctor);
		} else {
			collection.each(function(item, idx, models) {
				that.$(selector).append('<option value="' + item.id + '">' + item.get("title") + '</li>');
			});
		}
		if (modelType == "condition") {
			this.resetMenu("#select-condition", this.model.get("condition").id);
		}
		// special li at end for adding new items to db
		if (!noAddNew) {
			this.$(selector).append('<option data-new="true" data-type="' + modelType + '" value="add-new-item">Add New</li>');
		}
	}
});
