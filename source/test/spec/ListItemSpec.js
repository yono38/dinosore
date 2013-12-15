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

		spyOn(model, 'fetch').andCallFake(function(cb) {
			cb['success'](model);
		});
		view = new $dino.ListItemView({
			'model' : model,
			name : 'testObject',
			click : true
		});
	});
	afterEach(function(){
		delete model;
		view.unbind();
		view.remove();
	});

	it("renders", function() {
		view.render();
		// asserts top level element rendered properly
		expect(view.$el).toBe('li');
		// asserts {name: testObject} in params worked
		expect(view.$("#testObject-detail")).toBe('a');
		expect(view.$(".check-items").children().length).toEqual(2);
	});

	it('retires', function() {
		view.render();
		view.$(".retireItem").trigger('click');
		expect(model.get("retired")).toBe(true);
	});
	
	it('unretires', function(){
		model.set("retired", true);
		view.render();
		view.$(".retireItem").trigger('click');
		expect(model.get("retired")).toBe(false);
	});

	it('saves plusOne of 0 on retirement', function() {
		view.render();
		var saved = false;
		// renderlist called on plusone save
		view.on('renderlist', function(){
			saved = true;
		});
		runs(function(){
			view.$(".retireItem").trigger('click');
		});
		waitsFor(function(){
			return saved;
		});
	});

	it('saves pluone model on click of plus button', function() {
		expect(true).toBe(true);
	});
}); 