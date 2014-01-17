window.$dino.PlusListView = Backbone.View.extend({
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
    //view.$el.trigger('pageinit');
    console.log('triggering indom on pluslistview');
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
    var that = this;
    // TODO fix dumb hack required for proper creation of sliders
    // after jquery mobile styling finished
    setTimeout(function() {
		that.renderList(that.first);
	}, 50);
    this.first = false;
    return this;
  }
});