window.$dino.ConditionDetailView = Backbone.View.extend({

	initialize : function() {
		this.template = _.template($dino.tpl.get('condition-details'));
	},

	loadAppts: function() {
		var appts = new $dino.AppointmentList();
		var that = this;
		appts.fetch({
			data: {
				user: Parse.User.current().id
			},
			success: function(appts) {
				console.log(appts.toJSON());
				var template = _.template($dino.tpl.get("appointment-list-item"));
				appts.each(function(appt) {
					if (appt.get("condition").id == that.model.id){
						var data = _.extend(appt.toJSON(), {
							time: moment.unix(appt.get("date")).format("MM/DD")
						});
						var apptItemTpl = template(data);
						console.log(apptItemTpl);
						this.$("#appointment-list").append(apptItemTpl);						
					}
					
				});
			}
		});
	},

	render : function(eventName) {
		var model = _.defaults(this.model.toJSON(), {
			"bugDetails" : "",
			"symptom" : [],
			"medication" : []
		});

		$(this.el).html(this.template(model));
		this.loadAppts();
		return this;
	}
});
