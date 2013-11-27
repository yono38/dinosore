window.$dino.BugListView = $dino.PlusListView.extend({
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
});