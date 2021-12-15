import {JDate} from "../src/j-date";
import {Angle} from "../src/angle";

describe('JDate Class', () => {
    test('fromUTC method', () => {
        expect(JDate.fromUTC(1977, 4, 26.4).valueOf()).toBe(2443259.9);
        expect(JDate.fromUTC(2000, 1, 1.5).valueOf()).toBe(2451545.0);
        expect(JDate.fromUTC(1987, 1, 27.0).valueOf()).toBe(2446822.5);
    });

});
