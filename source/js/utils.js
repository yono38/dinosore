$dino = window.$dino || {};

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
	else if (apiEnv == 'prod') $dino.apiRoot = 'https://api.dinoso.re' + apiPath;
	else if (apiEnv == 'test') $dino.apiRoot = 'http://localhost:5555' + apiPath;
	else $dino.apiRoot = '';
	console.log('Set up API root "'+$dino.apiRoot+'" for environment '+apiEnv);
}();
// =========================
// SET UP OFFLINE STATUS
// =========================
// Defaults to online
/*
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
//};	

// Turns first letter capital, used in formatting in app
String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};