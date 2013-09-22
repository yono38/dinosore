window.$dino.Color = Backbone.Model.extend({
   idAttribute: '_id',
    urlRoot: $dino.apiRoot + '/colors'
});

window.$dino.ColorList = Backbone.Collection.extend({
	model: $dino.Color,
	url: $dino.apiRoot + '/colors',
	comparator: function (color){
		return color.get("color");
	}
});