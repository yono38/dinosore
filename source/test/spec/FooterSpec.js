describe("FooterTest", function(){
    var view;
    // instantiate the view
    // So before each test begins we instantiate a new footerview and assign it to the view object - correcto
    beforeEach(function(){
        view = new $dino.FooterView();
    });
    
    it("contains the footer items", function(){
        // see https://github.com/velesin/jasmine-jquery
        // run render
        view.render(); // we call the render function (? method) on the view object - as required for the test :)
        expect(view.$el).toBe('div'); // finish this statement danny?
        expect(view.$("#footerBtnGroup a").length).toEqual(4); // (as there are 4 items)
        expect(view.$("#footerBtnGroup")).toContain("a[href=#bugs]"); // correct
        expect(view.$("#footerBtnGroup")).toContain("#medications"); // this one was (ALMOST) correct (look at ID again), look at the <a> element in tpl and see why AH I MISSED the ID. got it
        expect(view.$("#footerBtnGroup")).toContain("#appointments"); // #fixed YEP On an unrelated note, I should have made this route #appointments anyway :P
        expect(view.$("#footerBtnGroup")).toContain("#info") // #info
        
    });
    
    
});
