import {SolarDate} from "./solar-date";

export class ChineseCalendar {
    solarDate: SolarDate | undefined

    constructor() {
    }

    static fromSolarDate(year: number, month: number, day: number) {
        let solar = new ChineseCalendar();
        solar.solarDate = new SolarDate(year, month, day, 12);
        return solar;
    }

    daysOfMonth() {

    }
}
