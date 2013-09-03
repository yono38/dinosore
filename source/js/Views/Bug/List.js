window.BugListView = Backbone.View.extend({
    
    initialize:function () {
        this.template = _.template(tpl.get('bug-list'));   
        _.bindAll(this, 'render'); 
        this.collection = new BugList();
    },    
    
    sortList: function(bug){
    	return -bug.get("bugPriority");
    },
    
    events: {
      'click #logout' : 'logout',
      'click #medInfo' : 'medInfo',
      'click #newBug' : 'newBug'
    },
    
    newBug: function(){
      app.navigate("bugs/add", {trigger: true});
    },
    
    medInfo: function(){
      app.navigate("medinfo", {trigger: true});
    },
    
    addOne: function(bug){
      var view = new BugListItemView({model: bug, name:'cutiebear'});
      this.$("#myList").append(view.render().el);  
      this.$("#myList").listview('refresh');  
    },
    
    logout: function(){
      Parse.User.logOut(null, {
        success: function(){
          app.navigate("", {trigger:true});
        }
      });
    },
    render: function () {
        console.log(this);
        
        var that = this;
        $(this.el).html(this.template());  
        this.collection.query = new Parse.Query(Bug);
        this.collection.query.equalTo("user", Parse.User.current());   
        this.collection.fetch({
          success: function(collection){
          	collection.comparator = that.sortList;
          	
          	collection.sort();
            for (var i=0; i<collection.length; i++){
              that.addOne(collection.models[i]);
            }
	      	this.$("#myList").listview('refresh');  
          }});
        console.log(this.collection);
        return this;
    }
});