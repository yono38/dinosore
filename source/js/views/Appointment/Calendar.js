window.AppointmentsView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('appointment-calendar'));
        this.collection = new AppointmentList();
        this.collection.query = new Parse.Query(Appointment);
        this.collection.query.equalTo("user", Parse.User.current());   
        var that = this;
        this.collection.fetch({
          success: function(collection){
            // This code block will be triggered only after receiving the data.
            console.log(collection.toJSON()); 
            for (var i=0; i<collection.length; i++){
              var t = moment(collection.models[i].get("newDate")).add('days', 1);
      //        console.log(t);              
            }
            $( "input[type='date']").after( $( "<div />" ).datepicker({ altField: "#" + $(this).attr( "id" ), showOtherMonths: false, onSelect: that.selectDate, beforeShowDay: that.highlightAppt}))
          }});        
        _.bindAll(this, 'highlightAppt', 'selectDate');
    },

    render:function (eventName) {
        $(this.el).html(this.template());  
        var that = this;

        this.$("#checkbox-6").on( "checkboxradiocreate", function( event, ui ) {
          $(this).bind("click", that.addAppt);
        });
        return this;
    },
    
    events: {
      "click" : "preventDefault",
      "click .has-appt" : "showAppts",
      "click .removeAppt" : "removeAppt",
      "click .editAppt" : "modifyAppt"
    },

    modifyAppt: function(){
      var apptId = this.$(".editAppt").attr("data-apptId");
      console.log("Time to modify appt id: "+apptId);
      var query = new Parse.Query(Appointment);
      query.get(apptId, {
        success: function(appt){
          app.navigate("appts/"+apptId+"/modify", {trigger: true});
        },
        error: function(appt, err){
          console.log("appointment retrieval failed");
          console.log(err);
        }
      });
    },
    
    removeAppt: function(){
      var apptId = this.$(".removeAppt").attr("data-apptId");
      console.log("Time to remove appt id: "+apptId);
      var query = new Parse.Query(Appointment);
      query.get(apptId, {
        success: function(appt){
          appt.destroy({
            success: function(appt){
              console.log("appointment successfully removed");
            },
            error: function(appt, err){
              console.log("appointment removal failed");
              console.log(err);
            }
          })
        },
        error: function(appt, err){
          console.log("appointment retrieval failed");
          console.log(err);
        }
      });
    },
    
    addAppt: function(){
      app.navigate("#appts/add", {trigger:true});
      // bad practice!
      $(".hasDatepicker").hide();
    },

    showAppts: function(){
      setTimeout(function(){
        $("#fakeAppt").show();
        $("#noAppt").hide();
      }, 2);     
    },
    
    preventDefault: function(e){
      e.preventDefault();
      $("#fakeAppt").hide();
      $("#noAppt").show();
    },
    
    selectDate: function(dateText, inst){
      var appts = this.collection.toJSON();
      var d = _(appts).where({"date": dateText});
      if (d.length == 1){
        var day = moment(d[0].newDate.iso);
        console.log(day);
        var doc = new Parse.Query(Doctor);
        doc.get(d[0].doc, {
          success: function(doctor) {
            var apptData = {
              "title" : d[0].title,
              "doc" : doctor.get("title"),
              "time" : day.format('LT'),
              "apptId" : d[0].objectId
            };
            $("#fakeAppt").html(_.template(tpl.get("appt"), apptData)); 
            this.$(".removeAppt").button();
            this.$(".editAppt").button();
          },
          error: function(obj, err){
            console.log("failed to retrieve doctor");
          }
        });
      }
      $(".ui-controlgroup-label").html(dateText);
    },
    
    // this is called every time a button clicked - inefficient (do better algorithm to scale)
    highlightAppt: function(date) {
   //   console.log(this);
    //  var dates = this.testDates();
      var thisDate = moment(date);
      for (var i = 0; i < this.collection.length; i++) {
        var iterDate = moment(this.collection.models[i].get("newDate"));
            if (thisDate.isSame(iterDate, 'day')) {
              $("#noAppt").hide();
              return [true, 'has-appt'];
            }
      }
      return [true, ''];
  }

});
window.NewApptView = Backbone.View.extend({
  initialize: function(){
    this.template = _.template(tpl.get('app'));  
    this.first = true;   
    this.priority = 1;
  },
  events: {
    "click #addBtn" : "addAppt"
  },
  addAppt: function(e){
    e.preventDefault();
    
    var appt = new Appointment({
      user: Parse.User.current(),
      date: this.yyyymmdd_SlashConvert(this.$("#appt-date").val())
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
        app.navigate("appts", {trigger: true});
      },
      error: function(appt, error){
        console.log("Failed to save appt, error: "+error.description);
        console.log(error);
      }
    });
  },
  
  // courtesy of o-o on stackoverflow
  yyyymmdd : function() {
   var d = new Date();
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
      item = new BugList();
      query = Bug;
      selector = "#select-bug";
    } else {
      item = new DoctorList();
      query = Doctor;
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
