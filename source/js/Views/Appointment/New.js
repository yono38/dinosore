window.$dino.AppointmentNewView = $dino.NewFormView.extend({
	afterInitialize : function(opts) {
		this.model = this.model || new $dino.Appointment();
		this.template = _.template(tpl.get('appointment-new'));
		this.first = true;
		// extend child events on to parent's - inheritance ftw
		_.bindAll(this, 'setCondition', 'setDoctor');
		this.events = _.extend({}, $dino.NewFormView.prototype.events, this.events);
	},

	events : {
		"click #addBtn" : "addAppt",
		"change #select-condition" : "setCondition",
		"change #select-doctor" : "setDoctor"
	},
	
	setCondition: function(e) {
		var $sel = this.$("#select-condition option:selected");
		var condition = {
			id: $sel.val(),
			title: $sel.text()
		};
		this.model.set("condition", condition);
	},
	
	setDoctor: function(e) {
		var $sel = this.$("#select-doctor option:selected");
		if ($sel.val() != "add-new-item"){
			var doc = {
				id: $sel.val(),
				title: $sel.text()
			};
			this.model.set("doctor", doc);
		}
	},
	
	validateAppt: function() {
		this.$("#error-msg").empty();
		var val = this.$("#appt-title").val();
		var $parent = this.$("#appt-title").parent();
		if (val == ""){
			this.$("#error-msg").html("Don't forget to make a title!");
	// TODO highlight title
	//		$parent.css("background-color", "rgba(255,0,0,0.2)");
			return false;
		}
		return true;
	},

	addAppt : function(e) {
		e.preventDefault();
		
		if (!this.validateAppt()) return;
		
		this.model.set("title", this.$("#appt-title").val());
		this.model.set("user", Parse.User.current().id);
		this.model.set("type", this.$("#select-type").val());

		this.model.set("date", moment($("#appt-date").val() + " " + $("#appt-time").val()).unix());
		console.log(this.model.toJSON());

		this.model.save(null, {
			success : function(appt) {
				console.log("Appt saved: " + appt.id);
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

	render : function(date) {
		var date = this.model.get("date");
		this.$el.html(this.template(_.extend(this.model.toJSON(), {
			"header" : this.header,
			"day" : moment.unix(date).format('YYYY-MM-DD'), 
			"time" : moment.unix(date).format('HH:mm:ss'), 
		})));
		if (this.first) {
			this.first = false;
			this.conditionList = new $dino.BugList();
			this.loadList(this.conditionList, "#select-condition", "condition", true);
			this.doctorList = new $dino.DoctorList();
			this.loadList(this.doctorList, "#select-doctor", "doctor");
		} else if (reload) {
			this.makeList(this.conditionList, "#select-condition", "condition", true);
			this.makeList(this.doctorList, "#select-doctor", "doctor");
		}
		// TODO figure out how to not need this
		$(".ui-page").trigger("pagecreate");
		this.resetMenu("#select-type", this.model.get("type"));
		console.log(this.model.get("condition").id);
		return this;
	},

}); 