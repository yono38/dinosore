window.$dino.PlusOne= Backbone.Model.extend({
   defaults: {
	date: moment().unix()
   },
   idAttribute: '_id',
  urlRoot: $dino.apiRoot + '/plusones'
});

window.$dino.PlusOneList = Backbone.Collection.extend({
    model: $dino.PlusOne,
    comparator: 'date',
    url: $dino.apiRoot + '/plusones'
});