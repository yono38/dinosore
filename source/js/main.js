Parse.initialize("ILMokni7fwKhJSdWh38cGPpEwL2CLsrhcrUgJmG6", "cDQoHLQqGRRj9srzrpG2jv6X5nl2BPdh7hVUBRoc");

$dino.AppRouter = Backbone.Router.extend({

	routes : {
		"" : "start",
		"bugs/add" : "newBug",
		"symptoms/add" : "newSymptom",
		"symptoms" : "symptomList",
		"bug/:id" : "bugDetails",
		"bug/:id/modify" : "bugModify",
		"bug/:id/modify/dialog" : "bugDialog",
		"appts" : "appts",
		"appts/:id/modify" : "apptModify",
		"appts/add" : "newAppt",
		"bugs" : "bugList",
		"medinfo" : "medInfo",
		"medications" : "medicationList",
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
		var self = this;
		this.loadBug(id, function(data) {
			console.log("view bug details");
			self.changePage(new $dino.BugModifyDialogView({
				model : data
			}));
		});
	},

	newAppt : function() {
		this.changePage(new $dino.NewApptView());
	},

	newBug : function() {
		this.changePage(new $dino.NewBugView());
	},

	medInfo : function() {
		this.changePage(new $dino.MedicalInfoView(), true);
	},

	appts : function() {
		var collection = new $dino.AppointmentList();
		var apptView = new $dino.AppointmentsView({
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
				self.changePage(new $dino.AppointmentModifyView({
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
			this.symptomList();
		} else {
			this.changePage(new $dino.LoginView());
		}
	},

	bugList : function() {
		var collection = new $dino.BugList();
		this.changePage(new $dino.BugListView({
			"collection" : collection
		}), true);
	},

	symptomList : function() {
		console.log("in symptomList");
		this.changePage(new $dino.SymptomListView(), true);
	},

	loadBug : function(id, callback) {
		console.log("loading bug " + id);
		var bug = new $dino.Bug({});
		bug.id = id;
		bug.fetch({
			success : function(data) {
				callback(data);
			}
		});
	},

	bugDetails : function(id) {
		var self = this;
		this.loadBug(id, function(data) {
			console.log("view bug details");
			self.changePage(new $dino.BugDetailView({
				model : data
			}), true);
		});
	},

	bugModify : function(id) {
		var self = this;
		this.loadBug(id, function(data) {
			console.log("modify bug details");
			self.changePage(new $dino.BugModifyView({
				model : data
			}));
		});
	},

	medicationList : function() {
		var collection = new $dino.MedicationList();
		var medView = new $dino.MedicationListView({
			"collection" : collection
		});
		this.changePage(medView, true);
	},

	changePage : function(page, hasFooter) {
		$(page.el).attr('data-role', 'page');
		page.render();
		if (hasFooter) {
			this.footer = this.footer || new $dino.FooterView();
			this.footer.render();
			$(page.el).append($(this.footer.el));
		}
		$('body').append($(page.el));
		if (page.collection)
			page.collection.fetch({remote: false});
		var transition = $.mobile.defaultPageTransition;
		// We don't want to slide the first page
		if (this.firstPage) {
			transition = 'none';
			this.firstPage = false;
		}
		$.mobile.changePage($(page.el), {
			changeHash : false,
			transition : transition
		});
	}
});

$(document).ready(function() {
	FastClick.attach(document.body);
	tpl.loadTemplates(['bug-list', 'appointment-calendar', 'bug-delete-dialog', 'bug-list-item', 'bug-details', 'bug-new', 'login', 'medical-info', 'appointment-new', 'bug-details-modify', 'list-view', 'list-item', 'list-new', 'delete-confirm', 'footer', 'appointment-modify', 'appointment-item'], function() {
		$dino = window.$dino || {};
		$dino.app = new $dino.AppRouter();
		Backbone.history.start();
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
