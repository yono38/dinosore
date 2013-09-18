window.$dino.Bug = Backbone.Model.extend({
   idAttribute: '_id',
    urlRoot: '/api/v1/bugs',
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
	url: '/api/v1/bugs'
});

