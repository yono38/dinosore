window.$dino.Symptom= Backbone.Model.extend({
   defaults: {
    title: "New Symptom",
   	count: 0,
   },
   idAttribute: '_id',
   urlRoot: $dino.apiRoot + '/symptoms'
});

window.$dino.SymptomList = Backbone.Collection.extend({
    model: $dino.Symptom,
    url: $dino.apiRoot + '/symptoms'
});

// NEXT:
// Add user search to collections
// 