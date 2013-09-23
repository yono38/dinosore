describe("SymptomListView", function(){
	var view;
	
	beforeEach(function(){
		view = new $dino.SymptomListView();
	});	
	
	it("exists", function(){
		expect(view).toBeDefined();
	});
	
	it("renders properly", function(){
		view.render();
		expect(view.$el).toBeDefined();
	});

	it("can add symptoms", function(){
		expect(view.newSypListItem).not.toBeDefined();
		view.newSymptom();
		expect(view.adding).toBeTruthy();
		expect(view.newSymptomListItem).toBeDefined();
		expect(view.newSymptomListItem.$("#newItemLi").length).toEqual(1);
//		expect(view.$("#newSymptom .ui-btn-text").text()).toEqual("Cancel");
	});
	
	it("won't try to create duplicate add symptom bars, will remove on second call", function(){
		spyOn(view, 'addSymptomToList').andCallThrough();
		expect(view.newSymptomListItem).not.toBeDefined();
		view.newSymptom();
		expect(view.newSymptomListItem.$("#newItemLi").length).toEqual(1);
		view.newSymptom();
		expect(view.addSymptomToList.calls.length).toEqual(1);
	});
	
	it("resets list on new symptom", function(){
		spyOn(view, 'renderList');
		expect(view.newSymptomListItem).not.toBeDefined();
		view.newSymptom();
		expect(view.newSymptomListItem).toBeDefined();
		view.addSymptomToList();
		expect(view.newSymptomListItem).toBeNull();
		expect(view.adding).toBeFalsy();
//		expect(view.$("#newSymptom .ui-btn-text").text()).toEqual("Add");
	});
	
});