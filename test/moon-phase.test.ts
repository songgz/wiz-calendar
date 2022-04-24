import {LunarDate} from "../src";
import {MoonPhaseName} from "../src/MoonPhase";


describe('Moonphase Class', () => {
    test('getMoonphase method', () => {
        let l1 = new LunarDate(1977,4,1);
        //let m1 = new MoonPhase(l1.getFirstOfMonth());
        //m1.getMoonphase(MoonphaseName.NewMoon);
        //{"1": {"mjd": -8263.047660221844, "phase": 1, "sign": "●", "time": "10:51:22"}, "16": {"mjd": -8248.311906536072, "phase": 3, "sign": "○", "time": "04:30:51"}, "22": {"mjd": -8241.536798262809, "phase": 4, "sign": "☾", "time": "23:07:01"}, "9": {"mjd": -8255.027719730515, "phase": 2, "sign": "☽", "time": "11:20:05"}}
        expect(l1.getMoonPhase(MoonPhaseName.NewMoon).mjdTT()).toBeCloseTo(-8263.047660221844, 10);

        //let l2 = new LunarDate(1075,4,1);
        //expect(l2.calcMoonPhase()).toStrictEqual({"1": {"mjd": -337736.06617712503, "phase": 1, "sign": "●", "time": "10:24:42"}, "16": {"mjd": -337720.8234802974, "phase": 3, "sign": "○", "time": "16:14:11"}, "23": {"mjd": -337714.23680114903, "phase": 4, "sign": "☾", "time": "06:19:00"}, "9": {"mjd": -337727.9089751736, "phase": 2, "sign": "☽", "time": "14:11:05"}});

    });

});
