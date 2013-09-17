window.$dino.Doctor = Backbone.Model.extend({
   defaults: {
    title: "New Doctor"
   },
   idAttribute: '_id',
   urlRoot: '/api/v1/doctors'
});

window.$dino.DoctorList = Backbone.Collection.extend({
    model: $dino.Doctor,
   url: '/api/v1/doctors'
});