window.$dino.AppointmentCalendarView = Backbone.View.extend({
  initialize: function (opts) {
    this.collection = opts.collection;
    this.template = _.template($dino.tpl.get('appointment-calendar'));
    this.apptItems = [];
    var that = this;
    if (!opts.debug) {
      this.collection.fetch({
        data: { 'user': Parse.User.current().id },
        success: function (collection) {
          // This code block will be triggered only after receiving the data.
          that.buildHighDates();
          that.loadTodayAppt();
        }
      });
    } else {
      this.buildHighDates();
    }
    this.collection.bind('destroy', this.refreshAppts, this);
    _.bindAll(this, 'buildHighDates', 'refreshAppts', 'changeDate');
  },
  buildHighDates: function (refresh) {
    this.highDates = {};
    for (var i = 0; i < this.collection.length; i++) {
      var t = moment.unix(this.collection.models[i].get('date')).format('YYYY-MM-DD');
      this.highDates[t] = this.highDates[t] ? _.union(this.highDates[t], [i]) : [i];
    }
    if (refresh)
      this.$('#mydate').datebox({ 'highDates': _.keys(this.highDates) }).datebox('refresh');
  },
  events: {
    'click .ui-datebox-griddate.ui-corner-all': 'hideEmptyAppt',
    'click .has-appt': 'showAppts',
    'datebox': 'changeDate',
    'click #addApptBtn': 'newAppt'
  },
  loadTodayAppt: function () {
    this.changeDate(null, {
      'method': 'set',
      'value': moment().format('YYYY-MM-DD')
    });
  },
  loadApptItem: function (appt) {
    var day = moment.unix(appt.get('date'));
    var that = this;
    var doc = appt.get('doc');
    if (doc != 'none') {
      var doctor = new $dino.Doctor();
      doctor.id = appt.doc;
      doctor.fetch({
        data: { _id: doc },
        success: function (doctor) {
          var apptData = _.extend(appt.toJSON(), { 'time': day.format('LT') });
          var apptItem = new $dino.AppointmentListItemView({
              model: appt,
              template: 'appointment-item'
            });
          that.apptItems.push(apptItem);
          that.$('#dayAppts').append(apptItem.render().el);
          that.$('#dayAppts').show();
          that.$('#noAppt').hide();
          apptItem.$el.trigger('indom');
          that.$('#dayAppts').listview();
          that.$('#dayAppts').listview('refresh');
        },
        error: function (obj, err) {
          console.log('failed to retrieve doctor');
        }
      });
    } else {
      var apptData = _.extend(appt.toJSON(), { 'time': day.format('LT') });
      console.log(apptData);
      var apptItem = new $dino.AppointmentListItemView({
          model: appt,
          template: 'appointment-item'
        });
      this.apptItems.push(apptItem);
      that.$('#dayAppts').append(apptItem.render().el);
      this.$('#dayAppts').show();
      apptItem.$el.trigger('indom');
      that.$('#dayAppts').listview();
      that.$('#dayAppts').listview('refresh');
    }
  },
  changeDate: function (e, passed) {
    var noChange = false;
    if (!passed.value)
      noChange = true;
    passed.value = passed.value || $('#currDate').text();
    var self = this;
    if (passed.method === 'set' || passed.method == 'postrefresh' && !this.firstDateAlreadyCalled) {
      // TODO modify to use highdates as index instead of whole collection
      var d = this.highDates[passed.value] || [];
      if (d.length > 0) {
        var i;
        this.$('#dayAppts').empty();
        this.$('#dayAppts').show();
        this.$('#noAppt').hide();
        for (i = 0; i < d.length; i++) {
          this.loadApptItem(this.collection.models[d[i]]);
        }
      }
      if (!noChange)
        this.$('#currDate').html(moment(passed.value).format('dddd, MMMM Do YYYY'));
      this.currDate = passed.value;
      this.firstDateAlreadyCalled = true;
    } else {
      e.stopPropagation();
    }
  },
  loadDatebox: function (count) {
    var that = this;
    var cnt = $.isNumeric(count) ? count : 1;
    setTimeout(function () {
      if (cnt >= 10) {
        console.log('failed to load');
        that.$('#dateBoxLoading').html('<h2 class="fancyFont">Appointments failed to load</h2>');
        return;
      } else if (!that.highDates) {
        cnt++;
        that.loadDatebox(cnt);
      } else {
        //	console.log()
        that.$('#dateBoxLoading').hide();
        that.$('#mydate').datebox({
          'mode': 'calbox',
          'highDates': _.keys(that.highDates),
          'themeDateHigh': 'b',
          'theme': 'a',
          'useInline': true,
          'useImmediate': true,
          hideInput: true,
          calHighToday: false
        });
      }
    }, 200);
  },
  'hideEmptyAppt': function () {
    $('#dayAppts').hide();
    $('#noAppt').show();
  },
  newAppt: function (e) {
    if (e)
      e.preventDefault();
    var passDefault = '';
    if (this.currDate) {
      passDefault = '?' + this.currDate;
      console.log(this.currDate);
    }
    $dino.app.navigate('appts/add' + passDefault, { trigger: true });
  },
  refreshAppts: function () {
    // update highdates
    console.log(this);
    this.buildHighDates(true);
    this.changeDate(null, {
      'method': 'set',
      'value': this.$('#mydate').val()
    });
  },
  addAppt: function (e) {
    e.preventDefault();
    var passDefault = '';
    if (this.currDate) {
      passDefault = '?date=' + this.currDate;
      console.log(this.currDate);
    }
    $dino.app.navigate('#appts/add' + passDefault, { trigger: true });
    // bad practice!
    $('.hasDatepicker').hide();
  },
  showAppts: function () {
    setTimeout(function () {
      $('#dayAppts').show();
      $('#noAppt').hide();
    }, 2);
  },
  render: function (eventName) {
    this.$el.html(this.template({ today: moment().format('dddd, MMMM Do YYYY') }));
    var that = this;
    this.loadDatebox(1);
    // get rid of annoying background shadow
    setTimeout(function () {
      $('.ui-input-text.ui-shadow-inset').css({
        'border': 'none',
        'box-shadow': 'none'
      });
    }, 100);
    this.$('#checkbox-6').on('checkboxradiocreate', function (event, ui) {
      $(this).bind('click', that.addAppt);
    });
    return this;
  }
});