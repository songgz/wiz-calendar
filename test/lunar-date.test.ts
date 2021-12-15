import {LunarDate} from "../src/lunar-date";


describe('LunarDate Class', () => {
    test('hasLeapMonth method', () => {
        let l1 = new LunarDate(1977,4,0,1);
        let l2 = new LunarDate(2009,5,1,1);
        expect(l1.hasLeapMonth()).toBe(false);
        expect(l2.hasLeapMonth()).toBe(true);
    });

    test('calcJD method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(2009,5,1,true);
        expect(l1.jd).toBe(2443282);
        expect(l2.jd).toBe(2455006);
    });

    test('calcLunar method', () => {
        let l1 = new LunarDate(2443282);
        let l2 = new LunarDate(2455006);
        expect(l1.toHash()).toStrictEqual({D:1,M:4,N:30,R:false,Y:1977,h:12,m:0,s:0});
        expect(l2.toHash()).toStrictEqual({D:1,M:5,N:29,R:true,Y:2009,h:12,m:0,s:0});
    });

});
