import {SolarDate} from "./solar-date";
import {LunarDate} from "./lunar-date";
import {JulianDate} from "./julian-date";

export class WizCalendar {
    private static instance: WizCalendar;
    private currentDate: SolarDate | LunarDate | JulianDate | undefined;

    private constructor() {
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new WizCalendar();
        }
        return this.instance;
    }

    static solarDate(year: number, month: number, day: number, hr?: number, min?: number, sec?: number) {
        return this.instance.currentDate = new SolarDate(year, month, day, hr, min, sec);
    }

    static lunarDate(year: number, month: number, day: number, leap: boolean, hr?: number, min?: number, sec?: number) {
        return this.instance.currentDate = new LunarDate(year, month, day, leap, hr, min, sec);
    }

    static julianDate(mjd: number) {
        return this.instance.currentDate = new LunarDate(mjd);
    }
}
