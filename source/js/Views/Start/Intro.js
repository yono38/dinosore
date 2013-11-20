window.$dino.StartIntroView = Backbone.View.extend({
	initialize : function() {
		this.page = 1;
		this.views = [];
		console.log('init startintroview');
		_.bindAll(this, 'renderBugView', 'createBugIntro', 'render');
	},
	events : {

	},
	createBugIntro: function(e) {
		var that = this;
		console.log('running createbugIntro');
		var view = this.views[0];
		if (!view) console.warn('empty view for createBugIntro');
		// fake adding to get new input
		console.log(view);
		// create "app symptom"" list item
		view.addingBtn.adding = true;
		view.newItem();
		// create symptom pluslist item
		var item = new $dino.Symptom({
			_id: -1,
			title: 'Headache',
			type: 'symptom'
		});
		var itemview = new $dino.SymptomListItemView({
			model : item
		});
		view.$("#activeConditionList").append(itemview.render().el);
		view.$("#activeConditionList").listview('refresh');
		itemview.makeSwiper();
		$dino.view = view;
        $dino.intro = intro = introJs();
          intro.setOptions({
          	tooltipClass: 'customIntro',
          	showBullets: false,
            steps: [
              {
                element: '.footerBtn[href="#bugs"]',
                intro: "This is the Bug List page",
                position: 'top'
              },
              {
                element: '.ui-block-a .new-item-padding',
                intro: "Click to add a new symptom",
                position: 'bottom'
              },
              {
              	element: document.querySelector('#newItemLi'),
              	intro: 'Input the symptom and click the plus',
              	position: 'bottom'
              },
              {
              	element: '.plus-one',
              	intro: 'Click plus one to log',
              	position: 'left'
              },
              {
              	element: '#activeConditionList',
              	intro: 'Choose the severity, add any notes, and click the check to confirm',
              	position: 'bottom'
              }
            ]
          });
          intro.onchange(function(target){
			console.log($(".introjs-helperNumberLayer").text());
          	if ($(".introjs-helperNumberLayer").text() == "2") {
          		console.log('step 2!');
          		view.addingBtn.toggleButton(true);
          		view.$(".cancelBtn span .ui-btn-text").text("Cancel");
          		$("#newItemInput").val('Headache');
          	}
          	if ($(".introjs-helperNumberLayer").text() == "3") {
          		$("#myList").hide();
          		view.$(".cancelBtn span .ui-btn-text").text("Symptom");
          		view.addingBtn.toggleButton();
          	}
          	if ($(".introjs-helperNumberLayer").text() == "4") {
          		itemview.setSeverity();
          		itemview.$(".swiper-wrapper").css({
          			"height": "auto",
          			"width": "100%",
          		});
          		itemview.$("#item-title-slide").css("width", "100%");
          		itemview.$("#severity").val("4");
          		itemview.$("#severity").slider("refresh");
				itemview.changeSeverity();
          		itemview.$("#symptom-notes").val("Throbbing");
				itemview.$(".plus-one").hide();
				itemview.$(".check-items").show();
          		$(".introjs-nextbutton").hide();
          	}
          	console.log(target);
          });
          intro.onbeforechange(function(target){
          	if ($(".introjs-helperNumberLayer").text() == "2") {
          		$("#myList").show();
          	}
          	if ($(".introjs-helperNumberLayer").text() == "3") {
          		$("#activeConditionList").show();
          	}
          	if ($(".introjs-helperNumberLayer").text() == "4") {
          	}
          });
          	
          intro.oncomplete(function(){
          	that.page = 2;
          	//that.render();
          	// temporary
          	$dino.app.navigate("bugs", {
          		trigger: true
          	});
          });
          intro.onexit(function(){
          	$dino.app.navigate("bugs", {
          		trigger: true
          	});
          });
          setTimeout(function(){
          	intro.start(); 		
          	view.$("#myList").hide();
          	view.$("#activeConditionList").hide();
          }, 2);
	},
	createMedicationIntro: function(e) {
	},
	// =======================
	// RENDERING METHODS
	// =======================
	renderBugView : function() {
		var view = this.views[0] = this.views[0] || new $dino.BugListView({
			template : _.template(tpl.get('bug-list-view')),
			modelType : $dino.Symptom,
			header : "Bugs",
			collection : new $dino.SymptomList(),
			name : "symptom",
			debug: true
		});
		this.$el.bind('pageloaded', this.createBugIntro);
		this.$el.html(view.render().el);
	
	},
	renderMedicationView : function() {
		var coll = new $dino.MedicationList();
		var view = new $dino.PlusListView({
			modelType : $dino.Medication,
			header : "Medications",
			collection : coll,
			clickItems: true,
			name : "medication"
		});
		this.$el.bind('pageloaded', this.createMedicationIntro);
		this.$el.html(view.render().el);
		setTimeout(function(){
          	intro.start(); 		
          	view.$("#myList").hide();
          	view.$("#activeConditionList").hide();
        }, 2);
		$(".ui-page").trigger('pagecreate');
	},
	renderAppointmentView : function() {

	},
	renderGraphView : function() {

	},
	render : function() {
		switch(this.page) {
			case 1:
				this.renderBugView();
				break;
			case 2:
				this.renderMedicationView();
				break;
			case 3:
				this.renderAppointmentView();
				break;
			case 4:
				this.renderGraphView();
		}
		return this;
	}
}); 