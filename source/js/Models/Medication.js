window.$dino.Medication = Backbone.Model.extend({
  defaults: {
    title: 'New Medication',
    count: 0
  },
  idAttribute: '_id',
  urlRoot: $dino.apiRoot + '/medications'
});
window.$dino.MedicationList = Backbone.Collection.extend({
  model: $dino.Medication,
  url: $dino.apiRoot + '/medications'
});