window.$dino.PlusOneListView = $dino.PlusListView.extend({
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
});