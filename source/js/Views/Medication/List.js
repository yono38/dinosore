window.$dino.MedicationListView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('list-view'));   
        _.bindAll(this, 'render', 'renderList', 'addMedicationToList'); 
        this.collection = new $dino.MedicationList();
        this.collection.bind('destroy', this.renderList);
        this.adding = false;
    },    
    
    sortList: function(med){
    	return -med.get("count");
    },
    
    events: {
      'click #logout' : 'logout',
      'click #newItem' : 'newMedication',
      'click #newItemLi' : 'dontClick',
      'click #medication-detail' : 'dontClick'
    },
    
    dontClick:function(e){
    	e.preventDefault();
    },
    
    addMedicationToList: function(e){
    	if (e)	e.preventDefault();
    	if (this.newMedicationListItem){
			this.newMedicationListItem.remove();    	
			this.newMedicationListItem = null;
		}
   		this.$("#newItem .ui-btn-text").text("Add");
   		this.$("#newItem").removeClass("cancelBtn");
   		this.$("#newItem").buttonMarkup({ icon: "plus" });
		this.adding = false;
		this.renderList();
    },
    
    newMedication: function(e){
    	if (e) e.preventDefault();
    	if (!this.adding){
	    	this.newMedicationListItem = new $dino.ListNewView({
	    		modelType: $dino.Medication,
	    		header: "Medications"
	    	});
	      	this.newMedicationListItem.bind('newItem', this.addMedicationToList);
	    	this.$("#myList").prepend(this.newMedicationListItem.render().el);
	    	this.$("#myList").listview('refresh');
	   		this.$("#newItemInput").textinput().focus();
	   		this.$("#newItem .ui-btn-text").text("Cancel");
	   		this.$("#newItem").addClass("cancelBtn");
	   		this.$("#newItem").buttonMarkup({ icon: "delete" });
	   		this.adding = true;
   		} else if (this.newMedicationListItem) {
   			this.addMedicationToList();
   		}
    },
    
    addOne: function(Medication){
      	var view = new $dino.ListItemView({model: Medication, name: "medication"});
     	this.$("#myList").append(view.render().el);  
    },
    
    logout: function(){
      Parse.User.logOut(null, {
        success: function(){
          $dino.app.navigate("", {trigger:true});
        }
      });
    },
    
    renderList: function() {
    	var that = this;
    	this.$("#myList").empty();
    	this.collection.query = new Parse.Query($dino.Medication);
        this.collection.query.equalTo("user", Parse.User.current());   
        this.collection.fetch({
       
          success: function(collection){
          	if (collection.length ==0){
          		that.$("#myList").html('<span class="bobregular"><div>No Medications Added Yet!</div><hr> <div>Click "Add" Above to Get Started</div><hr></span>');
          		this.emptyCollection = true;
          		return;
          	}
          	
          	collection.comparator = that.sortList;
          	
          	collection.sort();
            for (var i=0; i<collection.length; i++){
              that.addOne(collection.models[i]);
            }
	      	that.$("#myList").listview();  
	      	that.$("#myList").listview('refresh');  
          }});
        return this;
    },
    
    render: function () {                
        $(this.el).html(this.template({"header":"Medications"}));  
        this.renderList();
        return this;
    }
});