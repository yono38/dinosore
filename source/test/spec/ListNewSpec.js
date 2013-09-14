describe("ListNewView", function(){
	var view;
	
	beforeEach(function(){
		view = new $dino.ListNewView({
			modelType: $dino.Symptom,
			header: "Symptoms"	
		});
	});
	
	afterEach(function(){
		view.destroy();
	});
	
	it("renders", function(){
		view.render();
		expect(view.$el).not.toBeEmpty();
	});
	
	
});
