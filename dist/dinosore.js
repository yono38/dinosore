/*! dinosore - v1.0.0 - 2013-12-02 */window.$dino.Allergy = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: {
    user: Parse.User.current().id,
    title: ''
  },
  urlRoot: $dino.apiRoot + '/allergies'
});
window.$dino.AllergyList = Backbone.Collection.extend({
  model: $dino.Allergy,
  url: $dino.apiRoot + '/allergies'
});;window.$dino.Appointment = Backbone.Model.extend({
   idAttribute: '_id',
   defaults: {
    date: moment().unix(),
    type: "Appointment",
    title: "",
    notes: "",
    doctor: {id: "No Doctor"},
    condition: {id: 'None'}
   },
   urlRoot: $dino.apiRoot + '/appointments'
});

window.$dino.AppointmentList = Backbone.Collection.extend({
    model: $dino.Appointment,
   url: $dino.apiRoot + '/appointments'
});;window.$dino.Bug = Backbone.Model.extend({
	idAttribute : '_id',
	urlRoot : $dino.apiRoot + '/bugs',
	defaults : {
		status : "Active",
		details: "",
		title : "",
		symptom : [],
		doctor: {title: ""},
		medication : []
	},
});

window.$dino.BugList = Backbone.Collection.extend({
	model : $dino.Bug,
	url : $dino.apiRoot + '/bugs'
});

;window.$dino.Color = Backbone.Model.extend({
   idAttribute: '_id',
    urlRoot: $dino.apiRoot + '/colors'
});

window.$dino.ColorList = Backbone.Collection.extend({
	model: $dino.Color,
	url: $dino.apiRoot + '/colors',
	comparator: function (color){
		return color.get("color");
	}
});;window.$dino.Doctor = Backbone.Model.extend({
   defaults: {
    title: "New Doctor"
   },
   idAttribute: '_id',
   urlRoot: $dino.apiRoot + '/doctors'
});

window.$dino.DoctorList = Backbone.Collection.extend({
    model: $dino.Doctor,
   url: $dino.apiRoot + '/doctors'
});;window.$dino.Medication = Backbone.Model.extend({
  defaults: {
    title: 'New Medication',
    count: 0
  },
  idAttribute: '_id',
  urlRoot: $dino.apiRoot + '/medications'
});
window.$dino.MedicationList = Backbone.Collection.extend({
  model: $dino.Medication,
  url: $dino.apiRoot + '/medications'
});;window.$dino.PlusOne= Backbone.Model.extend({
   defaults: {
	date: moment().unix()
   },
   idAttribute: '_id',
  urlRoot: $dino.apiRoot + '/plusones'
});

window.$dino.PlusOneList = Backbone.Collection.extend({
    model: $dino.PlusOne,
    comparator: 'date',
    url: $dino.apiRoot + '/plusones'
});;window.$dino.Symptom = Backbone.Model.extend({
  defaults: {
    title: 'New Symptom',
    count: 0
  },
  idAttribute: '_id',
  urlRoot: $dino.apiRoot + '/symptoms'
});
window.$dino.SymptomList = Backbone.Collection.extend({
  model: $dino.Symptom,
  url: $dino.apiRoot + '/symptoms'
});  // NEXT:
     // Add user search to collections
     // 
