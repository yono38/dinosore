window.$dino.ListItemView = Backbone.View.extend({
  tagName: 'li',
  initialize: function (opts) {
    this.name = opts.name; // name represents type of item ex: 'medication'
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
    } else {
      console.log('retire this item');
      this.model.set('retired', true);
      // log a severity plusone of 0
      var retired_marker = new $dino.PlusOne();
      retired_marker.set({
      	item: this.model.id,
      	severity: 0,
      	user: Parse.User.current().id,
      	type: this.name
      });
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
	console.log('confirming delete');
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
  render: function () {
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
});