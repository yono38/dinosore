describe("SymptomListItemView", function(){
	var view, model;
	
	beforeEach(function(){
		model = new $dino.Symptom();
		model.set("objectId", "123");
		view = new $dino.SymptomListItemView({ "model" : model});
	});	
	
	it("renders", function(){
		expect(view.$el).toBeEmpty();
		view.render();
		console.log(view.$el.html());
		expect(view.$el).not.toBeEmpty();
		expect(view.$(".symptom-title").text()).toEqual('New Symptom');	
	});
	
	it("opens severity slider", function(){
		view.render();
		view.setSeverity();
		expect(view.$("#severity").val()).toEqual("3");
		expect(view.$("#severity")).toBeHidden();
	});
	
	it("opens and closes severity slider", function(){
		view.render();
		view.setSeverity();
		expect(view.settingSeverity).toBeTruthy();
		expect(view.$("#severity").length).toEqual(1);
		view.resetTitle();
		expect(view.$("#severity").length).toEqual(0);
		expect(view.settingSeverity).toBeFalsy();
		view.setSeverity();
		expect(view.settingSeverity).toBeTruthy();
		expect(view.$("#severity").length).toEqual(1);		
	});
	
	it("can plusOne", function(){
		view.render();
		spyOn(view.model, 'save');
		view.clickPlus();
		expect(view.model.get("count")).toEqual(1);
		expect(view.model.save.calls.length).toEqual(1);
	});
});
