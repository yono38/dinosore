window.FooterView = Backbone.View.extend({
	
  initialize: function() {
    this.template = _.template(tpl.get('footer'));    
  },
  
  events: {
	"click .footerBtn" : "navBtn"
  },
  
  navBtn: function(e){
  	var hash = $(e.currentTarget).attr("href");
  	if ($.inArray(hash, ['appts', 'medinfo', 'list', 'symptoms'] )){
  		app.navigate(hash, true);
  	}
  },
  
  render: function(){
    $(this.el).html(this.template());
    return this;
  }
});