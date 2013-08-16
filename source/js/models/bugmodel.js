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

window.Med = Parse.Object.extend({
  className: "Med",
  title: "New Medication"
});

window.MedList = Parse.Collection.extend({
  model: Med
});

window.MedTest = Parse.Object.extend({
  className: "MedTest",
  title: "New Test"
});

window.MedTestList = Parse.Collection.extend({
  model: MedTest
});
