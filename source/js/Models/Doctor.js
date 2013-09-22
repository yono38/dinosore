window.$dino.Doctor = Backbone.Model.extend({
   defaults: {
    title: "New Doctor"
   },
   idAttribute: '_id',
   urlRoot: $dino.apiRoot + '/doctors'
});

window.$dino.DoctorList = Backbone.Collection.extend({
    model: $dino.Doctor,
   url: $dino.apiRoot + '/doctors'
});