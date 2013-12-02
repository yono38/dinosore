window.$dino.InfoModifyView = $dino.NewFormView.extend({
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
});