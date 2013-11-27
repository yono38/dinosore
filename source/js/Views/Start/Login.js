window.$dino.StartLoginView = Backbone.View.extend({
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
      success: function (user) {
        var usr = new $dino.User(user.toJSON());
        usr.id = Parse.User.current().id;
        usr.save();
        $dino.app.navigate('bugs', { trigger: true });
      },
      error: function (usr, err) {
        that.$('#error').html(err.message.toTitleCase());
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