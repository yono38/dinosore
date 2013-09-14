window.$dino.Medication= Parse.Object.extend({
    className: "Medication",
   defaults: {
    title: "New Medication",
   	count: 0,
   }
});

window.$dino.MedicationList = Parse.Collection.extend({
    model: $dino.Medication
});

