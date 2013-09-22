window.$dino.Appointment = Backbone.Model.extend({
   idAttribute: '_id',
   defaults: {
    date: moment().valueOf(),
    title: "New Appointment"
   },
   urlRoot: $dino.apiRoot + '/appointments'
});

window.$dino.AppointmentList = Backbone.Collection.extend({
    model: $dino.Appointment,
   url: $dino.apiRoot + '/appointments'
});