window.$dino.BugDetailView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('bug-details'));
    },

    render:function (eventName) {
        var model = _.defaults(this.model.toJSON(), {
          "bugDetails" : "",
          "symptoms": [],
          "medications": [],
          "tests": [],
          "assignedTo": "Not Assigned"
        });
        console.log(model);    

        $(this.el).html(this.template(model));
        return this;
    }

});
