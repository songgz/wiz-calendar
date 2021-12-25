
import {LunarDate} from "../src/lunar-date";
import {SolarTerm, SolarTermName} from "../src/solar-term";

describe('SolarTerm Class', () => {
    test('getSolarTerm method', () => {
        let l1 = new LunarDate(1977,4,1);
        let s1 = new SolarTerm(l1.getFirstOfMonth());
        expect(s1.getSolarTerm(SolarTermName.WinterSolstice)).toBe(-8045);
        expect(s1.getSolarTerm(SolarTermName.SummerSolstice)).toBe(-8229);
        expect(s1.getSolarTerm(SolarTermName.StartOfAutumn)).toBe(-8182);

        let l2 = new LunarDate(1075,4,1);
        let s2 = new SolarTerm(l2.getFirstOfMonth());
        expect(s2.getSolarTerm(SolarTermName.WinterSolstice)).toBe(-337494);
        expect(s2.getSolarTerm(SolarTermName.SummerSolstice)).toBe(-337677);
        expect(s2.getSolarTerm(SolarTermName.StartOfAutumn)).toBe(-337630);

    });

});
