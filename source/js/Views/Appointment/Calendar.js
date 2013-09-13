window.$dino.AppointmentsView = Backbone.View.extend({

	initialize : function(opts) {
		this.collection = opts.collection;
		this.template = _.template(tpl.get('appointment-calendar'));
		var that = this;
		this.highDates = [];
		this.collection.fetch({
			success : function(collection) {
				// This code block will be triggered only after receiving the data.
				for (var i = 0; i < collection.length; i++) {
					var t = moment(collection.models[i].get("newDate")).format('YYYY-MM-DD');
					that.highDates.push(t);
				}
				// remove dupes
				that.highDates = _.uniq(that.highDates);
			}
		});
		_.bindAll(this, 'changeDate');
	},

	loadApptItem : function(appt) {
		var day = moment(appt.newDate.iso);
		var that = this;
		if (appt.doc != 'none') {
			var doc = new Parse.Query($dino.Doctor);
			doc.get(appt.doc, {
				success : function(doctor) {
					var apptData = {
						"title" : appt.title,
						"doc" : doctor.get("title"),
						"time" : day.format('LT'),
						"apptId" : appt.objectId
					};
					that.$("#fakeAppt").append(_.template(tpl.get("appointment-item"), apptData));
					that.$("#fakeAppt").show();
					that.$("#noAppt").hide();
					that.$(".removeAppt").button();
					that.$(".editAppt").button();
				},
				error : function(obj, err) {
					console.log("failed to retrieve doctor");
				}
			});
		} else {
			var apptData = {
				"title" : appt.title,
				"doc" : "No Doctor",
				"time" : day.format('LT'),
				"apptId" : appt.objectId
			};
			this.$("#fakeAppt").append(_.template(tpl.get("appointment-item"), apptData));
			this.$("#fakeAppt").show();
			this.$("#noAppt").hide();
			this.$(".removeAppt").button();
			this.$(".editAppt").button();
		}

	},

	changeDate : function(e, passed) {
		var self = this;
		if (passed.method === 'set') {
			// TODO modify to use highdates as index instead of whole collection
			var appts = this.collection.toJSON();
			var d = _(appts).where({
				"date" : passed.value
			});
			d = _(d).sortBy(function(m) {
				return moment(m.newDate.iso);
			});
			if (d.length > 0) {
				var i;
				this.$("#fakeAppt").empty().show();
				this.$("#noAppt").hide();
				for ( i = 0; i < d.length; i++) {
					this.loadApptItem(d[i]);
				}
			}
			this.$("#currDate").html(passed.value);

		} else {
			e.stopPropagation();
		}
	},

	render : function(eventName) {
		$(this.el).html(this.template({
			today : moment().format("YYYY-MM-DD")
		}));
		var that = this;
		setTimeout(function() {
			that.$("#mydate").datebox({
				"mode" : "calbox",
				"highDates" : that.highDates,
				"useInline" : true,
				"useImmediate" : true,
				hideInput : true,
				calHighToday : false
			});
		}, 200);
		// get rid of annoying background shadow
		setTimeout(function() {
			$(".ui-input-text.ui-shadow-inset").css({
				"border" : "none",
				"box-shadow" : "none"
			});
		}, 100);
		this.$("#checkbox-6").on("checkboxradiocreate", function(event, ui) {
			$(this).bind("click", that.addAppt);
		});
		return this;
	},

	events : {
		"click .ui-datebox-griddate.ui-corner-all" : "hideEmptyAppt",
		"click" : "preventDefault",
		"click .has-appt" : "showAppts",
		"click .removeAppt" : "removeAppt",
		"click .editAppt" : "modifyAppt",
		"datebox" : "changeDate",
		"click #addApptBtn" : "newAppt"
	},
	
	// handles case where user clicks calendar date with no appt
	"hideEmptyAppt": function(){
		$("#fakeAppt").hide();
		$("#noAppt").show();
	},

	newAppt : function() {
		$dino.app.navigate("appts/add", {
			trigger : true
		});
	},

	modifyAppt : function() {
		var apptId = this.$(".editAppt").attr("data-apptId");
		var query = new Parse.Query($dino.Appointment);
		query.get(apptId, {
			success : function(appt) {
				$dino.app.navigate("appts/" + apptId + "/modify", {
					trigger : true
				});
			},
			error : function(appt, err) {
				console.log("appointment retrieval failed");
				console.log(err);
			}
		});
	},

	removeAppt : function() {
		var apptId = this.$(".removeAppt").attr("data-apptId");
		var query = new Parse.Query($dino.Appointment);
		query.get(apptId, {
			success : function(appt) {
				appt.destroy({
					success : function(appt) {
						console.log("appointment successfully removed");
					},
					error : function(appt, err) {
						console.log("appointment removal failed");
						console.log(err);
					}
				});
			},
			error : function(appt, err) {
				console.log("appointment retrieval failed");
				console.log(err);
			}
		});
	},

	addAppt : function() {
		$dino.app.navigate("#appts/add", {
			trigger : true
		});
		// bad practice!
		$(".hasDatepicker").hide();
	},

	showAppts : function() {
		setTimeout(function() {
			$("#fakeAppt").show();
			$("#noAppt").hide();
		}, 2);
	},

	preventDefault : function(e) {
		e.preventDefault();
	}
});
