import {Angle} from "./angle";
import {JulianDate} from "./julian-date";
import {Sun} from "./ephem";
import {LunarDate} from "./lunar-date";

export class EightChar {
    yearStem = 0;
    yearBranch = 0;
    monthStem = 0;
    monthBranch = 0;
    dayStem = 0;
    dayBranch = 0;
    hourStem = 0;
    hourBranch = 0;
    timezone = 0;
    long = 0;
    mjd = 0;
    /**
     * 力学时
     */
    mjde = 0;
    /**
     * 本地真太阳时(使用低精度算法计算时差)
     */
    apparentSolarTime = 0;

    //TT=UTC+64.184s
    /**
     * @param mjd - J2000.0算起的儒略日
     * @param long - 地球经度
     * @param timezone - 时区
    */
    constructor(mjd: number, long?: number, timezone?: number) {
        this.long = (long || 116.383333) * Angle.D2R
        this.timezone = timezone || (new Date()).getTimezoneOffset() / 60;
        this.mjd = mjd + this.timezone / 24;
        this.mjde = this.mjd + JulianDate.dt_T(this.mjd);
        this.apparentSolarTime = this.mjd + JulianDate.apparentSolarTime(this.mjde / 36525) + this.long / Angle.PI2;

        let w = Sun.aLong( this.mjde / 36525, -1 );
        let k = Math.floor((w / (2 * Math.PI) * 360 + 45 + 15 * 360) / 30); //1984年立春起算的节气数(不含中气)
        this.yearStem = Math.floor(k / 12 + 6000000) % 10;
        this.yearBranch = Math.floor(k / 12 + 6000000) % 12;
        this.monthStem = (k + 2 + 60000000) % 10;
        this.monthBranch = (k + 2 + 60000000) % 12;

        let jde = this.apparentSolarTime + 13 / 24; //转为前一日23点起算(原jd为本日中午12点起算)
        let jdn = Math.floor(jde);
        let bigHour = Math.floor((jde - jdn) * 12); //日数与时辰
        this.dayStem = (jdn - 6 + 9000000) % 10;
        this.dayBranch = (jdn - 6 + 9000000) % 12;
        this.hourStem = ((jdn - 1) * 12 + 90000000 + bigHour) % 10;
        this.hourBranch = ((jdn - 1) * 12 + 90000000 + bigHour) % 12;
    }

    getYear() {
        return LunarDate.Stems[this.yearStem] + LunarDate.Branches[this.yearBranch];
    }

    getMonth() {
        return LunarDate.Stems[this.monthStem] + LunarDate.Branches[this.monthBranch];
    }

    getDay() {
        return LunarDate.Stems[this.dayStem] + LunarDate.Branches[this.dayBranch];
    }

    getHour() {
        return LunarDate.Stems[this.hourStem] + LunarDate.Branches[this.hourBranch];
    }
}
