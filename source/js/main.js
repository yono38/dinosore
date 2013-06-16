Parse.initialize("ILMokni7fwKhJSdWh38cGPpEwL2CLsrhcrUgJmG6", "cDQoHLQqGRRj9srzrpG2jv6X5nl2BPdh7hVUBRoc");

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"start",
        "bugs/add" : "newBug",
        "list":"list",
        "bugs/:id":"bugDetails",
        "medinfo": "medInfo"
    },
    
    initialize:function () {
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;

    },
    
    newBug: function(){
      this.changePage(new NewBugView());
    },
    
    medInfo: function(){
     this.changePage(new MedicalInfoView());
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

    bugDetails:function (id) {
        var bug = new Bug({id:id});
        var self = this;
        bug.fetch({
            success:function (data) {
                self.changePage(new BugDetailView({model:data}));
            }
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
    
    tpl.loadTemplates(['bug-list', 'bug-item', 'bug-details', 'add-bug', 'login', 'med-info'],
        function () {
            app = new AppRouter();
            Backbone.history.start();
        });
});

