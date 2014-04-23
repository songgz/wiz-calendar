describe("Bazi test", function() {
    var bz;

    beforeEach(function() {
        bz = new Lunisolar.Bazi(2456770.942824074); //2014-4-23 10:37:40   //甲午年 戊辰月 甲子日 己巳时 真太阳 10:24:48
    });

    it("test year month day hour", function() {

        expect(bz.getYear()).toEqual("甲午");
        expect(bz.getMonth()).toEqual("戊辰");
        expect(bz.getDay()).toEqual("甲子");
        expect(bz.getHour()).toEqual("己巳");

        expect(bz.trueSolarTime).toEqual("10:24:48");

    });

});