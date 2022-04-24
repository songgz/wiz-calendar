
import {LunarDate} from "../src/lunar-date";
import {SolarTerm, SolarTermName} from "../src/solar-term";
import {JulianDate} from "../src/julian-date";

describe('SolarTerm Class', () => {
    test('getSolarTerm method', () => {
        let l1 = new LunarDate(1977,4,1);
        let s1 = new SolarTerm(l1.getFirstOfMonth());
        expect(s1.getSolarTerm(SolarTermName.WinterSolstice).jdn()).toBe(-8045 + JulianDate.J2000);
        expect(s1.getSolarTerm(SolarTermName.SummerSolstice).mjdn()).toBe(-8229);
        expect(s1.getSolarTerm(SolarTermName.StartOfAutumn).mjdn()).toBe(-8182);

        let l2 = new LunarDate(1075,4,1);
        let s2 = new SolarTerm(l2.getFirstOfMonth());
        expect(s2.getSolarTerm(SolarTermName.WinterSolstice).mjdn()).toBe(-337494);
        expect(s2.getSolarTerm(SolarTermName.SummerSolstice).mjdn()).toBe(-337677);
        expect(s2.getSolarTerm(SolarTermName.StartOfAutumn).mjdn()).toBe(-337630);

    });

    test('getSolarTerm method', () => {
        let l1 = new LunarDate(1977,4,1);
        let s1 = new SolarTerm(l1.getFirstOfMonth());
        let term = s1.getSolarTerm(SolarTermName.WinterSolstice);
        expect(term.mjdn()).toBe(-8045);
        expect(term.jdn()).toBe(2443500);
        expect(term.formatTime()).toBe('07:23:08');
    });

});
