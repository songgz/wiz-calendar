describe("SolarTerm", function() {
    
    it("test getTermK", function() {
    	var term = new Lunisolar.SolarTerm();
        expect(term.getTermK(Lunisolar.JDate.J2000)).toEqual(18);

    });

//    it("test newton", function(){
//        var f = function(x){
//            return x*x*x + 2*x*x + 3*x + 4;
//        };
//        expect(Lunisolar.newton(f, -2.0, 0.0, 0.01)).toBeCloseTo(-1.65063);
//    });


});