window.BugDetailView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('bug-details'));
    },

    render:function (eventName) {
        var model = _.defaults(this.model.toJSON(), {
          "symptoms": false,
          "medications": false,
          "tests": false,
          "assignedTo": "Not Assigned"
        });
        console.log(model);    

        $(this.el).html(this.template(model));
        return this;
    }

});
