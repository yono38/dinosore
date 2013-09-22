window.$dino.Bug = Backbone.Model.extend({
   idAttribute: '_id',
    urlRoot: $dino.apiRoot + '/bugs',
   defaults: {
    bugStatus: "Open",
    bugPriority: 1,
    title: "New Bug",
		symptoms: [],
		doctor: "",
		medications: [],
		tests: []
   },
});

window.$dino.BugList = Backbone.Collection.extend({
    model: $dino.Bug,
	url: $dino.apiRoot + '/bugs'
});

