window.$dino.Appointment = Backbone.Model.extend({
   idAttribute: '_id',
   defaults: {
    date: moment().valueOf(),
    title: "New Appointment"
   },
   urlRoot: '/api/v1/appointments'
});

window.$dino.AppointmentList = Backbone.Collection.extend({
    model: $dino.Appointment,
   url: '/api/v1/appointments'
});