describe("PlusListView", function(){
	var view, collection;
	
	beforeEach(function(){
        collection = new $dino.SymptomList();
		view = new $dino.BugListView({
			modelType: $dino.Symptom,
			header: "Symptom",
			collection: collection,
			name: "symptom"
		});
	});	
	
	afterEach(function(){
		view.destroy();
	});
	
	it("renders", function(){
		spyOn(view, 'renderList');
		view.render();
		expect(view.renderList).toHaveBeenCalled();
		expect(view.$el).toBeDefined();
	});
/* TODO Move to ListNewView
	it("can add items", function(){
		expect(view.newListItem).not.toBeDefined();
		view.newItem();
		expect(view.adding).toBeTruthy();
		expect(view.newListItem).toBeDefined();
		expect(view.newListItem.$("#newItemLi").length).toEqual(1);
//		expect(view.$("#newItem .ui-btn-text").text()).toEqual("Cancel");
	});
	
	it("won't try to create duplicate add symptom bars, will remove on second call", function(){
		spyOn(view, 'addItemToList').andCallThrough();
		spyOn(view, 'renderList');
		expect(view.newListItem).not.toBeDefined();
		view.newItem();
		expect(view.newListItem.$("#newItemLi").length).toEqual(1);
		view.newItem();
		expect(view.addItemToList.calls.length).toEqual(1);
	});

	it("resets list on new symptom", function(){
		spyOn(view, 'renderList');
		expect(view.newListItem).not.toBeDefined();
		view.newItem();
		expect(view.newListItem).toBeDefined();
		view.addItemToList();
		expect(view.newListItem).toBeNull();
		expect(view.adding).toBeFalsy();
//		expect(view.$("#newSymptom .ui-btn-text").text()).toEqual("Add");
	});
*/
});