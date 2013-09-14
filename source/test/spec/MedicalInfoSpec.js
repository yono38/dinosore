describe("MedicalInfoView", function(){
	var view, model;
	
	beforeEach(function(){
		view = new $dino.MedicalInfoView();
	});
	
	afterEach(function(){
		view.destroy();
	});
	
	it("renders", function(){
		var usr, flag = false;
		runs(function(){
			usr = Parse.User.logIn("jasmine", "test", {
				success: function(){
					flag = true;
				}
			});
		});
		
		waitsFor(function(){
			return flag;
		}, "user to log in", 1500);
		
		runs(function(){
			view.render();
			expect(view.$el).not.toBeEmpty();
			expect(view.$("#username").text()).toEqual("jasmine");
			expect(view.$("#age").text()).toEqual("Age 23 years");
			expect(view.$("#last-checkup").text()).toEqual("Last Checkup: 09/2013");
		});
	});
	
});
