window.$dino.Bug = Parse.Object.extend({
    className: "Bug",
   defaults: {
    bugStatus: "Open",
    bugPriority: 1,
    title: "New Bug",
		symptoms: [],
		doctor: "",
		medications: [],
		tests: []
   }
});

window.$dino.BugList = Parse.Collection.extend({
    model: $dino.Bug
});

