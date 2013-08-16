window.BugDetailView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('bug-details'));
    },

    render:function (eventName) {
        var model = _.defaults(this.model.toJSON(), {
          "symptoms": false,
          "medications": false,
          "tests": false,
          "assignedTo": "Not Assigned"
        });
        console.log(model);    

        $(this.el).html(this.template(model));
        return this;
    }

});

window.BugModifyView = Backbone.View.extend({

    initialize:function(){
        this.template = _.template(tpl.get('bug-details-mod'));
        _.bindAll(this, "deleteItem", "doneModifying", "addItem", "render");
        this.model.bind('change', this.render);
        this.debounceSaveTextInput =  _.debounce(this.saveTextInput, 2000);
    },
    
    events: {
      "click .add_detail_item": "addItem",
      "click .delete_detail_item": "deleteItem",
      "click #doneModify": "doneModifying",
      "click #changeAssignedTo" : "changeAssignedTo",
      "click #doneAssignment" : "doneAssigning",
      "expand": "trackCollapsible",
      "keyup .bugDetailTxtInput": "debounceSaveTextInput",
      "change #select-choice-month": "savePriority"
    },
    
    savePriority: function(e){
      this.model.save({
        "bugPriority": parseInt($("#select-choice-month").val())
      }, {
        success: function(){
          console.log('priority input saved');
        }
      });
    },
    
    trackCollapsible: function(e){
      this.openCollapsible = e.target.id;
    },
    
    deleteItem: function(e){
      e.preventDefault();
      var item = ($(e.currentTarget).parent().children(".itemName"))[0];
      var type = $(e.currentTarget).attr("data-type")
      this.model.remove(type, $(item).text());
      var that = this;
      this.model.save(null, {
        success: function(){
          that.render();
        }
      });
    },
    
    saveTextInput: function(e){    
      this.model.save({
        "title": $("#bugTitleTxtInput").val(),
        "bugStatus": $("#bug_status_input").val(),
        "bugDetails": $("#bug_details_input").val()
      }, {
        success: function(){
          console.log('text input saved');
        }
      });
    },
    
    changeAssignedTo: function(e){
      e.preventDefault();
      $(e.currentTarget).parent().html('<input id="newAssignment" value="'+this.$("#assignedTo").text()+'" /><a href="#" id="doneAssignment" data-icon="check">Done</a>');
      this.$("#newAssignment").textinput();
      this.$("#doneAssignment").button();
     },
     
    doneAssigning: function(e){
      e.preventDefault();
      var assign = this.$("#newAssignment").val();
      $(e.currentTarget).parent().html('<span id="assignedTo">'+assign+'</span> <a href="#" id="changeAssignedTo" iconpos="notext"  data-inline="true" data-mini="true" data-role="button" data-icon="back" >Change</a>');
      this.model.set("assignedTo", assign);
    },
    
    doneModifying: function(e){
      e.preventDefault();
      this.model.save({
        "bugDetails": $("#bug_details_input").val(),
        "bugStatus": $("#bug_status_input").val()
      }, {
        success: function(me){
          console.log("successful update");
          // cut off /modify
          var route = (window.location.hash).slice(0,-7);
          app.navigate(route, {trigger: true});
        }
      });
    },
    
    addItem: function(e){
      var item = $(e.currentTarget).parent().siblings("td").children()[0];
      var itemName = $(item).val();
      if (itemName != ""){
        var type = $(item).attr("data-type");
    //    this.model.add(type, itemName);
        var typeItemArr = this.model.get(type);
        // defaults to false
        console.log(typeItemArr);
        if (!typeItemArr) {
          typeItemArr = [];
        }
        var that = this;
        console.log(type);
        console.log(typeItemArr);
        this.model.save({
          type: typeItemArr.push(itemName)
        }, {
          success: function(){
            console.log(typeItemArr);
            console.log(that.model);
            that.render();
          }
        });
      }
    },
    
    render: function() {
        var model = _.defaults(this.model.toJSON(), {
          "symptoms": [],
          "medications": [],
          "tests": [],
          "assignedTo": "Not Assigned"
        });
        console.log(model);
        $(this.el).html(this.template(model));
        $(".ui-page").trigger("pagecreate");
        if (this.openCollapsible){
          $("#"+this.openCollapsible).trigger("expand");
        }
        return this;
    }

});
