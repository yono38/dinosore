window.SymptomListView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('symptom-list'));   
        _.bindAll(this, 'render', 'addToCollection'); 
        this.collection = new SymptomList();
    },    
    
    sortList: function(bug){
    	return -bug.get("count");
    },
    
    events: {
      'click #logout' : 'logout',
      'click #newSymptom' : 'newSymptom',
      'click #newSymptomLi' : 'dontClick'
    },
    
    dontClick:function(e){
    	e.preventDefault();
    },
    
    newSymptom: function(e){
    	e.preventDefault();
    	var newSymptomListItem = new SymptomListNewView();
      	newSymptomListItem.bind('newItem', this.renderList);
    	console.log(newSymptomListItem);
    	this.$("#myList").append(newSymptomListItem.render().el);
    	this.$("#myList").listview('refresh');
   		$("#newSymptomInput").textinput();
    },
    
    addOne: function(symptom){
    	console.log("berzo adds poop to scoopah");
      	var view = new SymptomListItemView({model: symptom});
     	this.$("#myList").append(view.render().el);  
    },
    
    logout: function(){
      Parse.User.logOut(null, {
        success: function(){
          app.navigate("", {trigger:true});
        }
      });
    },
    
    renderList: function() {
    	var that = this;
    	this.$("#myList").empty();
    	this.collection.query = new Parse.Query(Symptom);
        this.collection.query.equalTo("user", Parse.User.current());   
        this.collection.fetch({
       
          success: function(collection){
          	
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
        $(this.el).html(this.template());  
        this.renderList();
        return this;
    }
});