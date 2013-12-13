describe("ConditionDetailView", function(){
	var view;
	
	beforeEach(function(){
		view = new $dino.ConditionDetailView();
		Parse = {
			User: {
				current: function() {
					return { id : "testid" };
				}
			}
		};
	});
	
	afterEach(function(){
		view.unbind();
		view.remove();
	});
	
	it("renders", function(){
		view.model = new $dino.MockBug();
		view.render();
		expect(view.$el).not.toBeEmpty();
		console.log(view.el);
		expect(view.$("#symptomList").text().trim()).toEqual("No Symptoms Recorded");
		expect(view.$("#medicationList").text().trim()).toEqual("No Medications Recorded");
	});
	
	// for this test, I need to create medications/symptoms
	// add their ids to the model, and mock fetch them
	it("populates lists", function(){
		var model = new $dino.MockBug({
			"symptom" : [ {"id":"5260b7c8ecab4cbc0b000066","title":"Nausea"},{"id":"5260b7c8ecab4cbc0b343200066","title":"Headache"}],
			"medication" : [ {"id":"5260b7c8ecab4cbc0b000066","title":"Tylenol"}],
		});
		view.model = model;
		view.render();
		console.log(view.el);
		expect(view.$("#symptomList li").length).toEqual(2);
		expect(view.$("#medicationList li").length).toEqual(1);
		expect(view.$("#medicationList li .itemName").text()).toEqual("Tylenol"); 
	});
});