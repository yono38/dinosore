describe("SymptomListItemView", function(){
	Parse.Object.save = function(data, cbObj){
		cbObj['success']();
	};
	Parse.Object.destroy = function(cbObj){
		cbObj['success']();
	};
	
	var view, model;
	
	beforeEach(function(){
		model = new $dino.Symptom();
		model.set({
			"objectId": "123",
			"id" : "123"
			});
		view = new $dino.SymptomListItemView({ "model" : model});
	});	
	
	afterEach(function(){
		view.destroy();
	});
	
	it("renders", function(){
		expect(view.$el).toBeEmpty();
		view.render();
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
	
	it("cannot plusOne twice", function(){
		view.render();
		spyOn(view.model, 'save').andCallFake(function(){
			view.added = true;
		});
		view.clickPlus();
		view.clickPlus();
		expect(view.model.get("count")).toEqual(1);
		expect(view.model.save.calls.length).toEqual(1);
	});
	
	it("plusOnes with severity", function(){
		view.render();
		spyOn(view.model, 'save');
		view.setSeverity();
		view.$("#severity").val("5");
		view.clickPlus();
		expect(view.model.save.calls.length).toEqual(1);
		expect(view.plusOne.get("severity")).toEqual(5);
	});
	
	it("plusOnes with notes", function(){
		view.render();
		spyOn(view.model, 'save');
		view.setSeverity();
		expect(view.$("#symptom-notes").length).toEqual(1);
		view.$("#symptom-notes").val("Test Note");
		view.clickPlus();
		expect(view.model.save.calls.length).toEqual(1);
		expect(view.plusOne.get("notes")).toEqual("Test Note");
	});
	
	it("can be deleted", function(){
		spyOn(view.model, 'destroy');
		view.render();
		view.confirmDelete();
		expect(view.deleteDialog).toBeDefined();
		view.deleteDialog.deleteItem();
		expect(view.model.destroy.calls.length).toEqual(1);		
	});
});
