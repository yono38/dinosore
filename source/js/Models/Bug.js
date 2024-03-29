window.$dino.Bug = Backbone.Model.extend({
	idAttribute : '_id',
	urlRoot : $dino.apiRoot + '/bugs',
	defaults : {
		status : "Active",
		details: "",
		title : "",
		symptom : [],
		doctor: {title: ""},
		medication : []
	},
});

window.$dino.BugList = Backbone.Collection.extend({
	model : $dino.Bug,
	url : $dino.apiRoot + '/bugs'
});

