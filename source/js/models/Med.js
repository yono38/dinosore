
window.$dino.Med = Parse.Object.extend({
  className: "Med",
  title: "New Medication"
});

window.$dino.MedList = Parse.Collection.extend({
  model: $dino.Med
});