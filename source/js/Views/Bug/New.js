window.$dino.NewBugView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('bug-new'));
		this.first = true;
		this.priority = 1;
		_(this).bindAll("addBug", "render", "loadColorList", "changeColor", "changePriority");
	},
	events : {
		"click #addBtn" : "addBug",
		"click .ui-radio" : "changePriority",
		"change #select-color" : "changeColor"
	},
	changeColor : function() {
		this.$("#select-color").parent().attr("style", this.$("#select-color option:selected").attr("style"));
		this.setColor = true;
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
		if (this.setColor) {
			bug.set("color", this.$("#select-color").val() );
		}
		bug.save(null, {
			success : function(bug) {
				console.log("New bug saved: " + bug.id);
				$dino.app.navigate("bugs", {
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
	loadColorList : function(cnt) {
		var that = this;
		that.$("#select-color").html('<option value="default">DEFAULT</option>');
		_($dino.colors).each(function(color, key, arr) {
			console.log()
			that.$("#select-color").append('<option value="' + key + '" style="background:#' + color.hex + '" class="colorName">' + color.color + '</option>');
		});
	},
	makeList : function(type) {
		var that = this;
		var t = (this.length == 17) ? this : this.colors;
		t.fetch({
			success : function(collection) {
				$("#select-color").empty();
				collection.forEach(function(color, key, arr) {
					$("#select-color").append('<option value="' + key + '" style="background:#' + color.hex + '" class="colorName">' + color.color + '</option>');
				});
			},
			error : function(collection, error) {
				// The collection could not be retrieved.
				console.log(error);
			}
		}, {
			remote : false
		});
	},
	render : function() {
		this.$el.html(this.template());
		var that = this;
		this.loadColorList();
		if (this.first) {
			this.first = false;
			$(this.el).find("input[type='radio']").checkboxradio({
				create : that.changePriority
			});
		}
		return this;
	}
});
