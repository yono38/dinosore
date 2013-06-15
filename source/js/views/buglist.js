
window.BugListView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('bug-list'));    
     //   this.collection.listenTo("all", this.render, this);
    },

    render: function () {
        $(this.el).html(this.template());      
        return this;
    }
});

window.BugItemView = Backbone.View.extend({

    tagName:"li",

    initialize:function () {
        this.template = _.template(tpl.get('employee-list-item'));
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

window.LoginView = Backbone.View.extend({
  initialize: function() {
        this.template = _.template(tpl.get('login'));    
  },
  
  events: {
    'click #signupBtn' : 'signup',
    'click #loginBtn' : 'login'
  },
  
  signup: function(){
    var usr = this.$("#email").val();
    var pw = this.$("#password").val();
    var that = this;
    Parse.User.signUp(usr, pw, {
      success: function(user) {
        app.navigate("list", {trigger: true});
      }, 
      error: function(err){
        that.$("#error").html(err);
      }
    });
  },
  
  login: function(){
    var usr = this.$("#email").val();
    var pw = this.$("#password").val();
    var that = this;
    Parse.User.logIn(usr, pw, {
      success: function(user) {
        app.navigate("list", {trigger: true});
      }, 
      error: function(usr, err){
        that.$("#error").html(err);        
      }
    });  
  },
  
  render: function(){
    $(this.el).html(this.template());
    return this;
  }
});
