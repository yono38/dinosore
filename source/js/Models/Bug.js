window.$dino.Bug = Backbone.Model.extend({
   idAttribute: '_id',
   defaults: {
    bugStatus: "Open",
    bugPriority: 1,
    urlRoot: '/api/v1/bugs',
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

