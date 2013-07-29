Parse.initialize("ILMokni7fwKhJSdWh38cGPpEwL2CLsrhcrUgJmG6", "cDQoHLQqGRRj9srzrpG2jv6X5nl2BPdh7hVUBRoc");

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"start",
        "bugs/add" : "newBug",
        "appts/add" : "newAppt",
        "list":"list",
        "bug/:id":"bugDetails",
        "bug/:id/modify": "bugModify",
        "medinfo": "medInfo",
        "appts": "appts"
    },
    
    initialize:function () {
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;

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
    
    tpl.loadTemplates(['bug-list', 'app', 'item', 'bug-details', 'add-bug', 'login', 'med-info', 'appointments', 'bug-details-modificatio', 'appt'],
        function () {
            app = new AppRouter();
            Backbone.history.start();
        });
});

