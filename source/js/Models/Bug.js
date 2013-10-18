window.$dino.Bug = Backbone.Model.extend({
	idAttribute : '_id',
	urlRoot : $dino.apiRoot + '/bugs',
	defaults : {
		bugStatus : "Active",
		bugPriority : 1,
		title : "New Bug",
		symptom : [],
		assignedTo : "",
		medication : []
	},
});

window.$dino.BugList = Backbone.Collection.extend({
	model : $dino.Bug,
	url : $dino.apiRoot + '/bugs'
});

