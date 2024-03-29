window.$dino.GraphView = Backbone.View.extend({
  initialize: function (opts) {
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
    this.template = _.template($dino.tpl.get('graph'));
    _.bindAll(this, 'render', 'makeSeries', 'loadMultiChart');
  },
  events: {},
  hasSympPlusOnes: function (data) {
    console.log(data);
    var hasSymps = _.chain(data).pluck('type').contains('symptom').value();
    return hasSymps;
  },
  setNoDataMessage: function () {
    this.$('#graphContainer').html('<h1>Can\'t find any data for these :( Try a different set!</h1>');
  },
  loadItemPlusOnes: function (itemIds) {
    if (itemIds.length === 0) {
      this.setNoDataMessage();
    }
    var that = this;
    var apiCall = $dino.apiRoot + '/plusones?user=' + Parse.User.current().id + '&item=~';
    apiCall += _.reduceRight(itemIds, function (a, b) {
      return a + '|' + b;
    });
    $.ajax({
      url: apiCall,
      dataType: 'json',
      success: function (data) {
        if (that.type == 'condition') {
          that.loadConditionChart(data);
        } else {
          // graph currently doesn't support medication-only
          if (!that.hasSympPlusOnes(data)) {
            that.setNoDataMessage();
            return;
          }
          that.loadMultiChart(data);
        }
      }
    });
  },
  loadConditionChart: function (itemData) {
    // holds plusones for single symptom
    var sympJson = _.where(itemData, { 'type': 'symptom' });
    // holds plusones for multiple medications
    var medJson = _.where(itemData, { 'type': 'medication' });
    if (sympJson.length === 0 && medJson.length === 0) {
      this.$('#graphContainer').html('<h1>Can\'t find any data for these :( Try a different set!</h1>');
      return;
    }
    // colors array - accessed from end to from for symp and front to back for med
    var colors = [
        '#7CE555',
        '#B84645',
        '#F16A28',
        '#FF9B3E',
        '#3FCCBE',
        '#241F61',
        '#51C4E1',
        '#60205A',
        '#F94610',
        '#7C10F9',
        '#9E5751',
        '#48B660'
      ];
    //holds dates of meds taken and symptom logged as formatted strings:
    var timeAxis = [];
    //holds all timestamps for symptoms and meds for sorting
    var timeStamps = [];
    // holds y values for one symptom
    var sevAxis = [];
    // holds notes for one symptom
    var noteSeries = [];
    //keep medtime with timestamps in so can look up times meds taken
    var medTime = [];
    var medNameAndTime = {};
    // holds all series (symptom and medication)
    var gSeries = [];
    // set up timestamps
    timeStamps = _.chain(itemData).pluck('date').uniq().compact().value();
    timeStamps = timeStamps.sort();
    // create timeAxis
    _.each(timeStamps, function (elem) {
      var time = moment.unix(elem);
      var date = time.format('MMM Do - h:mm a');
      timeAxis.push(date);
    });
    // make the series for symptoms
    // create arrays with symp id as key
    var sympGroup = _.groupBy(sympJson, 'item');
    _.each(this.conditionItem.get('symptom'), function (sympInfo, idx) {
      var sympSerie = {
          name: sympInfo.title,
          color: colors[colors.length - idx - 1],
          data: []
        };
      // go through plusones for the symptom and add to data array
      var sortedJson = _.groupBy(sympGroup[sympInfo.id], 'date');
      // loop through timestamps
      // if data exists for timestamp, use it
      // otherwise set to most recent severity (default 0)
      var prev = 0, sympNotes;
      _.each(timeStamps, function (ts, idx) {
        var elem = sortedJson[ts];
        sympNotes = '';
        if (elem) {
          prev = elem[0].severity;
          sympNotes = elem[0].notes;
        }
        sympSerie.data.push({
          y: prev,
          date: timeAxis[idx],
          notes: sympNotes
        });  // TODO this doesn't work
             //var notes = elem.notes;
             //noteSeries[date] = notes;
      });
      gSeries.push(sympSerie);
    });
    var appendTimeSevToAxis = _.each(sympJson, function (elem) {
        var time = moment.unix(elem.date);
        date = time.format('MMM Do - h:mm a');
        //timeStamps.push(elem.date);
        //timeAxis.push(date);
        var sev = elem.severity;
        sevAxis.push(sev);
        var notes = elem.notes;
        noteSeries[date] = notes;
      });
    var that = this;
    var appendMedTimeToArr = _.each(medJson, function (el) {
        var time = moment.unix(el.date);
        var date = time.format('MMM Do - h:mm a');
        var medicationItem = _.where(that.conditionItem.get('medication'), { 'id': el.item });
        // key-val obj of date to title
        medNameAndTime[date] = medicationItem[0].title;
        //will need for medication date lookup:
        medTime.push(date);  //timeStamps.push(el.date);
      });
    var makePlotLines = function (timeAxis, medTime) {
      var i = 0;
      var plotLines = [];
      var medNameColors = [];
      var colors = [
          '#7CE555',
          '#B84645',
          '#F16A28',
          '#FF9B3E',
          '#3FCCBE',
          '#241F61',
          '#51C4E1',
          '#60205A',
          '#F94610',
          '#7C10F9',
          '#9E5751',
          '#48B660'
        ];
      _.each(medTime, function (elem) {
        var index = _.indexOf(timeAxis, elem);
        //medName = name of medicine taken at this specific time
        medName = medNameAndTime[elem];
        //console.log(medName);
        //console.log(medNameColors[medName]);
        //console.log(medNameColors);
        if (!_.contains(_.keys(medNameColors), medName)) {
          console.log('in if');
          medNameColors[medName] = colors[i];
          if (i != 11) {
            i++;
          } else {
            i = 0;
          }
        }
        var plsJson = {
            'color': medNameColors[medName],
            width: 3,
            zIndex: 4,
            label: { text: medName },
            value: index
          };
        plotLines.push(plsJson);
      });
      return plotLines;
    };
    // required for medication plotlines
    var medSerie = {
        name: 'Placebo',
        data: timeAxis,
        type: 'scatter',
        marker: { enabled: false }
      };
    gSeries.push(medSerie);
    console.log(gSeries);
    chart = new Highcharts.Chart({
      chart: {
        backgroundColor: '#FCFAD6',
        renderTo: 'graphContainer',
        type: 'line',
        marginRight: 20,
        marginBottom: 75,
        marginTop: 20
      },
      credits: { enabled: false },
      title: {
        text: ' ',
        style: { color: '#4A4A4A' }
      },
      legend: { enabled: false },
      xAxis: {
        categories: timeAxis,
        tickLength: 10,
        plotLines: makePlotLines(timeAxis, medTime)
      },
      yAxis: {
        max: 5,
        min: 0,
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
      series: gSeries,
      tooltip: {
        followTouchMove: true,
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: 'Date: {point.date} <br>Severity: {point.y}<br>Notes: {point.notes}',
        shared: false
      }
    });
  },
  loadMultiChart: function (itemData) {
    var that = this;
    // holds plusones for single symptom
    var jsoon = _.where(itemData, { 'type': 'symptom' });
    // holds plusones for multiple medications
    var medJson = _.where(itemData, { 'type': 'medication' });
    if (jsoon.length === 0 && medJson.length === 0) {
      this.$('#graphContainer').html('<h1>Can\'t find any data for these :( Try a different set!</h1>');
      return;
    }
    //holds dates of meds taken and symptom logged
    var timeAxis = [], timeStamps = [], sevAxis = [], noteSeries = [], medTime = [], medNameAndTime = {};
    var appendSympTimeToArr = _.each(jsoon, function (elem) {
        var time = moment.unix(elem.date);
        date = time.format('MMM Do - h:mm a');
        timeStamps.push(elem.date);
      });
    var appendMedTimeToArr = _.each(medJson, function (el) {
        var time = moment.unix(el.date);
        var date = time.format('MMM Do - h:mm a');
        medNameAndTime[date] = that.items.medication[el.item];
        //will need for medication date lookup:
        medTime.push(date);
        timeStamps.push(el.date);
      });
    timeStamps.sort();
    console.log(timeStamps);
    _.each(timeStamps, function (elem) {
      var time = moment.unix(elem);
      var date = time.format('MMM Do - h:mm a');
      timeAxis.push(date);
    });
    // used as filler if no severity set on date
    var prev = 0;
    console.log(jsoon);
    dattes = jsoon;
    var appendTimeSevToAxis = _.each(timeStamps, function (time) {
        var elem = _.first(_.where(jsoon, { 'date': time }));
        if (elem && elem.severity) {
          var sev = elem.severity;
          sevAxis.push(sev);
          prev = sev;
        } else {
          sevAxis.push(prev);
        }
        var notes = '';
        if (elem && elem.notes) {
          notes = elem.notes;
        }
        noteSeries[date] = notes;
      });
    var makePlotLines = function (timeAxis, medTime) {
      var i = 0;
      var plotLines = [];
      var medNameColors = [];
      var colors = [
          '#7CE555',
          '#B84645',
          '#F16A28',
          '#FF9B3E',
          '#3FCCBE',
          '#241F61',
          '#51C4E1',
          '#60205A',
          '#F94610',
          '#7C10F9',
          '#9E5751',
          '#48B660'
        ];
      console.log(timeAxis);
      _.each(medTime, function (elem) {
        var index = _.indexOf(timeAxis, elem);
        console.log(elem);
        //medName = name of medicine taken at this specific time
        medName = medNameAndTime[elem];
        if (!_.contains(_.keys(medNameColors), medName)) {
          medNameColors[medName] = colors[i];
          if (i != 11) {
            i++;
          } else {
            i = 0;
          }
        }
        var plsJson = {
            'color': medNameColors[medName],
            width: 3,
            zIndex: 4,
            label: { text: medName },
            value: index
          };
        plotLines.push(plsJson);
      });
      console.log(plotLines);
      return plotLines;
    };
    chart = new Highcharts.Chart({
      chart: {
        backgroundColor: '#FCFAD6',
        renderTo: 'graphContainer',
        type: 'line',
        marginRight: 20,
        marginBottom: 75,
        marginTop: 20
      },
      credits: { enabled: false },
      title: {
        text: ' ',
        style: { color: '#4A4A4A' }
      },
      legend: { enabled: false },
      xAxis: {
        categories: timeAxis,
        tickLength: 10,
        plotLines: makePlotLines(timeAxis, medTime)
      },
      yAxis: {
        max: 5,
        min: 0,
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
          marker: { enabled: false }
        }
      ],
      tooltip: {
        formatter: function () {
          var s = this.points[0].key + ':<br>';
          s += 'Severity: ' + this.points[0].y;
          if (noteSeries[this.points[0].key]) {
            s += '<br> Notes: ' + noteSeries[this.points[0].key];
          }
          return s;
        },
        shared: true
      }
    });
  },
  makeSeries: function (itemData) {
    var that = this;
    var series = [];
    var colors = [
        '#7CE555',
        '#B84645',
        '#F16A28',
        '#FF9B3E',
        '#3FCCBE',
        '#241F61',
        '#51C4E1',
        '#60205A',
        '#F94610',
        '#7C10F9',
        '#9E5751',
        '#48B660'
      ];
    var colorIdx = 0;
    var s = _.where($dino.data, { type: 'symptom' });
    var q = _.groupBy(s, 'item');
    _.each(q, function (symp, key) {
      var serie = {
          name: that.items.symptom[key],
          color: colors[colorIdx],
          data: []
        };
      colorIdx++;
      _.each(symp, function (el) {
        var severity = el.severity ? el.severity : 0;
        var dataPoint = {
            x: el.date,
            date: moment.unix(el.date).format('MMM Do - h:mm a'),
            y: severity
          };
        dataPoint.notes = !el.notes || el.notes === '' ? 'N/a' : el.notes;
        serie.data.push(dataPoint);
      });
      series.push(serie);
    });
    series.push({
      name: 'Placebo',
      data: that.makeTimeAxis(itemData),
      type: 'scatter',
      marker: { enabled: false }
    });
    conosole.log(series);
    return series;
  },
  makeTimeAxis: function (itemData) {
    var m = _.where(itemData, { type: 'medication' });
    var dates = _.pluck(m, 'date');
    return dates;
  },
  render: function () {
    var that = this;
    this.$el.html(this.template({ title: 'Graph' }));
    if (this.items) {
      this.loadItemPlusOnes(_.union(_.keys(this.items.medication), _.keys(this.items.symptom)));
    } else if (this.condition) {
      this.conditionItem = new $dino.Bug();
      this.conditionItem.id = this.condition;
      this.conditionItem.fetch({
        success: function (data) {
          that.$('.ui-title').prepend(data.get('title'));
          var itemIds = _.union(_.pluck(data.get('medication'), 'id'), _.pluck(data.get('symptom'), 'id'));
          that.loadItemPlusOnes(itemIds);
        },
        error: function (err) {
          $dino.fail404();
        }
      });
    } else {
      $dino.fail404();
    }
  }
});