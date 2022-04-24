import {JulianDate} from "./julian-date";
import {Angle} from "./angle";
import {Sun} from "./ephem";

export class SolarTerm {
    private readonly mjd: number;
    private springEquinoxes: number | undefined;
    private solarTerms: {[key: number]: JulianDate} = {};


    constructor(mjd: number) {
        this.mjd = mjd;
    }

    //春分周期数，春分太阳位于黄经0度
    getSpringEquinoxes() {
        if(this.springEquinoxes === undefined){
            let w = Sun.aLong((this.mjd) / 36525.0, 3);
            this.springEquinoxes = Math.floor(w / Angle.PI2 + 0.01);
        }
        return this.springEquinoxes;
    }

    getSolarTerm(solarTermName: SolarTermName): JulianDate {
        if(this.solarTerms[solarTermName] === undefined) {
            this.solarTerms[solarTermName] = new JulianDate(Sun.mjd((this.getSpringEquinoxes() + solarTermName / 24) * Angle.PI2));
        }
        return this.solarTerms[solarTermName];
    }

    // getSolarTerm2(solarTermName: SolarTermName) {
    //
    //     return  new JulianDate(Sun.mjd((this.getSpringEquinoxes() + solarTermName / 24) * Angle.PI2));
    //
    // }

    /**
     * 求某时刻临近的节气，返回东八区的儒略日时间
     * 高精度
     * @param mjd - J2000.0算起的儒略日时间
     * @return - 东八区儒略日
     */
    static closestJD(mjd: number) { //精气
        const d = Math.PI / 12;
        const w = Math.floor((mjd + 293) / 365.2422 * 24) * d;
        const a = Sun.mjd(w);
        if (a - mjd > 5) return Sun.mjd(w - d);
        if (a - mjd < -5) return Sun.mjd(w + d);
        return a;
    }


}


export enum SolarTermName {
    //春分
    SpringEquinox = 0,
    //清明
    PureBrightness = 1,
    //谷雨
    GrainRain= 2,
    //立夏
    StartOfSummer = 3,
    //小满
    GrainFull = 4,
    //芒种
    GrainInEar = 5,
    //夏至
    SummerSolstice = 6,
    //小暑
    SlightHeat = 7,
    //大暑
    GreatHeat = 8,
    //立秋
    StartOfAutumn = 9,
    //处暑
    LimitOfHeat = 10,
    //白露
    WhiteDew = 11,
    //秋分
    AutumnalEquinox = 12,
    //寒露
    ColdDew = 13,
    //霜降
    FrostDescent = 14,
    //立冬
    StartOfWinter = 15,
    //小雪
    SlightSnow = 16,
    //大雪
    GreatSnow = 17,
    //冬至
    WinterSolstice = 18,
    //小寒
    SlightCold = 19,
    //大寒
    GreatCold = 20,
    //立春
    StartOfSpring = 21,
    //雨水
    RainWater = 22,
    //惊蛰
    InsectsAwaken = 23,
}
