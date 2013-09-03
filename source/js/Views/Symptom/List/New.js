window.SymptomListNewView = Backbone.View.extend({
	
	tagName:"li",
	
	initialize:function(){
		this.template = _.template(tpl.get("symptom-list-new"));
		
	},
	
	render:function(){
		$(this.el).html(this.template());
		return this;
	}
});
