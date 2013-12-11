window.$dino.PlusListAddButtonView = Backbone.View.extend({
	className : 'new-item-padding ui-bar ui-bar-f',
	tagName : 'div',
	templateStr : '<a href="#" data-role="button" data-iconshadow="false" data-inline="true" class="new-item ui-icon-alt ui-icon-nodisc" data-icon="plus" data-theme="f"><%= btnText %></a>',
	initialize : function(opts) {
		this.adding = false;
		opts = opts || {};
		this.addText = opts.addText || 'Add';
		this.cancelText = opts.cancelText || 'Cancel';
		this.template = _.template(this.templateStr);
		this.debug = opts.debug;
		this.id = opts.elId || '#new-item';
		_.bindAll(this, 'render', 'toggle');
	},
	events : {
		'click' : 'toggle',
		'click .new-item' : 'dontClick'
	},
	toggle : function(e) {
		this.adding = !this.adding;
		// toggle state
		this.render(true);
		this.trigger('toggle');
	},
	toggleButton : function(adding) {
		if (adding) {
			this.$('.new-item').addClass('cancelBtn');
			this.$el.addClass('cancelBtn');
		} else {
			this.$('.new-item').removeClass('cancelBtn');
			this.$el.removeClass('cancelBtn');
		}
		var btnIcon = adding ? 'delete' : 'plus';
		this.$('.new-item').buttonMarkup({
			icon : btnIcon
		});
	},
	dontClick : function(e) {
		e.preventDefault();
	},
	render : function(tgl) {
		var data = {
			'btnText' : this.adding ? this.cancelText : this.addText
		};
		if (!this.debug) {
			this.$el.html(this.template(data));
		}
		this.toggleButton(this.adding);
		return this;
	}
}); 