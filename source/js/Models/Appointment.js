window.$dino.Appointment = Parse.Object.extend({
   className: "Appointment",
   defaults: {
    date: new Date(),
    title: "New Appointment"
   }
});

window.$dino.AppointmentList = Parse.Collection.extend({
    model: $dino.Appointment
});