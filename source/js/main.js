$dino.AppRouter = Backbone.Router.extend({

	routes : {
		"" : "start",
		"bugs/add" : "newBug",
		"symptoms/add" : "newSymptom",
		"symptoms" : "symptomList",
		"symptoms/:id/graph" : "graphSymptom",
		"bug/:id" : "bugDetails",
		"bug/:id/modify" : "bugModify",
		"bug/:id/delete" : "bugDialog",
		"appts" : "appts",
		"offline" : "offlineExit",
		"appts/:id/modifyOld" : "apptModify",
		"appts/:id/modify" : "apptModifyNew",
		"appts/add" : "newAppt",
		"bugs" : "bugList",
		"info" : "info",
		"info/modify" : "infoModify",
		"medications" : "medicationList",
		"login" : "login",
		"privacy" : "privacySettings",
		"signup" : "signup",
		"*path" : "start"
	},

	initialize : function() {
		$('.back').live('click', function(event) {
			window.history.back();
			return false;
		});
		this.firstPage = true;
	},

	bugDialog : function(id) {
		console.log('in bug dialog');
		var self = this;
		this.loadBug(id, function(data) {
			console.log("view bug details");
			self.changePage(new $dino.BugModifyDialogView({
				model : data
			}));
		});
	},

	privacySettings : function() {
		this.changePage(new $dino.StartPrivacyView());
	},

	newAppt : function() {
		this.changePage(new $dino.AppointmentNewView());
	},

	login : function() {
		this.changePage(new $dino.StartLoginView());
	},

	signup : function() {
		this.changePage(new $dino.StartSignupView());
	},

	newBug : function() {
		this.changePage(new $dino.ConditionNewView({
			header : "New"
		}));
	},

	info : function() {
		this.changePage(new $dino.MedicalInfoView(), true);
	},
	
	infoModify: function() {
		this.changePage(new $dino.InfoModifyView({
			model: Parse.User.current(),
			tpl: 'info-modify'
		}));
	},

	offlineExit : function() {
		this.changePage(new $dino.OfflineExitView());
	},

	appts : function() {
		var collection = new $dino.AppointmentList();
		var apptView = new $dino.AppointmentCalendarView({
			"collection" : collection
		});
		this.changePage(apptView, true);
		$("#date").hide();
		$(".hasDatepicker").off().remove();
	},

	apptModify : function(id) {
		var self = this;
		var appt = new $dino.Appointment();
		appt.id = id;
		appt.fetch({
			success : function(data) {
				console.log("modify appt");
				self.changePage(new $dino.AppointmentModifyOldView({
					model : data
				}));
				$("#date").hide();
				$(".hasDatepicker").off().remove();
			},
			error : function(data, err) {
				console.log(err);
			}
		});
	},

	apptModifyNew : function(id) {
		var self = this;
		var appt = new $dino.Appointment();
		appt.id = id;
		appt.fetch({
			success : function(data) {
				console.log("modify appt");
				self.changePage(new $dino.AppointmentNewView({
					header: "Modify",
					model : data
				}));
				$("#date").hide();
				$(".hasDatepicker").off().remove();
			},
			error : function(data, err) {
				console.log(err);
			}
		});
	},

	start : function() {
		if (Parse.User.current()) {
			this.bugList();
		} else {
			this.changePage(new $dino.StartSplashView());
		}
	},

	bugList : function() {
		var coll = new $dino.SymptomList();
		var sympView = new $dino.SymptomListView({
			template : _.template(tpl.get('bug-list-view')),
			modelType : $dino.Symptom,
			header : "Bugs",
			collection : coll,
			name : "symptom"
		});
		this.changePage(sympView, true);
	},

	loadBug : function(id, callback) {
		console.log("loading bug " + id);
		var bug = new $dino.Bug({});
		bug.id = id;
		bug.fetch({
			success : function(data) {
				callback(data);
			},
			error : function(err, data) {
				$dino.fail404();
			}
		});
	},

	bugDetails : function(id) {
		var self = this;
		this.loadBug(id, function(data) {
			self.changePage(new $dino.BugDetailView({
				model : data
			}), true);
		});
	},

	bugModify : function(id) {
		var self = this;
		this.loadBug(id, function(data) {
			console.log("modify bug details");
			self.changePage(new $dino.ConditionNewView({
				model : data,
				header : "Modify"
			}));
		});
	},

	symptomList : function() {
		var coll = new $dino.SymptomList();
		var sympView = new $dino.SymptomListView({
			template : _.template(tpl.get('bug-list-view')),
			modelType : $dino.Symptom,
			header : "Bugs",
			collection : coll,
			name : "symptom"
		});
		this.changePage(sympView, true);
	},
	
	graphSymptom: function(id){
		console.log('graphing '+id);
		var that = this;
		var symp = new $dino.Symptom();
		symp.id = id;
		symp.fetch({
			success : function(data) {
				console.log(data.toJSON());
				that.changePage(new $dino.SymptomGraphView({
					model: data
				}));
			},
			error : function(err, data) {
				$dino.fail404();
			}
		});
	},

	medicationList : function() {
		var coll = new $dino.MedicationList();
		var medView = new $dino.PlusListView({
			modelType : $dino.Medication,
			header : "Medications",
			collection : coll,
			name : "medication"
		});
		//	var medView = new $dino.MedicationListView({});
		this.changePage(medView, true);
	},

	changePage : function(page, hasFooter) {
		$(page.el).attr('data-role', 'page');
		$(page.el).data("theme", "a");
		page.render();
		if (hasFooter) {
			this.footer = this.footer || new $dino.FooterView();
			this.footer.render();
			$(page.el).append($(this.footer.el));
		}
		$('body').append($(page.el));
		if (page.collection)
			page.collection.fetch();
		var transition = 'none';
		// $.mobile.defaultPageTransition;
		// We don't want to slide the first page
		if (this.firstPage) {
		//	transition = 'none';
			this.firstPage = false;
		}
		$.mobile.changePage($(page.el), {
			changeHash : false,
			transition : transition
		});
		page.pageloaded = true;
	}
});

$(document).ready(function() {
	FastClick.attach(document.body);
	tpl.loadTemplates(['graph', 'info-modify', 'offline-exit', 'severity-slider', 'appointment-calendar', 'condition-list-item', 'bug-list-view', 'bug-delete-dialog', 'privacy', 'bug-details', 'condition-new', 'login', 'medical-info', 'appointment-new', 'signup', 'start-splash', 'list-view', 'list-item', 'list-new', 'delete-confirm', 'footer', 'appointment-modify', 'appointment-item'], function() {
		$dino = window.$dino || {};
		$dino.app = new $dino.AppRouter();
		Backbone.history.start();
		$dino.fail404 = function(override) {
			if ($dino.env == 'prod' && !override) {;
				console.log('offline');
				$dino.app.navigate('offline', {
					trigger : true
				});
			}
		};
	});
});
/*   $(document).on("pageshow", ".ui-page", function () {
 var $page  = $(this);
 console.log($page);
 ,  vSpace = $page.children('.ui-header').outerHeight() + $page.children('.ui-footer').outerHeight() + $page.children('.ui-content').height();

 if (vSpace < $(window).height()) {
 var vDiff = $(window).height() - $page.children('.ui-header').outerHeight() - $page.children('.ui-footer').outerHeight() - 40;//minus thirty for margin
 $page.children('.ui-content').height(vDiff);
 }
 });*/
