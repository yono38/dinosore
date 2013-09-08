window.$dino.Symptom= Parse.Object.extend({
    className: "Symptom",
   defaults: {
    title: "New Symptom",
   	count: 0,
   }
});

window.$dino.SymptomList = Parse.Collection.extend({
    model: $dino.Symptom
});

