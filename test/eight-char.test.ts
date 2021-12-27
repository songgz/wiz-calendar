import {EightChar} from "../src/eight-char";
import {JulianDate} from "../src/julian-date";


describe('EightChar Class', () => {
    test('new method', () => {
        //2014-4-23 10:37:40   //甲午年 戊辰月 甲子日 己巳时 真太阳 10:24:48
        let jd = JulianDate.gd2jd(2014, 4, 23, 10,37,40); //2456770.942824074
        let ec = new EightChar(jd);
        expect(ec.getYear()).toBe('甲午');
        expect(ec.getMonth()).toBe('戊辰');
        expect(ec.getDay()).toBe('甲子');
        expect(ec.getHour()).toBe('己巳');
    });

});
