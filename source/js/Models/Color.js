window.$dino.Color = Backbone.Model.extend({
   idAttribute: '_id',
    urlRoot: '/api/v1/colors'
});

window.$dino.ColorList = Backbone.Collection.extend({
	model: $dino.Color,
	url: '/api/v1/colors',
	comparator: function (color){
		return color.get("color");
	}
});