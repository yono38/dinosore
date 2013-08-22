window.Appointment = Parse.Object.extend({
   className: "Appointment",
   defaults: {
    date: new Date(),
    title: "New Appointment"
   }
});

window.AppointmentList = Parse.Collection.extend({
    model: Appointment
});