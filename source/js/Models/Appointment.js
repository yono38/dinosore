window.$dino.Appointment = Backbone.Model.extend({
   idAttribute: '_id',
   defaults: {
    date: moment().unix(),
    type: "Appointment",
    title: "",
    doctor: {id: "No Doctor"},
    condition: {id: 'None'}
   },
   urlRoot: $dino.apiRoot + '/appointments'
});

window.$dino.AppointmentList = Backbone.Collection.extend({
    model: $dino.Appointment,
   url: $dino.apiRoot + '/appointments'
});