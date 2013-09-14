window.$dino.ListNewView = Backbone.View.extend({
	
	tagName:"li",
	
	initialize:function(opts){
		this.template = _.template(tpl.get('list-new'));
		this.modelType = opts.modelType; // ex $dino.Medication
		this.header = opts.header; // "Medication"
	},
	
	events: {
		'click' : 'noClick',
		'click .add-one': 'createNew',
		'keypress #newItemInput' : 'addOnEnter'
	},
	
	noClick: function(e){
		e.preventDefault();
	},
	
	destroy: function(){
		this.unbind();
		this.remove();
	},
	
	addOnEnter: function(e){
	  if (e.keyCode == 13) this.createNew();
	},
	
	focus: function(){
		$(this.el).focus();
	},
	
	createNew: function(e){
		if (e) e.preventDefault();
		if (this.$("#newItemInput").val() != ""){
			var med = new this.modelType({
				user: Parse.User.current(),
				title: this.$("#newItemInput").val()
			});
			var that = this;
			med.save(null, {
				success: function(item){
					console.log('item saved! great job!');
					that.trigger('newItem');
					that.remove();
				},
				error: function(err, item){
					console.log('item failed to save');
				}
			});
		}
	},
	
	render:function(){
		$(this.el).html(this.template({type: this.header}));
		return this;
	}
});
