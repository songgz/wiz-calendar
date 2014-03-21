describe("LunarDate", function() {
    //var date;

    beforeEach(function() {
        //date = new Lunisolar.LunarDate();
    });

    it("test run yue", function() {

        expect(Lunisolar.LunarDate.yuerun(2008,1)).toBeCloseTo(yuerun(2008,1));

    });

    it("test to JD", function() {

        expect(Lunisolar.LunarDate.toJD(2008,1,0,1)).toBeCloseTo(ymdJd(2008, 1, 0, 1));

    });

//    it("test newton", function(){
//        var f = function(x){
//            return x*x*x + 2*x*x + 3*x + 4;
//        };
//        expect(Lunisolar.newton(f, -2.0, 0.0, 0.01)).toBeCloseTo(-1.65063);
//    });


});