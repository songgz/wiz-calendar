import {SunMoon} from "./ephem";
import {JulianDate} from "./julian-date";
import {Angle} from "./angle";

export class MoonPhase {
    private readonly mjd: number;
    private newMoons: number | undefined;
    private moonPhases: {[key: number]: JulianDate} = {};

    constructor(mjd: number) {
        this.mjd = mjd;
    }

    getNewMoons(): number {
        if(this.newMoons === undefined) {
            let ms = SunMoon.aLongD((this.mjd) / 36525, 10, 3);
            this.newMoons = Math.floor((ms + 2) / Angle.PI2);
        }
        return this.newMoons;
    }

    getMoonPhase(moonphaseName: MoonPhaseName) {
        if (this.moonPhases[moonphaseName] === undefined) {
            let mjd = SunMoon.mjdUTC((this.getNewMoons() + moonphaseName / 4.0) * Angle.PI2);
            //console.log(n);
            //console.log(n + JulianDate.J2000 - JulianDate.J2000);
            this.moonPhases[moonphaseName] = new JulianDate(mjd);
        }
        return this.moonPhases[moonphaseName];
    }

    static Signs = ['●', '☽', '○', '☾'];
}


export enum MoonPhaseName {
    //朔，新月
    NewMoon = 0,
    //上弦
    FirstQuarter = 1,
    //望，满月
    FullMoon = 2,
    //下弦
    LastQuarter = 3,
}
