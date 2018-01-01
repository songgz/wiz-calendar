describe("A JDate is just a function", function() {

    it("The 'dt' compute delta time (ΔT = TD - UT)", function() {
        expect(Lunisolar.JDate.dt(1702)).toEqual(dt_calc(1702));
        expect(Lunisolar.JDate.dt(-500)).toEqual(dt_calc(-500));
        expect(Lunisolar.JDate.dt(2200)).toEqual(dt_calc(2200));       
    });

    it("test valueOf", function() {
        var d = Lunisolar.JDate(10);
        expect(d + 5).toEqual(15);
        expect(d / 3).toBeCloseTo(3.33, 2);
        expect(d * 3).toEqual(30);
        expect(d - 3.0).toEqual(7.0);
    });

    it("test gd2jd", function() {
        //dj = 2456770.942824074 //2014-4-23 10:37:40   //甲午年 戊辰月 甲子日 己巳时 真太阳 10:24:48        
        var j = Lunisolar.JDate.gd2jd(2014,4,23,10,37,40);
        expect(j).toBeCloseTo(2456770.942824074);

    });

    it("test DD", function() {
        //dj = 2456770.942824074 //2014-4-23 10:37:40   //甲午年 戊辰月 甲子日 己巳时 真太阳 10:24:48
        var d = Lunisolar.JDate.DD(2456770.942824074);
        expect(d).toEqual({Y:2014,M:4,D:23,h:10,m:37,s:40});

    });
});
