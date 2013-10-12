window.$dino.StartSignupView = Backbone.View.extend({
	initialize : function() {
		this.template = _.template(tpl.get('signup'));
	},

	events : {
	},

	validateFieldsExist: function(){
		
	},
  
  signup: function(){
    var usr = this.$("#email").val();
    var pw = this.$("#password").val();
    var that = this;
   if (usr == "" || pw == ""){
    	this.$("#error").html("Email & Password Cannot Be Blank");
    	return;
    }
    Parse.User.signUp(usr, pw, {}, {
      success: function(user) {
      	var User = $dino.User(Parse.User.current().toJSON());
      	User.set("id", Parse.User.current().id);
      	User.save();
        $dino.app.navigate("symptoms", {trigger: true});
      }, 
      error: function(err){
        that.$("#error").html(err.message.toTitleCase());
      }
    });
  },
  

	render : function(eventName) {
		this.$el.html(this.template());
		return this;
	}
}); 
