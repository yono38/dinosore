window.Doctor = Parse.Object.extend({
   "className": "Doctor",
   defaults: {
    title: "New Doctor"
   }
});

window.DoctorList = Parse.Collection.extend({
    model: Doctor
});