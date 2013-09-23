beforeEach(function() {
	window.$dino.app = $dino.app || { navigate: function(){}};
	spyOn($dino.app, 'navigate');
});
