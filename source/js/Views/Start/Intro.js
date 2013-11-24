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
		itemview.makeSwiper(null, false);
		$dino.view = view;
        $dino.intro = intro = introJs();
          intro.setOptions({
          	tooltipClass: 'customIntro',
          	showBullets: false,
            steps: [
              {
              	element: '#myList',
                intro: "<strong>Welcome!</strong><br>Using Dinosore, you can make exact records of your health over time. Don't estimate when you think a problem started, see it for yourself!",
                position: 'bottom'
              },
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
              	intro: 'Input the symptom and click the plus to add',
              	position: 'bottom'
              },
              {
              	element: '.plus-one',
              	intro: 'Whenever you are feeling the symptom, click the plus to log it',
              	position: 'left'
              },
              {
              	element: '#activeConditionList',
              	intro: 'Choose the severity, add a descriptive note (only if you want!), and click the check to confirm or the X to cancel',
              	position: 'bottom'
              },
              {
              	element: '#symptom-detail',
              	intro: "Swipe left to reveal the options menu. You can delete a symptom or retire it when it is no longer active",
              	position: 'bottom'
              },
              {
              	element: '#symptom-detail',
              	intro: "After you've logged the symptom a few times, click the symptom name to view its graph",
              	position: 'bottom'
              },
              {
              	element: '#myList',
              	intro: 'We hope you find Dinosore useful and easy to use! If you have any questions or comments, feel free to talk to us anytime at dinosorehealth@gmail.com',
              	position: 'bottom'
              }
            ]
          });
          intro.onchange(function(target){
          	console.log($(".introjs-helperNumberLayer").text());
          	if ($(".introjs-helperNumberLayer").text() == "") {
          		view.$el.append('<style id="temp-intro-css">.introjs-helperLayer {background:transparent;border: none;box-shadow: none;}.introjs-arrow{display:none}.introjs-tooltip{max-width:none;}</style>');
          		console.log('hide helperLayer');
          	}
          	if ($(".introjs-helperNumberLayer").text() == "1") {
          		$("#temp-intro-css").remove();
          		console.log('show helperLayer');
          	}
          	if ($(".introjs-helperNumberLayer").text() == "3") {
          		view.addingBtn.toggleButton(true);
          		view.$(".cancelBtn span .ui-btn-text").text("Cancel");
          		var note = "Headache"
				, i
				, typeNote = function(i){
	          		$("#newItemInput").val(note.substr(0,i));
				};
				for (i=1; i<=note.length;i++){
					setTimeout(typeNote, i*200, i);	
				}
          	}
          	if ($(".introjs-helperNumberLayer").text() == "4") {
          		$("#myList").hide();
          		view.$(".cancelBtn span .ui-btn-text").text("Symptom");
          		view.addingBtn.toggleButton();
          	}
          	if ($(".introjs-helperNumberLayer").text() == "5") {
          		itemview.setSeverity();
          		itemview.$(".swiper-wrapper").css({
          			"height": "auto",
          			"width": "100%",
          		});
          		itemview.$("#item-title-slide").css("width", "100%");
          		itemview.$("#severity").val("4");
          		itemview.$("#severity").slider("refresh");
				itemview.changeSeverity();
				var note = "Throbbing"
				, i
				, typeNote = function(i){
	          		itemview.$("#symptom-notes").val(note.substr(0,i));
				};
				for (i=1; i<=note.length;i++){
					setTimeout(typeNote, i*200, i);	
				}
				
				itemview.$(".plus-one").hide();
				itemview.$(".check-items").show();
          	}
          	if ($(".introjs-helperNumberLayer").text() == "6") {
          		itemview.resetTitle();
				itemview.addBubble('.item-title', 'Saved');		
          		view.$("#myList").empty().show();
          	}
          	if ($(".introjs-helperNumberLayer").text() == "7") {
				swiper = itemview.mySwiper;
          		itemview.mySwiper.init();
          		itemview.mySwiper.swipeNext();
          	}
          	if ($(".introjs-helperNumberLayer").text() == "8") {
          		itemview.mySwiper.swipePrev();
          		view.$el.append('<style id="temp-intro-css">.introjs-helperLayer {background:transparent;border: none;box-shadow: none;}.introjs-arrow{display:none}.introjs-tooltip{max-width:none;}.introjs-tooltiptext{padding-bottom:15px}</style>');
          		$(".introjs-nextbutton").hide();
          	//	$(".introjs-nextbutton").text("Learn More");
          		$(".introjs-skipbutton").text("Get Started").show();
		        setTimeout(function(){
					$(".introjs-skipbutton").text("Get Started").show();
				}, 2);
          	}
          	console.log(target);
          });
          intro.onbeforechange(function(target){
			console.log($(".introjs-helperNumberLayer").text());
          	if ($(".introjs-helperNumberLayer").text() == "3") {
          		$("#myList").show();
          	}
          	if ($(".introjs-helperNumberLayer").text() == "4") {
          		$("#activeConditionList").show();
          	}
          });
          	
          intro.oncomplete(function(){
          	$dino.app.navigate("bugs", {
          		trigger: true
          	});
          	$("#temp-intro-css").remove();
          	view.$el.empty();
      		view.remove();
          });
          intro.onexit(function(){
          	$dino.app.navigate("bugs", {
          		trigger: true
          	});
          	$("#temp-intro-css").remove();
          	view.$el.empty();
          	view.remove();
          });
          // have to wait for jQuery to render before hiding
          setTimeout(function(){
          	intro.start(); 		
          	view.$("#myList").hide();
          	view.$("#activeConditionList").hide();
          }, 2);
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
	render : function() {
		this.renderBugView();
		return this;
	}
}); 