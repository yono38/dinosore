// Temporary view until caching implemented
window.$dino.OfflineExitView = Backbone.View.extend({
	initialize : function(options) {
		this.template = _.template(tpl.get('offline-exit'));
		this.$el.attr("data-theme", "a");
	},

	events : {
		"click #exit" : "exit"
	},

	exit : function(e) {
		e.preventDefault();
		if (navigator.app) {
			try {
				navigator.app.exitApp();
			} catch (err) {
				alert("Well shucks, looks like we failed to exit. Would you be a darling and close the app for us?");
			}
		} else {
			alert("Well shucks, looks like we failed to exit. Would you be a darling and close the app for us?");
		}

	},

	render : function() {
		this.$el.html(this.template());
	}
}); 