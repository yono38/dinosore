window.$dino.PlusOne= Backbone.Model.extend({
   defaults: {
	date: moment().valueOf()
   },
   idAttribute: '_id',
  urlRoot: $dino.apiRoot + '/plusones'
});
