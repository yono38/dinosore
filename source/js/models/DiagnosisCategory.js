window.DiagnosisCategory = Parse.Object.extend({

    className: "DiagnosisCategory",
   defaults: {
		symptoms: [],
		user: Parse.User.current()
   }
});

window.DignosisCategoryCollection = Parse.Collection.extend({
    model: Bug
});

