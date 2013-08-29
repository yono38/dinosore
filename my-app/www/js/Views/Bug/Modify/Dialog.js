window.BugModifyDialogView = Backbone.View.extend({
  id: "deleteDialog",
  initialize: function(options){
  	this.model = options.model;
    this.template = _.template(tpl.get('bug-delete-dialog'));
  },
  events: {
    "click #confirmDelete" : "deleteBug"
  },
  
  deleteBug: function(e){
    e.preventDefault();
    this.model.destroy({
      success: function(){
        console.log("bug deleted successfully");
        app.navigate("list", {trigger: true});
      },
      error: function(object, error) {
        console.log("Failed to delete");
      }
    });
  },
  
  render: function(){
    $(this.el).html(this.template({title:this.model.get("title")}));
    $(this.el).dialog({closeBtn: "none"});
  //  $( "#deleteDialog" ).dialog( "option", "closeBtn", "none" );
    
  }
});
