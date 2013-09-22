window.$dino.SymptomListView = $dino.PlusListView.extend({

	addOne : function(symptom) {
		var view = new $dino.SymptomListItemView({
			model : symptom
		});
		this.$("#myList").append(view.render().el);
	}

}); 