;window.$dino.User = Backbone.Model.extend({
	urlRoot: $dino.apiRoot +  '/users'
});;window.$dino.AppointmentCalendarView = Backbone.View.extend({
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
});;window.$dino.AppointmentListItemView = $dino.ListItemView.extend({
	initialize : function(opts) {
		// calling super.constructor
		$dino.ConditionListItemView.__super__.initialize.call(this, opts);
		var day = moment.unix(this.model.get("date"));
		this.model.set("time", day.format('LT'));
		console.log(this.model.toJSON());
		this.swiperHeight = this.calcHeight();
		this.name = "appointment";
	},

	events: {
		"click" : "dontclick",
		"indom" : "makeSwiper",
		"click .removeItem" : "confirmDelete",
		"click .modifyItem" : "modifyAppt"
	},

	modifyAppt : function(e) {
		if (e) e.preventDefault();
		$dino.app.navigate("appts/" + this.model.id + "/modify", {
			trigger : true
		});
	},

	calcHeight: function(){
		var height = [50, 85, 105, 120];
		var items = 0;
		if (this.model.get("doctor").id != "No Doctor") items++;
		if (this.model.get("condition").id != "None") items++;
		return height[items] + "px";
	},

	attributes: {
		'data-theme' : 'f',
		'data-icon' : 'false'
	}
});;window.$dino.AppointmentNewView = $dino.NewFormView.extend({
	afterInitialize : function(opts) {
		this.model = this.model || new $dino.Appointment();
		if (opts.defaultDate) {
			this.defaultDate = opts.defaultDate;
		}
		this.template = _.template($dino.tpl.get('appointment-new'));
		this.first = true;
		// extend child events on to parent's - inheritance ftw
		_.bindAll(this, 'setCondition', 'setDoctor');
		this.events = _.extend({}, $dino.NewFormView.prototype.events, this.events);
	},

	events : {
		"click #addBtn" : "addAppt",
		"change #select-condition" : "setCondition",
		"change #select-doctor" : "setDoctor"
	},
	
	setCondition: function(e) {
		var $sel = this.$("#select-condition option:selected");
		var condition = {
			id: $sel.val(),
			title: $sel.text()
		};
		this.model.set("condition", condition);
	},
	
	setDoctor: function(e) {
		var $sel = this.$("#select-doctor option:selected");
		if ($sel.val() != "add-new-item"){
			var doc = {
				id: $sel.val(),
				title: $sel.text()
			};
			this.model.set("doctor", doc);
		}
	},
	
	validateAppt: function() {
		this.$("#error-msg").empty();
		var val = this.$("#appt-title").val();
		var $parent = this.$("#appt-title").parent();
		if (val === ""){
			this.$("#error-msg").html("Don't forget to make a title!");
	// TODO highlight title
	//		$parent.css("background-color", "rgba(255,0,0,0.2)");
			return false;
		}
		return true;
	},

	addAppt : function(e) {
		e.preventDefault();
		
		if (!this.validateAppt()) return;
		
		this.model.set("title", this.$("#appt-title").val());
		this.model.set("user", Parse.User.current().id);
		this.model.set("type", this.$("#select-type").val());
		this.model.set("notes", this.$("#appt-notes").val());

		this.model.set("date", moment($("#appt-date").val() + " " + $("#appt-time").val()).unix());
		console.log(this.model.toJSON());

		this.model.save(null, {
			success : function(appt) {
				console.log("Appt saved: " + appt.id);
				$dino.app.navigate("appts", {
					trigger : true
				});
			},
			error : function(appt, error) {
				console.log("Failed to save appt, error: " + error.description);
				console.log(error);
			}
		});
	},

	preventDefault : function(e) {
		e.preventDefault();
	},

	render : function() {
		var date = this.model.get("date");
		this.$el.html(this.template(_.extend(this.model.toJSON(), {
			"header" : this.header,
			"day" : this.defaultDate || moment.unix(date).format('YYYY-MM-DD'), 
			"time" : moment.unix(date).format('HH:mm:ss'), 
		})));
		if (this.first) {
			this.first = false;
			this.conditionList = new $dino.BugList();
			this.loadList(this.conditionList, "#select-condition", "condition", true);
			this.doctorList = new $dino.DoctorList();
			this.loadList(this.doctorList, "#select-doctor", "doctor");
		} else if (reload) {
			this.makeList(this.conditionList, "#select-condition", "condition", true);
			this.makeList(this.doctorList, "#select-doctor", "doctor");
		}
		// TODO figure out how to not need this
		$(".ui-page").trigger("pagecreate");
		this.resetMenu("#select-type", this.model.get("type"));
		console.log(this.model.get("condition").id);
		return this;
	},

}); ;window.$dino.BugDetailView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template($dino.tpl.get('condition-details'));
	},

	loadAppts: function() {
		var appts = new $dino.AppointmentList();
		appts.fetch({
			data: {
				user: Parse.User.current().id
			},
			success: function(appts) {
				console.log(appts.toJSON());
				var template = _.template($dino.tpl.get("appointment-list-item"));
				appts.each(function(appt) {
					console.log(appt);
					var data = _.extend(appt.toJSON(), {
						time: moment(appt.date).format("MM/DD")					});
					var apptItemTpl = template(data);
					console.log(apptItemTpl);
					this.$("#appointment-list").append(apptItemTpl);
				});
			}
		});
	},

	render : function(eventName) {
		var model = _.defaults(this.model.toJSON(), {
			"bugDetails" : "",
			"symptom" : [],
			"medication" : []
		});

		$(this.el).html(this.template(model));
		this.loadAppts();
		return this;
	}
});
;window.$dino.BugListView = $dino.PlusListView.extend({
  afterInitialize: function () {
    this.bugCollection = new $dino.BugList();
    _.bindAll(this, 'intro');
  },
  events: {
    'click #intro-test': 'intro',
    'click .new-item': 'dontClick',
    'click #new-symptom-padding': 'newSymptom',
    'click #new-condition-padding': 'newCondition',
    'pageinit': 'loadedPage'
  },
  intro: function (e) {
    e.preventDefault();
    $dino.app.navigate('intro', { trigger: true });
  },
  createAddButton: function () {
    this.placeholder = 'Symptom';
    this.addingBtn = new $dino.PlusListAddButtonView({
      addText: 'Symptom',
      elId: 'new-symptom-padding'
    });
    this.$('.ui-block-a').html(this.addingBtn.render().el);
    this.addingBtn.bind('toggle', this.newItem, this);
  },
  newSymptom: function (e) {
    this.adding.symptom = !this.adding.symptom;
  },
  newCondition: function (e) {
    $dino.app.navigate('bugs/add', { trigger: true });
  },
  renderList: function (firstTime) {
    if (this.debug)
      return;
    var that = this;
    this.$('.loading').show();
    this.$('#myList').html('<img class="loading" src="css/images/ajax-loader.gif" style="margin-left:50%;padding-top:15px;" alt="loading..." />');
    this.$('#retiredList').empty();
    this.$('#activeConditionList').empty();
    this.bugCollection.fetch({
      data: { 'user': Parse.User.current().id },
      success: function (collection) {
        this.$('.loading').hide();
        collection.comparator = that.sortList;
        collection.sort();
        for (var i = collection.length - 1; i >= 0; i--) {
          var item = collection.models[i];
          that.addOne(item, 'bug');
        }
        if (that.pageloaded) {
          that.$('#activeConditionList').listview('refresh');
          that.$('#myList').listview('refresh');
          that.$('#retiredList').listview('refresh');
        }
      },
      error: function (err, data) {
        $dino.fail404();
      }
    });
    this.collection.fetch({
      data: { 'user': Parse.User.current().id },
      success: function (collection) {
        this.$('.loading').hide();
        if (collection.length === 0) {
          //	that.$("#myList").html('<span id="no-items-yet" class="fancyFont"><div>No ' + that.header + ' Added Yet!</div><hr> <div>Click "Add" Above to Get Started</div><hr></span>');
          return;
        }
        collection.comparator = that.sortList;
        collection.sort();
        // TODO should probably just sort better
        for (var i = collection.length - 1; i >= 0; i--) {
          that.addOne(collection.models[i], 'symptom');
        }
        if (!that.loading) {
          that.$('#activeConditionList').listview();
          that.$('#activeConditionList').listview('refresh');
          that.$('#myList').listview();
          that.$('#myList').listview('refresh');
          that.$('#retiredList').listview();
          that.$('#retiredList').listview('refresh');
        }
      },
      error: function (err, data) {
        $dino.fail404();
      }
    });
    return this;
  },
  addOne: function (item, type) {
    var selector = '#myList', view;
    if (type == 'symptom') {
      view = new $dino.SymptomListItemView({ model: item });
      selector = item.get('retired') === true ? '#retiredList' : '#myList';
      this.$(selector).append(view.render().el);
    } else if (type == 'bug') {
      view = new $dino.ConditionListItemView({ model: item });
      selector = item.get('status') == 'In Remission' || item.get('status') == 'Retired' ? '#retiredList' : '#myList';
      this.$(selector).prepend(view.render().el);
    } else {
      console.log('Invalid type: ' + type);
      return;
    }
    view.$el.trigger('indom');
    view.bind('renderlist', this.renderList);
  }
});;window.$dino.BugListItemView = Backbone.View.extend({

	tagName : "li",

	initialize : function() {
		this.template = _.template($dino.tpl.get('bug-list-item'));
		this.model.bind("change", this.render, this);
		var color = this.model.get("color");
		if (color)
			this.setColor(color);
		this.model.bind("destroy", this.close, this);
		_.bindAll(this, "setColor", 'destroy');
	},

	setColor : function(color_id) {
		var that = this;
		console.log(color_id);
		var itemColor = $dino.colors[color_id];
		this.$el.attr("style", "background:#" + itemColor.hex);
	},

	destroy : function() {
		this.unbind();
		this.remove();
	},

	render : function(eventName) {
		var t = this.model.toJSON();
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
}); ;window.$dino.DialogDeleteView = Backbone.View.extend({
	initialize : function(options) {
		this.template = _.template($dino.tpl.get('delete-confirm'));
		this.$el.attr("data-theme", "a");
		this.parentView = options.parentView;
	},

	events : {
		"click #cancel" : "destroy",
		"click #yes" : "deleteItem"
	},

	deleteItem : function() {
		var that = this;
		this.model.destroy({
			success : function() {
//				that.trigger('deleteItem');
				that.destroy();
			},
			error : function(data, err) {
				if (err.statusText == "OK"){
//					that.trigger('deleteItem');
					that.destroy();
				} else {
					console.log('error ', err, data);
				}
			}
		});

	},

	className : 'ui-content',

	id : 'confirm',

	open : function() {
		this.$el.popup();
		this.$el.popup('open');
		this.$("#yes").button();
		this.$("#cancel").button();
	},

	destroy : function() {
		this.$("#yes").remove();
		this.$("#cancel").remove();
		//this.$el.popup("close");
		this.unbind();
		this.remove();
		console.log('triggering delete on dialog');
	},

	render : function() {
		this.$el.html(this.template());
	}
}); ;window.$dino.ListItemView = Backbone.View.extend({
  tagName: 'li',
  initialize: function (opts) {
    this.name = opts.name;
    // Always be sure to set if overriding, this is the 
    // size for the symptom/medication listitems (one line)
    this.swiperHeight = opts.swiperHeight || '45px';
    var templateName = opts.template || 'list-item';
    this.template = _.template($dino.tpl.get(templateName));
    if (!opts.click) {
      this.$el.on('click', this.dontclick);
    }
    this.model.bind('remove', this.destroy, this);
    _.bindAll(this, 'remove', 'destroy', 'hidePlus', 'retireItem');
  },
  events: {
    'click .plus-one': 'clickPlus',
    'dblclick #item-detail': 'openDetails',
    'indom': 'makeSwiper',
    'click .removeItem': 'confirmDelete',
    'click .retireItem': 'retireItem'
  },
  setRetiredTheme: function () {
    var status = this.model.get('status');
    if (status == 'In Remission' || status == 'Retired') {
      console.log('changing theme');
      this.$el.attr('data-theme', 'd');
    }
  },
  retireItem: function (e) {
    e.preventDefault();
    var that = this;
    if (this.$('.retireItem').data('retired') === true) {
      console.log('reactivate this item');
      this.model.set('retired', false);
      this.model.save();
    } else {
      console.log('retire this item');
      this.model.set('retired', true);
    }
    this.model.save(null, {
      success: function (data) {
        console.log('model saved');
        that.trigger('renderlist');
      }
    });
  },
  makeSwiper: function (e, noSwipe) {
    noSwipe = noSwipe || true;
    this.mySwiper = this.$('.swiper-container').swiper({
      'noSwiping': noSwipe,
      'onSlideChangeEnd': this.hidePlus,
      'calculateHeight': false
    });
    // TODO this is a dumb hack caused because swiper
    // is auto-formatting height on list items based on 
    // length of content text inside, should just be able
    // to turn off with calculateHeight false :P
    this.$('.swiper-slide').css('height', '100%');
    this.$('.swiper-wrapper').css('height', this.swiperHeight);
  },
  hidePlus: function (swiper) {
    console.log(swiper);
    console.log(this);
    if (swiper.activeIndex == 1) {
      this.$('.plus-one').hide();
    } else {
      this.$('.plus-one').show();
    }
  },
  dontclick: function (e) {
    e.preventDefault();
  },
  openDetails: function (e) {
    e.preventDefault();
    console.log('opening detail page');
  },
  addBubble: function (selector, text) {
    if (this.$('.added-bubble').length < 1) {
      this.$(selector).append('<span data-count-theme="c" class="ui-li-count ui-btn-up-c ui-btn-corner-all added-bubble">' + text + '</span>');
    }
    this.$('.added-bubble').show();
    this.$('.added-bubble').fadeToggle(3000);
  },
  confirmDelete: function () {
    if (!this.settingSeverity) {
      this.deleteDialog = new $dino.DialogDeleteView({
        model: this.model,
        parentView: this
      });
      this.deleteDialog.render();
      this.$el.append(this.deleteDialog);
      this.deleteDialog.open();
    }
  },
  clickPlus: function (e) {
    if (e)
      e.preventDefault();
    var that = this;
    this.model.set('count', this.model.get('count') + 1);
    this.model.save();
    //create a new plusOne object when someone clicks plusOne
    this.plusOne = new $dino.PlusOne();
    this.plusOne.save({
      item: that.model.id,
      type: that.name,
      user: Parse.User.current().id
    }, {
      success: function (item) {
        that.addBubble('.item-title', '+1');
      }
    });
  },
  destroy: function () {
    console.log('calling destroy on listitem');
    this.unbind();
    if (this.remove) {
      console.log('removing');
      this.remove();
      this.model.trigger('refreshList');
    }  //		if (this.deleteDialog) this.deleteDialog.destroy();
  },
  render: function (eventName) {
    var that = this;
    var title = this.model.get('title');
    this.$el.html(this.template(_.extend(this.model.toJSON(), {
      title: title.length > 30 ? title.substr(0, 27) + '...' : title,
      type: this.name,
      retired: this.model.get('retired') || false
    })));
    if (this.model.get('retired') === true) {
      this.$el.attr('data-theme', 'd');
    }
    return this;
  }
});;window.$dino.ListNewView = Backbone.View.extend({
  tagName: 'li',
  initialize: function (opts) {
    this.template = _.template($dino.tpl.get('list-new'));
    this.modelType = opts.modelType;
    // ex $dino.Medication
    this.header = opts.header;
    // "Medication"
    // This stores the information needed for the pluslist view to 
    // deal with view info on creation
    var options = opts.options || {};
    this.options = _.defaults(options, {
      item: '#new-item',
      padding: '#new-item-padding',
      adder: this.adding,
      text: 'Item'
    });
  },
  events: {
    'click': 'noClick',
    'click .add-one': 'createNew',
    'keypress #newItemInput': 'addOnEnter'
  },
  noClick: function (e) {
    e.preventDefault();
  },
  destroy: function () {
    this.unbind();
    this.remove();
  },
  addOnEnter: function (e) {
    if (e.keyCode == 13)
      this.createNew();
  },
  focus: function () {
    $(this.el).focus();
  },
  createNew: function (e) {
    if (e)
      e.preventDefault();
    if (this.$('#newItemInput').val() !== '') {
      var med = new this.modelType({
          user: Parse.User.current().id,
          title: this.$('#newItemInput').val()
        });
      var that = this;
      med.save(null, {
        success: function (item) {
          console.log('item saved! great job!');
          that.trigger('newItem', null, this.options);
          that.remove();
        },
        error: function (err, item) {
          console.log('item failed to save');
        }
      });
    }
  },
  render: function () {
    $(this.el).html(this.template({ type: this.header }));
    return this;
  }
});;window.$dino.NewFormView = Backbone.View.extend({
	initialize : function(opts) {
		opts = opts || {};
		this.template = (opts.tpl) ? _.template($dino.tpl.get(opts.tpl)) : _.template($dino.tpl.get('condition-new'));
		this.header = opts.header || "New";
		this.model = this.model;
		this.debounceSaveTextInput = _.debounce(this.saveTextInput, 2000);
		_(this).bindAll("deleteItem", 'makeList');
		if (this.afterInitialize)
			this.afterInitialize(opts);
	},
	events : {
		"click .add_detail_item" : "addItem",
		"click .delete_detail_item" : "deleteItemEvent",
		"click .new-item" : "preventDefault",
		"keyup .text-input" : "debounceSaveTextInput",
		"change select" : "checkForAddNew",
		"click .add-btn-padding" : "addNewItem",
		"click .cancel-btn-padding" : "cancelNewItem",
	},

	validTypes : ['condition', 'symptom', 'doctor', 'medication'],

	addNewItem : function(e, type) {
		if (e)
			e.preventDefault();
		var that = this;
		type = type || $(e.currentTarget).data('type');
		var val = this.$("#new-" + type + "-input").val();
		console.log(type, val);
		if (val !== "" & _.contains(this.validTypes, type)) {
			console.log("Add to collection: ", type, val);
			var item = new $dino[type.toTitleCase()]();
			item.set({
				title : val,
				user : Parse.User.current().id
			});
			item.save(null, {
				success : function(item) {
					console.log(item.id);
					// adds newly created doctor to the menu and selects them
					// TODO this is a hack and I should change it to autorender
					if (type == "doctor") {
						that.loadList(that.doctorList, "#select-doctor", "doctor");
					}
					var opts = {
						"id" : item.id,
						"title" : item.get("title"),
						"type" : type
					};
					console.log(opts);
					that.addItem(null, opts);
				}
			});

		}

	},

	cancelNewItem : function(e, type) {
		if (e)
			e.preventDefault();
		type = type || $(e.currentTarget).data('type');
		if (_.contains(this.validTypes, type)) {
			this.resetMenu("#select-" + type);
			this.$('#' + type + '-new-group').hide();
			this.$('#' + type + '-list-bar').show();
		}
	},

	resetMenu : function(selector, valToSelect) {
		valToSelect = valToSelect || 'default';
		console.log('reset', selector);
		// Grab a select field
		var el = this.$(selector);

		// Select the relevant option, de-select any others
		el.val(valToSelect).attr('selected', true).siblings('option').removeAttr('selected');

		// jQM refresh
		try {
			el.selectmenu("refresh", true);
		} catch (err) {
			console.log(err);
		}
	},

	preventDefault : function(e) {
		e.preventDefault();
	},

	// save the text input and add a Saved bubble to the item
	saveTextInput : function(e) {
		this.model.set({
			"title" : $("#condition-title").val(),
			"details" : $("#condition-details").val()
		});
		if (this.liveSave) {
			this.model.save({}, {
				success : function() {
					console.log('text input saved');
					$("#savePopup").show().delay(2000).fadeOut();
				}
			});
		} else {
			console.log('model updated');
			//	console.log(this.model.toJSON());
		}
	},

	// reads the type and id off data attributes in the add button tag
	deleteItemEvent : function(e) {
		e.preventDefault();
		console.log(this);
		var type = $(e.currentTarget).attr("data-type");
		var id = $(e.currentTarget).attr("data-id");
		this.deleteItem(this.model, type, id, true);
	},

	// uses id to find and remove item from the array of its type in the model
	deleteItem : function(model, type, itemId, unlink) {
		console.log(type, itemId);
		var typeItemArr = model.get(type);
		typeItemArr = _.filter(typeItemArr, function(item) {
			return item.id != itemId;
		});
		model.set(type, typeItemArr);
		this.render(true);
	},

	// adds title and id to array of the item's type in the model'
	addItem : function(e, opts) {
		var itemType, itemVal, itemTitle;
		if (e) {
			itemType = $(e.currentTarget).data('type');
			itemVal = this.$("#select-" + itemType).val();
			itemTitle = this.$("#select-" + itemType + " option:selected").text();
		} else if (opts) {
			itemType = opts.type;
			itemVal = opts.id;
			itemTitle = opts.title;
		} else {
			console.log("Error: invalid addItem call");
			return;
		}
		// doctors are handled differently
		if (itemType == "doctor") {
			this.addNewDoctor(itemVal, itemTitle);
			return;
		}
		if (itemVal && itemVal !== "") {
			var typeItemArr = this.model.get(itemType);
			// defaults to false
			if (!typeItemArr) {
				typeItemArr = [];
			}
			var that = this;
			typeItemArr.push({
				"title" : itemTitle,
				"id" : itemVal
			});
			this.model.set(itemType, typeItemArr);
			console.log(this.model.toJSON());
			// TODO this is a hack should understand and change it
			that.first = true;
			that.render();
		}
	},

	addNewDoctor : function(id, title) {
		var doctorItem = {
			"title" : title,
			"id" : id
		};
		this.model.set("doctor", doctorItem);
		this.cancelNewItem(null, "doctor");
		console.log(id);
		this.resetMenu("#select-doctor", id);
	},

	// fetches passed in item collection and appends to selector
	loadList : function(coll, selector, modelType, noAddNew) {
		var that = this;
		coll.fetch({
			data : {
				user : Parse.User.current().id
			},
			success : function(collection) {
				if (modelType == "doctor")
					console.log(collection);
				that.makeList(collection, selector, modelType, noAddNew);
			},
			error : function(collection, error) {
				// The collection could not be retrieved.
				console.log(error);
			}
		});
	},

	checkForAddNew : function(e) {
		var $sel = $("option:selected", e.currentTarget);
		if ($sel.val() == "add-new-item" && $sel.data("type") !== "" && $sel.data("new") === true) {
			this.showNewItemInput($sel.data("type"));
		}
	},

	showNewItemInput : function(type) {
		if (_.contains(['symptom', 'doctor', 'medication'], type)) {
			$('#new-' + type + '-input').val("");
			$('#' + type + '-new-group').show();
			$('#' + type + '-list-bar').hide();
		}
	},

	filterCollection : function(collection, selector, modelType) {
		try {
			var type_ids = _.map(this.model.get(modelType), function(item) {
				return item.id;
			});
			console.log(type_ids);
			var filteredColl = collection.filter(function(item) {
				return !_.contains(type_ids, item.id);
			});
			_(filteredColl).each(function(item, idx, models) {
				that.$(selector).append('<option value="' + item.id + '">' + item.get("title") + '</li>');
			});
		} catch (err) {
			console.log(err);
		}
	},

	// builds list from fetched collection filtering from an
	// optional modelType that removes item already attached to the model from the modelType list
	makeList : function(collection, selector, modelType, noAddNew) {
		modelType = modelType || "";
		var that = this;
		console.log('running makelist on ' + selector);
		that.$(selector).empty();
		if (modelType && modelType != "doctor" && modelType != "condition" && this.model.get(modelType) && this.model.get(modelType).length !== 0) {
			console.log(this.model.toJSON());
			console.log(modelType);
			this.filterCollection(collection, selector, modelType);

		} else if (modelType == "doctor") {
			var selected;
			var modelDoctor = that.model.get("doctor").id;
			collection.each(function(item, idx, models) {
				that.$(selector).append('<option ' + selected + ' value="' + item.id + '">' + item.get("title") + '</li>');
			});
			this.resetMenu("#select-doctor", modelDoctor);
		} else {
			collection.each(function(item, idx, models) {
				that.$(selector).append('<option value="' + item.id + '">' + item.get("title") + '</li>');
			});
		}
		if (modelType == "condition") {
			this.resetMenu("#select-condition", this.model.get("condition").id);
		}
		// special li at end for adding new items to db
		if (!noAddNew) {
			this.$(selector).append('<option data-new="true" data-type="' + modelType + '" value="add-new-item">Add New</li>');
		}
	}
});
;window.$dino.PlusListView = Backbone.View.extend({
  initialize: function (opts) {
    _.extend(this, opts);
    this.template = opts.template || _.template($dino.tpl.get('list-view'));
    _.bindAll(this, 'render', 'renderList', 'addItemToList');
    this.collection.bind('refreshList', this.refreshList, this);
    this.clickItems = opts.clickItems;
    this.adding = false;
    this.loading = true;
    if (this.afterInitialize)
      this.afterInitialize(opts);
  },
  refreshList: function () {
    if (!this.loading) {
      this.$('#myList').listview('refresh');
      this.$('#retiredList').listview('refresh');
    }
  },
  sortList: function (item) {
    return -item.get('count');
  },
  events: {
    'pageinit': 'loadedPage',
    'click #intro-test': 'dontClick'
  },
  loadedPage: function () {
    this.loading = false;
  },
  dontClick: function (e) {
    console.log('click prevented');
    e.preventDefault();
  },
  addItemToList: function (e, opts) {
    if (e)
      e.preventDefault();
    if (this.newListItem) {
      this.newListItem.remove();
      this.newListItem = null;
    }
    this.addingBtn.adding = false;
    this.addingBtn.render();
    this.renderList();
  },
  newItem: function () {
    console.log(this.addingBtn);
    if (this.addingBtn.adding) {
      var itemData = {
          modelType: this.modelType,
          header: this.placeholder || this.header
        };
      this.newListItem = new $dino.ListNewView(itemData);
      this.newListItem.bind('newItem', this.addItemToList);
      this.$('#myList').prepend(this.newListItem.render().el);
      this.$('#myList').listview('refresh');
      this.$('#newItemInput').textinput().focus();
    } else if (this.newListItem) {
      this.newListItem.remove();
      this.newListItem = null;
    }
  },
  addOne: function (Item) {
    var view = new $dino.ListItemView({
        model: Item,
        name: this.name,
        click: this.clickItems
      });
    //	var selector = (Item.get("status") == "In Remission" || Item.get("status") == "Retired") ? "#retiredList" : "#myList";  
    var selector = '#myList';
    if (Item.get('retired') === true) {
      console.log('appending retired');
      this.$(selector).append(view.render().el);
    } else {
      console.log('prepending active');
      this.$(selector).prepend(view.render().el);
    }
    view.$el.trigger('indom');
    view.bind('renderlist', this.renderList);
  },
  renderList: function (firstTime) {
    var that = this;
    this.$('#myList').html('<img src="css/images/ajax-loader.gif" style="margin-left:50%;padding-top:15px;" alt="loading..." />');
    var fetchData = this.fetchData || { 'user': Parse.User.current().id };
    this.collection.fetch({
      data: fetchData,
      success: function (collection) {
        this.$('#myList').empty();
        if (collection.length === 0) {
          //	that.$("#myList").html('<span id="no-items-yet" class="fancyFont"><div>No '+that.header+' Added Yet!</div><hr> <div>Click "Add" Above to Get Started</div><hr></span>');
          return;
        }
        collection.comparator = that.sortList;
        collection.sort();
        for (var i = 0; i < collection.length; i++) {
          that.addOne(collection.models[i]);
        }
        if (!that.loading) {
          that.$('#myList').listview();
          that.$('#myList').listview('refresh');
          that.$('#retiredList').listview();
          that.$('#retiredList').listview('refresh');
        }
      },
      error: function (err, data) {
        $dino.fail404();
      }
    });
    return this;
  },
  createAddButton: function () {
    this.addingBtn = new $dino.PlusListAddButtonView({ debug: this.debug });
    this.$('#addButton').html(this.addingBtn.render().el);
    this.addingBtn.bind('toggle', this.newItem, this);
  },
  render: function () {
    this.$el.html(this.template({ 'header': this.header }));
    if (!this.addingBtn)
      this.createAddButton();
    this.renderList(this.first);
    this.first = false;
    return this;
  }
});;window.$dino.PlusListAddButtonView = Backbone.View.extend({
  className: 'new-item-padding ui-bar ui-bar-f',
  tagName: 'div',
  templateStr: '<a href="#" data-role="button" data-iconshadow="false" data-inline="true" class="new-item ui-icon-alt ui-icon-nodisc" data-icon="plus" data-theme="f"><%= btnText %></a>',
  initialize: function (opts) {
    this.adding = false;
    opts = opts || {};
    this.addText = opts.addText || 'Add';
    this.cancelText = opts.cancelText || 'Cancel';
    this.template = _.template(this.templateStr);
    this.debug = opts.debug;
    this.id = opts.elId || '#new-item';
    _.bindAll(this, 'render', 'toggle');
  },
  events: {
    'click': 'toggle',
    'click .new-item': 'dontClick'
  },
  toggle: function (e) {
    this.adding = !this.adding;
    // toggle state
    this.render(true);
    this.trigger('toggle');
  },
  toggleButton: function (adding) {
    if (adding) {
      this.$('.new-item').addClass('cancelBtn');
      this.$el.addClass('cancelBtn');
    } else {
      this.$('.new-item').removeClass('cancelBtn');
      this.$el.removeClass('cancelBtn');
    }
    var btnIcon = adding ? 'delete' : 'plus';
    this.$('.new-item').buttonMarkup({ icon: btnIcon });
  },
  dontClick: function (e) {
    e.preventDefault();
  },
  render: function (tgl) {
    var data = { 'btnText': this.adding ? this.cancelText : this.addText };
    if (!this.debug) {
      this.$el.html(this.template(data));
    }
    this.toggleButton(this.adding);
    return this;
  }
});;window.$dino.ConditionListItemView = $dino.ListItemView.extend({

	initialize : function() {
		// calling super.constructor
		$dino.ConditionListItemView.__super__.initialize.call(this, {
			name : "condition"
		});
		this.template = _.template($dino.tpl.get('condition-list-item'));
		this.debounceSaveSeverity = _.debounce(this.saveSeverity, 2000);
		_.bindAll(this, 'openGraph', 'saveSeverity', 'debounceSaveSeverity');
		var theme = (this.model.get("status") == "Retired" || this.model.get("status") == "In Remission") ? "d" : "b";
		this.$el.data('theme', theme);
		this.swiperHeight = "75px";
	},

	events : {
		"click" : "dontclick",
		"click .plus-one" : "clickPlus",
		//"swiperight" : "confirmDelete",
		"dblclick #item-detail" : "openDetails",
		"slidestop" : "changeSeverity",
		"keypress #item-notes" : "addOnEnter",
		"indom" : "makeSwiper",
		// TODO PUT THIS BACK!
		"click #condition-detail" : "openGraph",
		"click .removeItem" : "confirmDelete",
		"click .modifyItem" : "goToConditionDetail"
	},
	
	goToConditionDetail: function(e){
		if (e) e.preventDefault();
		if (!this.settingSeverity){
			$dino.app.navigate("bug/"+this.model.id, {
				trigger: true
			});
		}
	},
	
	openGraph: function(e) {
		e.preventDefault();
		if (!this.settingSeverity){
			var id = this.$("#condition-detail").data('id');
			$dino.app.navigate("graph?condition="+id, {
				trigger: true
			});
		}
	},
	
	changeSeverity : function() {
		console.log('change severity');
		//	this.$(".ui-slider div a span .ui-btn-text").html(this.$("#severity").val());
	},

	addOnEnter : function(e) {
		if (e.keyCode == 13)
			this.clickPlus();
	},

	severityTpl : function(data) {
		return _.template($dino.tpl.get('severity-slider'), data);
	},

	setSeverity : function() {
		var that = this;
		if (!this.settingSeverity) {
			var symptoms = this.model.get("symptom");
			_(symptoms).each(function(el, idx, arr) {
				console.log(idx);
				var endVal = false;
				if (idx == arr.length - 1)
					endVal = true;
				that.$("#symptomSliders").append(that.severityTpl({
					elId : el.id,
					title : el.title,
					end : endVal
				}));
			});
			this.$("#item-notes").textinput();
			this.$("#severity").slider({
				trackTheme : 'b',
			});
			this.$("#severity").hide();
			this.$("#cancel-change-severity").button({
				mini : true
			});
			this.$(".swiper-slide").addClass('swiper-no-swiping');
			this.changeSeverity();
			this.settingSeverity = true;
		}
	},

	clickPlus : function(e) {
		if (e)
			e.preventDefault();
		console.log(this.model.toJSON());
		console.log('clicked plus');
		this.$(".set-severity").show();
		if (!this.added) {
			var that = this;
			this.model.set("count", (this.model.get("count") + 1));
			this.model.save();
			//create a new plusOne object when someone clicks plusOne
			this.plusOne = new $dino.PlusOne();
			this.plusOne.save({
				item : this.model.id,
				type : that.name,
				user : Parse.User.current().id,
			}, {
				success : function(item) {
					that.added = true;
					that.setSeverity();
					that.$(".ui-icon").removeClass("ui-icon-plus");
					that.$(".ui-icon").addClass("ui-icon-check");
					// this allows resizing of item for multiple symptom sliders
					that.$(".swiper-slide").css("height", "auto");
				}
			});
		} else {
			this.clickCheck();
		}
	},

	clickCheck : function() {
		this.saveSeverity();
		// reset added button
		this.added = false;
		this.$(".ui-icon").removeClass("ui-icon-check");
		this.$(".ui-icon").addClass("ui-icon-plus");
		this.$("#symptomSliders").empty();
		// this resets slide size for modify/remove buttons
		this.$(".swiper-slide").removeClass('swiper-no-swiping');
		this.$(".swiper-slide").css("height", "100%");
		// TODO change this to use render
		// currently loses formatting on refresh
		// this.render();
		this.addBubble('h3', 'Saved');
	},
	
	saveSymptomSeverity: function(id, severityLvl) {
		//create a new plusOne object when someone clicks plusOne
			var plusOne = new $dino.PlusOne();
			plusOne.save({
				item : id,
				type : 'symptom',
				user : Parse.User.current().id,
				parent: this.model.id,
				parentType: "bug",
				severity: severityLvl
			}, {
				success : function(item) {
					console.log('Saved plusone severity '+severityLvl+' for symptom', id);
				}
			});
	},

	saveSeverity : function() {
		var that = this;
		_(this.$(".symptom-severity")).each(function(el, idx, arr) {
			var symp_id = $(el).data('id');
			var symp_severity = parseInt($(el).val(), 10);
			console.log(symp_severity);
			that.saveSymptomSeverity(symp_id, symp_severity);
		});
		this.settingSeverity = false;
		var sympNotes = this.$("#item-notes").val();
		if (this.added) {
			this.plusOne.save({
				notes : sympNotes,
			});
		}
	}
});
;window.$dino.ConditionNewView = $dino.NewFormView.extend({
  initialize: function (opts) {
    this.template = _.template($dino.tpl.get('condition-new'));
    this.first = true;
    this.header = opts.header || 'Condition';
    this.model = this.model || new $dino.Bug();
    this.debounceSaveTextInput = _.debounce(this.saveTextInput, 2000);
    _(this).bindAll('addCondition', 'deleteItem', 'makeList', 'render');
  },
  events: {
    'click .add_detail_item': 'addItem',
    'click .delete_detail_item': 'deleteItemEvent',
    'click #addBtn': 'addCondition',
    'click .new-item': 'preventDefault',
    'keyup .text-input': 'debounceSaveTextInput',
    'change select': 'checkForAddNew',
    'change #select-doctor': 'setDoctor',
    'change #select-status': 'setStatus',
    'click .add-btn-padding': 'addNewItem',
    'click .cancel-btn-padding': 'cancelNewItem',
    'pageinit': 'setMenu'
  },
  setMenu: function () {
    console.log('setting status menu to proper item');
    var val = this.model.get('status');
    this.resetMenu('#select-status', val);
  },
  setDoctor: function () {
    var $doc = this.$('#select-doctor option:selected');
    if ($doc.val() != 'add-new-item') {
      var docItem = {
          id: $doc.val(),
          title: $doc.text()
        };
      this.model.set('doctor', docItem);
    }
  },
  setStatus: function () {
    var $stat = this.$('#select-status option:selected');
    this.model.set('status', $stat.val());
  },
  addNewItem: function (e, type) {
    if (e)
      e.preventDefault();
    var that = this;
    type = type || $(e.currentTarget).data('type');
    var val = this.$('#new-' + type + '-input').val();
    console.log(type, val);
    if (val !== '' & _.contains([
        'symptom',
        'doctor',
        'medication'
      ], type)) {
      console.log('Add to collection: ', type, val);
      var item = new $dino[(type.toTitleCase())]();
      item.set({
        title: val,
        user: Parse.User.current().id
      });
      item.save(null, {
        success: function (item) {
          console.log(item.id);
          // adds newly created doctor to the menu and selects them
          // TODO this is a hack and I should change it to autorender
          if (type == 'doctor') {
            that.loadList(that.doctorList, '#select-doctor', 'doctor');
          }
          var opts = {
              'id': item.id,
              'title': item.get('title'),
              'type': type
            };
          console.log(opts);
          that.addItem(null, opts);
        }
      });
    }
  },
  cancelNewItem: function (e, type) {
    if (e)
      e.preventDefault();
    type = type || $(e.currentTarget).data('type');
    if (_.contains([
        'symptom',
        'doctor',
        'medication'
      ], type)) {
      this.resetMenu('#select-' + type);
      this.$('#' + type + '-new-group').hide();
      this.$('#' + type + '-list-bar').show();
    }
  },
  saveTextInput: function (e) {
    this.model.set({
      'title': $('#condition-title').val(),
      'details': $('#condition-details').val()
    });
    if (this.liveSave) {
      this.model.save({}, {
        success: function () {
          console.log('text input saved');
          $('#savePopup').show().delay(2000).fadeOut();
        }
      });
    } else {
      console.log('model updated');  //	console.log(this.model.toJSON());
    }
  },
  deleteItemEvent: function (e) {
    e.preventDefault();
    console.log(this);
    var type = $(e.currentTarget).attr('data-type');
    var id = $(e.currentTarget).attr('data-id');
    this.deleteItem(this.model, type, id, true);
  },
  deleteItem: function (model, type, itemId, unlink) {
    console.log(type, itemId);
    var typeItemArr = model.get(type);
    typeItemArr = _.filter(typeItemArr, function (item) {
      return item.id != itemId;
    });
    model.set(type, typeItemArr);
    this.render(true);
  },
  addItem: function (e, opts) {
    var itemType, itemVal, itemTitle;
    if (e) {
      itemType = $(e.currentTarget).data('type');
      itemVal = this.$('#select-' + itemType).val();
      itemTitle = this.$('#select-' + itemType + ' option:selected').text();
    } else if (opts) {
      itemType = opts.type;
      itemVal = opts.id;
      itemTitle = opts.title;
    } else {
      console.log('Error: invalid addItem call');
      return;
    }
    console.log(itemVal);
    console.log(itemType);
    // doctors are handled differently
    if (itemType == 'doctor') {
      this.addNewDoctor(itemVal, itemTitle);
      return;
    }
    if (itemVal && itemVal !== '' && itemVal != 'default') {
      var typeItemArr = this.model.get(itemType);
      // defaults to false
      if (!typeItemArr) {
        typeItemArr = [];
      }
      var that = this;
      typeItemArr.push({
        'title': itemTitle,
        'id': itemVal
      });
      this.model.set(itemType, typeItemArr);
      console.log(this.model.toJSON());
      // TODO this is a hack should understand and change it
      that.first = true;
      that.render();
    }
  },
  addNewDoctor: function (id, title) {
    var doctorItem = {
        'title': title,
        'id': id
      };
    this.model.set('doctor', doctorItem);
    this.cancelNewItem(null, 'doctor');
    console.log(id);
    this.resetMenu('#select-doctor', id);
  },
  addCondition: function (e) {
    e.preventDefault();
    //this.$("#error-msg").hide();
    if (!this.validateCondition())
      return;
    console.log(this.model.toJSON());
    this.model.set('user', Parse.User.current().id);
    this.model.save(null, {
      success: function (condition) {
        console.log('New condition saved: ' + condition.id);
        $dino.app.navigate('bugs', { trigger: true });
      },
      error: function (condition, error) {
        console.log('Failed to save condition, error: ' + error.description);
        console.log(error);
      }
    });
  },
  validateCondition: function () {
    if (this.$('#condition-title').val() === '') {
      this.$('#error-msg').html('Don\'t forgot to make a title!');
      this.$('#error-msg').show();
      return false;
    } else if (this.model.get('symptom').length === 0) {
      this.$('#error-msg').html('Add a symptom to start tracking this condition');
      this.$('#error-msg').show();
      return false;
    } else {
      return true;
    }
  },
  loadList: function (coll, selector, modelType) {
    var that = this;
    coll.fetch({
      data: { user: Parse.User.current().id },
      success: function (collection) {
        if (modelType == 'doctor')
          console.log(collection);
        that.makeList(collection, selector, modelType);
      },
      error: function (collection, error) {
        // The collection could not be retrieved.
        console.log(error);
      }
    });
  },
  checkForAddNew: function (e) {
    var $sel = $('option:selected', e.currentTarget);
    if ($sel.val() == 'add-new-item' && $sel.data('type') !== '' && $sel.data('new') === true) {
      this.showNewItemInput($sel.data('type'));
    }
  },
  showNewItemInput: function (type) {
    if (_.contains([
        'symptom',
        'doctor',
        'medication'
      ], type)) {
      $('#new-' + type + '-input').val('');
      $('#' + type + '-new-group').show();
      $('#' + type + '-list-bar').hide();
    }
  },
  makeList: function (collection, selector, modelType) {
    modelType = modelType || '';
    var that = this;
    console.log('running makelist on ' + selector);
    if (modelType && modelType != 'doctor' && this.model.get(modelType) && this.model.get(modelType).length !== 0) {
      console.log(this.model.toJSON());
      console.log(modelType);
      try {
        var type_ids = _.map(this.model.get(modelType), function (item) {
            return item.id;
          });
        console.log(type_ids);
        var filteredColl = collection.filter(function (item) {
            return !_.contains(type_ids, item.id);
          });
        _(filteredColl).each(function (item, idx, models) {
          that.$(selector).append('<option value="' + item.id + '">' + item.get('title') + '</li>');
        });
      } catch (err) {
        console.log(err);
      }
    } else if (modelType == 'doctor') {
      var selected;
      var modelDoctor = that.model.get('doctor').id;
      collection.each(function (item, idx, models) {
        that.$(selector).append('<option ' + selected + ' value="' + item.id + '">' + item.get('title') + '</li>');
      });
      this.resetMenu('#select-doctor', modelDoctor);
    } else {
      collection.each(function (item, idx, models) {
        that.$(selector).append('<option value="' + item.id + '">' + item.get('title') + '</li>');
      });
    }
    // special li at end for adding new items to db
    this.$(selector).append('<option data-new="true" data-type="' + modelType + '" value="add-new-item">Add New</li>');
  },
  render: function (reload) {
    console.log(this.header);
    this.$el.html(this.template(_.extend(this.model.toJSON(), { 'header': this.header })));
    var that = this;
    if (this.first) {
      this.first = false;
      $(this.el).find('input[type=\'radio\']').checkboxradio({});
      this.symptomList = new $dino.SymptomList();
      this.loadList(this.symptomList, '#select-symptom', 'symptom');
      this.medicationList = null;
      this.medicationList = new $dino.MedicationList();
      this.loadList(this.medicationList, '#select-medication', 'medication');
      this.doctorList = new $dino.DoctorList();
      this.loadList(this.doctorList, '#select-doctor', 'doctor');
    } else if (reload) {
      this.makeList(this.medicationList, '#select-medication', 'medication');
      this.makeList(this.symptomList, '#select-symptom', 'symptom');
      this.makeList(this.doctorList, '#select-doctor', 'doctor');
    }
    // TODO figure out how to not need this
    $('.ui-page').trigger('pagecreate');
    return this;
  }
});;window.$dino.FooterView = Backbone.View.extend({
  initialize: function () {
    this.template = _.template($dino.tpl.get('footer'));
  },
  events: { 'click .footerBtn': 'navBtn' },
  navBtn: function (e) {
    var hash = $(e.currentTarget).attr('href');
    console.log('going to ' + hash);
    if ($.inArray(hash, [
        'appts',
        'info',
        'bugs',
        'symptoms',
        'medications'
      ])) {
      $dino.app.navigate(hash, true);
    }
  },
  render: function () {
    $(this.el).html(this.template());
    return this;
  }
});;window.$dino.GraphView = Backbone.View.extend({
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
});;window.$dino.HelpAppointmentView = Backbone.View.extend({
  initialize: function (opts) {
    _.bindAll(this, 'createIntro');
  },
  createIntro: function () {
    var that = this;
    $dino.intro = intro = introJs();
    intro.setOptions({
      tooltipClass: 'customIntro',
      showBullets: false,
      steps: [
        {
          element: '.footerBtn#appointments',
          intro: 'This is the appointments page.',
          position: 'top'
        },
        {
          element: 'div[data-role=\'content\']',
          intro: 'Choose a day to load appointment information.',
          position: 'bottom'
        },
        {
          element: '#dayAppts',
          intro: 'The appointment stores the details on your appointment, including any doctor or condition you have linked to the appointment.',
          position: 'top'
        },
        {
          element: '#dayAppts',
          intro: 'Like with Symptoms and Condtions, you can swipe left to access the options menu.',
          position: 'top'
        }
      ]
    });
    var nextpage = _.once(function () {
        $('.introjs-overlay').remove();
        $('.introjs-helperLayer').remove();
        $dino.app.navigate('help?type=graph', { trigger: true });
        that.$el.unbind();
        that.$el.remove();
      });
    intro.onchange(function (target) {
      console.log($('.introjs-helperNumberLayer').text());
      if ($('.introjs-helperNumberLayer').text() === '') {
        setTimeout(function () {
          $('.customIntro').css({
            left: '-85px',
            top: '-130px'
          });
          $('.customIntro .introjs-arrow').css({ left: '120px' });
        }, 2);
      }
      if ($('.introjs-helperNumberLayer').text() == '3') {
        that.view.apptItems[0].mySwiper.swipeNext();
        $('.introjs-nextbutton').on('click', function () {
          console.log('nextpage');
          nextpage();
        });
      }
    });
    intro.oncomplete(function (target) {
      $('#temp-intro-css').remove();
      $dino.app.navigate('bugs', { trigger: true });
      this.$el.unbind();
      this.$el.remove();
    });
    intro.onexit(function (target) {
      $('#temp-intro-css').remove();
      $dino.app.navigate('bugs', { trigger: true });
      this.$el.unbind();
      this.$el.remove();
    });
    setTimeout(function () {
      intro.start();
    }, 200);
  },
  render: function () {
    var appt = new $dino.Appointment({
        '_id': '-1',
        'condition': {
          'title': 'Migraines',
          'id': '-10'
        },
        'date': moment().unix(),
        'doctor': {
          'id': '10',
          'title': 'Dr. Robert'
        },
        'notes': 'Questions you want to ask or things you want to discuss can be put here',
        'title': 'Neurologist 1st Visit',
        'type': 'Appointment',
        'user': 'dBsnmh3xV3'
      });
    var collection = new $dino.AppointmentList([appt]);
    var view = this.view = new $dino.AppointmentCalendarView({
        'collection': collection,
        debug: true
      });
    this.$el.bind('pageloaded', this.createIntro);
    this.$el.html(view.render().el);
    setTimeout(function () {
      $('.ui-input-text.ui-shadow-inset').css({
        'border': 'none',
        'box-shadow': 'none'
      });
      console.log(view);
      view.changeDate(null, {
        'method': 'set',
        'value': moment().format('YYYY-MM-DD')
      });
    }, 100);
    return this;
  }
});;window.$dino.HelpConditionView = Backbone.View.extend({
  initialize: function (opts) {
    this.page = opts.page || 1;
    this.views = [];
    console.log('init startintroview');
    _.bindAll(this, 'renderBugView', 'createBugIntro', 'createNewConditionIntro', 'createConditionListItemIntro', 'renderNewConditionView', 'render');
  },
  events: {},
  createBugIntro: function (e) {
    var that = this;
    console.log('running createbugIntro');
    var view = this.views[0];
    if (!view)
      console.warn('empty view for createBugIntro');
    $dino.view = view;
    $dino.intro = intro = introJs();
    intro.setOptions({
      tooltipClass: 'customIntro conditionIntro',
      showBullets: false,
      steps: [{
          element: '#new-condition-padding',
          intro: 'Conditions are greater health problems which have related medications and symptoms (i.e. Asthma, Migraines, Diabetes, etc). Press plus to create a condition.',
          position: 'bottom'
        }]
    });
    intro.onchange(function (target) {
      console.log($('.introjs-helperNumberLayer').text());
      console.log(target);
    });
    intro.onbeforechange(function (target) {
    });
    intro.oncomplete(function () {
      $dino.app.navigate('help?type=condition&page=2', { trigger: true });
      $('#temp-intro-css').remove();
      view.$el.empty();
      view.remove();
    });
    intro.onexit(function () {
      $dino.app.navigate('bugs', { trigger: true });
      $('#temp-intro-css').remove();
      view.$el.empty();
      view.remove();
    });
    // have to wait for jQuery to render before hiding
    setTimeout(function () {
      intro.start();
      $('.introjs-skipbutton').text('Next').show();
      //removeClass("introjs-skipbutton").addClass("introjs-nextbutton").show();
      view.$('#myList').hide();
      view.$('#activeConditionList').hide();
    }, 200);
  },
  createNewConditionIntro: function () {
    var that = this;
    console.log('running createNewconditionIntro');
    var view = this.views[1];
    view.showNewItemInput('medication');
    $dino.view = view;
    $dino.intro = intro = introJs();
    intro.setOptions({
      tooltipClass: 'customIntro',
      showBullets: false,
      steps: [
        {
          element: '#title-list-border',
          intro: 'This is where you create a new symptom',
          position: 'bottom'
        },
        {
          element: '#condition-details',
          intro: 'Put any notes about the condition',
          position: 'bottom'
        },
        {
          element: '#status-list-border',
          intro: 'Indicate whether it is active, in remission, or retired (no longer a condition for you).',
          position: 'bottom'
        },
        {
          element: '#symptom-list-border',
          intro: 'Add one or more symptoms by selecting the symptom in the list and clicking the Add button. You can also add a new symptom by selecting "Add New" in the list.',
          position: 'bottom'
        },
        {
          element: '#symptom-new-group',
          intro: 'To create a new symptom, type in the name and click Add. It will be added to the symptom list. This same behavior applies to medications as well.',
          position: 'bottom'
        },
        {
          element: '#addBtn',
          intro: 'When you are finished, click the Save button',
          position: 'top'
        }
      ]
    });
    intro.onchange(function (target) {
      $('#footerBtnGroup').hide();
      if ($('.introjs-helperNumberLayer').text() === '') {
        view.cancelNewItem(null, 'medication');
      }
      console.log($('.introjs-helperNumberLayer').text());
      console.log(target);
    });
    var nextpage = _.once(function () {
        console.log('go to page 3');
        $('.introjs-overlay').remove();
        $('.introjs-helperLayer').remove();
        $dino.app.navigate('help?type=condition&page=3', { trigger: true });
      });
    intro.onbeforechange(function (target) {
      if ($('.introjs-helperNumberLayer').text() == '4') {
        view.$('#symptom-new-group').show();
      }
      if ($('.introjs-helperNumberLayer').text() == '5') {
        console.log($('.introjs-nextbutton'));
        $('.introjs-nextbutton').on('click', function () {
          console.log('nextpage');
          nextpage();
        });
      }
    });
    intro.onexit(function () {
      $dino.app.navigate('bugs', { trigger: true });
      $('#temp-intro-css').remove();
      view.$el.empty();
      view.remove();
    });
    // have to wait for jQuery to render before hiding
    setTimeout(function () {
      intro.start();
      view.$('#myList').hide();
      view.$('#activeConditionList').hide();
    }, 200);
  },
  createConditionListItemIntro: function () {
    console.log(this.views);
    var view = this.views[0];
    // create condition pluslist item
    var item = new $dino.Bug({
        _id: -1,
        status: 'Active',
        details: 'Stuff',
        title: 'Migraines',
        symptom: [
          {
            title: 'Itchy Scalp',
            id: '-1'
          },
          {
            title: 'Headache',
            id: '-2'
          },
          {
            title: 'Blurred Vision',
            id: '-3'
          }
        ],
        doctor: { title: 'Dr. Roberts' },
        medication: []
      });
    var itemview = new $dino.ConditionListItemView({ model: item });
    view.$('#activeConditionList').append(itemview.render().el);
    view.$('#activeConditionList').listview('refresh');
    itemview.makeSwiper(null, false);
    $dino.view = view;
    $dino.intro = intro = introJs();
    intro.setOptions({
      tooltipClass: 'customIntro',
      showBullets: false,
      steps: [
        {
          element: '#activeConditionList',
          intro: 'After you save the symptom, it is added to the buglist. Click the Plus to log it.',
          position: 'bottom'
        },
        {
          element: '#activeConditionList',
          intro: 'Set the severity for the symptoms, add any additional notes and click the check to save the condition.',
          position: 'bottom'
        },
        {
          element: '.footerBtn#medications',
          intro: 'This button brings you to the medications page. Medications work like symptoms, but don\'t have a severity.',
          position: 'top'
        }
      ]
    });
    var nextpage = _.once(function () {
        console.log('go to page 3');
        $('.introjs-overlay').remove();
        $('.introjs-helperLayer').remove();
        $dino.app.navigate('help?type=appointment&page=1', { trigger: true });
      });
    intro.oncomplete(function (target) {
      $('#temp-intro-css').remove();
      $dino.app.navigate('bugs', { trigger: true });
    });
    intro.onexit(function (target) {
      $('#temp-intro-css').remove();
      $dino.app.navigate('bugs', { trigger: true });
    });
    intro.onchange(function (target) {
      if ($('.introjs-helperNumberLayer').text() === '') {
        setTimeout(function () {
          console.log('setting css');
          $('.customIntro').css({
            bottom: '-150px',
            left: '25px',
            top: '95px'
          });
        }, 2);
      }
      if ($('.introjs-helperNumberLayer').text() == '1') {
        itemview.setSeverity();
        itemview.mySwiper.init();
        itemview.$('.ui-icon').removeClass('ui-icon-plus');
        itemview.$('.ui-icon').addClass('ui-icon-check');
        // this allows resizing of item for multiple symptom sliders
        itemview.$('.swiper-slide').css('height', 'auto');
      }
      if ($('.introjs-helperNumberLayer').text() == '2') {
        $('.introjs-nextbutton').on('click', function () {
          console.log('nextpage');
          nextpage();
        });
      }
    });
    setTimeout(function () {
      intro.start();
      view.$('#myList').hide();
    }, 2);
  },
  renderBugView: function () {
    var view = this.views[0] = new $dino.BugListView({
        template: _.template($dino.tpl.get('bug-list-view')),
        modelType: $dino.Symptom,
        header: 'Bugs',
        collection: new $dino.SymptomList(),
        name: 'symptom',
        debug: true
      });
    if (this.page == 1) {
      this.$el.bind('pageloaded', this.createBugIntro);
    } else if (this.page == 3) {
      this.$el.bind('pageloaded', this.createConditionListItemIntro);
    }
    this.$el.html(view.render().el);
  },
  renderNewConditionView: function () {
    var view = this.views[1] = new $dino.ConditionNewView({ header: 'New' });
    this.$el.bind('pageloaded', this.createNewConditionIntro);
    this.$el.html(view.render().el);
  },
  render: function () {
    if (this.page == 1 || this.page == 3) {
      this.renderBugView();
    } else if (this.page == 2) {
      this.renderNewConditionView();
    }
    return this;
  }
});;window.$dino.HelpGraphView = Backbone.View.extend({
  initialize: function (opts) {
    this.page = opts.page || 1;
    _.bindAll(this, 'createIntro', 'renderMedInfoView');
  },
  createIntro: function () {
    var that = this;
    $dino.intro = intro = introJs();
    intro.setOptions({
      tooltipClass: 'customIntro',
      showBullets: false,
      steps: [
        {
          element: '.footerBtn#info',
          intro: 'This is the correlation graph page. Here you can select symptoms, medications and conditions that you wish to visualize.',
          position: 'top'
        },
        {
          element: '#symp-med-chart',
          intro: 'See symptom progress versus the medications you are taking.',
          position: 'bottom'
        },
        {
          element: '#condition-chart',
          intro: 'Or, see progression of a condition with related symptoms, medications and notes.',
          position: 'top'
        },
        {
          element: '#symp-med-chart',
          intro: 'Thanks for following along with this tutorial! We hope you enjoy using Dinosore.',
          position: 'bottom'
        }
      ]
    });
    var nextpage = _.once(function () {
        $dino.app.navigate('help?type=graph&page=2', { trigger: true });
      });
    intro.onchange(function (target) {
      console.log($('.introjs-helperNumberLayer').text());
      if ($('.introjs-helperNumberLayer').text() === '') {
        setTimeout(function () {
          console.log('setting css');
          $('.customIntro').css({
            left: '-120px',
            top: '-235px'
          });
          $('.customIntro .introjs-arrow').css({ left: '160px' });
        }, 2);
      }
      if ($('.introjs-helperNumberLayer').text() == '3') {
        that.$el.append('<style id="temp-intro-css">.introjs-tooltipbuttons{margin-top:15px;margin-bottom:5px;}.introjs-helperLayer {background:transparent;border: none;box-shadow: none;}.introjs-arrow{display:none}.introjs-tooltip{max-width:none;}</style>');
        $('.introjs-nextbutton').hide();
        $('.introjs-skipbutton').text('Get Started').show();
        setTimeout(function () {
          $('.introjs-skipbutton').text('Get Started').show();
        }, 2);
      }
    });
    intro.oncomplete(function (target) {
      $('#temp-intro-css').remove();
      $dino.app.navigate('bugs', { trigger: true });
    });
    intro.onexit(function (target) {
      $('#temp-intro-css').remove();
      $dino.app.navigate('bugs', { trigger: true });
    });
    setTimeout(function () {
      intro.start();
    }, 200);
  },
  renderMedInfoView: function () {
    this.view = new $dino.MedicalInfoView();
    this.$el.bind('pageloaded', this.createIntro);
    this.$el.html(this.view.render().el);
  },
  render: function () {
    if (this.page == 2) {
      this.renderGraphView();
    } else {
      this.renderMedInfoView();
    }
    return this;
  }
});;window.$dino.InfoModifyView = $dino.NewFormView.extend({
  afterInitialize: function () {
    console.log(this.template);
    this.events = _.extend({}, $dino.NewFormView.prototype.events, this.events);
    this.allergyList = new $dino.AllergyList();
    this.doctorList = new $dino.DoctorList();
  },
  events: { 'click #save-info': 'saveInfo' },
  deleteItem: function (self, type, itemId, unlink) {
    var model = this[type + 'List'].get(itemId);
    model.destroy();
    this.$('*[data-id="' + itemId + '"]').parent().remove();
  },
  loadUserList: function (type, selector) {
    var that = this;
    this[type + 'List'].fetch({
      data: { user: Parse.User.current().id },
      success: function (collection) {
        if (type == 'doctor')
          console.log(collection);
        that.makeList(collection, selector, type);
      },
      error: function (collection, error) {
        // The collection could not be retrieved.
        console.log(error);
      }
    });
  },
  saveInfo: function (e) {
    if (e)
      e.preventDefault();
    var usr = Parse.User.current();
    usr.set('name', this.$('user-fullname').val());
    usr.set('birthday', moment(this.$('birthday').val()).unix());
    usr.save(null, {
      success: function () {
        $dino.app.navigate('info', { trigger: true });
      }
    });
  },
  makeList: function (collection, selector, type) {
    collection.each(function (item, idx, coll) {
      this.$(selector).append('<li><a href="#" data-role="button" data-inline="true" data-icon="delete" data-id="' + item.id + '" class="delete_detail_item" data-type="' + type + '" data-iconpos="notext" data-theme="a" title="X">X></a>' + '<span class="fancyFont itemName"><span data-id="' + item.id + '" class="itemName">' + item.get('title') + '</span></span></li>');
    });
    this.$('.delete_detail_item').button();
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    this.loadUserList('doctor', '#doctor-list');
  }
});;window.$dino.MedicalInfoView = $dino.NewFormView.extend({
	afterInitialize : function(opts) {
		this.template = _.template($dino.tpl.get('medical-info'));
		// extend child events on to parent's - inheritance ftw
		this.events = _.extend({}, $dino.NewFormView.prototype.events, this.events);
		_.bindAll(this, 'loadList', 'render');
		this.model = Parse.User.current();
		this.visualize = {
			'medication' : {},
			'symptom' : {}
		};
	},
	events : {
		'click #logout' : 'logout',
		'click #visualize-items' : 'visualizeItems',
		'click #visualize-condition' : 'visualizeCondition',
		'click #select-medication-button' : 'openListbox',
		'click #select-medication-listbox .ui-header a.ui-btn-left' : 'closeBox',
		'change #select-condition' : 'refreshSelect'
	},
	refreshSelect : function(e) {
		console.log('test');
	},
	closeBox : function(e) {
		e.preventDefault();
		this.$('#select-medication-listbox').popup('close');
	},
	openListbox : function(e) {
		e.preventDefault();
		console.log(e);
		this.$('#select-medication').selectmenu('refresh');
		this.$('#select-medication-listbox').popup({
			overlayTheme : 'a'
		});
		this.$('#select-medication-listbox').popup('open');
		this.$('#select-medication-listbox li:first-child').removeClass('ui-btn-down-a ui-focus');
	},
	visualizeItems : function(e) {
		e.preventDefault();
		var that = this;
		var symp = this.$('#select-symptom option:selected');
		if (symp.val() == 'default') {
			this.$('#error').html('Woops, you forgot to select a symptom to graph!');
			return;
		}
		this.visualize.symptom[symp.val()] = symp.text();
		var symp_str = symp.val() + ',' + symp.text();
		var meds = this.$('#select-medication option:selected');
		var med_str = '';
		_(meds).each(function(med, idx) {
			if (med_str.length > 0)
				med_str += ',';
			var $med = $(med);
			var this_med_str = $med.val() + ',' + $med.text();
			med_str += this_med_str;
		});
		var nav_str = 'graph?symptom=' + symp_str + '&medication=' + med_str;
		$dino.app.navigate(nav_str, {
			trigger : true
		});
	},
	visualizeCondition : function(e) {
		e.preventDefault();
		var nav_str = 'graph?condition=' + this.$('#select-condition').val();
		$dino.app.navigate(nav_str, {
			trigger : true
		});
	},
	logout : function() {
		Parse.User.logOut(null, {
			success : function() {
				localStorage.clear();
				$dino.app.navigate('', {
					trigger : true
				});
			}
		});
	},
	addItem : function(e, opts) {
		var itemType, itemVal, itemTitle;
		if (e) {
			itemType = $(e.currentTarget).data('type');
			itemVal = this.$('#select-' + itemType).val();
			itemTitle = this.$('#select-' + itemType + ' option:selected').text();
		} else if (opts) {
			itemType = opts.type;
			itemVal = opts.id;
			itemTitle = opts.title;
		} else {
			console.log('Error: invalid addItem call');
			return;
		}
		if (itemVal != 'default' && !_.contains(_.keys(this.visualize[itemType]), itemVal)) {
			this.visualize[itemType][itemVal] = itemTitle;
			this.$('#' + itemType + '-list').append('<li>' + '<a href="#" data-role="button" data-inline="true" data-corners="true" data-icon="delete" data-id="' + itemVal + '" class="ui-icon-nodisc delete_detail_item" data-type="' + itemType + '" data-iconpos="notext">X</a>' + '<span class="fancyFont itemName"><span data-id="' + itemVal + '" class="itemName">' + itemTitle + '</span></span></li>');
			this.$('.delete_detail_item').button();
		}
	},
	deleteItem : function(model, type, itemId, unlink) {
		delete this.visualize[type][itemId];
		this.$('a[data-id=\'' + itemId + '\']').parent().remove();
	},
	filterCollection : function(coll, selector, modelType) {
	},
	loadLists : function() {
		this.symptomList = new $dino.SymptomList();
		this.loadList(this.symptomList, '#select-symptom', 'symptom', true);
		this.medicationList = new $dino.MedicationList();
		this.loadList(this.medicationList, '#select-medication', 'medication', true);
		this.conditionList = new $dino.BugList();
		try {
			this.loadList(this.conditionList, '#select-condition', 'condition', true);
		} catch (err) {
			console.log('fix this later:');
			console.log(err);
		}
	},
	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
}); ;window.$dino.MedicationListItemView = Backbone.View.extend({
	
	tagName: "li",
	
	initialize: function(){
		this.template = _.template($dino.tpl.get('list-item'));
		this.debounceSaveSeverity =  _.debounce(this.saveSeverity, 2000);
		this.model.bind('remove', this.destroy);
		_.bindAll(this, 'destroy');
	}, 
	
	events: {
		"click .plus-one" : "clickPlus",
		"swiperight" : "confirmDelete",
		"dblclick #medication-detail" : "openMedicationDetails",
	},
	
	openMedicationDetails: function(e){
		e.preventDefault();
		console.log('opening detail page');
	},
	
	// resets the title (removes severity slider)
	// can place added bubble on plusOne
	resetTitle: function(e){
		if (e) e.preventDefault();
		var title = this.model.get("title");
		var itemHtml = '<span class="medication-title">'+title+'</span>';
		this.$("h3").html(itemHtml);
		this.settingSeverity = false;
	},
	
	addBubble: function(selector, text){
		if (this.$(".added-bubble").length < 1) {this.$(selector).append('<span data-count-theme="b" class="ui-li-count ui-btn-up-e ui-btn-corner-all added-bubble">'+ text +'</span>');}
		this.$(".added-bubble").show();
		this.$(".added-bubble").fadeToggle(3000);
	},
	
	confirmDelete: function(){
		if (!this.settingSeverity){		
			this.deleteDialog = new $dino.DialogDeleteView({model: this.model, parentView: this});
			this.deleteDialog.render();
			$(this.el).append(this.deleteDialog);
			this.deleteDialog.open();
		}
	},

	clickPlus: function(e){
		if (e) e.preventDefault();

		var that = this;
		console.log('clickcing');
		if (this.alreadyClicked) return;
		this.model.increment("count", 1);
		this.model.save(); 
		//create a new plusOne object when someone clicks plusOne
		this.plusOne = new $dino.PlusOne();
		this.plusOne.save({
			item: this.model.id,
			user: Parse.User.current()
		}, {
		success: function(item){
			that.addBubble('h3', 'added');
		}
		});
	},
	
	destroy: function(){
		if (this.deleteDialog) this.deleteDialog.destroy();
		this.unbind();
		this.remove();
	},
	
	render:function(eventName){
		$(this.el).html(this.template(_.extend(this.model.toJSON(), {type: "medication"})));
        return this;
	}
	
});;// Temporary view until caching implemented
window.$dino.OfflineExitView = Backbone.View.extend({
	initialize : function(options) {
		this.template = _.template($dino.tpl.get('offline-exit'));
		this.$el.attr("data-theme", "a");
	},

	events : {
		"click #retry" : "retry",
		"click #exit" : "exit"
	},
	
	retry: function(e){
		e.preventDefault();
		window.history.back();
	},

	exit : function(e) {
		e.preventDefault();
		if (navigator.app) {
			try {
				navigator.app.exitApp();
			} catch (err) {
				alert("Well shucks, looks like we failed to exit. Would you be a darling and close the app for us?");
			}
		} else {
			alert("Well shucks, looks like we failed to exit. Would you be a darling and close the app for us?");
		}

	},

	render : function() {
		this.$el.html(this.template());
	}
}); ;window.$dino.PlusOneListView = $dino.PlusListView.extend({
  afterInitialize: function (opts) {
    this.fetchData = {
      user: Parse.User.current().id,
      type: opts.type,
      item: opts.item
    };
    this.sortList = 'date';
  },
  renderList: function () {
    var that = this;
    this.$('#myList').html('<img src="css/images/ajax-loader.gif" style="margin-left:50%;padding-top:15px;" alt="loading..." />');
    var fetchData = this.fetchData || { 'user': Parse.User.current().id };
    this.collection.fetch({
      data: fetchData,
      success: function (collection) {
        this.$('#myList').empty();
        if (collection.length === 0) {
          that.$('#myList').html('<h1 id="no-items-yet" class="fancyFont">No ' + that.header + ' Recorded Yet!</h1>');
          return;
        }
        collection.comparator = that.sortList;
        collection.sort();
        for (var i = 0; i < collection.length; i++) {
          that.addOne(collection.models[i]);
        }
        if (!that.loading) {
          that.$('#myList').listview();
          that.$('#myList').listview('refresh');
          that.$('#retiredList').listview();
          that.$('#retiredList').listview('refresh');
        }
      },
      error: function (err, data) {
        $dino.fail404();
      }
    });
    return this;
  },
  addOne: function (item) {
    this.$('#myList').append(new $dino.PlusOneListItemView({ model: item }).render().el);
  },
  renderTitle: function () {
    var id = this.fetchData.item;
  },
  render: function () {
    $(this.el).html(this.template({ 'header': this.header }));
    this.renderTitle();
    this.renderList(this.first);
    this.first = false;
    return this;
  }
});;window.$dino.PlusOneListItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'plus-one-item',
  initialize: function (opts) {
    var templateName = opts.template || 'plusone-list-item';
    this.template = _.template($dino.tpl.get(templateName));
  },
  render: function () {
    var that = this;
    var plusone_date = moment.unix(this.model.get('date')).format('dddd, MMMM Do YYYY, h:mm a');
    var tpl_data = { date: plusone_date };
    this.$el.html(this.template(tpl_data));
    return this;
  }
});;window.$dino.StartIntroView = Backbone.View.extend({
  initialize: function () {
    this.page = 1;
    this.views = [];
    console.log('init startintroview');
    _.bindAll(this, 'renderBugView', 'createBugIntro', 'render');
  },
  events: {},
  createBugIntro: function (e) {
    var that = this;
    console.log('running createbugIntro');
    var view = this.views[0];
    if (!view)
      console.warn('empty view for createBugIntro');
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
    var itemview = new $dino.SymptomListItemView({ model: item });
    view.$('#activeConditionList').append(itemview.render().el);
    view.$('#activeConditionList').listview('refresh');
    itemview.makeSwiper(null, false);
    $dino.view = view;
    $dino.intro = intro = introJs();
    intro.setOptions({
      tooltipClass: 'customIntro',
      showBullets: false,
      steps: [
        {
          element: '#myList',
          intro: '<strong>Welcome!</strong><br>Using Dinosore, you can make exact records of your health over time. Don\'t estimate when you think a problem started, see it for yourself!',
          position: 'bottom'
        },
        {
          element: '.footerBtn[href="#bugs"]',
          intro: 'This is the Bug List page',
          position: 'top'
        },
        {
          element: '.ui-block-a .new-item-padding',
          intro: 'Click to add a new symptom',
          position: 'bottom'
        },
        {
          element: document.querySelector('#newItemLi'),
          intro: 'Input the symptom and click the plus to add.',
          position: 'bottom'
        },
        {
          element: '.plus-one',
          intro: 'Whenever you are feeling the symptom, click the plus to log it.',
          position: 'left'
        },
        {
          element: '#activeConditionList',
          intro: 'Choose the severity, add a descriptive note (only if you want!), and click the check to confirm or the X to cancel.',
          position: 'bottom'
        },
        {
          element: '#symptom-detail',
          intro: 'After you\'ve logged the symptom a few times, click the symptom name to view its graph.',
          position: 'bottom'
        },
        {
          element: '#symptom-detail',
          intro: 'Swipe left to reveal the options menu. You can delete a symptom or retire it when it is no longer active.',
          position: 'bottom'
        },
        {
          element: '#myList',
          intro: 'We hope you find Dinosore useful and easy to use! If you have any questions or comments, feel free to talk to us anytime at dinosorehealth@gmail.com.',
          position: 'bottom'
        }
      ]
    });
    var nextpage = _.once(function () {
        console.log('calling nextpage');
        $dino.app.navigate('help?type=condition&page=1', { trigger: true });
        $('.introjs-overlay').remove();
        $('.introjs-helperLayer').remove();
        that.$el.unbind();
        that.$el.remove();
      });
    intro.onchange(function (target) {
      console.log($('.introjs-helperNumberLayer').text());
      if ($('.introjs-helperNumberLayer').text() === '') {
        view.$el.append('<style id="temp-intro-css">.introjs-helperLayer {background:transparent;border: none;box-shadow: none;}.introjs-arrow{display:none}.introjs-tooltip{max-width:none;}</style>');
        console.log('hide helperLayer');
      }
      if ($('.introjs-helperNumberLayer').text() == '1') {
        $('#temp-intro-css').remove();
        console.log('show helperLayer');
      }
      if ($('.introjs-helperNumberLayer').text() == '3') {
        view.addingBtn.toggleButton(true);
        view.$('.cancelBtn span .ui-btn-text').text('Cancel');
        var note = 'Headache', i, typeNote = function (i) {
            $('#newItemInput').val(note.substr(0, i));
          };
        for (i = 1; i <= note.length; i++) {
          setTimeout(typeNote, i * 200, i);
        }
      }
      if ($('.introjs-helperNumberLayer').text() == '4') {
        $('#myList').hide();
        view.$('.cancelBtn span .ui-btn-text').text('Symptom');
        view.addingBtn.toggleButton();
      }
      if ($('.introjs-helperNumberLayer').text() == '5') {
        itemview.setSeverity();
        itemview.$('.swiper-wrapper').css({
          'height': 'auto',
          'width': '100%'
        });
        itemview.$('#item-title-slide').css('width', '100%');
        itemview.$('#severity').val('4');
        itemview.$('#severity').slider('refresh');
        itemview.changeSeverity();
        var note2 = 'Throbbing', j, typeNote2 = function (j) {
            itemview.$('#symptom-notes').val(note.substr(0, j));
          };
        for (j = 1; j <= note2.length; j++) {
          setTimeout(typeNote2, j * 200, j);
        }
        itemview.$('.plus-one').hide();
        itemview.$('.check-items').show();
      }
      if ($('.introjs-helperNumberLayer').text() == '6') {
        itemview.resetTitle();
        itemview.addBubble('.item-title', 'Saved');
        view.$('#myList').empty().show();
      }
      if ($('.introjs-helperNumberLayer').text() == '7') {
        swiper = itemview.mySwiper;
        itemview.mySwiper.init();
        itemview.mySwiper.swipeNext();
      }
      if ($('.introjs-helperNumberLayer').text() == '8') {
        itemview.mySwiper.swipePrev();
        view.$el.append('<style id="temp-intro-css">.introjs-helperLayer {background:transparent;border: none;box-shadow: none;}.introjs-arrow{display:none}.introjs-tooltip{max-width:none;}.introjs-tooltiptext{padding-bottom:15px}</style>');
        $('.introjs-nextbutton').text('Continue Tutorial');
        $('.introjs-skipbutton').text('Get Started').show();
        $('.introjs-nextbutton').on('click', function () {
          nextpage();
        });
        setTimeout(function () {
          $('.introjs-skipbutton').text('Get Started').show();
        }, 2);
      }
      console.log(target);
    });
    intro.onbeforechange(function (target) {
      console.log($('.introjs-helperNumberLayer').text());
      if ($('.introjs-helperNumberLayer').text() == '3') {
        $('#myList').show();
      }
      if ($('.introjs-helperNumberLayer').text() == '4') {
        $('#activeConditionList').show();
      }
    });
    intro.oncomplete(function () {
      $dino.app.navigate('bugs', { trigger: true });
      $('#temp-intro-css').remove();
      view.$el.empty();
      view.remove();
    });
    intro.onexit(function () {
      $dino.app.navigate('bugs', { trigger: true });
      $('#temp-intro-css').remove();
      view.$el.empty();
      view.remove();
    });
    // have to wait for jQuery to render before hiding
    setTimeout(function () {
      intro.start();
      view.$('#myList').hide();
      view.$('#activeConditionList').hide();
    }, 200);
  },
  renderBugView: function () {
    var view = this.views[0] = this.views[0] || new $dino.BugListView({
        template: _.template($dino.tpl.get('bug-list-view')),
        modelType: $dino.Symptom,
        header: 'Bugs',
        collection: new $dino.SymptomList(),
        name: 'symptom',
        debug: true
      });
    this.$el.bind('pageloaded', this.createBugIntro);
    this.$el.html(view.render().el);
  },
  renderMedicationView: function () {
    var coll = new $dino.MedicationList();
    var view = new $dino.PlusListView({
        modelType: $dino.Medication,
        header: 'Medications',
        collection: coll,
        clickItems: true,
        name: 'medication'
      });
    this.$el.bind('pageloaded', this.createMedicationIntro);
    this.$el.html(view.render().el);
    setTimeout(function () {
      intro.start();
      view.$('#myList').hide();
      view.$('#activeConditionList').hide();
    }, 2);
    $('.ui-page').trigger('pagecreate');
  },
  render: function () {
    this.renderBugView();
    return this;
  }
});;window.$dino.StartLoginView = Backbone.View.extend({
  initialize: function () {
    this.template = _.template($dino.tpl.get('login'));
  },
  events: {
    'click #signupBtn': 'signup',
    'click #loginBtn': 'login',
    'focus input': 'increasePageHeight'
  },
  increasePageHeight: function () {
    var $page = $('.ui-page'), vSpace = $page.children('.ui-header').outerHeight() + $page.children('.ui-footer').outerHeight() + $page.children('.ui-content').height();
    console.log($page);
    if (vSpace < $(window).height()) {
      var vDiff = $(window).height() - $page.children('.ui-header').outerHeight() - $page.children('.ui-footer').outerHeight() - 40;
      //minus thirty for margin
      $page.children('.ui-content').height(vDiff);
    }
  },
  login: function () {
    var usr = this.$('#email').val();
    var pw = this.$('#password').val();
    var that = this;
    if (usr === '' || pw === '') {
      this.$('#error').html('Don\'t forget to fill out all the fields!');
      return;
    }
    Parse.User.logIn(usr, pw, {
      success: function(user) {
		var usr = new $dino.User(user.toJSON());
		usr.id = Parse.User.current().id;
		usr.save();
        $dino.app.navigate("bugs", {trigger: true});
      }, 
      error: function(usr, err){
        that.$("#error").html(err.message.toTitleCase());        
      }
    });
  },
  render: function () {
    $(this.el).html(this.template());
    return this;
  }
});
function normalizeTable(tbl, isTest) {
  var results = [];
  var keys = [];
  var i, j;
  var th = $(tbl).find('thead tr').children();
  var tr = $(tbl).find('tbody').children();
  // read out the table header keys
  for (i = 0; i < th.length; i++) {
    keys[i] = th[i].textContent.replace(/\s/g, '_').replace('?', '');
  }
  // make results using keys
  var oneResult;
  for (i = 0; i < tr.length; i++) {
    oneResult = {};
    var trData = $(tr[i]).children();
    for (j = 0; j < trData.length; j++) {
      if (isTest && j == 4) {
        oneResult[keys[j]] = normalizeTable($(trData[j]).find('list item table'));
      } else if (trData[j].textContent !== '') {
        oneResult[keys[j]] = trData[j].textContent;
      }
    }
    results.push(oneResult);
  }
  return results;
}
;window.$dino.StartPrivacyView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template($dino.tpl.get('privacy'));
	},

	events : {
		"change input[type='radio']" : "bringOnZeeJargon",
		"click #next" : "nextPage"
	},
	
	nextPage: function(){
		$dino.app.navigate("symptoms", {
			trigger : true
		});
	},

	bringOnZeeJargon : function(e){
		if ($(e.target).attr('id') == 'privacy-cloud') {
			$("#jargon").html("By storing your data in the cloud you absolve Dinosore of all fault in case anything terrible happens.");	
		} else {
			$("#jargon").empty();
		}
	},
	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
}); 
;window.$dino.StartSignupView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template($dino.tpl.get('signup'));
	},

	events : {
		"click #signupBtn" : "signup"
	},

	validateFieldsExist : function(inputs) {
		var valid = true;
		$("#error").empty();
		_(inputs).each(function(val, key, arr){
			if (!val || val === ""){
				$("#error").html("You forgot some info!");
				$("#"+key).addClass('input-error');
				valid = false;
			} else {
				$("#"+key).removeClass('input-error');
			}
		});
		return valid;
	},
	
	validatePasswords: function(inputs){
		if (inputs.password != inputs['confirm-password']){
			$("#error").html("Passwords do not match");
			$("#password").addClass('input-error');
			$("#confirm-password").addClass('input-error');
			return false;
		} else {
			return true;
		}
		
	},

	signup : function() {
		var inputs = {
			"name" : this.$("#name").val(),
			"email" : this.$("#email").val(),
			"password" : this.$("#password").val(),
			"confirm-password" : this.$("#confirm-password").val(),
			"birthday" : moment(this.$("#birthday").val()).unix(),
			"gender" : this.$('input[name="select-gender"]:checked').val(),
		};
		var valid = this.validateFieldsExist(inputs);
		if (!valid) return;
		valid = this.validatePasswords(inputs);
		if (!valid) return;
		var that = this;
		Parse.User.signUp(inputs.email, inputs.password, {}, {
			success : function(user) {
				var User = Parse.User.current();
				User.set({
					birthday: inputs.birthday,
					name: inputs.name,
					gender: inputs.gender
				});
				User.save(null,{ 
					success: function(){
						$dino.app.navigate("intro", {
							trigger : true
						});
					},
					error : function(err) {
						that.$("#error").html(err.error.toTitleCase());
					}
				});
			}, 
			error: function(err){
				that.$("#error").html(err.error.toTitleCase());
			}
		});
	},
	
	createMenstrationSymptoms: function() {
		var isReadySymptoms = [false, false, false];
		var readyState = [true, true, true];
		
		// save the symptoms (flow, cramps, mood) & check for readyState in callback, if ready, call createMenstrationCondition
	},

	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
});
;window.$dino.StartSplashView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template($dino.tpl.get('start-splash'));
	},
	events : {
		'click #splash-login' : 'login',
		'click #splash-signup' : 'signup'
	},

	login: function(e) {
		e.preventDefault();
		$dino.app.navigate("login", {
			trigger : true
		});
	},
	
	signup: function(e) {
		e.preventDefault();
		$dino.app.navigate("signup", {
			trigger : true
		});
	},

	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
}); 
;// TODO implement
window.$dino.SymptomDetailView = new Backbone.View.extend({
	
	initalize: function(){
		this.template($dino.tpl.get('symptom-detail'));
	},
	
	events: {
		
	},
	
	render: function(){
		
	}
	
});
;window.$dino.SymptomGraphView = Backbone.View.extend({
	initialize : function(opts) {
		var title = 'Test Graph';
		this.template = _.template($dino.tpl.get('graph'));
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
		if (data.length === 0){
			this.$("#graphContainer").html('<h4 class="fancyFont">Sorry! No plusones recorded for this symptom yet, come back when you\'ve tracked more data :)');
			return;
		}
		var jsoon = data.toJSON();

		var timeAxis = [];
		var sevAxis = [];
		var noteSeries = [];

		console.log(jsoon);
		var appendTimeSevToAxis = _.each(jsoon, function(elem) {
			var time = moment.unix(elem.date);
			date = (time.format("MMM Do - h:mm a"));
			timeAxis.push(date);
			var sev = elem.severity || 0;
			sevAxis.push(sev);
			var notes = elem.notes;
			noteSeries[date] = notes;
		});
		
		console.log(timeAxis);
		console.log(sevAxis);

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
;window.$dino.SymptomListItemView = $dino.ListItemView.extend({
	
	initialize: function(){
		// calling super.constructor
		$dino.SymptomListItemView.__super__.initialize.call(this, {name: "symptom"});
		_.bindAll(this, 'saveSymptom');
	}, 
	
	events: {
		"click" : "dontclick",
		"click .plus-one" : "clickPlus",
		"click #confirm-plus" : "saveSymptom",
		"slidestop" : "changeSeverity",
		"keypress #symptom-notes" : "addOnEnter",
		"indom" : "makeSwiper",
		"click #cancel-plus" : "resetTitle",
		"click #item-title-slide" : "goToSymptomDetail",
		"click .removeItem" : "confirmDelete",
		"click .retireItem" : "retireItem"
	},

	// resets the title (removes severity slider)
	// can place added bubble on plusOne
	resetTitle: function(e){
		if (e) e.preventDefault();
		this.$(".check-items").hide();
		this.$(".plus-one").show();
		this.$(".set-severity").hide();
		this.$(".swiper-slide").removeClass('swiper-no-swiping');
		this.$(".swiper-slide").css("height", "100%");
		this.$("#symptom-notes").val("");
		this.$("#severity").val("0");
		this.$("#severity").slider("refresh");
		this.changeSeverity();
		//var title = this.model.get("title");
		//var itemHtml = '<span class="symptom-title">'+title+'</span>';
		//this.$("h3").html(itemHtml);
		this.settingSeverity = false;
	},
	
	goToSymptomDetail: function(e){
		if (e) e.preventDefault();
		if (!this.settingSeverity){
			$dino.app.navigate("symptoms/"+this.model.id+"/graph", {
				trigger: true
			});
		}
	},
	
	changeSeverity: function(){
		this.$(".ui-slider div a span .ui-btn-text").html(this.$("#severity").val());		
	},
	
	addOnEnter: function(e){
		if (e.keyCode == 13) this.clickPlus();
	},

	setSeverity: function(){
		if (!this.settingSeverity){
			this.$(".set-severity").show();
			this.$(".swiper-slide").addClass('swiper-no-swiping');
			this.$("#symptom-notes").textinput();
			this.$("#severity").slider({
				trackTheme: 'a',
			});
			this.$("#severity").hide();
			this.$("#cancel-change-severity").button({
				mini: true
			});
			this.changeSeverity();
			this.settingSeverity = true;	
		}
	},
	
	clickPlus: function(e){
		if (e) e.preventDefault();
		console.log('clicking plus');
		this.setSeverity();
		this.$(".plus-one").hide();
		this.$(".check-items").show();
		this.$(".swiper-slide").css("height", "auto");
	},
	
	saveSymptom: function(){
		var that = this;
		var severityLvl = this.settingSeverity ? parseInt(this.$("#severity").val(), 10) : null;
		var sympNotes = this.$("#symptom-notes").val();
		var plusOne = new $dino.PlusOne();
		plusOne.save({
				item: this.model.id,
				type: this.name,
				user: Parse.User.current().id,
				notes: sympNotes,
				severity: severityLvl,
			}, {
			success: function(item){ 
				that.resetTitle();
				that.addBubble('.item-title', 'Saved');		
				that.model.set("count", (this.model.get("count") + 1));
				that.model.save(); 
			}
		});
	}
	
});
;// =========================
// PARSE.COM
// TODO PHASE OUT
// =========================
Parse.initialize("ILMokni7fwKhJSdWh38cGPpEwL2CLsrhcrUgJmG6", "cDQoHLQqGRRj9srzrpG2jv6X5nl2BPdh7hVUBRoc");

// ==========================
// ENVIRONMENT
// ==========================
$dino.env = 'dev';
//$dino.env = 'prod';
//$dino.env = 'cache';
;$(document).bind("mobileinit", function () {
    console.log('mobileinit');
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
    $.support.cors = true;
	$.mobile.allowCrossDomainPages = true;

    // Remove page from DOM when it's being replaced
    $('div[data-role="page"]').live('pagehide', function (event, ui) {
        $(event.currentTarget).remove();
    });
});
;$dino.AppRouter = Backbone.Router.extend({
  routes: {
    '': 'start',
    'appts': 'appts',
    'appts/:id/modify': 'modifyAppt',
    'appts/add(?*path)': 'newAppt',
    'bugs': 'bugList',
    'bugs/add': 'newCondition',
    'bug/:id': 'bugDetails',
    'bug/:id/modify': 'bugModify',
    'bug/:id/delete': 'bugDialog',
    'graph': 'makeGraph',
    'help': 'helpPage',
    'info': 'info',
    'info/modify': 'infoModify',
    'intro': 'intro',
    'login': 'login',
    'medications': 'medicationList',
    'medication/:id': 'medicationDetails',
    'offline': 'offlineExit',
    'privacy': 'privacySettings',
    'signup': 'signup',
    'symptoms/:id/graph': 'graphSymptom',
    '*path': 'start'
  },
  initialize: function () {
    $('.back').live('click', function (event) {
      window.history.back();
      return false;
    });
    this.firstPage = true;
  },
  appts: function () {
    var collection = new $dino.AppointmentList();
    var apptView = new $dino.AppointmentCalendarView({ 'collection': collection });
    this.changePage(apptView, true);
    $('#date').hide();
    $('.hasDatepicker').off().remove();
  },
  modifyAppt: function (id) {
    var self = this;
    var appt = new $dino.Appointment();
    appt.id = id;
    appt.fetch({
      success: function (data) {
        console.log('modify appt');
        self.changePage(new $dino.AppointmentNewView({
          header: 'Modify',
          model: data
        }));
        $('#date').hide();
        $('.hasDatepicker').off().remove();
      },
      error: function (data, err) {
        console.log(err);
      }
    });
  },
  newAppt: function (path) {
    if (path)
      console.log(path);
    this.changePage(new $dino.AppointmentNewView({ defaultDate: path }));
  },
  info: function () {
    var medInfo = new $dino.MedicalInfoView();
    this.changePage(medInfo, true);
    medInfo.loadLists();
  },
  infoModify: function () {
    this.changePage(new $dino.InfoModifyView({
      model: Parse.User.current(),
      tpl: 'info-modify'
    }));
  },
  offlineExit: function () {
    this.changePage(new $dino.OfflineExitView());
  },
  bugList: function () {
    var coll = new $dino.SymptomList();
    var bugListView = new $dino.BugListView({
        template: _.template($dino.tpl.get('bug-list-view')),
        modelType: $dino.Symptom,
        header: 'Bugs',
        collection: coll,
        name: 'symptom'
      });
    this.changePage(bugListView, true);
  },
  newCondition: function () {
    this.changePage(new $dino.ConditionNewView({ header: 'New' }));
  },
  loadBug: function (id, callback) {
    console.log('loading bug ' + id);
    var bug = new $dino.Bug({});
    bug.id = id;
    bug.fetch({
      success: function (data) {
        callback(data);
      },
      error: function (err, data) {
        $dino.fail404();
      }
    });
  },
  bugDetails: function (id) {
    var self = this;
    this.loadBug(id, function (data) {
      self.changePage(new $dino.BugDetailView({ model: data }), true);
    });
  },
  bugModify: function (id) {
    var self = this;
    this.loadBug(id, function (data) {
      console.log('modify bug details');
      self.changePage(new $dino.ConditionNewView({
        model: data,
        header: 'Modify'
      }));
    });
  },
  start: function () {
    if (Parse.User.current()) {
      this.bugList();
    } else {
      this.changePage(new $dino.StartSplashView());
    }
  },
  intro: function () {
    this.changePage(new $dino.StartIntroView(), true);
  },
  privacySettings: function () {
    this.changePage(new $dino.StartPrivacyView());
  },
  login: function () {
    this.changePage(new $dino.StartLoginView());
  },
  signup: function () {
    this.changePage(new $dino.StartSignupView());
  },
  makeGraph: function (params) {
    console.log(params);
    var visualize;
    if (params.condition) {
      visualize = new $dino.GraphView({ condition: params.condition });
      $dino.app.changePage(visualize);
    } else if (params.symptom) {
      var graph_items = {
          symptom: [],
          medication: []
        };
      // set up symptom
      // id first, then title
      var symp = params.symptom.split(',');
      graph_items.symptom[symp[0]] = symp[1];
      // if medications, set medication
      if (params.medication) {
        var meds = params.medication.split(',');
        // if not multiple of 2, something went terribly wrong
        if (meds.length % 2 !== 0)
          $dino.fail404();
        var i = 0;
        while (i < meds.length) {
          graph_items.medication[meds[i]] = meds[i + 1];
          i += 2;
        }
      }
      console.log(graph_items);
      visualize = new $dino.GraphView({ items: graph_items });
      $dino.app.changePage(visualize);
    } else {
      $dino.fail404();
    }
  },
  graphSymptom: function (id) {
    console.log('graphing ' + id);
    var that = this;
    var symp = new $dino.Symptom();
    symp.id = id;
    symp.fetch({
      success: function (data) {
        console.log(data.toJSON());
        that.changePage(new $dino.SymptomGraphView({ model: data }));
      },
      error: function (err, data) {
        $dino.fail404();
      }
    });
  },
  helpPage: function (params) {
    console.log(params);
    if (!params || !params.type) {
      this.changePage(new $dino.StartIntroView(), true);
    } else {
      switch (params.type) {
      case 'condition':
        this.changePage(new $dino.HelpConditionView({ page: params.page }), true);
        break;
      case 'appointment':
        this.changePage(new $dino.HelpAppointmentView({}), true);
        break;
      case 'graph':
        this.changePage(new $dino.HelpGraphView({}), true);
        break;
      default:
        this.changePage(new $dino.StartIntroView(), true);
        break;
      }
    }
  },
  medicationList: function () {
    var coll = new $dino.MedicationList();
    var medView = new $dino.PlusListView({
        modelType: $dino.Medication,
        header: 'Medications',
        collection: coll,
        clickItems: true,
        name: 'medication'
      });
    this.changePage(medView, true);
  },
  medicationDetails: function (id) {
    var coll = new $dino.PlusOneList();
    var medView = new $dino.PlusOneListView({
        modelType: $dino.Medication,
        item: id,
        type: 'medication',
        header: 'Medication Details',
        collection: coll,
        name: 'medication-plusone'
      });
    this.changePage(medView, true);
  },
  changePage: function (page, hasFooter) {
    $(page.el).attr('data-role', 'page');
    $(page.el).data('theme', 'a');
    $(page.el).on('pageinit', function () {
      page.pageloaded = true;
      $(page.el).trigger('pageloaded');
    });
    page.render();
    if (hasFooter) {
      this.footer = this.footer || new $dino.FooterView();
      this.footer.render();
      $(page.el).append($(this.footer.el));
    }
    $('body').append($(page.el));
    if (page.collection)
      page.collection.fetch();
    var transition = 'none';
    // $.mobile.defaultPageTransition;
    // We don't want to slide the first page
    if (this.firstPage) {
      //	transition = 'none';
      this.firstPage = false;
    }
    // reset noBack flag to default
    $dino.noBack = false;
    $.mobile.changePage($(page.el), {
      changeHash: false,
      transition: transition
    });
    $dino.currView = page;
  }
});
$(document).ready(function () {
  $dino = window.$dino || {};
  FastClick.attach(document.body);
  var tplCallback = function () {
    $dino = window.$dino || {};
    $dino.app = new $dino.AppRouter();
    Backbone.history.start();
    // override back button for android
    // if I set $dino.noBack on any page
    // I can use the back button as I like
    document.addEventListener('backbutton', function (e) {
      e.preventDefault();
      if (!$dino.noBack) {
        window.history.back();
      }
    }, false);
    $dino.fail404 = function (override) {
      if ($dino.env == 'prod' && !override) {
        console.log('offline');
        $dino.app.navigate('offline', { trigger: true });
      }
    };
  };
  if ($dino.env == 'prod') {
    $dino.tpl.loadTemplateFile(tplCallback);
  } else {
    $dino.tpl.loadTemplates([
      'plusone-list-item',
      'appointment-list-item',
      'start-tutorial',
      'graph',
      'info-modify',
      'offline-exit',
      'severity-slider',
      'appointment-calendar',
      'condition-list-item',
      'bug-list-view',
      'bug-delete-dialog',
      'privacy',
      'condition-details',
      'condition-new',
      'login',
      'medical-info',
      'appointment-new',
      'signup',
      'start-splash',
      'list-view',
      'list-item',
      'list-new',
      'delete-confirm',
      'footer',
      'appointment-item'
    ], tplCallback);
  }
});;$dino = window.$dino || {};

// ==========================
// TEMPLATING FUNCTIONALITY
// ==========================
$dino.tpl = {
  templates: {},
  tplDir: 'tpl/',
  tplFile: 'templates.html',
  // used in dev
  loadTemplates: function (names, callback) {
    var that = this;
    var loadTemplate = function (index) {
      var name = names[index];
      //     console.log('Loading template: ' + name);
      $.ajax({
        url: that.tplDir + name + '.html',
        cache: false,
        success: function (data) {
          that.templates[name] = data;
          index++;
          if (index < names.length) {
            loadTemplate(index);
          } else {
            callback();
          }
        }
      });
    };
    loadTemplate(0);
  },
  // used in prod
  loadTemplateFile: function (callback) {
    var that = this;
    $.get('templates.html', function (data) {
      var tpls = $(data);
      for (var i = 0; i < tpls.length; i++) {
        var $tpl = $(tpls[i]);
        var id = $tpl.attr('id');
        var html = $tpl.html();
        that.templates[id] = html;
      }
      callback();
    });
  },
  get: function (name) {
    return this.templates[name];
  }
};

// ==========================
// SET API ROOT
// ==========================
var setApiPath = function() {
	var apiEnv = $dino.env
	, apiPath = '/api/v1';
	if (apiEnv == 'dev') $dino.apiRoot = 'https://localhost' + apiPath;
	else if (apiEnv == 'prod') $dino.apiRoot = 'https://jasonschapiro.com' + apiPath;
	else $dino.apiRoot = '';
	console.log('Set up API root "'+$dino.apiRoot+'" for environment '+apiEnv);
}();
// =========================
// SET UP OFFLINE STATUS
// =========================
// Defaults to online
$dino.offline = false;

// Always listening for changes
// TODO need to see if this works in phonegap
// Not implemented yet
$(window).on("offline", function(){
	$dino.offline = true;
//	if (apiEnv == 'prod') popupExit();
});
$(window).on("online", function(){
	$dino.offline = false;
});

// Function to ping and see if web server running
// requires CORS
// TODO not implemented yet
$dino.ping = function(){
/*	$.ajax({
		url: 'http://google.com',
		success: function(d){
			$dino.offline = false;
		},
		error: function(){
			$dino.offline = true;
			$dino.app.navigate("offline", {
				trigger : true
			});
		}
}); */
};	

// Turns first letter capital, used in formatting in app
String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};