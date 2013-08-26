window.NewBugView = Backbone.View.extend({
  initialize: function(){
    this.template = _.template(tpl.get('bug-new'));  
    this.first = true;   
    this.priority = 1;
    _(this).bindAll("addBug", "changePriority");
  },
  events: {
    "click #addBtn" : "addBug",
    "click .ui-radio": "changePriority"
  },
  changePriority: function(){
    var that = this;
    setTimeout(function(){
		that.priority = $(".ui-radio-on").prev().val() || 1;
    }, 200);
  },
  addBug: function(e){
  	e.preventDefault();
    var bug = new Bug({
      bugPriority: parseInt(this.priority),
      user: Parse.User.current()
    });
    if (this.$("#bugtitle").val() != ""){
      bug.set("title", this.$("#bugtitle").val());
    }
    if (this.$("#bugdetails").val() != ""){
      bug.set("bugDetails", this.$("#bugdetails").val());    
    }
    if (this.$("#assignedto").val() != ""){
      bug.set("assignedTo", this.$("#assignedto").val());    
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