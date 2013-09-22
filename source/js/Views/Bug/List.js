window.$dino.BugListView = Backbone.View.extend({
    
    initialize:function (opts) {
        this.template = _.template(tpl.get('bug-list'));   
        _.bindAll(this, 'render');
        this.collection = opts.collection;
    },    
    
    sortList: function(bug){
    	return -bug.get("bugPriority");
    },
    
    events: {
      'click #logout' : 'logout',
      'click #newBug' : 'newBug'
    },
    
    newBug: function(){
      $dino.app.navigate("bugs/add", {trigger: true});
    },
    
    addOne: function(bug){
      var view = new $dino.BugListItemView({model: bug});
      this.$("#myList").append(view.render().el);  
      this.$("#myList").listview('refresh');  
    },
    
    render: function () {
        var that = this;
        $(this.el).html(this.template());  
       // this.$("#myList").listview();
        this.collection.fetch({
          data: { "user" : Parse.User.current().id },
          success: function(collection){
          	collection.comparator = that.sortList;
          	
          	collection.sort();
            for (var i=0; i<collection.length; i++){
              that.addOne(collection.models[i]);
            }
	      	that.$("#myList").listview('refresh');  
          }});
        return this;
    }
});