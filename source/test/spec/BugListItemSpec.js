describe("BugItemView", function(){
	var view, model;
	
	beforeEach(function(){
		model = new $dino.MockBug({
			"assignedTo" : "Dr. Wolfson",
			"bugDetails" : "Stuff",
			"bugPriority" : 4,
			"bugStatus" : "assigned",
			"objectId" : "123"
		});
		view = new $dino.BugListItemView({"model": model});
	});
	
	it("renders", function(){
		view.render();
		expect(view.$el).not.toBeEmpty();
	});
	
	it("can be colored", function(){
		var colorModel = new $dino.MockColor({
			color: "ORANGE",
			hex: "FA8B2F"
		});
		spyOn(colorModel, 'fetch').andCallFake(function(cbObj){
			cbObj["success"]();
		});
		view.render();
		expect(view.$el.attr("style")).not.toBeDefined();
		view.setColor(colorModel);
		expect(view.$el.attr("style")).toEqual('background:#'+colorModel.get("hex"));
	});

});