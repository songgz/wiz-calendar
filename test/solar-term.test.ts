import {LunarDate, SolarTermName, JulianDate, Sun} from "../src";

describe('SolarTerm Class', () => {
    test('getSolarTerm method', () => {
        let l1 = new LunarDate(1977,4,1);
        let s1 = new Sun(l1.getFirstOfMonth());
        expect(s1.getSolarTerm(SolarTermName.WinterSolstice).getJulianDate().getJDN()).toBe(-8045 + JulianDate.J2000);
        expect(s1.getSolarTerm(SolarTermName.SummerSolstice).getJulianDate().getMJDN()).toBe(-8229);
        expect(s1.getSolarTerm(SolarTermName.StartOfAutumn).getJulianDate().getMJDN()).toBe(-8182);

        let l2 = new LunarDate(1075,4,1);
        let s2 = new Sun(l2.getFirstOfMonth());
        expect(s2.getSolarTerm(SolarTermName.WinterSolstice).getJulianDate().getMJDN()).toBe(-337494);
        expect(s2.getSolarTerm(SolarTermName.SummerSolstice).getJulianDate().getMJDN()).toBe(-337677);
        expect(s2.getSolarTerm(SolarTermName.StartOfAutumn).getJulianDate().getMJDN()).toBe(-337630);

    });

    test('getSolarTerm method', () => {
        let l1 = new LunarDate(1977,4,1);
        let s1 = new Sun(l1.getFirstOfMonth());
        let term = s1.getSolarTerm(SolarTermName.WinterSolstice);
        expect(term.getJulianDate().getMJDN()).toBe(-8045);
        expect(term.getJulianDate().getJDN()).toBe(2443500);
        expect(term.getJulianDate().formatTime()).toBe('07:23:08');
    });

    test('getSolarTerm method', () => {
        let s1 = new Sun(2443296 - JulianDate.J2000);
        console.log(s1.getPrevSolarTerm());
        console.log(s1.getTerm());
        console.log(s1.getNextSolarTerm());
    });

});
