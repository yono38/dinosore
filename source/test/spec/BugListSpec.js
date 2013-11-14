// TODO render lists test
// TODO retire test
// TODO proper condition/symptom retire/active ordering test
describe("BugListView", function() {
	var view, collection, collData;

	collData = '[{"_id":"1","bugStatus":"Open","assignedTo":"Dr. Roberts","bugPriority":3,"title":"Flu","symptoms":["Stuffy Nose","Headache"],"doctor":"Dr. Normal","medications":[],"tests":[]},{"_id":"2","bugStatus":"Assigned","assignedTo":"Dr. Day","bugPriority":4,"title":"Strep Throat","symptoms":["Sore Throat"],"doctor":"Dr. Dangerous","medications":[],"tests":[]},{"_id":"3","bugStatus":"Assigned","assignedTo":"Dr. Day","bugPriority":2,"title":"Diabetes","symptoms":["Low Blood Sugar"],"doctor":"Dr. Safety","medications":["Insulin 30cc"],"tests":["Glucose Test"]}]';
	beforeEach(function() {
		collection = new $dino.BugList(JSON.parse(collData));
		view = new $dino.BugListView({
			"collection" : collection
		});
		spyOn(collection, "fetch").andCallFake(function() {
			collection.comparator = view.sortList;

			collection.sort();
			for (var i = 0; i < collection.length; i++) {
				view.addOne(collection.models[i]);
			}
		});
	});

	afterEach(function() {
		view.unbind();
		view.remove();
	});

	it("renders", function() {
		spyOn(view, 'addOne');
		expect(view.$el).toBeEmpty();
		spyOn(Parse.User, 'current').andReturn({
			id: 25
		});
		view.render();
		expect(collection.fetch).toHaveBeenCalled();
		expect(view.$el).not.toBeEmpty();
	});
	
}); 