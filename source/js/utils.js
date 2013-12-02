$dino = window.$dino || {};
$dino.tpl = {
  templates: {},
  tplDir: 'tpl/',
  tplFile: 'templates.html',
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
String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};