window.$dino.SymptomListView = $dino.PlusListView.extend({

	afterInitialize : function() {
		this.bugCollection = new $dino.BugList();
	},

	events : {
		'click .new-item' : 'dontClick',
		'click #new-symptom-padding' : 'newSymptom',
		'click #new-condition-padding' : 'newCondition',
		'pageinit' : 'loadedPage'
	},

	createAddButton : function() {
		this.placeholder = "Symptom";
		this.addingBtn = new $dino.PlusListAddButtonView({
			addText : "Symptom",
			elId : "new-symptom-padding"
		});
		this.$(".ui-block-a").html(this.addingBtn.render().el);
		this.addingBtn.bind('toggle', this.newItem, this);
	},

	newSymptom : function(e) {
		this.adding.symptom = !this.adding.symptom;
		console.log('clicked new sypmtom');
	},

	newCondition : function(e) {
		$dino.app.navigate("bugs/add", {
			trigger : true
		});
		console.log('clicked new condition');
	},

	renderList : function(firstTime) {
		var that = this;
		this.$("#myList").empty();
		this.$("#retiredList").empty();
		this.$("#activeConditionList").empty();
		this.bugCollection.fetch({
			data : {
				"user" : Parse.User.current().id
			},
			success : function(collection) {
				collection.comparator = that.sortList;

				collection.sort();
				for (var i = 0; i < collection.length; i++) {
					var item = collection.models[i];
					that.addOne(item, "bug");
				}
				if (that.pageloaded) {
					that.$("#activeConditionList").listview('refresh');
					that.$("#myList").listview('refresh');
					that.$("#retiredList").listview('refresh');
				}
			},
			error : function(err, data) {
				$dino.fail404();
			}
		});		
		this.collection.fetch({
			data : {
				"user" : Parse.User.current().id
			},
			success : function(collection) {
				if (collection.length == 0) {
					that.$("#myList").html('<span id="no-items-yet" class="fancyFont"><div>No ' + that.header + ' Added Yet!</div><hr> <div>Click "Add" Above to Get Started</div><hr></span>');
					return;
				}

				collection.comparator = that.sortList;

				collection.sort();
				for (var i = 0; i < collection.length; i++) {
					that.addOne(collection.models[i], "symptom");
				}
				if (!that.loading) {
					that.$("#activeConditionList").listview();
					that.$("#activeConditionList").listview('refresh');
					that.$("#myList").listview();
					that.$("#myList").listview('refresh');
					that.$("#retiredList").listview();
					that.$("#retiredList").listview('refresh');
				}
			},
			error : function(err, data) {
				$dino.fail404();
			}
		});

		return this;
	},

	addOne : function(item, type) {
		var selector = "#myList";
		if (type == "symptom") {
			var view = new $dino.SymptomListItemView({
				model : item
			});
		} else if (type == "bug") {
			var view = new $dino.ConditionListItemView({
				model : item
			});
	      	selector = (item.get("status") == "In Remission" || item.get("status") == "Retired") ? "#retiredList" : "#activeConditionList";  
		} else {
			console.log("Invalid type: " + type);
		}
      	console.log(selector);
     	this.$(selector).append(view.render().el);  
	}
});
