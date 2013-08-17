window.AppointmentModifyView = Backbone.View.extend({
  initialize: function(){
    this.template = _.template(tpl.get('appointment-modify'));  
  },
  events: {
    "click #modBtn" : "modAppt"
  },
  
  modAppt: function(e) {
    e.preventDefault();
    if (this.$("#title").val() != ""){
      this.model.set("title", this.$("#title").val());
    }
    if (this.$("#select-bug").val() != "none"){
      this.model.set("bug", this.$("#select-bug").val());    
    }
    if (this.$("#select-doc").val() != "none"){
      this.model.set("doc", this.$("#select-doc").val());    
    }
    this.model.set("newDate", 
      moment(
        $("#appt-date").val()+" "+$("#appt-time").val()
      ).toDate()
    );
    this.model.set("date", 
      moment($("#appt-date").val()).format("YYYY-MM-DD")
    );
    this.model.set("doc", $("#select-doc").val());
    this.model.set("bug", $("#select-bug").val());
    
    this.model.save(null, {
      success: function(appt){
        console.log("New appt saved: "+appt.id);
        app.navigate("appts", {trigger: true});
      },
      error: function(appt, error){
        console.log("Failed to save appt, error: "+error.description);
        console.log(error);
      }
    });
  },
  
  preventDefault: function(e){
    e.preventDefault();
  },
  
  render: function(){
    var apptMoment = moment(this.model.get("newDate"));
    var data = { 
     // title, apptDate, apptTime, apptId
     "apptId" : this.model.id,
     "title" : this.model.get("title"),
     "apptDate" : apptMoment.format("YYYY-MM-DD"),
     "apptTime" : apptMoment.format("HH:mm:ss")
    };
    $(this.el).html(this.template(data));
    this.renderMenu("bug");
    this.renderMenu("doctor");    
    $(".ui-page").trigger("pagecreate");
    return this;  
  },
  
  // for bugs or doctors
  renderMenu: function(type){
    if (!(type == "doctor" || type == "bug")) {
      console.log("invalid type: "+type);
      return;
    }
    var item, query, selector, selected;
    if (type == "bug") {
      item = new BugList();
      query = Bug;
      selector = "#select-bug";
      selected = this.model.get("bug");
    } else {
      item = new DoctorList();
      query = Doctor;
      selector = "#select-doc";
      selected = this.model.get("doc");
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
        var selectThis;
	console.log(selected);
	_.each(coll['_byId'], function(v,k){
	  selectThis = (selected == k) ? "selected" : "";
          that.$(selector).append("<option "+selectThis+" value='"+k+"'>"+v.get("title")+"</option>");
        });
       // TODO add new item from menu
       // that.$(selector).append("<option id='newBug'>New Bug</option>");
       that.$(selector).selectmenu("refresh");
      },  
      error: function(coll, err){
        console.log(err);
      }
    });
  }
  
});
