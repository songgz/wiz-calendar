describe("LunarDate", function() {
    //var date;

    beforeEach(function() {
        //date = new Lunisolar.LunarDate();
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

    it("test toYmd ", function(){

        expect(Lunisolar.LunarDate.yuesoqi(2456741,1)).toEqual(1);

    });


});