
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
    this.first = true;   
    this.priority = 1;
  },
  events: {
    "click #addBtn" : "addBug",
    "create": "changePriority"
  },
  changePriority: function(){
    var that = this;
    $(this).click(function(){ 
      that.priority = $(this).val();
      console.log(that.priority);
    });
  },
  addBug: function(){
    var bug = new Bug({
      bugPriority: this.priority,
      user: Parse.User.current()
    });
    if (this.$("#bugtitle").val() != ""){
      bug.set("title", this.$("#bugtitle").val());
    }
    if (this.$("#bugdetails").val() != ""){
      bug.set("bugDetails", this.$("#bugdetails").val());    
    }
    if (this.$("#assignedto").val() != ""){
      bug.set("doctor", this.$("#assignedto").val());    
      bug.set("bugStatus", "Assigned");          
    }
    bug.save(null, {
      success: function(bug){
        console.log("New bug saved: "+bug.id);
        app.navigate("list", {trigger: true});
      },
      error: function(bugg, error){
        console.log("Failed to save bug, error: "+error.description);
        console.log(error);
      }
    });
  },
  preventDefault: function(e){
    console.log(($(this)[0]).el);
    $(($(this)[0]).el).css("background", "red");
    e.preventDefault();
  },
  render: function(){
    $(this.el).html(this.template());
    var that = this;
    if (this.first){
      this.first = false;
      $(this.el).find("input[type='radio']").checkboxradio({
       create: that.changePriority
      });
    }
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
