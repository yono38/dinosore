window.$dino.ConditionNewView = $dino.NewFormView.extend({
	initialize : function(opts) {
		this.template = _.template($dino.tpl.get('condition-new'));
		this.first = true;
		this.header = opts.header || 'Condition';
		this.model = this.model || new $dino.Bug();
		this.debounceSaveTextInput = _.debounce(this.saveTextInput, 2000);
		_(this).bindAll('addCondition', 'deleteItem', 'makeList', 'render');
	},
	events : {
		'click .delete_detail_item' : 'deleteItemEvent',
		'click #addBtn' : 'addCondition',
		'click .new-item' : 'preventDefault',
		'keyup .text-input' : 'debounceSaveTextInput',
		'change select' : 'checkForAddNew',
		'change #select-doctor' : 'setDoctor',
		'change #select-status' : 'setStatus',
		'click .open-input-new-item' : 'openNewItemInput',
		'click .cancel-btn-padding' : 'cancelNewItem',
		'click .add-btn-padding' : 'addNewItem',
		'change #select-medication' : 'selectMedication',
		'pageinit' : 'setMenu',
		'click #select-medication-button' : 'openMedListbox',
		'click #select-symptom-button' : 'openSympListbox',
		'click #select-medication-listbox .ui-header a.ui-btn-left' : 'closeMedListbox',
		'click #select-symptom-listbox .ui-header a.ui-btn-left' : 'closeSympListbox',
	},
	// =====================
	// MultiSelect Handling
	// ====================
	closeSympListbox: function(e) {
		e.preventDefault();
		this.closeListbox('symptom');
	},
	closeMedListbox: function(e) {
		e.preventDefault();
		this.closeListbox('medication');
	},
	closeListbox : function(item) {
		this.$('#select-'+ item +'-listbox').popup('close');
	},
	openSympListbox: function(e) {
		e.preventDefault();
		this.openListbox('symptom');
	},
	openMedListbox: function(e) {
		e.preventDefault();
		this.openListbox('medication');
	},
	openListbox : function(item) {
		this.$('#select-'+ item).selectmenu('refresh');
		this.$('#select-'+ item +'-listbox').popup({
			overlayTheme : 'a'
		});
		this.$('#select-'+ item +'-listbox').popup('open');
		this.$('#select-'+ item +'-listbox li:first-child').removeClass('ui-btn-down-a ui-focus');
	},
	selectMedication: function(e){
		console.log('chose medication');
//		this.$("#select-medication-button .ui-btn-inner .ui-btn-text span").text("Medications");
	},
	setMenu : function() {
		console.log('setting status menu to proper item');
		var val = this.model.get('status');
		this.resetMenu('#select-status', val);
	},
	setDoctor : function() {
		var $doc = this.$('#select-doctor option:selected');
		if ($doc.val() != 'add-new-item') {
			var docItem = {
				id : $doc.val(),
				title : $doc.text()
			};
			this.model.set('doctor', docItem);
		}
	},
	setStatus : function() {
		var $stat = this.$('#select-status option:selected');
		this.model.set('status', $stat.val());
	},
	// ======================
	// New Item Functions
	// ======================
	openNewItemInput:function(e, type){
		if (e)
			e.preventDefault();
		type = type || $(e.currentTarget).data('type');
		this.$("#"+type+"-new-group").show();
		this.$("#select-"+type+"-button").hide();
		this.$("#new-"+type+"-input-btn").hide();
	},
	cancelNewItem : function(e, type) {
		if (e)
			e.preventDefault();
		type = type || $(e.currentTarget).data('type');
		this.$("#"+type+"-new-group").hide();
		this.$("#select-"+type+"-button").show();
		this.$("#new-"+type+"-input-btn").show();
		this.$("#new-"+type+"-input").val("");
	},
	addNewItem : function(e, type) {
		if (e)
			e.preventDefault();
		var that = this;
		type = type || $(e.currentTarget).data('type');
		var val = this.$('#new-' + type + '-input').val();
		console.log(type, val);
		// validate
		if (val === '' ) {
			this.$("#"+type+"-new-group .ui-input-text").css("border-bottom", "2px solid red");
			return;
		} else {
			this.$("#"+type+"-new-group .ui-input-text").css("border-bottom", "none");
		}
		if (val !== '' & _.contains(['symptom', 'doctor', 'medication'], type)) {
			console.log('Add to collection: ', type, val);
			var item = new $dino[(type.toTitleCase())]();
			item.set({
				title : val,
				user : Parse.User.current().id
			});
			console.log(item);
			item.save(null, {
				success : function(item) {
					console.log(item.id);
					// adds newly created doctor to the menu and selects them
					// TODO this is a hack and I should change it to autorender
					if (type == 'doctor') {
						that.loadList(that.doctorList, '#select-doctor', 'doctor');
					}
					var opts = {
						'id' : item.id,
						'title' : item.get('title'),
						'type' : type
					};
					console.log(opts);
					that.addItem(null, opts);
				}
			});
		} else {
			console.log("Trying to add unknown type:", type);
		}
	},
	saveTextInput : function(e) {
		this.model.set({
			'title' : $('#condition-title').val(),
			'details' : $('#condition-details').val()
		});
		if (this.liveSave) {
			this.model.save({}, {
				success : function() {
					console.log('text input saved');
					$('#savePopup').show().delay(2000).fadeOut();
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
		var type = $(e.currentTarget).attr('data-type');
		var id = $(e.currentTarget).attr('data-id');
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
	addItem : function(e, opts) {
		var itemType, itemVal, itemTitle;
		if (opts) {
			itemType = opts.type;
			itemVal = opts.id;
			itemTitle = opts.title;
		} else {
			console.log('Error: invalid addItem call');
			return;
		}
		this.$("#select-"+itemType).append('<option selected value="'+itemVal+'">'+itemTitle+'</option>');
		this.$("#select-"+itemType).selectmenu('refresh');
		this.$("#new-"+itemType+"-input").val("");
		this.cancelNewItem(null, itemType);
		/*console.log(itemVal);
		console.log(itemType);
		// doctors are handled differently
		if (itemType == 'doctor') {
			this.addNewDoctor(itemVal, itemTitle);
			return;
		}
		if (itemVal && itemVal !== '' && itemVal != 'default') {
			var typeItemArr = this.model.get(itemType);
			// defaults to false
			if (!typeItemArr) {
				typeItemArr = [];
			}
			var that = this;
			typeItemArr.push({
				'title' : itemTitle,
				'id' : itemVal
			});
			this.model.set(itemType, typeItemArr);

			console.log(this.model.toJSON());
		}*/
	},
	addNewDoctor : function(id, title) {
		var doctorItem = {
			'title' : title,
			'id' : id
		};
		this.model.set('doctor', doctorItem);
		this.cancelNewItem(null, 'doctor');
		console.log(id);
		this.resetMenu('#select-doctor', id);
	},
	// underscore ftw!
	getSelected: function(type) {
		var r =_.map(
			// choose not disabled so it won't get placeholder element
			this.$("#select-"+type+" option:not(:disabled):selected"), 
			function(node){
				return {"id":node.value,"title":node.text}; 
			}
		);
		console.log(r);
		return r;
	},
	addCondition : function(e) {
		e.preventDefault();
		//this.$("#error-msg").hide();
		if (!this.validateCondition())
			return;
		this.model.set({
			'user': Parse.User.current().id,
			'symptom' : this.getSelected('symptom'),
			'medication': this.getSelected('medication'),
			'count': 0,
			'status': this.$("select-status").val(),
			'doctor': {
				'title': this.$("#select-doctor option:selected").text(),
				'id': this.$("#select-doctor option:selected").val()
			},
			'title': this.$("#condition-title").val(),
			'details': this.$("#condition-details").val()
		});
		console.log(this.model.toJSON());
		this.model.save(null, {
			success : function(condition) {
				console.log('New condition saved: ' + condition.id);
				$dino.app.navigate('bugs', {
					trigger : true
				});
			},
			error : function(condition, error) {
				console.log('Failed to save condition, error: ' + error.description);
				console.log(error);
			}
		});
	},
	validateCondition : function() {
		sympSize = _.chain(this.$("#select-symptom option:selected"))
			.map(function(node){return node.value;})
			.compact() // remove falsy from placeholder value
			.value()
			.length;
		if (this.$('#condition-title').val() === '') {
			this.$('#error-msg').html('Don\'t forgot to make a title!');
			this.$('#error-msg').show();
			return false;
		} else if (sympSize === 0) {
			this.$('#error-msg').html('Add a symptom to start tracking this condition');
			this.$('#error-msg').show();
			return false;
		} else {
			return true;
		}
	},
	loadList : function(coll, selector, modelType) {
		var that = this;
		coll.fetch({
			data : {
				user : Parse.User.current().id
			},
			success : function(collection) {
				if (modelType == 'doctor')
					console.log(collection);
				that.makeList(collection, selector, modelType);
			},
			error : function(collection, error) {
				// The collection could not be retrieved.
				console.log(error);
			}
		});
	},
	checkForAddNew : function(e) {
		var $sel = $('option:selected', e.currentTarget);
		if ($sel.val() == 'add-new-item' && $sel.data('type') !== '' && $sel.data('new') === true) {
			this.showNewItemInput($sel.data('type'));
		}
	},
	showNewItemInput : function(type) {
		if (_.contains(['symptom', 'doctor', 'medication'], type)) {
			$('#new-' + type + '-input').val('');
			$('#' + type + '-new-group').show();
			$('#' + type + '-list-bar').hide();
		}
	},
	makeList : function(collection, selector, modelType) {
		modelType = modelType || '';
		var that = this;
		var selectedItem = "";
		var selected = _.pluck(this.model.get(modelType), 'id');
		console.log('running makelist on ' + selector);
		this.$(selector).children( 'option:not(:first)' ).remove();
		if (modelType && modelType != 'doctor' && this.model.get(modelType) && this.model.get(modelType).length !== 0) {
			console.log(this.model.toJSON());
			console.log(modelType);
			console.log(collection);
			try {
				collection.each(function(item, idx, models) {
					selectedItem = "";
					if (_.contains(selected, item.id)) selectedItem = "selected";
					that.$(selector).append('<option '+selectedItem +' value="' + item.id + '">' + item.get('title') + '</li>');
				});
				that.$(selector).selectmenu('refresh');
			} catch (err) {
				console.log(err);
			}
		} else if (modelType == 'doctor') {
			selectedItem = "";
			var modelDoctor = that.model.get('doctor').id;
			collection.each(function(item, idx, models) {
				selectedItem = "";
				if (modelDoctor === item.id) selectedItem = "selected";
				that.$(selector).append('<option ' + selectedItem + ' value="' + item.id + '">' + item.get('title') + '</li>');
			});
			this.resetMenu('#select-doctor', modelDoctor);
		} else {
			collection.each(function(item, idx, models) {
				that.$(selector).append('<option value="' + item.id + '">' + item.get('title') + '</li>');
			});
		}
	},
	render : function(reload) {
		console.log(this.header);
		this.$el.html(this.template(_.extend(this.model.toJSON(), {
			'header' : this.header
		})));
		var that = this;
		if (this.first) {
			this.first = false;
			$(this.el).find('input[type=\'radio\']').checkboxradio({});
			this.symptomList = new $dino.SymptomList();
			this.loadList(this.symptomList, '#select-symptom', 'symptom');
			this.medicationList = null;
			this.medicationList = new $dino.MedicationList();
			this.loadList(this.medicationList, '#select-medication', 'medication');
			this.doctorList = new $dino.DoctorList();
			this.loadList(this.doctorList, '#select-doctor', 'doctor');
		} else if (reload) {
			this.makeList(this.medicationList, '#select-medication', 'medication');
			this.makeList(this.symptomList, '#select-symptom', 'symptom');
			this.makeList(this.doctorList, '#select-doctor', 'doctor');
		}
		// TODO figure out how to not need this
		$('.ui-page').trigger('pagecreate');
		return this;
	}
}); 