window.$dino.PlusOne= Backbone.Model.extend({
   defaults: {
	date: moment().unix()
   },
   idAttribute: '_id',
  urlRoot: $dino.apiRoot + '/plusones'
});
