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

    test('getReignTitle method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        expect(l1.getReignTitle()).toBe('[当代]中国  公历纪元1977年');
        expect(l2.getReignTitle()).toBe('[北宋]神宗 赵顼 熙宁8年');

    });

    test('year Stem  Branch method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        expect(l1.getYearStem() + l1.getYearBranch()).toBe('丁巳');
        expect(l2.getYearStem() + l2.getYearBranch()).toBe('乙卯');

    });

    test('getYearAnimal method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        expect(l1.getYearAnimal()).toBe('蛇');
        expect(l2.getYearAnimal()).toBe('兔');

    });

    test('month Stem  Branch method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        let l3 = new LunarDate(1075,4,1,true);
        expect(l1.getMonthStem() + l1.getMonthBranch()).toBe('乙巳');
        expect(l2.getMonthStem() + l2.getMonthBranch()).toBe('辛巳');
        expect(l3.getMonthStem() + l3.getMonthBranch()).toBe('辛巳');
    });

    test('day Stem  Branch method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        let l3 = new LunarDate(1075,4,1,true);
        expect(l1.getDayStem() + l1.getDayBranch()).toBe('乙亥');
        expect(l2.getDayStem() + l2.getDayBranch()).toBe('壬戌');
        expect(l3.getDayStem() + l3.getDayBranch()).toBe('壬辰');
    });

    test('hour Stem  Branch method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        let l3 = new LunarDate(1075,4,1,true);
        expect(l1.getHourStem() + l1.getHourBranch()).toBe('丙子');
        expect(l2.getHourStem() + l2.getHourBranch()).toBe('庚子');
        expect(l3.getHourStem() + l3.getHourBranch()).toBe('庚子');
    });

    test('getFirstOfMonth method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        expect(l1.getFirstOfMonth()).toBe(2443282);
        expect(l2.getFirstOfMonth()).toBe(2113809);

    });

    test('getLastOfMonth method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        expect(l1.getLastOfMonth()).toBe(2443311);
        expect(l2.getLastOfMonth()).toBe(2113838);

    });

    test('calcMoonPhase method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        expect(l1.calcMoonPhase()).toStrictEqual({"1": {"mjd": -8263.047660221844, "phase": 1, "sign": "●", "time": "10:51:22"}, "16": {"mjd": -8248.311906536072, "phase": 3, "sign": "○", "time": "04:30:51"}, "22": {"mjd": -8241.536798262809, "phase": 4, "sign": "☾", "time": "23:07:01"}, "9": {"mjd": -8255.027719730515, "phase": 2, "sign": "☽", "time": "11:20:05"}});
        expect(l2.calcMoonPhase()).toStrictEqual({"1": {"mjd": -337736.06617712503, "phase": 1, "sign": "●", "time": "10:24:42"}, "16": {"mjd": -337720.8234802974, "phase": 3, "sign": "○", "time": "16:14:11"}, "23": {"mjd": -337714.23680114903, "phase": 4, "sign": "☾", "time": "06:19:00"}, "9": {"mjd": -337727.9089751736, "phase": 2, "sign": "☽", "time": "14:11:05"}});

    });

    test('calcPentads method', () => {
        let l1 = new LunarDate(1977,4,1);
        let l2 = new LunarDate(1075,4,1);
        expect(l1.calcPentads()).toStrictEqual({"14": {"idx": 14, "mjd": -8249.574844103354, "name": "三候", "sign": "▲", "style": 3, "time": "22:12:13"}, "20": {"idx": 15, "mjd": -8244.352768111572, "name": "芒种", "sign": "◆", "style": 1, "time": "03:32:01"}, "25": {"idx": 16, "mjd": -8239.125074069498, "name": "二候", "sign": "▲", "style": 2, "time": "08:59:54"}, "30": {"idx": 17, "mjd": -8233.893316933369, "name": "三候", "sign": "▲", "style": 3, "time": "14:33:37"}, "35": {"idx": 18, "mjd": -8228.657127700872, "name": "夏至", "sign": "◆", "style": 0, "time": "20:13:44"}, "4": {"idx": 12, "mjd": -8259.990049679236, "name": "小满", "sign": "◆", "style": 0, "time": "12:14:20"}, "9": {"idx": 13, "mjd": -8254.78819516463, "name": "二候", "sign": "▲", "style": 2, "time": "17:05:00"}});
        expect(l2.calcPentads()).toStrictEqual({"13": {"idx": 9, "mjd": -337723.72590414487, "name": "立夏", "sign": "◆", "style": 1, "time": "18:34:42"}, "18": {"idx": 10, "mjd": -337718.5175525063, "name": "二候", "sign": "▲", "style": 2, "time": "23:34:43"}, "24": {"idx": 11, "mjd": -337713.3009869755, "name": "三候", "sign": "▲", "style": 3, "time": "04:46:35"}, "29": {"idx": 12, "mjd": -337708.07782516006, "name": "小满", "sign": "◆", "style": 0, "time": "10:07:56"}, "3": {"idx": 7, "mjd": -337734.10560091044, "name": "二候", "sign": "▲", "style": 2, "time": "09:27:56"}, "34": {"idx": 13, "mjd": -337702.8482978428, "name": "二候", "sign": "▲", "style": 2, "time": "15:38:27"}, "8": {"idx": 8, "mjd": -337728.9225275461, "name": "三候", "sign": "▲", "style": 3, "time": "13:51:34"}});

    });


});
