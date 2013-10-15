window.$dino.PlusListView = Backbone.View.extend({

    initialize:function (opts) {
    	_.extend(this, opts);
        this.template = _.template(tpl.get('list-view'));   
        _.bindAll(this, 'render', 'renderList', 'addItemToList'); 
        this.collection.bind('destroy', this.renderList);
        this.adding = false;
        this.loading = true;
    },    
    
    sortList: function(item){
    	return -item.get("count");
    },
    
    events: {
      'click #newItemPadding' : 'newItem',
      'click #newItemLi' : 'dontClick',
      'pageinit' : 'loadedPage'
    },
    
    loadedPage: function(){
        this.loading = false;
    },
    
    dontClick:function(e){
    	e.preventDefault();
    },
    
    addItemToList: function(e){
    	if (e)	e.preventDefault();
    	if (this.newListItem){
			this.newListItem.remove();    	
			this.newListItem = null;
		}
   		this.$("#newItem .ui-btn-text").text("Add");
   		this.$("#newItem").removeClass("cancelBtn");
   		this.$("#newItemPadding").removeClass("cancelBtn");
   		this.$("#newItem").buttonMarkup({ icon: "plus" });
		this.adding = false;
		this.renderList();
    },
    
    newItem: function(e){
    	if (e) e.preventDefault();
    	if (!this.adding){
    		var itemData = {
    			modelType: this.modelType,
    			header: this.header
    		};
	    	this.newListItem = new $dino.ListNewView(itemData);
	      	this.newListItem.bind('newItem', this.addItemToList);
	    	this.$("#myList").prepend(this.newListItem.render().el);
	    	this.$("#myList").listview('refresh');
	   		this.$("#newItemInput").textinput().focus();
	   		this.$("#newItem .ui-btn-text").text("Cancel");
	   		this.$("#newItem").addClass("cancelBtn");
	   		this.$("#newItemPadding").addClass("cancelBtn");
	   		this.$("#newItem").buttonMarkup({ icon: "delete" });
	   		this.$("#newItem").buttonMarkup({ icon: "delete" });
	   		this.adding = true;
   		} else if (this.newListItem) {
   			this.addItemToList();
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
          		that.$("#myList").html('<span id="noItemsYet" class="fancyFont"><div>No '+that.header+' Added Yet!</div><hr> <div>Click "Add" Above to Get Started</div><hr></span>');
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
    
    render: function () {                
        $(this.el).html(this.template({"header":this.header}));  
        this.renderList(this.first);
        this.first = false;
        return this;
    }
});