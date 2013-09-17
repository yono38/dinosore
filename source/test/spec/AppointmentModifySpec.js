describe("AppointmentModifyView", function(){
	var view, model, colldata, coll;
	
	model = new $dino.MockAppointment({
		"title" : "Brain Examination",
		"date" : moment().format("YYYY-MM-DD"),
		"newDate" : moment().startOf('hour').toDate()
	});
	model.id = "10";
	
	beforeEach(function(){
		view = new $dino.AppointmentModifyView({"model":model});
	});
	
	afterEach(function(){
		view.unbind();
		view.remove();
		delete coll;
	});
	
	it("renders", function(){
		view.render();
		expect(view.$("#apptId").val()).toEqual(model.id);
		expect(view.$("#title").val()).toEqual(model.get("title"));
		expect(view.$("#appt-date").val()).toEqual(model.get("date"));
		expect(view.$("#appt-time").val()).toEqual(moment(model.get("newDate")).format("HH:mm:ss"));
	});
	
	it("loads bugs into a select menu", function(){
		collData = '[{"objectId":1,"title":"Migrane"},{"objectId":2,"title":"Strep Throat"},{"objectId":3,"title":"Tendonitis"}]'
		, coll = new $dino.BugList(JSON.parse(collData));
		spyOn(coll, 'fetch').andCallFake(function(cb, type){
			if (type == "bug") cb['success'](coll);
		});
		spyOn(view.$("#select-bug"), 'selectmenu');
		spyOn(view, 'getCollection').andReturn(coll);
		view.render();
		expect(view.getCollection).toHaveBeenCalled();
		expect(view.getCollection.calls.length).toEqual(2); // one for bug list & one for doctor list
		expect(view.$("#select-bug")).not.toBeEmpty();
		console.log(view.$("#select-bug").html());
		expect(view.$("#select-bug option").length).toEqual(4);
		expect($(view.$("#select-bug option")[0]).val()).toEqual("none");
		expect($(view.$("#select-bug option")[1]).text()).toEqual(coll.models[0].get("title"));
		expect($(view.$("#select-bug option")[2]).text()).toEqual(coll.models[1].get("title"));
		expect($(view.$("#select-bug option")[3]).text()).toEqual(coll.models[2].get("title"));
	});
	
});