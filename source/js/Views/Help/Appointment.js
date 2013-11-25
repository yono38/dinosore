window.$dino.HelpAppointmentView = Backbone.View.extend({
	initialize : function(opts) {
		_.bindAll(this, 'createIntro');
	},
	createIntro : function() {
		var that = this;
       $dino.intro = intro = introJs();
       intro.setOptions({
          	tooltipClass: 'customIntro',
          	showBullets: false,
            steps: [
              {
              	element: '.footerBtn#appointments',
                intro: "This is the appointments page",
                position: 'top'
              },
              {
              	element: "div[data-role='content']",
                intro: "Choose a day to load appointment information",
                position: 'bottom'
              },
              {
              	element: "#dayAppts",
                intro: "The appointment stores the details on your appointment, including any doctor or condition you have linked to the appointment",
                position: 'top'
              },
              {
              	element: "#dayAppts",
                intro: "Like with Symptoms and Condtions, you can swipe left to access the options menu",
                position: 'top'
              },
              ]
            });
			var nextpage = _.once(function(){
	          	$(".introjs-overlay").remove();
	          	$(".introjs-helperLayer").remove();
	          	$dino.app.navigate("help?type=graph", {
	          		trigger: true
	          	});
	          	that.$el.unbind();
	          	that.$el.remove();
          	});          
          intro.onchange(function(target){
          	console.log($(".introjs-helperNumberLayer").text());

          	if ($(".introjs-helperNumberLayer").text() == "") {
          		setTimeout(function(){
          			$(".customIntro").css({
		          		left: "-85px",
						top: "-130px"
	          		});
          			$(".customIntro .introjs-arrow").css({
          				left: "120px"
          			});
          	}, 2);
          	}
          	if ($(".introjs-helperNumberLayer").text() == "3") {
          		that.view.apptItems[0].mySwiper.swipeNext();
	          	$(".introjs-nextbutton").on("click", function(){
	          		console.log('nextpage');
	      			nextpage();    		
	          	});
          	}
          });
           intro.oncomplete(function(target){
          	$("#temp-intro-css").remove();
          	$dino.app.navigate("bugs", {
          		trigger: true
          	});
          	this.$el.unbind();
          	this.$el.remove();
          });
          intro.onexit(function(target){
          	$("#temp-intro-css").remove();
          	$dino.app.navigate("bugs", {
          		trigger: true
          	});
          	this.$el.unbind();
          	this.$el.remove();
          });
          setTimeout(function(){
          	intro.start(); 	
          }, 200);
	},
	render : function() {
		var appt = new $dino.Appointment({
			"_id" : "-1",
			"condition" : {
		      "title": "Migraines",
		      "id": "-10"			
			},
			"date" : moment().unix(),
			"doctor" : {
				"id" : "10",
				"title" : "Dr. Robert"
			},
			"notes" : "Questions you want to ask or things you want to discuss can be put here",
			"title" : "Neurologist 1st Visit",
			"type" : "Appointment",
			"user" : "dBsnmh3xV3"
		});
		var collection = new $dino.AppointmentList([appt]);
		var view = this.view = new $dino.AppointmentCalendarView({
			"collection" : collection,
			debug: true
		});
		this.$el.bind('pageloaded', this.createIntro);
		this.$el.html(view.render().el);

		//view.loadDatebox(1);
		// get rid of annoying background shadow
		setTimeout(function() {
			$(".ui-input-text.ui-shadow-inset").css({
				"border" : "none",
				"box-shadow" : "none"
			});
			console.log(view);
			view.changeDate(null, {'method':'set', 'value': moment().format('YYYY-MM-DD')});
		}, 100);
		return this;
	}
}); 