describe("Login", function(){
	var view;
	
	beforeEach(function(){
		view = new LoginView();
	});
	
	afterEach(function(){
		Parse.User.logout();
	});
	
	it("should be able to render", function(){
		view.render();
		expect(view.$el).toBeDefined();
	});
		
});