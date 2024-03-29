describe("AppointmentCalendarView", function() {
	var view, collection, time = '13:00', collData = JSON.parse('[{"_id":1,"date":"2013-09-19","title":"Checkup", "doc":"none"},{"_id":2,"date":"2013-09-01","title":"Gyno Appt", "doc":"none"},{"_id":3,"date":"2013-09-01","title":"MRI Screening", "doc":"none"}]');
	beforeEach(function() {
		spyOn(Parse.User, 'current').andReturn({
			"id" : 25
		});
		collection = new $dino.AppointmentList(collData);

		for (var i = 1; i < 4; i++) {
			var mod = collection.models[i - 1], day = mod.get("date"), apptDateTime = moment(day + " " + time).valueOf();
			collection.models[i - 1].set("date", apptDateTime);
		}
		spyOn(collection, 'fetch').andCallFake(function(cb){
			cb['success'](collection);
		});
		view = new $dino.AppointmentsView({
			"collection" : collection
		});
	});

	afterEach(function() {
		view.unbind();
		view.remove();
	});

	it("renders", function() {
		// this is required because some event in datebox is delayed
		// and the page isn't fully rendered immediately after render method
		// TODO fix appointments
		var finishedRender = false;

		runs(function() {
			view.render();
			setTimeout(function() {
				finishedRender = true;
			}, 250);
		});

		waitsFor(function() {
			return finishedRender;
		}, "datebox to render", 251);

		runs(function() {
			expect(view.$(".ui-datebox-gridlabel h4").text()).toEqual(moment().format('MMMM YYYY'));
//			expect(view.$("#currDate").html()).toEqual(moment().format('YYYY-MM-DD'));
			expect(view.$(".ui-datebox-container")).not.toBeEmpty();
		});

	});
	
	it("loads appointments", function() {
		var finishedRender = false;
		runs(function() {
			view.render();
			setTimeout(function() {
				finishedRender = true;
			}, 250);
		});

		waitsFor(function() {
			return finishedRender;
		}, "datebox to render", 251);

		runs(function() {
			spyOn(view, 'loadApptItem').andCallThrough();
			view.$("#mydate").val('2013-09-19');
			view.changeDate(null, {'method':'set', 'value':'2013-09-19'});
			expect(view.loadApptItem).toHaveBeenCalled();
			expect(view.$("#currDate").text()).toEqual('2013-09-19');
			expect(view.$("#dayAppts")).not.toBeEmpty();
			expect(view.$(".ui-li-count").text()).toEqual('1:00 PM');
			expect(view.$('h3:contains("Checkup")')).not.toBeEmpty();
		});

	});
	
	it("loads multiple appointments on a day", function(){
		var finishedRender = false;
		runs(function() {
			view.render();
			setTimeout(function() {
				finishedRender = true;
			}, 250);
		});

		waitsFor(function() {
			return finishedRender;
		}, "datebox to render", 251);

		runs(function() {
			spyOn(view, 'loadApptItem').andCallThrough();
			view.$("#mydate").val('2013-09-01');
			view.changeDate(null, {'method':'set', 'value':'2013-09-01'});
			expect(view.$("#dayAppts .ui-li-heading").length).toEqual(2);
			expect(view.loadApptItem).toHaveBeenCalled();
			expect(view.loadApptItem.calls.length).toEqual(2);
			expect(view.$("#currDate").text()).toEqual('2013-09-01');
			expect(view.$("#dayAppts")).not.toBeEmpty();
			expect(view.$('h3:contains("Checkup")')).not.toBeEmpty();
		});		
	});
});
