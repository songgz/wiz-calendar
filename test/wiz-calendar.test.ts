import {WizCalendar} from "../src/wiz-calendar";
import {SolarDate} from "../src";

describe('WizCalendar Class', () => {
    test('julianDate method', () => {
        let mjd = -8263; //J2000算起的儒略日
        let julian = WizCalendar.julianDate(mjd);
        expect(julian.mjdTT()).toEqual(mjd);
    });

    test('solarDate method', () => {
        let solar = WizCalendar.solarDate(1977, 5, 18);
        expect(solar.format('date')).toBe('1977-05-18');
    });

    test('lunarDate method', () => {
        let lunar = WizCalendar.lunarDate(1977,4,1);
        expect(lunar.format('date')).toBe('1977-04-01+0');
    });

});
