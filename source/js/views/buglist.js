
window.BugListView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('bug-list'));   
        _.bindAll(this, 'render'); 
        this.collection = new BugList();
    //    this.collection.on("all", this.render);
        this.collection.on("add", this.addOne);
        
        
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
      var view = new BugItemView({model: bug});
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
            // This code block will be triggered only after receiving the data.
            console.log(collection.toJSON()); 
            for (var i=0; i<collection.length; i++){
              that.addOne(collection.models[i]);
            }
          }});
        console.log(this.collection);
        return this;
    }
});

window.BugItemView = Backbone.View.extend({

    tagName:"li",

    initialize:function () {
        this.template = _.template(tpl.get('bug-item'));
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

window.NewBugView = Backbone.View.extend({
  initialize: function(){
    this.template = _.template(tpl.get('add-bug'));  
  },
  events: {

  },
  preventDefault: function(e){
    console.log(($(this)[0]).el);
    $(($(this)[0]).el).css("background", "red");
    e.preventDefault();
  },
  choosePriority: function(e){
    console.log($(this));
    
   // console.log($(this).css("background", "red"));
   // $(this).checkboxradio('enable');
  },
  render: function(){
    $(this.el).html(this.template());
    return this;  
  }
  
});

window.MedicalInfoView = Backbone.View.extend({

  initialize:function(){
    this.template = _.template(tpl.get('med-info'));
  },
  render: function(eventName){
    $(this.el).html(this.template());
    return this;
  }

});
