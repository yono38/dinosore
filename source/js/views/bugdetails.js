window.BugDetailView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('bug-details'));
    },

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

window.BugModifyView = Backbone.View.extend({

    initialize:function(){
        this.template = _.template(tpl.get('bug-details-modificatio'));
        _.bindAll(this, "deleteItem", "doneModifying", "addItem", "render");
        this.model.bind('change', this.render);
        this.$('div[data-role="collapsible"]').bind('click', this.addDetailItem);
    },
    
    events: {
      "click .add_detail_item": "addItem",
      "click .delete_detail_item": "deleteItem",
      "click #doneModify": "doneModifying",
      "click #changeAssignedTo" : "changeAssignedTo",
      "click #doneAssignment" : "doneAssigning"
    },
    
    deleteItem: function(e){
      e.preventDefault();
      console.log(e);
      var item = ($(e.currentTarget).parent().children(".itemName"))[0];
      console.log($(item).text());
      var type = $(item).attr("data-type");
      
      this.model.remove(type, $(item).text());
    },
    
    changeAssignedTo: function(e){
      e.preventDefault();
      console.log($(e.currentTarget));
      $(e.currentTarget).parent().html('<input id="newAssignment" value="'+this.$("#assignedTo").text()+'" /><a href="#" id="doneAssignment" data-icon="check">Done</a>');
      this.$("#newAssignment").textinput();
      this.$("#doneAssignment").button();
  //    this.$("#doneAssigment").on('click', this.doneAssigning);
     },
     
    doneAssigning: function(e){
      e.preventDefault();
      console.log(e);
      var assign = this.$("#newAssignment").val();
      $(e.currentTarget).parent().html('<span id="assignedTo">'+assign+'</span> <a href="#" id="changeAssignedTo" iconpos="notext"  data-inline="true" data-mini="true" data-role="button" data-icon="back" >Change</a>');
      this.model.set("assignedTo", assign);
    },
    
    doneModifying: function(){
      this.model.save(null, {
        success: function(me){
          console.log("successful update");
        }
      });
    },
    
    addItem: function(e){
      var item = $(e.currentTarget).parent().siblings("td").children()[0];
      var itemName = $(item).val();
      if (itemName != ""){
        var type = $(item).attr("data-type");
        this.model.add(type, itemName);
      }
    },
    
    addDetailItem:function(){
      this.preventDefault();
      console.log('add bug detail item');
      console.log(this);
    },
    
    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        $(".ui-page").trigger("pagecreate");
       // setTimeout(function(){$(".ui-page").trigger("pagecreate");}, 2000);

        return this;
    }

});