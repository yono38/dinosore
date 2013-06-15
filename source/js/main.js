Parse.initialize("ILMokni7fwKhJSdWh38cGPpEwL2CLsrhcrUgJmG6", "cDQoHLQqGRRj9srzrpG2jv6X5nl2BPdh7hVUBRoc");

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"start",
        "list":"list",
        "bugs/:id":"bugDetails",
    },

    initialize:function () {
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;

    },
    
    start:function() {
      if (Parse.User.current()){
        this.list();
      } else {
        this.changePage(new LoginView());
      }
    },

    list:function () {
      this.bugs = this.bugs || new BugList();
      this.bugs.query = new Parse.Query(Bug);
      this.bugs.query.equalTo("user", Parse.User.current());
      this.bugs.fetch();
      this.changePage(new BugListView({collection: this.bugs}));
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
    
    tpl.loadTemplates(['bug-list', 'bug-item', 'bug-details', 'add-bug-item', 'login'],
        function () {
            app = new AppRouter();
            Backbone.history.start();
        });
});
