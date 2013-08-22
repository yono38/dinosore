window.BugListView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('bug-list'));   
        _.bindAll(this, 'render'); 
        this.collection = new BugList();
    //    this.collection.on("all", this.render);
        this.collection.on("add", this.addOne);
           
    },
    
    sortList: function(bug){
    	console.log(bug);
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
      var view = new BugListItemView({model: bug});
      this.$("#myList").append(view.render().el);  
      $("#myList").listview('refresh');  
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
            // This code block will be triggered only after receiving the data.
            for (var i=0; i<collection.length; i++){
              that.addOne(collection.models[i]);
            }
          }});
        console.log(this.collection);
        return this;
    }
});