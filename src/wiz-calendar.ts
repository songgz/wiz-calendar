import {SolarDate} from "./solar-date";
import {LunarDate} from "./lunar-date";
import {JulianDate} from "./julian-date";
import {EightChar} from "./eight-char";

export class WizCalendar {

    static solarDate(year: number, month: number, day: number, hr?: number, min?: number, sec?: number): SolarDate {
        return new SolarDate(year, month, day, hr, min, sec);
    }

    static lunarDate(year: number, month: number, day: number, leap?: boolean, hr?: number, min?: number, sec?: number): LunarDate {
        return new LunarDate(year, month, day, leap, hr, min, sec);
    }

    static julianDate(mjd: number): JulianDate {
        return new JulianDate(mjd);
    }

    static eightChar(mjd: number, long?: number, timezone?: number) {
        return new EightChar(mjd);
    }
}
