window.$dino.BugModifyView = Backbone.View.extend({

    initialize:function(){
        this.template = _.template(tpl.get('bug-details-modify'));
        _.bindAll(this, "deleteItem", "doneModifying", "addItem", "render");
        this.model.bind('change', this.render);
        this.colors = new $dino.ColorList();
        this.debounceSaveTextInput =  _.debounce(this.saveTextInput, 2000);
    },
    
    events: {
      "click .add_detail_item": "addItem",
      "click .delete_detail_item": "deleteItem",
      "click #doneModify": "doneModifying",
      "click #changeAssignedTo": "changeAssignedTo",
      "click #doneAssignment": "doneAssigning",
      "expand": "trackCollapsible",
      "keyup .bugDetailTxtInput": "debounceSaveTextInput",
      "change #select-choice-month": "savePriority",
      "click #deleteBug": "deleteBug",
      "change #select-color": "changeColor"
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
    
    loadColorList: function(selectedColor){
      var that = this;
      this.colors.fetch({
        success: function(collection) {
          $("#select-color").empty();
          collection.each(function(color) {
            var selected = "";
            if (selectedColor && selectedColor.id == color.id) selected = "selected";
            $("#select-color").append('<option '+selected+' value="' + color.id + '" style="background:#' + color.get("hex") + '" class="colorName">'+color.get("color")+'</option>');
          });
          $("#select-color").selectmenu("refresh", true);
          if (selectedColor){
            var background = $("#select-color option:selected").attr("style");
            $("#select-color").parent().attr("style", background);
          }
        },
         error: function(collection, error) {
	        // The collection could not be retrieved.
	        console.log(error);
      }
      });
  },
  
  loadList: function(type){
  	var that = this;
  	if (!this[type]){
  		var typeColl = (type == "symptom") ? new $dino.SymptomList() : new $dino.MedicationList();
	  	typeColl.fetch({
	  		data: { "user" : Parse.User.current().id }, 
	  		success: function(coll){
			  	that[type] = coll;
				that.makeList(type);
	  		}
	  	});
  	} else {
  		this.makeList(type);
  	}

  }, 
  
  makeList: function(type){
	console.log(this.$("#select-"+type));
	var coll = this[type];
	if (!coll){
		console.log('makeList called with no collection for type: '+type);
		return;
	}
  	coll.each(function(item){
		console.log('appending');
		this.$("#select-"+type).append('<option value="' + item.id + '">'+item.get("title")+'</option>');
	});
  },
    
    changeColor: function(e){
	   var selectedColorModel = this.colors.get(this.$("#select-color").val());
       this.model.save({
          "color": selectedColorModel.id
      });
    },
    
    trackCollapsible: function(e){
      this.openCollapsible = e.target.id;
    },
    
    deleteItem: function(e){
      e.preventDefault();
      // load typeArr if not loaded
      // find & remove using data-id
      // re-render
      var type = $(e.currentTarget).attr("data-type");      
      var id = $(e.currentTarget).attr("data-id");
      console.log(type, id);
      var typeItemArr = this.model.get(type);
      typeItemArr = _.filter(typeItemArr, function(item){
      	return item.id != id;
      });
      this.model.set(type, typeItemArr);
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
          $("#savePopup").show().delay(2000).fadeOut();
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
        "title": $("#bugTitleTxtInput").val(),
        "bugDetails": $("#bug_details_input").val(),
        "bugStatus": $("#bug_status_input").val(),
      }, {
        success: function(me){
          console.log("successful update");
          // cut off /modify
          var route = (window.location.hash).slice(0,-7);
          $dino.app.navigate(route, {trigger: true});
        }
      });
    },
    
    addItem: function(e){
      var itemType = $(e.currentTarget).data('type'),
       itemVal = this.$("#select-"+itemType).val(),
       itemTitle = this.$("#select-"+itemType+" option:selected").text();
      console.log(itemVal);
      if (itemVal && itemVal != ""){
        var typeItemArr = this.model.get(itemType);
        // defaults to false
        if (!typeItemArr) {
          typeItemArr = [];
        }
        var that = this;
        var type = itemType + 's';
        typeItemArr.push({
          		"title" : itemTitle,
          		"id" : itemVal
          });
        this.model.set(type, typeItemArr);
        console.log(this.model.toJSON());
        this.model.save(null, {
          success: function(){
            console.log(typeItemArr);
            that.render();
          }
        });
      }  
    },
    
    render: function() {
    	var that = this;
        var model = _.defaults(this.model.toJSON(), {
          "symptoms": [],
          "medications": [],
          "tests": [],
          "assignedTo": "Not Assigned"
        });
        $(this.el).html(this.template(model));
        if (this.model.get('color')) {
	      var color = new $dino.Color();
          color.id = this.model.get("color");
          color.fetch({
            success: function(col){
              that.loadColorList(col);  
            }
          });
        } else {
          this.loadColorList();
        }
        this.loadList('symptom');
        this.loadList('medication');
        this.dialog = this.dialog || new $dino.BugModifyDialogView({model: this.model});
        this.dialog.render();
        this.$("#deleteDialog").html(this.dialog.el);
        this.$("#savePopup").hide();
        $(".ui-page").trigger("pagecreate");
        if (this.openCollapsible){
          $("#"+this.openCollapsible).trigger("expand");
        }
        return this;
    }

});

