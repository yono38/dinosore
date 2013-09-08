
window.$dino.NewApptView = Backbone.View.extend({
  initialize: function(){
    this.template = _.template(tpl.get('appointment-new'));  
    this.first = true;   
    this.priority = 1;
  },
  events: {
    "click #addBtn" : "addAppt"
  },
  addAppt: function(e){
    e.preventDefault();
    
    var appt = new $dino.Appointment({
      user: Parse.User.current(),
      date: this.$("#appt-date").val()
    });
    if (this.$("#title").val() != ""){
      appt.set("title", this.$("#title").val());
    }
    if (this.$("#select-bug").val() != "none"){
      appt.set("bug", this.$("#select-bug").val());    
    }
    if (this.$("#select-doc").val() != "none"){
      appt.set("doc", this.$("#select-doc").val());    
    }
    appt.set("newDate", 
      moment(
        $("#appt-date").val()+" "+$("#appt-time").val()
      ).toDate()
    );
    
    appt.save(null, {
      success: function(appt){
        console.log("New appt saved: "+appt.id);
        $dino.app.navigate("appts", {trigger: true});
      },
      error: function(appt, error){
        console.log("Failed to save appt, error: "+error.description);
        console.log(error);
      }
    });
  },
  
  // courtesy of o-o on stackoverflow
  yyyymmdd : function(date) {
   d = date || new Date();
   var yyyy = d.getFullYear().toString();
   var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = d.getDate().toString();
   return yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]); // padding
  },
  
  yyyymmdd_SlashConvert: function(str){
    var split = str.split('-');
    return split[1]+'/'+split[2]+'/'+split[0];
  },
  
  preventDefault: function(e){
    e.preventDefault();
  },
  
  render: function(){
    var todayDate = new Date();
    var data = { 
     "today" : this.yyyymmdd()
    };
    $(this.el).html(this.template(data));
    this.renderMenu("bug");
    this.renderMenu("doctor");    
    return this;  
  },
  
  // for bugs or doctors
  renderMenu: function(type){
    if (!(type == "doctor" || type == "bug")) {
      console.log("invalid type: "+type);
      return;
    }
    var item, query, selector;
    if (type == "bug") {
      item = new $dino.BugList();
      query = $dino.Bug;
      selector = "#select-bug";
    } else {
      item = new $dino.DoctorList();
      query = $dino.Doctor;
      selector = "#select-doc";
    }
    item.query = new Parse.Query(query);
    if (type == "bug") {
      item.query.equalTo("user", Parse.User.current());
    }
    var that = this;
    item.fetch({
      success: function(coll){
        console.log(coll);
        that.$(selector).html("<option value='none'>None</option>");        
        _.each(coll['_byId'], function(v,k){
          that.$(selector).append("<option value='"+k+"'>"+v.get("title")+"</option>");
        });
       // TODO add new item from menu
       // that.$(selector).append("<option id='newBug'>New Bug</option>");
      },  
      error: function(coll, err){
        console.log(err);
      }
    });
  }
  
});