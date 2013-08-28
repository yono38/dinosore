window.Bug = Parse.Object.extend({

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

window.BugList = Parse.Collection.extend({
    model: Bug
});
