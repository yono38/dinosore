describe("LoginView", function(){
	var view;
	
	beforeEach(function(){
		view = new $dino.LoginView();
	});
	
	afterEach(function(){
		if (Parse.User.current() != null){
			runs(function(){
				Parse.User.logOut();
			});
			waitsFor(function(){
				return Parse.User.current() == null;
			});
		}
		$dino.app = null;
	});
	
	it("should exist", function(){
		expect(view).toBeDefined();
	});
	
	it("should be able to render", function(){
		view.render();
		expect(view.$el).toBeDefined();
	});
	
	it("throws login errors on empty password/email", function(){
		view.render();
		view.login();
		expect(view.$("#error").html()).toEqual("Email &amp; Password Cannot Be Blank");
	});

	it("throws signup errors on empty password/email", function(){
		view.render();
		view.signup();
		expect(view.$("#error").html()).toEqual("Email &amp; Password Cannot Be Blank");
	});
	
	it("lets user logs in", function(){
		view.render();
		view.$("#email").val("jasmine");
		view.$("#password").val("test");
		runs(function(){
			view.login();		
		});
		
		waitsFor(function(){
			return Parse.User.current() != null;
		}, "User should be logged in", 1500);
		
		runs(function(){
			expect(Parse.User.current()).toBeDefined();
			expect(Parse.User.current().getUsername()).toEqual("jasmine");
		});
	});
	
	it("navigates to symptom on login", function(){
		$dino.app = jasmine.createSpyObj("app", ['navigate']);
		view.render();
		view.$("#email").val("jasmine");
		view.$("#password").val("test");
		runs(function(){
			view.login();		
		});
		
		waitsFor(function(){
			return Parse.User.current() != null;
		}, "User should be logged in", 1500);
		
		runs(function(){
			expect($dino.app.navigate).toHaveBeenCalled();
			expect($dino.app.navigate).toHaveBeenCalledWith("symptoms", {trigger: true});
		});
	});
});