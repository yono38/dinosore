window.$dino.PlusOne= Backbone.Model.extend({
   defaults: {
	date: moment().valueOf()
   },
   idAttribute: '_id',
  urlRoot: '/api/v1/plusones'
});
