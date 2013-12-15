Backbone.Model.prototype.save = function(data, cbObj) {
        this.set(data);
        if (cbObj)
                cbObj['success']();
};
Backbone.Model.prototype.destroy = function(cbObj) {
        cbObj['success']();
};

beforeEach(function() {
        window.$dino.app = $dino.app || {
                navigate : function() {
                }
        };
        spyOn($dino.app, 'navigate');
});
