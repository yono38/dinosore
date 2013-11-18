window.$dino.SymptomGraphView = Backbone.View.extend({
	initialize : function(opts) {
		var title = 'Test Graph';
		this.template = _.template(tpl.get('graph'));
		_.bindAll(this, 'render', 'loadSingleChart');
	},

	events: {
		'click #back' : 'returnToBuglist', 
		'pageinit' : 'resize'
	},
	
	resize: function(){
		console.log('resize');
		$(window).trigger('resize');
	},
	
	returnToBuglist: function(e){
		e.preventDefault();
		$dino.app.navigate("bugs", {
			trigger: true
		});
	},
	
	loadSingleChart: function(data){
		var that = this;
		if (data.length == 0){
			this.$("#graphContainer").html('<h4 class="fancyFont">Sorry! No plusones recorded for this symptom yet, come back when you\'ve tracked more data :)');
			return;
		}
		var jsoon = data.toJSON();

		var timeAxis = [];
		var sevAxis = [];
		var noteSeries = [];

		var appendTimeSevToAxis = _.each(jsoon, function(elem) {
			var time = moment.unix(elem.date);
			date = (time.format("MMM Do - HH:mm:ss a"));
			timeAxis.push(date);
			var sev = elem.severity;
			sevAxis.push(sev);
			var notes = elem.notes;
			noteSeries[date] = notes;
		});

		var chart = new Highcharts.Chart({

            chart: {
                backgroundColor: '#FCFAD6',
                renderTo: 'graphContainer',
                type: 'line',
                marginRight: 20,
                marginBottom: 75,
                marginTop: 75,
                events: {
                	load: function() {
                		console.log('graph load complete');
                		// TODO figure out why this doesn't work immediately
                		// jQuery mobile drawing issue?
                		setTimeout(function(){
	                		that.resize();
                		}, 200);
                	}
                }
            },

            credits: {
                enabled: false
        	},
      
            title: {
                text: ' ',
                style: { color: '#4A4A4A' }
            },
            
            legend: {
                enabled: false
                },

            xAxis: {
                categories: timeAxis,
                tickLength: 10
            },

            plotOptions: {
                series: {
                     lineColor: '#51C4E1',   
                     marker: {
                        fillColor: '#3FCCBE',
                                 
                    }

                }
            },

            yAxis: {
            	min: 0,
                max: 5,
                title: {
                    text: 'Severity',
                    style: { color: '#4A4A4A' }
                },
            },

            series: [{
                name: 'Severity',
                data: sevAxis,
                }],

            tooltip: {
                followTouchMove: true,
                formatter: function() {
                    var s = this.points[0].key+ ":<br>";
                    s += "Severity: " +  this.points[0].y;
                    if (noteSeries[this.points[0].key]){
                        s += "<br> Notes: " + noteSeries[this.points[0].key];
                    }
                    console.log(noteSeries[this.points[0].key]);
                    console.log(this.points);
                    return s;
                },
                shared: true
                        },

        });
	},
	
	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		var that = this;
		var pOne = new $dino.PlusOneList();
		pOne.fetch({
			data: {
				user: Parse.User.current().id,
				item: this.model.id
			},
			success : function(data) {
				that.plusOnes = data;
				that.loadSingleChart(data);
			},
			error : function(err, data) {
				$dino.fail404();
			}
		});
	}
});
