describe("LunarDate", function() {
    //var date;

    beforeEach(function() {

    });

    it("test run yue", function() {

        expect(Lunisolar.LunarDate.yuerun(2008,1)).toBeCloseTo(yuerun(2008,1));

    });

    it("test toJD", function() {

        expect(Lunisolar.LunarDate.toJD(2008,1,0,1)).toBeCloseTo(ymdJd(2008, 1, 0, 1));

    });

    it("test toYmd ", function(){

        expect(Lunisolar.LunarDate.toYmd(2008)).toEqual(jdYmd(2008));

    });

//    it("test new LunarDate ", function(){
//        var date = new Lunisolar.LunarDate(2456957);
//        expect(date.getYear()).toEqual(2014);
//        expect(date.getMonth()).toEqual(8);
//        expect(date.isLeapMonth()).toEqual(0);
//    });
//
//    it("test new LunarDate ", function(){
//        var date = new Lunisolar.LunarDate(2456957);
//        expect(date.getYear()).toEqual(2014);
//        expect(date.getMonth()).toEqual(9);
//        expect(date.isLeapMonth()).toEqual(1);
//    });

    it("test nextMonth ", function(){
        var date = new Lunisolar.LunarDate(2456957);
        date.nextMonth();
        expect(date.getYear()).toEqual(2014);
        expect(date.getMonth()).toEqual(10);
        expect(date.isLeapMonth()).toEqual(0);
    });


});