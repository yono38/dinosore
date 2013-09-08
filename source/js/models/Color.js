window.$dino.Color = Parse.Object.extend({
   className: "Color"
});

window.$dino.ColorList = Parse.Collection.extend({
	model: $dino.Color,
	comparator: function (color){
		return color.get("color");
	}
});