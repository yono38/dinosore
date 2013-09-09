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
    
    logout: function(){
      Parse.User.logOut(null, {
        success: function(){
          $dino.app.navigate("", {trigger:true});
        }
      });
    },
    render: function () {
        var that = this;
        $(this.el).html(this.template());  
       // this.$("#myList").listview();
        this.collection.fetch({
          success: function(collection){
          	collection.comparator = that.sortList;
          	
          	collection.sort();
            for (var i=0; i<collection.length; i++){
              that.addOne(collection.models[i]);
            }
	      	that.$("#myList").listview('refresh');  
          }});
        console.log(this.collection);
        return this;
    }
});