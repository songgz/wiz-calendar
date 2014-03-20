describe("SolarTerm", function() {
    var term;

    beforeEach(function() {
        term = new Lunisolar.SolarTerm();
    });

    it("test getTermK", function() {

        expect(term.getTermK(Lunisolar.JDate.J2000)).toEqual(1);

    });

//    it("test newton", function(){
//        var f = function(x){
//            return x*x*x + 2*x*x + 3*x + 4;
//        };
//        expect(Lunisolar.newton(f, -2.0, 0.0, 0.01)).toBeCloseTo(-1.65063);
//    });


});