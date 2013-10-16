window.$dino.PlusListView = Backbone.View.extend({

    initialize:function (opts) {
    	_.extend(this, opts);
        this.template = opts.template || _.template(tpl.get('list-view'));   
        _.bindAll(this, 'render', 'renderList', 'addItemToList'); 
        this.collection.bind('destroy', this.renderList);
        this.adding = false;
        this.loading = true;
        if (this.afterInitialize) this.afterInitialize();
    },    
    
    sortList: function(item){
    	return -item.get("count");
    },
    
    events: {
      'pageinit' : 'loadedPage'
    },
    
    loadedPage: function(){
        this.loading = false;
    },
    
    dontClick:function(e){
    	e.preventDefault();
    },
    
    addItemToList: function(e, opts){
    	if (e)	e.preventDefault();
    	if (this.newListItem){
			this.newListItem.remove();    	
			this.newListItem = null;
		}
		this.addingBtn.adding = false;
		this.addingBtn.render();
		this.renderList();
    },
    
    newItem: function(){
    	console.log(this.addingBtn);
    	if (this.addingBtn.adding){
    		var itemData = {
    			modelType: this.modelType,
    			header: this.placeholder || this.header
    		};
	    	this.newListItem = new $dino.ListNewView(itemData);
	      	this.newListItem.bind('newItem', this.addItemToList);
	    	this.$("#myList").prepend(this.newListItem.render().el);
	    	this.$("#myList").listview('refresh');
	   		this.$("#newItemInput").textinput().focus();
   		} else if (this.newListItem) {
			this.newListItem.remove();    	
			this.newListItem = null;
  		}
    },
    
    addOne: function(Item){
      	var view = new $dino.ListItemView({model: Item, name: this.name});
     	this.$("#myList").append(view.render().el);  
    },
    
    renderList: function(firstTime) {
    	var that = this;
    	this.$("#myList").empty();
        this.collection.fetch({
      	  data: { "user" : Parse.User.current().id }, 
          success: function(collection){
          	if (collection.length ==0){
          		that.$("#myList").html('<span id="no-items-yet" class="fancyFont"><div>No '+that.header+' Added Yet!</div><hr> <div>Click "Add" Above to Get Started</div><hr></span>');
          		return;
          	}
          	
          	collection.comparator = that.sortList;
          	
          	collection.sort();
            for (var i=0; i<collection.length; i++){
              that.addOne(collection.models[i]);
            }
            if (!that.loading){
		      	that.$("#myList").listview();  
		      	that.$("#myList").listview('refresh'); 
	        }
          },
          error: function(err, data){
          	$dino.fail404();
          }
          });
        return this;
    },
    
    createAddButton: function(){
    	this.addingBtn = new $dino.PlusListAddButtonView();
    	this.$("#addButton").html(this.addingBtn.render().el);
    	this.addingBtn.bind('toggle', this.newItem, this);
    },
    
    render: function () {                
        $(this.el).html(this.template({"header":this.header}));  
        if (!this.addingBtn) this.createAddButton();
        this.renderList(this.first);
        this.first = false;
        return this;
    }
});