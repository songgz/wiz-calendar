describe("LunarDate", function() {

    beforeEach(function() {
    });


    it("test toJD", function() {

       var d = new Lunisolar.LunarDate(2008, 1, 0, 1);
        //expect(d.toJD()).toBeCloseTo(ymdJd(2008, 1, 0, 1));
        expect(d.toJD()).toBeCloseTo(Lunisolar.JDate.gd2jd(2008, 2, 7));

    });

    it("test .toJD", function(){

        var d = new Lunisolar.LunarDate(2008,1,0,1);
        expect(d.toJD() + 0.5).toEqual(ymdJd(2008, 1, 0, 1));
        expect(d.valueOf() + 0.5).toEqual(ymdJd(2008, 1, 0, 1));

    });

    it("test .toLD", function(){
        var j = ymdJd(2008, 1, 0, 1) - 0.5;
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

});