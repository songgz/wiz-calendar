describe("LunarDate", function() {

    beforeEach(function() {
    });

//    it("test run yue", function() {
//
//        expect(Lunisolar.LunarDate.yuerun(2008,1)).toBeCloseTo(yuerun(2008,1));
//
//    });

    it("test toJD", function() {

       var d = new Lunisolar.LunarDate(2008, 1, 0, 1);
        expect(d.toJD()).toBeCloseTo(ymdJd(2008, 1, 0, 1));

    });

    it("test toYmd ", function(){

//        var j = ymdJd(2008, 1, 0, 1);
//        var d = new Lunisolar.LunarDate(j);
//        expect(d.toLD()).toEqual(jdYmd(j));

    });

    it("test .toJD", function(){

        var d = new Lunisolar.LunarDate(2008,1,0,1);
        expect(d.toJD()).toEqual(ymdJd(2008, 1, 0, 1));
        expect(d.valueOf()).toEqual(ymdJd(2008, 1, 0, 1));

    });

    it("test .toLD", function(){
        var j = ymdJd(2008, 1, 0, 1);
        var d = new Lunisolar.LunarDate(j);
        var t = jdYmd(j);
        expect(d.year).toEqual(t.Y);
        expect(d.month).toEqual(t.M);
        expect(d.day).toEqual(t.D);
        expect(d.leap).toEqual(t.R);
        expect(d.hour).toEqual(t.h);
        expect(d.minute).toEqual(t.m);
        expect(d.second).toEqual(t.s);
        expect(d.days).toEqual(t.N);

    });

//    it("test new LunarDate ", function(){
//        var date = new Lunisolar.LunarDate(2456928);
//        expect(date.getYear()).toEqual(2014);
//        expect(date.getMonth()).toEqual(9);
//        expect(date.isLeapMonth()).toEqual(0);
//    });
//
//    it("test new LunarDate ", function(){
//        var date = new Lunisolar.LunarDate(2456957);
//        expect(date.getYear()).toEqual(2014);
//        expect(date.getMonth()).toEqual(9);
//        expect(date.isLeapMonth()).toEqual(1);
//    });
//
//    it("test nextMonth ", function(){
//        var date = new Lunisolar.LunarDate(2456957);
//        date.nextMonth();
//        expect(date.getYear()).toEqual(2014);
//        expect(date.getMonth()).toEqual(10);
//        expect(date.isLeapMonth()).toEqual(0);
//    });


});