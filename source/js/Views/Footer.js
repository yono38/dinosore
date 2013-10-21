window.$dino.FooterView = Backbone.View.extend({
	
  initialize: function() {
    this.template = _.template(tpl.get('footer'));    
  },
  
  events: {
	"click .footerBtn" : "navBtn"
  },
  
  navBtn: function(e){
  	var hash = $(e.currentTarget).attr("href");
  	console.log('going to '+hash);
  	if ($.inArray(hash, ['appts', 'info', 'bugs', 'symptoms', 'medications'] )){
  		$dino.app.navigate(hash, true);
  	}
  },
  
  render: function(){
    $(this.el).html(this.template());
    return this;
  }
});