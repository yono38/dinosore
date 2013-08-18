Parse.initialize("ILMokni7fwKhJSdWh38cGPpEwL2CLsrhcrUgJmG6", "cDQoHLQqGRRj9srzrpG2jv6X5nl2BPdh7hVUBRoc");

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"start",
        "bugs/add" : "newBug",
        "bug/:id":"bugDetails",
        "bug/:id/modify": "bugModify",
        "bug/:id/modify/dialog": "bugDialog",        
        "appts": "appts",        
        "appts/:id/modify": "apptModify",
        "appts/add" : "newAppt",
        "list":"list",        
        "medinfo": "medInfo" 
    },
    
    initialize:function () {
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;

    },
    
    bugDialog: function(id){
      var self = this;
      this.loadBug(id, function(data){
        console.log("view bug details");
        self.changePage(new BugModifyDialogView({model:data}));
      });      	
    },
    
    newAppt: function(){
      this.changePage(new NewApptView());
    },
    
    newBug: function(){
      this.changePage(new NewBugView());
    },
    
    medInfo: function(){
     this.changePage(new MedicalInfoView());
    },
    
    appts: function(){
      var apptView = new AppointmentsView();
      this.changePage(apptView);
      $("#date").hide();
      $(".hasDatepicker").off().remove();
    },
    
    apptModify: function(id){
      var self = this;
      var appt = new Appointment({objectId:id});
      appt.fetch({
        success: function(data){
          console.log("modify appt");
          self.changePage(new AppointmentModifyView({model:data}));
	  $("#date").hide();
	  $(".hasDatepicker").off().remove();
        },
        error: function(data, err){
          console.log(err);
        }
      });
    },
    
    start:function() {
      if (Parse.User.current()){
        this.list();
      } else {
        this.changePage(new LoginView());
      }
    },

    list:function () {
      this.changePage(new BugListView());
    },
    
    loadBug: function(id, callback){
      console.log("loading bug "+id);
        var bug = new Bug({objectId:id});
        console.log(bug);
    //    _.bind(callback, this);
        bug.fetch({
            success:function (data) {
                callback(data);
            }
        });    
    },

    bugDetails:function (id) {
      var self = this;
      this.loadBug(id, function(data){
        console.log("view bug details");
        self.changePage(new BugDetailView({model:data}));
      });  
    },
    
    bugModify:function (id) {
      var self = this;
      this.loadBug(id, function(data){
        console.log("modify bug details");
        self.changePage(new BugModifyView({model:data}));
      });    
    },

    changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        if (page.collection) page.collection.fetch();
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }
});

$(document).ready(function () {
    
    tpl.loadTemplates(['bug-list', 'appointment-calendar', 'bug-delete-dialog', 'bug-list-item', 'bug-details', 'bug-new', 'login', 
    'medical-info', 'appointment-new', 'bug-details-modify', 'appointment-modify', 'appointment-item'],
        function () {
            app = new AppRouter();
            Backbone.history.start();
        });
});

