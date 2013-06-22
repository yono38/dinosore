window.AppointmentsView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('appointments'));
        _.bindAll(this, 'highlightAppt');
    },

    render:function (eventName) {
        $(this.el).html(this.template());  
        return this;
    },
    
    events: {
      "click" : "preventDefault",
      "click .has-appt" : "showAppts"
    },
    
    showAppts: function(){
      setTimeout(function(){$("#fakeAppt").show();}, 2);     
    },
    
    preventDefault: function(e){
      e.preventDefault();
      console.log($(this));
        $("#fakeAppt").hide();      
    },
    
    selectDate: function(dateText, inst){
      console.log("selected date: "+dateText);
      $("#currDate").html(dateText);
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
              return [true, 'has-appt'];
            }
      }
      return [true, ''];
  }

});
