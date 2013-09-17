window.$dino.Medication= Backbone.Model.extend({
   defaults: {
    title: "New Medication",
   	count: 0,
   },
   idAttribute: '_id',
    urlRoot: '/api/v1/medications'
});

window.$dino.MedicationList = Backbone.Collection.extend({
    model: $dino.Medication,
    url: '/api/v1/medications'
});

