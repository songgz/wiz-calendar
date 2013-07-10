describe("WizCalendar", function () {

    it("test version attribute", function () {
        expect(WC.version).toEqual("0.0.1");
    });

    it("test int method", function () {
        expect(WC.int(1.01)).toEqual(1);
        expect(WC.int(1.99)).toEqual(1);
        expect(WC.int(-1.99)).toEqual(-1);
        expect(WC.int(-1.01)).toEqual(-1);
    });


});

describe("Angle", function () {
    //var angle;

    beforeEach(function () {

    });

    it("test rad class method", function () {
        var angle = WC.Angle.rad(Math.PI);
        expect(angle.valueOf()).toEqual(Math.PI);
    });

    it("test inPI2 method", function () {
        var angle1 = WC.Angle.rad(Math.PI * 3);
        var angle2 = WC.Angle.rad(-Math.PI * 3);
        expect(angle1.inPI2()).toEqual(Math.PI);
        expect(angle2.inPI2()).toEqual(Math.PI);
    });

    it("test toDMS method", function () {
        var angle = WC.Angle.rad(Math.PI);
        expect(angle.toDMS()).toEqual("+180°00’00.00”");
    });

    it("test +-*/ method", function(){
        var sum1 = WC.Angle.rad(1) + WC.Angle.rad(1);
        var sum2 = WC.Angle.rad(1) * 3;
        expect(sum1).toEqual(2);
        expect(sum2).toEqual(3);
    });
});

describe("JDate", function () {
    it("test dt class method", function () {
        expect(WC.JDate.dt(1702)).toBeCloseTo(10.0,0);
        expect(WC.JDate.dt(1802)).toBeCloseTo(13.1,0);
        expect(WC.JDate.dt(1988)).toBeCloseTo(55.8,0);
        expect(WC.JDate.dt(1902)).toBeCloseTo(0,0);
        expect(WC.JDate.dt(1960)).toBeCloseTo(33.2,0);
        expect(WC.JDate.dt(2015)).toBeCloseTo(69.0,0);
    });

    it("test gd2jd class method", function () {
        expect(WC.JDate.gd2jd(1977, 4, 26.4)).toBeCloseTo(2443259.9,1);
        expect(WC.JDate.gd2jd(2000, 1, 1.5)).toBeCloseTo(2451545.0,1);
        expect(WC.JDate.gd2jd(1987, 1, 27.0)).toBeCloseTo(2446822.5,1);
        expect(WC.JDate.gd2jd(1987, 4, 10)).toBeCloseTo(2446895.5,1);
        expect(WC.JDate.gd2jd(1987, 6, 19.5)).toBeCloseTo(2446966.0,1);
        expect(WC.JDate.gd2jd(1988, 1, 27.0)).toBeCloseTo(2447187.5,1);
        expect(WC.JDate.gd2jd(1988, 6, 19.5)).toBeCloseTo(2447332.0,1);
        expect(WC.JDate.gd2jd(1900, 1, 1.0)).toBeCloseTo(2415020.5,1);
        expect(WC.JDate.gd2jd(1600, 1, 1.0)).toBeCloseTo(2305447.5,1);
        expect(WC.JDate.gd2jd(1600, 12, 31.0)).toBeCloseTo(2305812.5,1);
        expect(WC.JDate.gd2jd(837, 4, 10.3)).toBeCloseTo(2026871.8,1);
        expect(WC.JDate.gd2jd(-1000, 7, 12.5)).toBeCloseTo(1356001.0,1);
        expect(WC.JDate.gd2jd(-1000, 2, 29.0)).toBeCloseTo(1355866.5,1);
        expect(WC.JDate.gd2jd(-1001, 8, 17.9)).toBeCloseTo(1355671.4,1);
        expect(WC.JDate.gd2jd(-4712, 1, 1.5)).toBeCloseTo(0.0,1);
    });

    it("test jd2gd class method", function () {
        expect(WC.JDate.jd2gd(2446822.5)).toEqual({Y:1987, M:1, D:27, h:0, m:0, s:0});
        expect(WC.JDate.jd2gd(0)).toEqual({Y:-4712, M:1, D:1, h:12, m:0, s:0});
        expect(WC.JDate.jd2gd(2443259.9)).toEqual({Y:1977, M:4, D:26, h:9, m:35, s:59.99});
    });

});


describe("Coord", function () {
    it("test obl class method", function () {
        var jd = WC.JDate.gd(2013,1,1,12);
        expect(WC.Coord.obl(jd).toDMS()).toEqual("+ 23°26’15.36”");
    });

    it("test",function(){
        //WC.JQtest(WC.JDate.gd(2000,1,1,12));
    });

});