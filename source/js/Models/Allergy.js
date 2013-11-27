window.$dino.Allergy = Backbone.Model.extend({
  idAttribute: '_id',
  defaults: {
    user: Parse.User.current().id,
    title: ''
  },
  urlRoot: $dino.apiRoot + '/allergies'
});
window.$dino.AllergyList = Backbone.Collection.extend({
  model: $dino.Allergy,
  url: $dino.apiRoot + '/allergies'
});