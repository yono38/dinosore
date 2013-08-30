//Backbone.View -- like inheriting from the baseline backbone view
window.BugListView = Backbone.View.extend({

//basically: initialize = key, function is the value
//this refers the backbone.view.extend object,

//initialize is a backbone thing - knows to run on instantiation
//need to use this.(insert key) because inside of object
//"_word_:_value_" - word is basically a variable to hold the contents beyond the colon
    
    initialize:function () {
    	//template is an underscore thing, _ = $, backbone runs off of underscore
    	//this.template is the same as template:.... but written like this
    	//because its initialized within a function
    	//if do this.classNAme, would override classname outside of this function -
    	//global within this object
    	//if use var template = ... , template would only exist inside of this function
    	//becuase using this.template, it exists in the entirety of the backbone.view
    	//object
    	//in regular js, this would only refer to the object it's in, in  backbone,
    	//it refers to the whole backbone object it's in
    	//_.template is like a template function generator - it takes in a string of the
    	//html file name and looks for the words in the <%= %> and makes them variables.
    	//for example, if there are three shortcodes in the html file, template would take
    	//3 parameters to fulfill those variables
        this.template = _.template(tpl.get('bug-list'));   
        //ensures the this inside of render always refers to backbone object
        //render is a function in this view object
        //render can be called by multiple things
        //for example, when click on appointment in footer, only the footer
        //would be re-rendered if you didn't pass the appointment object into
        //the appropriate appointment render. It would automatically pass in 
        //the footer object to render instead of the appointment object otherwise
        _.bindAll(this, 'render'); 
        //collection holds multiple objects
        //BugList references buglist in bug.js -- window.buglist in bug.js means global
        this.collection = new BugList();
    //    this.collection.on("all", this.render);
    //this.on is listening for an event inside the backbone object
    //the event is the first parameter. it starts listening for this event, 
    //creates an event listener - add gets triggered when a model isadded to the 
    //buglist collection (from bug.js), add is a backbone thing, 
    //when this action is triggered, call the addOne function.
    //sometimes you only want to create these types of listeners when certain
    //events happen and then you wouldnt just put them in the events:{} object
    //example: you have dialog box open up, you'd want to create a listner on 
    //the x on that specific close box
        this.collection.on("add", this.addOne);
    /*   
    in this case, this just listens for poopah to be triggered within backbone
    view object - triggered if do this.trigger('poopah') inside any other function
    
     
        this.on('poopah', function(){
        	console.log('you a scoopah');
        });
        this.trigger('poopah');
   */        
    },    
    
    //bug is an item - comparator (where its called) runs a for each loop
    //and bug is the for each... for each bug
    sortList: function(bug){
    	//tells to sort by bugPriority (called from comparator line)
    	// - = descending order
    	return -bug.get("bugPriority");
    },
    
    //this setup for events is  bacbone thing
    events: {
    	//same as this.on('click #logout', this.logout)
    	//sets up set of listeners when view is initially created
    	//so whenever it hears these events, it calls these functions
      'click #logout' : 'logout',
      'click #medInfo' : 'medInfo',
      'click #newBug' : 'newBug'
    },
    
    newBug: function(){
    	//navigate changes your address to another address - backbone thing
    	// when someone clicks new bug, it will take you to the bug/add page
    	//html for bugs/add page is in main.js
    	//trigger:true means bugs/add event is triggered
    	//app is a router object - the bugs/add event is in main.js under routes
    	//object, knows to look there because app.
    	//routes looks like events - automatically starts at setup ish
    	//routes looks inside of address bar (url) but events looks inside browser itself
    	//for click events
      app.navigate("bugs/add", {trigger: true});
    },
    
    medInfo: function(){
      app.navigate("medinfo", {trigger: true});
    },
    
    
    //called when add a new model into the collection
    addOne: function(bug){
    	//takes in new bug that was added and initializes buglistitemview
    	//(which is in item.js)
    	//takes in bug - so the this's in item.js refer to this bug
    	//have to use model: bug becausek need to pass in key value object 
    	//so then inside of item.js, can reference this.model
    	//have to pass in the model because it doesnt' exist until the addOne
    	//function is run
    	//this.model is referenced in item.js so it is expecting it from this
    	//function
      var view = new BugListItemView({model: bug, name:'cutiebear'});
      	//.el is an html string representation fo the current string of that
      	//views html
      	//view.render() takes in the template and model and forms the 
      	//finished template. el is the actual html string of the finished tempalte
      	//basically, this line appends the html of the page to mylist and refreshes
      	//the page to update after adding a bug
      	//buglist view is one type of page so its a child view of the router
      	//the item views are the children views of the list (contained wqithint the list)
      	//so the larger list calls render on the items
      	//knows to call render on the item list view because view is created above
      this.$("#myList").append(view.render().el);  
      $("#myList").listview('refresh');  
    },
    
    logout: function(){
      Parse.User.logOut(null, {
      	//if there is a succesfull logout, navigate to the empty hash event in the router
        //google.com/backbone = google.com/backbone# = empty hash compared to 
        //google.com/backboone#ber
        //success needs to be called because parse is asynchronous
        //callback function: gets called with the contents of whatever
        //your asynchronous ajax call receives
        //if the function succeeds, calls success, if error, calls errors - 
        //looks for those keys
        success: function(){
          app.navigate("", {trigger:true});
        }
      });
    },
//render gets called int eh router
    render: function () {
        console.log(this);
        
        var that = this;
        //this.trigger('poopah');
        //take the string that comes out of template function and
        //replace this.el with the template html
        //creates frame for the buglist, so we make the frame before
        //adding the information from parse below
        $(this.el).html(this.template());  
        //patter to follow when pulling down a colelction from parse
        //gets the bug collection
        this.collection.query = new Parse.Query(Bug);
        this.collection.query.equalTo("user", Parse.User.current());   
        this.collection.fetch({
        //can't add items until the list exists, so this is after the template
        //html gets put into the .el html
          success: function(collection){
          	//comparator, does a for each and runs that.sortList
          	//and evaluates the return values from sortList
          	//comparator just says that its sorting and sortlist tells it how to sort
          	//backbone thing
        	//this gets overwritten in the inner success call
        	//when put a function inside of a backbone function inside the view
        	//this gets lost
        	//in general if you do a function inside of a function (encapsulation)
        	//the this, or any variable in the inner function is only visibile inside
        	//the inner function
          	collection.comparator = that.sortList;
          	
          	collection.sort();
            // This code block will be triggered only after receiving the data.
            for (var i=0; i<collection.length; i++){
              that.addOne(collection.models[i]);
            }
          }});
        console.log(this.collection);
        //return this so you can do chaining, liek view.render.el, this menas
        //you can have view.render.e;aslkdjf
        return this;
    }
});