describe("FooterView", function(){
	var view;
	
	beforeEach(function(){
		view = new $dino.FooterView();
	});
	
	afterEach(function(){
		view.destroy();
	});
	
	it("renders", function(){
		view.render();
		expect(view.$el).not.toBeEmpty();
	});
	
	
});
