window.$dino.SymptomListView = Backbone.View.extend({

	initialize : function(opts) {
		this.template = _.template(tpl.get('list-view'));
		_.bindAll(this, 'render', 'renderList', 'addSymptomToList');
		this.collection = new $dino.SymptomList();
		this.collection.bind('destroy', this.renderList);
		this.adding = false;
		this.first = true;
	},

	sortList : function(bug) {
		return -bug.get("count");
	},

	events : {
		'click #logout' : 'logout',
		'click #newItem' : 'newSymptom',
		'click #newItemLi' : 'dontClick',
	},

	dontClick : function(e) {
		e.preventDefault();
	},

	addSymptomToList : function(e) {
		if (e)
			e.preventDefault();
		if (this.newSymptomListItem) {
			this.newSymptomListItem.remove();
			this.newSymptomListItem = null;
		}
		this.$("#newItem .ui-btn-text").text("Add");
		this.$("#newItem").removeClass("cancelBtn");
		this.$("#newItem").buttonMarkup({
			icon : "plus"
		});
		this.adding = false;
		this.renderList();
		this.$("#myList").listview('refresh');
	},

	newSymptom : function(e) {
		if (e)
			e.preventDefault();
		if (!this.adding) {
			this.newSymptomListItem = new $dino.ListNewView({
				modelType : $dino.Symptom,
				header : "Symptoms"
			});
			this.newSymptomListItem.bind('newItem', this.addSymptomToList);
			this.$("#myList").prepend(this.newSymptomListItem.render().el);
			this.$("#myList").listview('refresh');
			this.$("#newItemInput").textinput().focus();
			this.$("#newItem .ui-btn-text").text("Cancel");
			this.$("#newItem").addClass("cancelBtn");
			this.$("#newItem").buttonMarkup({
				icon : "delete"
			});
			this.adding = true;
		} else if (this.newSymptomListItem) {
			this.addSymptomToList();
		}
	},

	addOne : function(symptom) {
		var view = new $dino.SymptomListItemView({
			model : symptom
		});
		this.$("#myList").append(view.render().el);
		console.log('addone called');
	},

	logout : function() {
		Parse.User.logOut(null, {
			success : function() {
				$dino.app.navigate("", {
					trigger : true
				});
			}
		});
	},

	renderList : function(firstTime) {
		var that = this;
		this.$("#myList").empty();
		this.collection.fetch({
			data : {
				user : Parse.User.current().id
			},

			success : function(collection) {
				if (collection.length == 0) {
					that.$("#myList").html('<span class="bobregular"><div>No Symptoms Added Yet!</div><hr> <div>Click "Add" Above to Get Started</div><hr></span>');
					this.emptyCollection = true;
					return;
				}

				collection.comparator = that.sortList;

				collection.sort();
				for (var i = 0; i < collection.length; i++) {
					that.addOne(collection.models[i]);
				}
				console.log(collection);
				if (firstTime) {
					console.log('render list');
					that.$("#myList").listview();
					that.$("#myList").listview('refresh');
				}
			},
			error : function() {
				alert("You fucked up, kid.");
			}
		});
		return this;
	},

	render : function() {
		$(this.el).html(this.template({
			"header" : "Symptoms"
		}));
		this.renderList(this.first);
		console.log('not first anymore');
		this.first = false;
		return this;
	}
}); 