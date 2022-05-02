import {JulianDate} from "../src/julian-date";
import {SolarDate} from "../src/solar-date";
import {LunarDate} from "../src/lunar-date";

describe('JulianDate Class', () => {
    test('fromUTC method', () => {
        expect(new SolarDate(1977, 4, 26.4).valueOf()).toBe(2443259.9);
        expect(new SolarDate(2000, 1, 1.5).valueOf()).toBe(2451545.0);
        expect(new SolarDate(1987, 1, 27.0).valueOf()).toBe(2446822.5);
    });

    test("test gd2jd", () => {
        //dj = 2456770.942824074 //2014-4-23 10:37:40   //甲午年 戊辰月 甲子日 己巳时 真太阳 10:24:48
        let j = JulianDate.gd2jd(2014, 4, 23, 10, 37, 40);
        expect(j).toBeCloseTo(2456770.942824074, 8);
        j = JulianDate.gd2jd(2021, 12, 26, 21, 0, 32);
        expect(j).toBeCloseTo(2459575.37537037, 8);

    });

    test("test DD", () => {
        //dj = 2456770.942824074 //2014-4-23 10:37:40   //甲午年 戊辰月 甲子日 己巳时 真太阳 10:24:48
        let d = JulianDate.DD(2456770.942824074);
        expect(d).toEqual({Y:2014,M:4,D:23,h:10,m:37,s:40});

        d = JulianDate.DD(2459575.37537037);
        expect(d).toEqual({Y:2021,M:12,D:26,h:21,m:0,s:32});

    });

    test('getSolarDate method', () => {
        let s1 = new SolarDate(2021, 12, 26, 21, 0, 32); //2459575.37537037
        let j = s1.getJulianDate();
        let s2 = j.getSolarDate();
        expect(s2.toHash()).toStrictEqual(s1.toHash());
    });

    test('getLunarDate method', () => {
        let s1 = new LunarDate(2021, 11, 23, false, 21, 0, 32); //2459575.37537037
        let j = s1.getJulianDate();
        let s2 = j.getLunarDate();
        expect(s2.toHash()).toStrictEqual(s1.toHash());

        let s11 = new LunarDate(1977, 4, 1, false, 0, 0, 0);
        let j2 = s11.getJulianDate();
        let s21 = j2.getLunarDate();
        expect(s21.toHash()).toStrictEqual(s11.toHash());

        let s111 = new LunarDate(1949, 7, 23, true);
        let j21 = JulianDate.fromJDN(2433175);
        let s211 = j21.getLunarDate();
        expect(s211.toHash()).toStrictEqual(s111.toHash());
    });



});
