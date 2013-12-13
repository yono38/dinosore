describe("ListItem", function() {
	var view, model;
	beforeEach(function() {
		spyOn(Parse.User, 'current').andReturn({
			"id" : 25
		});
		model = new $dino.Medication({
			'_id' : 10,
			'title' : "SomeListItem"
		});
		// _id is required for list-item template
		model.set('_id', 10);
	
		spyOn(model, 'fetch').andCallFake(function(cb){
			cb['success'](model);
		});
	});
	
	it("renders", function(){
			view = new $dino.ListItemView({
	        'model': model,
	        name: 'testObject',
	        click: true 
	      });
	      view.render();
	      // asserts top level element rendered properly
	      expect(view.$el).toBe('li');
	      // asserts {name: testObject} in params worked
	      expect(view.$("#testObject-detail")).toBe('a');
	      expect(view.$(".check-items").children().length).toEqual(2);
	});
});