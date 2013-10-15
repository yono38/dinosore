window.$dino.BugListView = Backbone.View.extend({

	initialize : function(opts) {
		this.template = _.template(tpl.get('bug-list'));
		_.bindAll(this, 'render');
		this.collection = opts.collection;
	},

	sortList : function(bug) {
		return -bug.get("bugPriority");
	},

	events : {
		'click #logout' : 'logout',
		'click #newBug' : 'newBug'
	},

	newBug : function() {
		$dino.app.navigate("bugs/add", {
			trigger : true
		});
	},

	addOne : function(bug) {
		var view = new $dino.BugListItemView({
			model : bug
		});
		this.$("#myList").append(view.render().el);
		if(this.pageloaded){
			this.$("#myList").listview('refresh');
		}
	},

	render : function() {
		var that = this;
		$(this.el).html(this.template());
		// this.$("#myList").listview();
		this.collection.fetch({
			data : {
				"user" : Parse.User.current().id
			},
			success : function(collection) {
				collection.comparator = that.sortList;

				collection.sort();
				for (var i = 0; i < collection.length; i++) {
					var item = collection.models[i];
					that.addOne(item);
					if (item.get("color")){
						console.log("setting color "+item.get("color"));
						localStorage.setItem("bugcolor-"+item.id, item.get("color"));
					}
				}
				if (that.pageloaded){
					that.$("#myList").listview('refresh');
				}
			},
          error: function(err, data){
          	$dino.fail404();
          }
		});
		return this;
	}
}); 