describe("BugListView", function() {
	var view, collection, collData;

	collData = '[{"objectId":"1","bugStatus":"Open","assignedTo":"Dr. Roberts","bugPriority":3,"title":"Flu","symptoms":["Stuffy Nose","Headache"],"doctor":"Dr. Normal","medications":[],"tests":[]},{"objectId":"2","bugStatus":"Assigned","assignedTo":"Dr. Day","bugPriority":4,"title":"Strep Throat","symptoms":["Sore Throat"],"doctor":"Dr. Dangerous","medications":[],"tests":[]},{"objectId":"3","bugStatus":"Assigned","assignedTo":"Dr. Day","bugPriority":2,"title":"Diabetes","symptoms":["Low Blood Sugar"],"doctor":"Dr. Safety","medications":["Insulin 30cc"],"tests":["Glucose Test"]}]';
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
		expect(view.$el).not.toBeEmpty();
	});
	
	it("creates a list from the collection", function(){
		spyOn(Parse.User, 'current').andReturn({
			"id" : 25
		});
		var item;
		spyOn(view, 'addOne').andCallFake(function(bug) {
			item = new $dino.BugListItemView({
				model : bug
			});
			view.$("#myList").append(item.render().el);
		});
		view.render();
		expect(view.$("#myList li").length).toEqual(3);
		expect($(view.$("#myList li h3")[0]).text()).toEqual("Strep Throat");
	});
}); 