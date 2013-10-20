window.$dino.AppointmentModifyOldView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('appointment-modify'));
	},
	events : {
		"click #modBtn" : "modAppt"
	},

	modAppt : function(e) {
		e.preventDefault();
		if (this.$("#title").val() != "") {
			this.model.set("title", this.$("#title").val());
		}
		if (this.$("#select-bug").val() != "none") {
			this.model.set("bug", this.$("#select-bug").val());
		}
		if (this.$("#select-doc").val() != "none") {
			this.model.set("doc", this.$("#select-doc").val());
		}
		this.model.set({
			"date" : moment($("#appt-date").val() + " " + $("#appt-time").val()).unix(),
			"doc" : $("#select-doc").val(),
			"bug" : $("#select-bug").val(),
			"user" : Parse.User.current().id
		});
		this.model.id = $("#apptId").val();

		this.model.save(null, {
			success : function(appt) {
				console.log("New appt saved: " + appt.id);
				$dino.app.navigate("appts", {
					trigger : true
				});
			},
			error : function(appt, error) {
				console.log("Failed to save appt, error: " + error.description);
				console.log(error);
			}
		});
	},

	preventDefault : function(e) {
		e.preventDefault();
	},

	render : function() {
		var apptMoment = moment(this.model.get("date"));
		var data = {
			// title, apptDate, apptTime, apptId
			"id" : this.model.id,
			"title" : this.model.get("title"),
			"apptDate" : apptMoment.format("YYYY-MM-DD"),
			"apptTime" : apptMoment.format("HH:mm:ss")
		};
		$(this.el).html(this.template(data));
		this.renderMenu("bug");
		this.renderMenu("doctor");
		$(".ui-page").trigger("pagecreate");
		return this;
	},

	checkValidType: function(type){
		return ($.inArray(type, ['doctor', 'bug']) != -1);	
	},
	
	getCollection : function(type) {
		if (this.checkValidType()) {
			console.log("invalid type: " + type);
			return;
		}
		var coll;
		if (type == "bug") {
			coll = new $dino.BugList();
		} else if (type == "doctor"){
			coll = new $dino.DoctorList();
		}
		return coll;
	},

	// for bugs or doctors
	renderMenu : function(type) {
		var item = this.getCollection(type);
		var selector = "#select-"+type;
		var selected = this.model.get(type);

		var that = this;
		item.fetch({
			success : function(coll) {
				that.$(selector).html("<option value='none'>None</option>");
				var selectThis;
				_.each(coll['_byId'], function(v, k) {
					selectThis = (selected == k) ? "selected" : "";
					that.$(selector).append("<option " + selectThis + " value='" + k + "'>" + v.get("title") + "</option>");
				});
				// TODO add new item from menu
				// that.$(selector).append("<option id='newBug'>New Bug</option>");
				that.$(selector).selectmenu();
				that.$(selector).selectmenu("refresh");
			},
			error : function(coll, err) {
				console.log(err);
			}
		}, type);
	}
});
