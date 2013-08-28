
window.Med = Parse.Object.extend({
  className: "Med",
  title: "New Medication"
});

window.MedList = Parse.Collection.extend({
  model: Med
});