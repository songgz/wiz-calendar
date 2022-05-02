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
    mjd = 0;
    phase = 0;
    sign = '';
    time = '';
    day = 0;

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

    getTime() {
        return JulianDate.timeStr(this.mjd);
    }

    getMjdn() {
        return Math.floor(this.mjd + 0.5);
    }

    static Signs = ['●', '☽', '○', '☾'];
}



