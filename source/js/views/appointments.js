window.AppointmentsView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('appointments'));
        _.bindAll(this, 'highlightAppt');
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
      "click .has-appt" : "showAppts"
    },
    
    addAppt: function(){
      app.navigate("#appts/add", {trigger:true});
      // bad practice!
      $(".hasDatepicker").hide();
    },

    showAppts: function(){
      setTimeout(function(){$("#fakeAppt").show();$("#noAppt").hide();
}, 2);     
    },
    
    preventDefault: function(e){
      e.preventDefault();
      $("#fakeAppt").hide();
      $("#noAppt").show();
      console.log($(this));
    },
    
    selectDate: function(dateText, inst){
      console.log("selected date: "+dateText);
      $(".ui-controlgroup-label").html(dateText);
   //   console.log(inst);
   
    },
    
    testDates: function(){
      return [ new Date(2013, 5, 18), new Date(2013, 5, 5), new Date(2013, 6, 1), new Date(2013, 5, 29)];
    },
    
    // this is called every time a button clicked - inefficient (do better algorithm to scale)
    highlightAppt: function(date) {
   //   console.log(this);
      var dates = this.testDates();
      for (var i = 0; i < dates.length; i++) {
            if (dates[i].getDate() == date.getDate() && dates[i].getMonth() == date.getMonth()) {
          //    console.log('has appt ');    
         //     console.log(date);
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
  addAppt: function(){
    var appt = new Appointment({
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
    appt.save(null, {
      success: function(appt){
        console.log("New appt saved: "+appt.id);
        app.navigate("list", {trigger: true});
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
  
  preventDefault: function(e){
    e.preventDefault();
  },
  render: function(){
   var todayDate = new Date();
   var data = { 
    "today" : this.yyyymmdd()
    };
    $(this.el).html(this.template(data));
  //  this.$("#appt-date").bind("create")
    //$( "#appt-date" ).datepicker( "setDate", "10/12/2012" );
    return this;  
  }
  
});