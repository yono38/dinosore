describe("ConditionItemView", function(){
	var view, model;
	
	beforeEach(function(){
		model = new $dino.MockBug({
			"assignedTo" : "Dr. Wolfson",
			"bugDetails" : "Stuff",
			"bugPriority" : 4,
			"bugStatus" : "assigned",
			"_id" : "123"
		});
		view = new $dino.ConditionListItemView({"model": model});
	});
	
	it("renders", function(){
		view.render();
		expect(view.$el).not.toBeEmpty();
	});
	
	// temporarily disabled
	/*it("can be colored", function(){
		spyOn($dino.MockColor, 'fetch').andCallFake(function(cbObj){
			var c = new $dino.Color({
				color : "test",
				hex : "FA8B2F"
			});
			cbObj["success"](c);
		});
		view.render();
		expect(view.$el.attr("style")).not.toBeDefined();
		view.setColor(colorModel);
		expect(view.$el.attr("style")).toEqual('background:#'+colorModel.get("hex"));
	}); */

});