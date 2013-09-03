window.Color = Parse.Object.extend({
   className: "Color"
});

window.ColorList = Parse.Collection.extend({
	model: Color,
	comparator: function (color){
		return color.get("color");
	}
});