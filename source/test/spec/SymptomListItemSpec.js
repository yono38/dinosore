describe("SymptomListItemView", function(){

	var view, model;

		
	beforeEach(function(){
		spyOn(Parse.User, 'current').andReturn({
			id: 25
		});
		model = new $dino.Symptom();
		model.set({
			"_id" : "123"
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
		expect(view.$(".symptom-title").text().trim()).toEqual('New Symptom');	
	});
	
	it("opens severity slider", function(){
		view.render();
		view.setSeverity();
		expect(view.$("#severity").val()).toEqual("0");
		expect(view.$("#severity")).toBeHidden();
	});
	
	it("opens and closes severity slider", function(){
		view.render();
		view.setSeverity();
		expect(view.settingSeverity).toBeTruthy();
		expect(view.$("#severity").length).toEqual(1);
		view.resetTitle();
		expect(view.$("#severity")).toBeHidden();
		expect(view.settingSeverity).toBeFalsy();
		view.setSeverity();
		expect(view.settingSeverity).toBeTruthy();
		expect(view.$("#severity").length).toEqual(1);		
	});
	
	it("can plusOne", function(){
		spyOn(view.model, 'save');
		view.render();
		view.clickPlus();
		expect(view.model.get("count")).toEqual(1);
		expect(view.model.save.calls.length).toEqual(1);
	});

	it("plusOnes with severity", function(){
		view.render();
		spyOn(view.model, 'save');
		view.clickPlus();
		expect(view.model.save.calls.length).toEqual(1);
		runs(function(){
			view.setSeverity();
			view.$("#severity").val("5");
			view.debounceSaveSeverity();
		});
		
		waitsFor(function(){
			return view.plusOne.get("severity") == 5;
		}, "severity to set on model", 2100);
		
		runs(function(){
			expect(view.plusOne.get("severity")).toEqual(5);
		});
	});
	
	it("plusOnes with notes", function(){
		view.render();
		spyOn(view.model, 'save');
		view.clickPlus();
		runs(function(){
			view.setSeverity();
			expect(view.$("#symptom-notes").length).toEqual(1);
			view.$("#symptom-notes").val("Test Note");
			view.debounceSaveSeverity();
		});
		
		waitsFor(function(){
			return view.plusOne.get("notes") == "Test Note";
		}, "notes to set on model", 2100);
		
		runs(function(){
			expect(view.plusOne.get("notes")).toEqual("Test Note");
		});
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
