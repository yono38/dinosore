describe("FooterTest", function(){
    var view;
    beforeEach(function(){
        view = new FooterView();
    });
    
    it("contains the right quantity", function(){
        view.render(); 
        expect(view.$("#footerBtnGroup #bugs").length).toEqual(4); 
    });

    it("contains the specific footer items", function(){
        view.render(); 
        expect(view.$el).toBe('div'); 
        expect(view.$("#footerBtnGroup a").length).toEqual(4);
        expect(view.$("#footerBtnGroup")).toContain("a[href=bugs]"); 
        expect(view.$("#footerBtnGroup")).toContain("#medication"); 
        expect(view.$("#footerBtnGroup")).toContain("#appointments");
        expect(view.$("#footerBtnGroup")).toContain("#info"); 
    });
    
    
});
