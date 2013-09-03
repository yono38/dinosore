window.BugListItemView = Backbone.View.extend({
	
    tagName:"li",

    initialize:function () {
        this.template = _.template(tpl.get('bug-list-item'));
        this.model.bind("change", this.render, this);
        var color = this.model.get("color");
        if (color) this.setColor(color);
        this.model.bind("destroy", this.close, this);
        _.bindAll(this, "setColor");
    },
    
    setColor: function(color){
    	var that = this;
    	color.fetch({
    		success: function(c){
    			that.$el.attr("style", "background:#"+color.get("hex"));
    		}
    	});
    },

    render:function (eventName) {
    	console.log(this.model.toJSON());
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});