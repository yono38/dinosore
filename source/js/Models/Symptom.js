window.Symptom= Parse.Object.extend({
    className: "Symptom",
   defaults: {
    title: "New Symptom",
   	count: 0,
   }
});

window.SymptomList = Parse.Collection.extend({
    model: Symptom
});

