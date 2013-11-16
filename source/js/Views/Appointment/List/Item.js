window.$dino.AppointmentListItemView = $dino.ListItemView.extend({
	initialize : function(opts) {
		// calling super.constructor
		$dino.ConditionListItemView.__super__.initialize.call(this, opts);
		var day = moment.unix(this.model.get("date"));
		this.model.set("time", day.format('LT'));
		console.log(this.model.toJSON());
		this.swiperHeight = this.calcHeight();
		this.name = "appointment";
	},

	events: {
		"click" : "dontclick",
		"indom" : "makeSwiper",
		"click .removeItem" : "confirmDelete",
		"click .modifyItem" : "modifyAppt"
	},

	modifyAppt : function(e) {
		if (e) e.preventDefault();
		$dino.app.navigate("appts/" + this.model.id + "/modify", {
			trigger : true
		});
	},

	calcHeight: function(){
		var height = [50, 85, 105, 120];
		var items = 0;
		if (this.model.get("doctor").id != "No Doctor") items++;
		if (this.model.get("condition").id != "None") items++;
		return height[items] + "px";
	},

	attributes: {
		'data-theme' : 'f',
		'data-icon' : 'false'
	}
});