window.$dino.ConditionNewView = Backbone.View.extend({
	initialize : function(opts) {
		this.template = _.template(tpl.get('condition-new'));
		this.first = true;
		this.header = opts.header || "Condition";
		this.model = this.model || new $dino.Bug();
		this.debounceSaveTextInput = _.debounce(this.saveTextInput, 2000);
		_(this).bindAll("addCondition", "deleteItem", 'makeList', "render", "changePriority");
	},
	events : {
		"click .add_detail_item" : "addItem",
		"click .delete_detail_item" : "deleteItemEvent",
		"click #addBtn" : "addCondition",
		"click .ui-radio" : "changePriority",
		"keyup .text-input" : "debounceSaveTextInput",
	},

	changePriority : function() {
		var that = this;
		// TODO figure out how to not do this
		console.log('test');
		setTimeout(function() {
			that.model.set("priority", that.$('input[name=radio-view]:checked').val());
			console.log(that.model.get("priority"));
		}, 50);
	},

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

	deleteItemEvent : function(e) {
		e.preventDefault();
		console.log(this);
		var type = $(e.currentTarget).attr("data-type");
		var id = $(e.currentTarget).attr("data-id");
		this.deleteItem(this.model, type, id, true);
	},

	deleteItem : function(model, type, itemId, unlink) {
		console.log(type, itemId);
		var typeItemArr = model.get(type);
		typeItemArr = _.filter(typeItemArr, function(item) {
			return item.id != itemId;
		});
		model.set(type, typeItemArr);
		this.render(true);
	},

	addItem : function(e) {
		var itemType = $(e.currentTarget).data('type'), itemVal = this.$("#select-" + itemType).val(), itemTitle = this.$("#select-" + itemType + " option:selected").text();
		console.log(itemVal);
		console.log(itemType);
		if (itemVal && itemVal != "") {
			var typeItemArr = this.model.get(itemType);
			// defaults to false
			if (!typeItemArr) {
				typeItemArr = [];
			}
			var that = this;
			typeItemArr.push({
				"title" : itemTitle.replace(" [assigned]", ""),
				"id" : itemVal
			});
			this.model.set(itemType, typeItemArr);
			console.log(this.model.toJSON());
			that.render(true);
		}
	},

	addCondition : function(e) {
		e.preventDefault();
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
	preventDefault : function(e) {
		e.preventDefault();
	},

	loadList : function(coll, selector, modelType) {
		var that = this;
		coll.fetch({
			data : {
				user : Parse.User.current().id
			},
			success : function(collection) {
				that.makeList(collection, selector, modelType);
			},
			error : function(collection, error) {
				// The collection could not be retrieved.
				console.log(error);
			}
		});
	},

	makeList : function(collection, selector, modelType) {
		var that = this;
		console.log('running makelist on ' + selector);
		if (modelType && this.model.get(modelType) && this.model.get(modelType).length != 0) {
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
					console.log(item);
					that.$(selector).append('<option value="' + item.id + '">' + item.get("title") + '</li>');
				});
				return;
			} catch (err) {
				console.log(err);
			}
		}
		collection.each(function(item, idx, models) {
			that.$(selector).append('<option value="' + item.id + '">' + item.get("title") + '</li>');
		});
	},

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
			this.loadList(this.doctorList, "#select-doctor");
		} else if (reload) {
			this.makeList(this.medicationList, "#select-medication", "medication");
			this.makeList(this.symptomList, "#select-symptom", "symptom");
			this.makeList(this.doctorList, "#select-doctor");
		}
		// TODO figure out how to not need this
		$(".ui-page").trigger("pagecreate");
		console.log(this.model.get("priority"));
		this.$("#priority-" + this.model.get("priority")).attr("checked", true).checkboxradio("refresh");
		return this;
	}
});
