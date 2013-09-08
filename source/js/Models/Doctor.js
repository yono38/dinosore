window.$dino.Doctor = Parse.Object.extend({
   "className": "Doctor",
   defaults: {
    title: "New Doctor"
   }
});

window.$dino.DoctorList = Parse.Collection.extend({
    model: $dino.Doctor
});