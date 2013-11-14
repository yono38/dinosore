window.$dino.PlusOneListItemView = Backbone.View.extend({
	tagName: 'li',
	className: 'plus-one-item',
	
	initialize: function(opts) {
		var templateName = opts.template || 'plusone-list-item';
		this.template = _.template(tpl.get(templateName));
	},
	
	render:function(){
		var that = this;
		var plusone_date = moment.unix(this.model.get("date")).format("dddd, MMMM Do YYYY, h:mm a");
		var tpl_data = 	{
			date: plusone_date
		};
		this.$el.html(this.template(tpl_data));
        return this;
	}		
});