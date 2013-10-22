window.$dino.GraphView = Backbone.View.extend({
	initialize : function(opts) {
		var title = 'Test Graph';
		if (opts.items) {
			this.type = 'items';
			this.items = opts.items;
		} else {
			if (!opts.condition)
				$dino.fail404();
			this.condition = opts.condition;
			this.type = 'condition';
		}
		console.log(this.condition);
		console.log(this.items);
		this.template = _.template(tpl.get('graph'));
		_.bindAll(this, 'render', 'goBack', 'makeSeries', 'loadMultiChart');
	},
	
	events: {
		'click #back': 'goBack'
	},
	
	goBack: function(e){
		if (e) e.preventDefault();
		$dino.app.changePage(new $dino.MedicalInfoView(), true);
	},

	// expects itemIds to be array of mongoIds
	loadItemPlusOnes : function(itemIds) {
		if (itemIds.length == 0) {
			this.$("#graphContainer").html("<h1>Can't find any data for these :( Try a different set!</h1>");
		}
		var that = this;
		var apiCall = $dino.apiRoot + '/plusones?user=' + Parse.User.current().id + '&item=~';
		apiCall += _.reduceRight(itemIds, function(a, b) {
			return a + '|' + b;
		});
		$.ajax({
			url : apiCall,
			dataType : 'json',
			success : function(data) {
				console.log(data);
				that.loadMultiChart(data);
			}
		});
	},
	
	loadMultiChart: function(itemData) {
		
        var jsoon = _.where(itemData, {"type": "symptom"});

        var medJson = _.where(itemData, {"type": "medication"});   
        
        if (jsoon.length == 0 && medJson.length == 0){
			this.$("#graphContainer").html("<h1>Can't find any data for these :( Try a different set!</h1>");
			return;
        }

        //holds dates of meds taken and symptom logged:             
        var timeAxis = [] 
        //holds all timestamps for symptoms and meds for sorting
        var timeStamps = []
        var sevAxis = []
        var noteSeries = []
        //keep medtime with timestamps in so can look up times meds taken
        var medTime = []
        var medNameAndTime = {}


        var appendTimeSevToAxis =  
            _.each(jsoon, function(elem){
                var time = moment.unix(elem.date);
                date = (time.format("MMM Do - h:mm a"));
                timeStamps.push(elem.date);
                //timeAxis.push(date);
                var sev = elem.severity;
                sevAxis.push(sev);
                var notes = elem.notes;
                noteSeries[date] = notes;
            });

		var that = this;
        var appendMedTimeToArr = 
            console.log("infunct");
            _.each(medJson, function(el){
                console.log("for lop")
                var time = moment.unix(el.date);
                //console.log(time);
                var date = (time.format("MMM Do - h:mm a")); 
                medNameAndTime[date] = that.items.medication[el["item"]];
                //console.log(date);
                //will need for medication date lookup:
                medTime.push(date);
                timeStamps.push(el.date);
                //console.log(timeAxis)
            });


        var sortAndConvertTimes = 
            timeStamps.sort();
            console.log(timeStamps);
            _.each(timeStamps, function(elem){
                var time = moment.unix(elem);
                var date = (time.format("MMM Do - h:mm a"));
                timeAxis.push(date);

            });
            

         //json array = info from database

        var makePlotLines = function(timeAxis, medTime){
            var i = 0;
            var plotLines =[];
            var medNameColors = [];
          
            var colors = ['#7CE555', '#B84645',  '#F16A28', '#FF9B3E', '#3FCCBE', '#241F61', '#51C4E1', '#60205A', '#F94610', '#7C10F9', '#9E5751', '#48B660'];
          
            _.each(medTime, function(elem){             
                var index = _.indexOf(timeAxis, elem);
                console.log(index);
                //medName = name of medicine taken at this specific time
                medName = medNameAndTime[elem];
                console.log(medName);
                console.log(medNameColors[medName]);
                console.log(medNameColors);
                
                if (!_.contains(_.keys(medNameColors), medName)){
                    console.log("in if");
                    medNameColors[medName] = colors[i]
                    if (i != 11){
                        i++;
                    }
                    else{ i = 0; }
                }

                var plsJson = {'color': medNameColors[medName], width: 3, zIndex:4, label:{text: medName}, value: index};
                plotLines.push(plsJson);

            });
            console.log('plotLines');
            console.log(plotLines);
                return plotLines;

        };

        console.log(makePlotLines(timeAxis, medTime));
        console.log(sevAxis);


         chart = new Highcharts.Chart({

            chart: {
                backgroundColor: '#FCFAD6',
                renderTo: 'graphContainer',
                type: 'line',
                marginRight: 20,
                marginBottom: 75,
                marginTop: 20
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
                tickLength: 10,
                plotLines: makePlotLines(timeAxis, medTime)
            },



            yAxis: {
                max: 5,
                title: {
                    text: 'Severity',
                    style: { color: '#4A4A4A' }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#4A4A4A'
                }]
            },

            series: [
                {
                    name: 'Symp1',
                    data: sevAxis,
                    color: '#60205A'
                },


                {
                    name: 'Placebo',
                    data: timeAxis,
                    type: 'scatter',
                    marker: {
                        enabled: false
                    },
                } 
            ],

            tooltip: {
                followTouchMove: true,
                formatter: function() {
                    var s = this.points[0].key+ ":<br>";
                    s += "Severity: " +  this.points[0].y;
                    if (noteSeries[this.points[0].key]){
                        s += "<br> Notes: " + noteSeries[this.points[0].key];
                    }
                    //console.log(noteSeries[this.points[0].key]);
                    //console.log(this.points);
                    return s;
                },
                shared: true
                        },

        });
	},

	/*loadMultiChart : function(itemData) {
		console.log(itemData);
		$dino.data = itemData;
		var that = this;
		//this.makeSeries(itemData);
		$('#graphContainer').highcharts({
			chart : {
				backgroundColor: '#FCFAD6',
				type : 'scatter',
				zoomType : 'xy'
			},
			title: {
				text: null
			},
			credits : {
				enabled : false
			},
			xAxis : {
				formatter : function() {
					console.log(this.value);
				},
				labels : {
					enabled : false
				}, 
				plotLines: that.makePlotlines(itemData)
			},
			yAxis : {
				title : {
					text : 'Severity'
				},
				min : 0,
				max : 5

			},
			legend : {
				layout : 'vertical',
				align : 'left',
				verticalAlign : 'top',
				x : 100,
				y : 70,
				floating : true,
				backgroundColor : '#FFFFFF',
				borderWidth : 1
			},
			plotOptions : {
				scatter : {
					marker : {
						radius : 5,
						states : {
							hover : {
								enabled : true,
								lineColor : 'rgb(100,100,100)'
							}
						}
					},
					states : {
						hover : {
							marker : {
								enabled : false
							}
						}
					},
					tooltip : {
						headerFormat : '<b>{series.name}</b><br>',
						pointFormat : 'Date: {point.date} <br>Severity: {point.y}<br>Notes: {point.notes}'
					}
				}
			},
			series : that.makeSeries(itemData)
		}); 
		
		
		
		
	}, */
	
	
	makePlotlines: function(itemData){
		var that = this;
		var plotlines = [];
		var colors = ['#241F61', '#51C4E1', '#60205A', '#F94610', '#7C10F9', '#9E5751', '#48B660', '#7CE555', '#B84645', '#F16A28', '#FF9B3E', '#3FCCBE',];
		var m = _.where(itemData, {"type": "medication"});
		var g = _.uniq(_.pluck(m, 'item'));
		var colorMap = {};
		_.each(g, function(el, idx){
			colorMap[el] = colors[idx];
		});
		
		_.each(m, function(med){
			var line = {
				color: colorMap[med.item],
				label: {
					text: that.items.medication[med.item]
				},
				value: med.date,
				width: 3,
				zIndex: 4
			};
			plotlines.push(line);
		});
		console.log(plotlines);
		return plotlines;
	},

	// will take symptoms plusones to create series array
	makeSeries : function(itemData) {
		var that = this;
		var series = [];
		var colors = ['#7CE555', '#B84645', '#F16A28', '#FF9B3E', '#3FCCBE', '#241F61', '#51C4E1', '#60205A', '#F94610', '#7C10F9', '#9E5751', '#48B660'];
		var colorIdx = 0;
		console.log(this.items);
		var s = _.where($dino.data, {
			type : "symptom"
		});
		var q = _.groupBy(s, 'item');
		_.each(q, function(symp, key) {
			var serie = {
				name : that.items.symptom[key],
				color : colors[colorIdx],
				data : []
			};
			colorIdx++;

			_.each(symp, function(el) {
				var severity = (el.severity) ? el.severity : 0;
				var dataPoint = {
					x : el.date,
					date : moment.unix(el.date).format("MMM Do - h:mm a"),
					y : severity
				};
				dataPoint.notes = (!el.notes || el.notes == "") ? "N/a" : el.notes;
				serie['data'].push(dataPoint);
			});
			series.push(serie);
		});
		series.push({
                    name: 'Placebo',
                    data: that.makeTimeAxis(itemData),
                    type: 'scatter',
                    marker: {
                        enabled: false
                    },
              } );
		console.log(series);
		return series;
	},

	// will make
	makeTimeAxis : function(itemData) {
		var m = _.where(itemData, {type: "medication"});
		var dates = _.pluck(m, 'date');
		console.log(dates);
		return dates;
	},

	render : function() {
		var that = this;
		this.$el.html(this.template({
			title : 'Graph'
		}));
		if (this.items) {
			this.loadItemPlusOnes(_.union(_.keys(this.items.medication), _.keys(this.items.symptom)));
		} else if (this.condition) {
			this.conditionItem = new $dino.Bug();
			this.conditionItem.id = this.condition;
			this.conditionItem.fetch({
				success : function(data) {
					console.log(data.toJSON());
					var itemIds = _.union(_.pluck(data.get('medication'), 'id'), _.pluck(data.get('symptom'), 'id'));
					that.loadItemPlusOnes(itemIds);
				},
				error : function(err) {
					$dino.fail404();
				}
			});
		} else {
			$dino.fail404();
		}
	}
});
