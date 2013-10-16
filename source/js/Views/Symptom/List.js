window.$dino.SymptomListView = $dino.PlusListView.extend({
    
    afterInitialize: function(){
    },
    
    events: {
      'click .new-item' : 'dontClick',
      'click #new-symptom-padding' : 'newSymptom',
      'click #new-condition-padding' : 'newCondition',
      'pageinit' : 'loadedPage'
    },
    
    createAddButton: function(){
    	this.placeholder = "Symptom";
    	this.addingBtn = new $dino.PlusListAddButtonView({
    		addText: "Symptom",
    		elId: "new-symptom-padding"
    	});
    	this.$(".ui-block-a").html(this.addingBtn.render().el);
    	this.addingBtn.bind('toggle', this.newItem, this);
    },
       
    newSymptom: function(e) {
    	this.adding.symptom = !this.adding.symptom;
    	console.log('clicked new sypmtom');
    },
    
    newCondition: function(e) {
    	$dino.app.navigate("bugs/add", {
    		trigger: true
    	});
    	console.log('clicked new condition');
    },
    
	addOne : function(symptom) {
		var view = new $dino.SymptomListItemView({
			model : symptom
		});
		this.$("#myList").append(view.render().el);
	}

}); 