window.$dino.NewBugView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('bug-new'));
		this.first = true;
		this.priority = 1;
		this.colors = new $dino.ColorList();
		// this.colors.bind("change", this.makeList);
		this.colors.bind('add', this.makeList);
		_(this).bindAll("addBug", "render", "makeList", "changePriority");
	},
	events : {
		"click #addBtn" : "addBug",
		"click .ui-radio" : "changePriority"
	},
	changePriority : function() {
		var that = this;
		setTimeout(function() {
			that.priority = $(".ui-radio-on").prev().val() || 1;
		}, 200);
	},
	addBug : function(e) {
		e.preventDefault();
		var bug = new $dino.Bug({
			bugPriority : parseInt(this.priority),
			user : Parse.User.current().id
		});
		if (this.$("#bugtitle").val() != "") {
			bug.set("title", this.$("#bugtitle").val());
		}
		if (this.$("#bugdetails").val() != "") {
			bug.set("bugDetails", this.$("#bugdetails").val());
		}
		if (this.$("#assignedto").val() != "") {
			bug.set("assignedTo", this.$("#assignedto").val());
			bug.set("bugStatus", "Assigned");
		}
		bug.set("color", this.colors.get(this.$("#select-color").val()));
		bug.save(null, {
			success : function(bug) {
				console.log("New bug saved: " + bug.id);
				$dino.app.navigate("list", {
					trigger : true
				});
			},
			error : function(bugg, error) {
				console.log("Failed to save bug, error: " + error.description);
				console.log(error);
			}
		});
	},
	preventDefault : function(e) {
		e.preventDefault();
	},
	makeList : function() {
		var that = this;
		console.log(this);
		var t = (this.length == 17) ? this : this.colors;
		t.fetch({
			success : function(collection) {
				console.log(collection);
				$("#select-color").empty();
				collection.forEach(function(color, key, arr) {
					console.log(color);
					$("#select-color").append('<option value="' + color.id + '" style="background:#' + color.get("hex") + '" class="colorName">' + color.get("color") + '</option>');
				});
			},
			error : function(collection, error) {
				// The collection could not be retrieved.
				console.log(error);
			}
		}, {remote: false});
	},
	render : function() {
		$(this.el).html(this.template());
		var that = this;
		this.makeList();
		if (this.first) {
			this.first = false;
			$(this.el).find("input[type='radio']").checkboxradio({
				create : that.changePriority
			});
		}
		return this;
	}
}); 