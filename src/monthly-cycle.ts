import {SunMoon} from "./ephem";
import {Angle} from "./angle";

export class MonthlyCycle {
    ms = 0;
    newMoon = 0;
    nextNewMoon = 0;

    constructor(mjc: number) {
        this.ms = SunMoon.aLongD(mjc / 36525, 10, 3);
        this.ms = Math.floor((this.ms + 2) / Angle.PI2) * Angle.PI2; //朔日
        this.newMoon = SunMoon.mjd(this.ms);

        if (Math.floor(this.newMoon + 0.5) > Math.floor(mjc + 0.5)) {
            this.nextNewMoon = this.newMoon;
            this.newMoon = SunMoon.mjd(this.ms - Angle.PI2);
        } else {
            this.ms += Angle.PI2;
            this.nextNewMoon = SunMoon.mjd(this.ms);
        }
    }
}
