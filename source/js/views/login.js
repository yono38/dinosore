window.LoginView = Backbone.View.extend({
  initialize: function() {
    this.template = _.template(tpl.get('login'));    
  },
  
  events: {
    'click #signupBtn' : 'signup',
    'click #loginBtn' : 'login',
    "keypress .ui-input-text"  : "tryLoginOnEnter",
    "popupafteropen #error" : "fadeError"
  },
  
  fadeError: function(e, ui){
  	$("#error").fadeTo(1600, 0.2);
  	setTimeout(function(){$("#error").popup("close");}, 1500);
  },
  
  tryLoginOnEnter: function(e) {
      if (e.keyCode == 13) this.login();
   },
    
  signup: function(){
    var usr = this.$("#email").val();
    var pw = this.$("#password").val();
    var that = this;
    Parse.User.signUp(usr, pw, {}, {
      success: function(user) {
        console.log("new user signup");
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
      	console.log('successful login');
        app.navigate("list", {trigger: true});
      }, 
      error: function(usr, err){
      	$("#error").css('opacity', 1)
        $("#error").html(err.message.toTitleCase());
        $("#error").popup("open");
      }
    });  
  },
  
  render: function(){
    $(this.el).html(this.template());
    return this;
  }
});
