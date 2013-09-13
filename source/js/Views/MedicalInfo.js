window.$dino.MedicalInfoView = Backbone.View.extend({

  initialize:function(){
    this.template = _.template(tpl.get('medical-info'));
  },
  render: function(eventName){
    $(this.el).html(this.template());
    return this;
  }

});