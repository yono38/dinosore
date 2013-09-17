window.$dino.Symptom= Backbone.Model.extend({
   defaults: {
    title: "New Symptom",
   	count: 0,
   },
   idAttribute: '_id',
   urlRoot: '/api/v1/symptoms'
});

window.$dino.SymptomList = Backbone.Collection.extend({
    model: $dino.Symptom,
    url: '/api/v1/symptoms'
});

// NEXT:
// Add user search to collections
// 