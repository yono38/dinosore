tpl = {

    // Hash of preloaded templates for the app
    templates:{},

	tplDir: 'tpl/',
	
    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment. All the template files should be
    // concatenated in a single file.
    loadTemplates: function (names, callback) {
        var that = this;
        $.get('templates.html', function (data) {
            var tpls = $(data);
            for (var i = 0; i < tpls.length; i++){
            	var $tpl = $(tpls[i]);
            	var id =$tpl.attr('id');
            	var html = $tpl.html();
            	that.templates[id] = html;            }
            callback();
        });
    },

    // Get template by name from hash of preloaded templates
    get: function (name) {
        return this.templates[name];
    }

};

String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

