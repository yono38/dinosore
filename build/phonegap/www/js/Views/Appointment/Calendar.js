window.$dino.AppointmentsView = Backbone.View.extend({

	initialize : function(opts) {
		this.collection = opts.collection;
		this.template = _.template(tpl.get('appointment-calendar'));
		var that = this;
		this.collection.fetch({
			data: { "user" : Parse.User.current().id },
			success : function(collection) {
				// This code block will be triggered only after receiving the data.
				that.buildHighDates();
			}
		});
		_.bindAll(this, 'buildHighDates', 'changeDate');
	},
	
	buildHighDates: function(refresh){
		this.highDates = {};
		for (var i = 0; i < this.collection.length; i++) {
			var t = moment(this.collection.models[i].get("date")).format('YYYY-MM-DD');
			this.highDates[t] = (this.highDates[t]) ? _.union(this.highDates[t], [i] ): [i];
		}
		if (refresh) this.$("#mydate").datebox({'highDates': _.keys(this.highDates)}).datebox('refresh');
	},

	loadApptItem : function(appt) {
		var day = moment(appt.get("date"));
		var that = this;
		var doc = appt.get("doc");
		if (doc != 'none') {
			var doctor = new $dino.Doctor();
			doctor.id = appt.doc;
			doctor.fetch({
				data : { _id : doc },
				success : function(doctor) {
					var apptData = {
						"title" : appt.get("title"),
						"doc" : doctor.get("title"),
						"time" : day.format('LT'),
						"apptId" : appt.id
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
				"title" : appt.get("title"),
				"doc" : "No Doctor",
				"time" : day.format('LT'),
				"apptId" : appt.id
			};
			this.$("#fakeAppt").append(_.template(tpl.get("appointment-item"), apptData));
			this.$("#fakeAppt").show();
			this.$("#noAppt").hide();
			this.$(".removeAppt").button();
			this.$(".editAppt").button();
		}

	},

	changeDate : function(e, passed) {
		passed.value = passed.value || $("#currDate").text();
		var self = this;
		if (passed.method === 'set' || (passed.method == 'postrefresh' && !this.firstDateAlreadyCalled)) {
			// TODO modify to use highdates as index instead of whole collection
			var d = this.highDates[passed.value] || [];
			if (d.length > 0) {
				var i;
				this.$("#fakeAppt").show();
				this.$("#noAppt").hide();
				for ( i = 0; i < d.length; i++) {
					this.loadApptItem(this.collection.models[d[i]]);
				}
			}
			this.$("#currDate").html(passed.value);
			this.firstDateAlreadyCalled = true;
		} else {
			e.stopPropagation();
		}
	},

	render : function(eventName) {
		this.$el.html(this.template({
			today : moment().format("YYYY-MM-DD")
		}));
		
		var that = this;
		this.loadDatebox(1);
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
	
	loadDatebox: function(count){
		var that = this;
		var cnt = ($.isNumeric(count)) ? count : 1;
		setTimeout(function() {
			if (cnt >= 10) {
				console.log("failed to load");
				that.$("#dateBoxLoading").html('<h2 class="fancyFont">Appointments failed to load</h2>');
				return;
			}
			else if (!that.highDates){
				cnt++;
				that.loadDatebox(cnt);
			} else {
			//	console.log()
				that.$("#dateBoxLoading").hide();
				that.$("#mydate").datebox({
					"mode" : "calbox",
					"highDates" : _.keys(that.highDates),
					//"themeDateHigh" : "e",
					"theme" : "a",
					"useInline" : true,
					"useImmediate" : true,
					hideInput : true,
					calHighToday : false
				});
			}
		}, 200);
	},

	events : {
		"click .ui-datebox-griddate.ui-corner-all" : "hideEmptyAppt",
		"click .ui-content" : "preventDefault",
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
		var appt = new $dino.Appointment({id: apptId});
		appt.fetch({
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
		var apptId = this.$(".removeAppt").attr("data-apptId")
		, day = $("#currDate").text()
		, appt = this.collection.get(apptId)
		, dex = _.indexOf(this.collection.models, appt);
		appt.destroy();
		// update highdates
		this.buildHighDates(true);
		this.changeDate(null, {
			"method" : "set",
			"value" : $("#currDate").text()
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
		console.log('preventing default');
		e.preventDefault();
	}
});