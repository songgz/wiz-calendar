import {JulianDate} from "./julian-date";

export class SolarTerm {
    mjd = 0;
    term = 0;

    constructor(mjd: number, term: number) {
        this.mjd = mjd;
        this.term = term;
    }

    getJulianDate() {
        return new JulianDate(this.mjd);
    }



    // getSolarTerm2(solarTermName: SolarTermName) {
    //
    //     return  new JulianDate(Sun.mjd((this.getSpringEquinoxes() + solarTermName / 24) * Angle.PI2));
    //
    // }




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
