window.$dino.HelpConditionView = Backbone.View.extend({
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
});