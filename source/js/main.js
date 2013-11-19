$dino.AppRouter = Backbone.Router.extend({

	routes : {
		"" : "start",
		"appts" : "appts",
		"appts/:id/modify" : "modifyAppt",
		"appts/add(?*path)" : "newAppt",
		"bugs" : "bugList",
		"bugs/add" : "newCondition",
		"bug/:id" : "bugDetails",
		"bug/:id/modify" : "bugModify",
		"bug/:id/delete" : "bugDialog",
		"graph" : "makeGraph",
		"info" : "info",
		"info/modify" : "infoModify",
		"login" : "login",
		"medications" : "medicationList",
		"medication/:id" : "medicationDetails",
		"offline" : "offlineExit",
		"privacy" : "privacySettings",
		"signup" : "signup",
		"symptoms/:id/graph" : "graphSymptom",
		"tutorial" : "tutorial",
		"*path" : "start"
	},

	initialize : function() {
		$('.back').live('click', function(event) {
			window.history.back();
			return false;
		});
		this.firstPage = true;
	},

// ===== Appointments ==== //
	appts : function() {
		var collection = new $dino.AppointmentList();
		var apptView = new $dino.AppointmentCalendarView({
			"collection" : collection
		});
		this.changePage(apptView, true);
		$("#date").hide();
		$(".hasDatepicker").off().remove();
	},
	
	modifyAppt: function(id) {
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

	newAppt : function(path) {
		if (path) console.log(path);
		this.changePage(new $dino.AppointmentNewView({
			defaultDate : path
		}));
	},

// ===== Misc Views (Unused/Rarely Used) === //
	info : function() {
		var medInfo = new $dino.MedicalInfoView(); 
		this.changePage(medInfo, true);
		medInfo.loadLists();
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

// ======== Bug List (Conditions & Symptoms) ====== //
	bugList : function() {
		var coll = new $dino.SymptomList();
		var bugListView = new $dino.BugListView({
			template : _.template(tpl.get('bug-list-view')),
			modelType : $dino.Symptom,
			header : "Bugs",
			collection : coll,
			name : "symptom"
		});
		this.changePage(bugListView, true);
	},

// ====== Condition (Bug) Views ======= //
	newCondition: function() {
		this.changePage(new $dino.ConditionNewView({
			header : "New"
		}));
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

// ========== Start Views ======= //
	start : function() {
		if (Parse.User.current()) {
			this.bugList();
		} else {
			this.changePage(new $dino.StartSplashView());
		}
	},

	privacySettings : function() {
		this.changePage(new $dino.StartPrivacyView());
	},


	login : function() {
		this.changePage(new $dino.StartLoginView());
	},

	signup : function() {
		this.changePage(new $dino.StartSignupView());
	},

	tutorial : function(){
		var tutView = new $dino.StartTutorialView();
		this.changePage(tutView);
		tutView.mySwiper = tutView.$('.swiper-container').swiper({
			onSlideChangeEnd: function(swiper) {
				tutView.checkEnd(swiper);
			}
		});	
	},

// ========== Graphs ========== //
	makeGraph: function(params) {
		console.log(params);
		if (params.condition) {
			var visualize = new $dino.GraphView({
				condition: params.condition
			});
			$dino.app.changePage(visualize);
		} else if (params.symptom) {
			var graph_items = {
				symptom: [],
				medication: []
			};
			// set up symptom
			// id first, then title
			var symp = params.symptom.split(',');
			graph_items['symptom'][ symp[0] ] = symp[1];
			
			// if medications, set medication
			if (params.medication) {
				var meds = params.medication.split(',');
				// if not multiple of 2, something went terribly wrong
				if (meds.length % 2 !== 0) $dino.fail404();
				var i = 0;
				while (i < meds.length) {
					graph_items['medication'][ meds[i] ] = meds[i + 1];
					i += 2;
				}
			}
			
			console.log(graph_items);

			var visualize = new $dino.GraphView({
				items: graph_items
			});
			$dino.app.changePage(visualize);
		} else {
			$dino.fail404();
		}
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

// ========== Medications ========== //
	medicationList : function() {
		var coll = new $dino.MedicationList();
		var medView = new $dino.PlusListView({
			modelType : $dino.Medication,
			header : "Medications",
			collection : coll,
			clickItems: true,
			name : "medication"
		});
		this.changePage(medView, true);
	},

	medicationDetails : function(id) {
		var coll = new $dino.PlusOneList();
		var medView = new $dino.PlusOneListView({
			modelType : $dino.Medication,
			item: id,
			type: "medication", 
			header : "Medication Details",
			collection : coll,
			name : "medication-plusone"
		});
		this.changePage(medView, true);		
	},

// ======== Helper Functions ======= //
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
		// reset noBack flag to default
		$dino.noBack = false;
		$.mobile.changePage($(page.el), {
			changeHash : false,
			transition : transition
		});
		page.pageloaded = true;
		$dino.currView = page;
	}
});

$(document).ready(function() {
	FastClick.attach(document.body);
	tpl.loadTemplates(['plusone-list-item', 'appointment-list-item', 'start-tutorial', 'graph', 'info-modify', 'offline-exit', 'severity-slider', 'appointment-calendar', 'condition-list-item', 'bug-list-view', 'bug-delete-dialog', 'privacy', 'condition-details', 'condition-new', 'login', 'medical-info', 'appointment-new', 'signup', 'start-splash', 'list-view', 'list-item', 'list-new', 'delete-confirm', 'footer', 'appointment-item'], function() {
		$dino = window.$dino || {};
		$dino.app = new $dino.AppRouter();
		Backbone.history.start();
		// override back button for android
		// if I set $dino.noBack on any page
		// I can use the back button as I like
		document.addEventListener("backbutton", function(e){
			e.preventDefault();
			if (!$dino.noBack) {
				window.history.back();
			}
		}, false);
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