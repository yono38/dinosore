describe("BugDetailView", function(){
	var view;
	
	beforeEach(function(){
		view = new $dino.BugDetailView();
	});
	
	afterEach(function(){
		view.unbind();
		view.remove();
	});
	
	it("renders", function(){
		view.model = new $dino.MockBug();
		view.render();
		expect(view.$el).not.toBeEmpty();
		expect(view.$("#symptomList").text().trim()).toEqual("No Symptoms Recorded");
		expect(view.$("#medicationList").text().trim()).toEqual("No Medications Recorded");
		expect(view.$("#assignedTo").html()).toEqual("Not Assigned");
	});
	
	it("populates lists", function(){
		var model = new $dino.MockBug({
			"symptoms" : [ "Nausea", "Headache"],
			"medications" : [ "Tylenol"],
			"assignedTo" : "Dr. Healthy"
		});
		view.model = model;
		view.render();
		expect(view.$("#symptomList li").length).toEqual(2);
		expect(view.$("#medicationList li").length).toEqual(1);
		expect(view.$("#medicationList li .itemName").text()).toEqual("Tylenol");
		expect(view.$("#assignedTo").text()).toEqual("Dr. Healthy");
	});
});