describe("AppointmentNewView", function(){
	var view, model;
	
	beforeEach(function(){
		view = new $dino.NewApptView();
	});
	
	afterEach(function(){
		view.unbind();
		view.remove();
	});
	
	it("renders", function(){
		view.render();
		expect(view.$("#appt-date").val()).toEqual(moment().format("YYYY-MM-DD"));
	});
	
});