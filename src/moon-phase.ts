import {JulianDate} from "./julian-date";

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

export class MoonPhase {
    private readonly mjd: number;
    private readonly phase: number;

    constructor(mjd: number, phase: number) {
        this.mjd = mjd;
        this.phase = phase;
    }

    getPhase() {
        return this.phase;
    }

    getSign() {
        return MoonPhase.Signs[this.phase];
    }

    getJulianDate() {
        return new JulianDate(this.mjd);
    }

    static Signs = ['●', '☽', '○', '☾'];
}



