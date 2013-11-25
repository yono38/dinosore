window.$dino.HelpGraphView = Backbone.View.extend({
	initialize : function(opts) {
		this.page = opts.page || 1;
		_.bindAll(this, 'createIntro', 'renderMedInfoView');
	},
	createIntro: function(){
		var that = this;
       $dino.intro = intro = introJs();
       intro.setOptions({
          	tooltipClass: 'customIntro',
          	showBullets: false,
            steps: [
              {
              	element: '.footerBtn#info',
                intro: "This is the correlation graph page. Here you can select symptoms, medications and conditions that you wish to visualize",
                position: 'top'
              },
              {
              	element: "#symp-med-chart",
                intro: "See symptom progress versus the medications you are taking.",
                position: 'bottom'
              },
              {
              	element: "#condition-chart",
                intro: "Or, see progression of a condition with related symptoms, medications and notes.",
                position: 'top'
              },
              {
              	element: "#symp-med-chart",
                intro: "Thanks for following along with this tutorial! We hope you enjoy using Dinosore.",
                position: 'bottom'
              },
              ]
            });
			var nextpage = _.once(function(){
	          	$dino.app.navigate("help?type=graph&page=2", {
	          		trigger: true
	          	});
          	});          
          intro.onchange(function(target){
          	console.log($(".introjs-helperNumberLayer").text());
         	if ($(".introjs-helperNumberLayer").text() == "") {
          		setTimeout(function(){
          			console.log('setting css');
	          		$(".customIntro").css({
	          			left: "-120px",
						top: "-235px"
	          		});
	          		$(".customIntro .introjs-arrow").css({
	          			left: "160px"
	          		});
          		}, 2);
          	}
          	if ($(".introjs-helperNumberLayer").text() == "3") {
          		that.$el.append('<style id="temp-intro-css">.introjs-tooltipbuttons{margin-top:15px;margin-bottom:5px;}.introjs-helperLayer {background:transparent;border: none;box-shadow: none;}.introjs-arrow{display:none}.introjs-tooltip{max-width:none;}</style>');
	          	$(".introjs-nextbutton").hide();
	          	$(".introjs-skipbutton").text('Get Started').show();
	          	setTimeout(function(){
		          	$(".introjs-skipbutton").text('Get Started').show();
	          	},2);
          	}
          });
          intro.oncomplete(function(target){
          	$("#temp-intro-css").remove();
          	$dino.app.navigate("bugs", {
          		trigger: true
          	});
          });
          intro.onexit(function(target){
          	$("#temp-intro-css").remove();
          	$dino.app.navigate("bugs", {
          		trigger: true
          	});
          });
          setTimeout(function(){
          	intro.start(); 	
          }, 200);	
	},
	renderMedInfoView: function(){
		this.view = new $dino.MedicalInfoView();
		this.$el.bind('pageloaded', this.createIntro);
		this.$el.html(this.view.render().el);
	},
	render: function(){
		if (this.page == 2) {
			this.renderGraphView();
		} else {
			this.renderMedInfoView();
		}
		return this;
	}
});