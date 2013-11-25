window.$dino.HelpConditionView = Backbone.View.extend({
	initialize : function(opts) {
		this.page = opts.page || 1;
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

		$dino.view = view;
        $dino.intro = intro = introJs();
          intro.setOptions({
          	tooltipClass: 'customIntro conditionIntro',
          	showBullets: false,
            steps: [
              {
              	element: '#new-condition-padding',
                intro: "Conditions are greater health problems which have related medications and symptoms (i.e. Asthma, Migraines, Diabetes, etc). Press plus to create a condition",
                position: 'bottom'
              },
            ]
          });
          intro.onchange(function(target){
          	console.log($(".introjs-helperNumberLayer").text());
          	console.log(target);
          });
          intro.onbeforechange(function(target){
          });
          	
          intro.oncomplete(function(){
          	$dino.app.navigate("help?type=condtion&page=2", {
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
          	$(".introjs-skipbutton").text("Next").show(); //removeClass("introjs-skipbutton").addClass("introjs-nextbutton").show();
          	view.$("#myList").hide();
          	view.$("#activeConditionList").hide();
          }, 2);
	},
	createNewConditionIntro: function(){
		var that = this;
		console.log('running createNewconditionIntro');
		var view = this.views[1];

		$dino.view = view;
        $dino.intro = intro = introJs();
          intro.setOptions({
          	tooltipClass: 'customIntro',
          	showBullets: false,
            steps: [
              {
              	element: '#condition-title',
                intro: "This is where you create a new symptom",
                position: 'bottom'
              },
              {
              	element: '#condition-details',
                intro: "Put any notes about the condition",
                position: 'bottom'
              },
              {
              	element: '#select-status',
                intro: "Indicate whether it is active, in remission, or retired (no longer a condition for you).",
                position: 'bottom'
              },
            ]
          });
          intro.onchange(function(target){
          	console.log($(".introjs-helperNumberLayer").text());
          	console.log(target);
          });
          intro.onbeforechange(function(target){
          });
          	
          intro.oncomplete(function(){
          	$dino.app.navigate("help?type=condtion&page=2", {
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
          	$(".introjs-skipbutton").text("Next").show(); //removeClass("introjs-skipbutton").addClass("introjs-nextbutton").show();
          	view.$("#myList").hide();
          	view.$("#activeConditionList").hide();
          }, 2);
	},
	// =======================
	// RENDERING METHODS
	// =======================
	renderBugView : function() {
		var view = new $dino.BugListView({
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
	renderNewConditionView: function() {
		var view = new $dino.ConditionNewView({
			header : "New"
		});
		this.$el.bind('pageloaded', this.createNewConditionIntro);
		this.$el.html(view.render().el);
	},
	render : function() {
		if (this.page == 1){
			this.renderBugView();
		} else if (this.page == 2) {
			this.renderNewConditionView();
		}
		return this;
	}
});