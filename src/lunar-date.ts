import {JDate} from "./j-date"
import {MoonPhase, Sun} from "./ephem";
import {Angle} from "./angle";

let int2 = function(v: number) { return Math.floor(v); };

export class LunarDate {
    jd = 0.0;
    year = 0;
    month = 0;
    day = 0.0;
    hour = 0;
    minute = 0;
    second = 0;
    leap = false;
    days = 0;

    constructor(...options: any[]){
        switch (options.length) {
            case 0:
                this.jd = 0;
                break;
            case 1:
                this.jd = options[0];
                this.calcLunar();
                break;
            case 3:
            case 4:
                this.year = options[0];
                this.month = options[1];
                this.day = options[2];
                this.leap = options[3] || false;
                this.jd = this.calcJD();
                let t = this.day;
                this.day = Math.floor(this.day)
                t =  (t -this.day) * 24;
                this.hour = Math.floor(t);
                t = (t - this.hour) * 60;
                this.minute = Math.floor(t);
                this.second = Math.floor((t - this.minute) * 60);
                break;
            default:
                this.year = options[0];
                this.month = options[1];
                this.day = options[2];
                this.leap = options[3];
                this.hour = options[4];
                this.minute = options[5];
                this.second = options[6];
                break;
        }
    }

    hasLeapMonth(): boolean {
        let nextNewMoon;
        let w = (this.year - 2000 + (this.month + 10.5) / 12) * Angle.PI2; //节气
        let majorSolarTerm = Sun.jd(w);
        let solarTermRad24 = Angle.PI2 / 24;
        let ms = MoonPhase.aLongD(majorSolarTerm / 36525, 10, 3);
        ms = Math.floor((ms + 2) / Angle.PI2) * Angle.PI2; //朔日
        let newMoon = MoonPhase.jd(ms);

        if (Math.floor(newMoon + 0.5) > int2(majorSolarTerm + 0.5)) {
            nextNewMoon = newMoon;
            newMoon = MoonPhase.jd(ms - Angle.PI2);
        }else{
            ms += Angle.PI2;
            nextNewMoon = MoonPhase.jd(ms);
        }

        if (Math.floor(newMoon + 0.5) > Math.floor(Sun.jd(w - solarTermRad24) + 0.5) && Math.floor(nextNewMoon + 0.5) <= Math.floor(Sun.jd(w + solarTermRad24) + 0.5)) {
            let solarTermRad12 = Angle.PI2 / 12;
            w += solarTermRad24;
            for (let j = 0; j <= 5; j++) {
                w += solarTermRad12; //下一个中气
                ms += Angle.PI2; //下一个朔日
                if (Math.floor(MoonPhase.jd(ms) + 0.5) > Math.floor(Sun.jd(w) + 0.5)){
                    return this.leap = false;
                }
            }
            return this.leap = true;
        }
        return this.leap = false;
    }

    /**
     * 农历转儒略日
     * @param year
     * @param month
     * @param isLeap
     * @param day
     */
    calcJD() {
        let nextNewMoon;
        let w = (this.year - 2000 + (this.month + 10) / 12) * Angle.PI2; //中气
        let minorSolarTerm = Sun.jd(w);
        let ms = MoonPhase.aLongD(minorSolarTerm / 36525, 10, 3);
        ms = Math.floor((ms + 2) / Angle.PI2) * Angle.PI2; //合朔
        let newMoon = MoonPhase.jd(ms);
        if (Math.floor(newMoon + 0.5) > Math.floor(minorSolarTerm + 0.5)) {
            nextNewMoon = newMoon;
            newMoon = MoonPhase.jd(ms - Angle.PI2);
        } else {
            ms += Angle.PI2;
            nextNewMoon = MoonPhase.jd(ms);
        }
        let solarTermRad24 = Angle.PI2 / 24;
        let solarTermRad12 = Angle.PI2 / 12;
        if (Math.floor(newMoon + 0.5) > Math.floor(Sun.jd(w - solarTermRad24) + 0.5) && Math.floor(nextNewMoon + 0.5) > Math.floor(Sun.jd(w + solarTermRad24) + 0.5)) {
            w += solarTermRad12;
            for (let j = 0; j <= 5; j++) {
                if (Math.floor(MoonPhase.jd(ms + j * Angle.PI2) + 0.5) > Math.floor(Sun.jd(w + j * Angle.PI2 / 12) + 0.5)) {
                    nextNewMoon = newMoon;
                    newMoon = MoonPhase.jd(ms - 2 * Angle.PI2);
                    break;
                }
            }
        }
        if (this.leap) {
            this.leap = this.hasLeapMonth();
        }
        if (!this.leap){
            return this.jd = Math.floor(newMoon + this.day - 1 + 0.5) + JDate.J2000;
        } else {
            return this.jd = Math.floor(nextNewMoon + this.day - 1 + 0.5) + JDate.J2000;
        }
    }

    calcLunar() {
        let nextNewMoon, w1, w2, wn, y, m, d, n, fd, ry;
        let F = this.jd + 0.5 - Math.floor(this.jd + 0.5);
        let mjd = Math.floor(this.jd + 0.5) - JDate.J2000;
        let ms = MoonPhase.aLongD(mjd / 36525, 10, 3);
        ms = Math.floor((ms + 2) / Angle.PI2) * Angle.PI2; //合朔
        let newMoon = MoonPhase.jd(ms);

        if (Math.floor(newMoon + 0.5) > mjd) {
            nextNewMoon = newMoon;
            newMoon = MoonPhase.jd(ms - Angle.PI2);
        } else {
            ms += Angle.PI2;
            nextNewMoon = MoonPhase.jd(ms);
        }

        let solarTermRad24 = Angle.PI2 / 24;
        let solarTermRad12 = Angle.PI2 / 12;

        w1 = Sun.aLong(newMoon / 36525, 3);
        w1 = Math.floor(w1 / solarTermRad24) * solarTermRad24; //节气
        while (Math.floor(Sun.jd(w1) + 0.5) < Math.floor(newMoon + 0.5)){
            w1 += solarTermRad24;
        }
        w2 = w1;
        while (Math.floor(Sun.jd(w2 + solarTermRad24) + 0.5) < Math.floor(nextNewMoon + 0.5)){
            w2 += solarTermRad24;
        }
        wn = Math.floor((w2 + 0.1) / solarTermRad24) + 4; //节气数
        y = Math.floor(wn / 24) + 2000 -1;
        wn = (wn % 24 + 24) % 24;
        m = Math.floor(wn / 2);
        d = mjd - Math.floor(newMoon + 0.5) + 1;
        n = Math.floor(nextNewMoon + 0.5) - Math.floor(newMoon + 0.5);
        fd = w2 - w1 < Angle.PI2 / 20 ? wn % 2 : 0;
        ry = w2 == w1 ? fd : 0;
        ms += Angle.PI2;
        w2 += 1.5 * solarTermRad12
        for (let j = 0; fd && j <= 5; j++) {
            if (Math.floor(Sun.jd(w2 + j * solarTermRad12) + 0.5) < Math.floor(MoonPhase.jd(ms + j * Angle.PI2) + 0.5)) {
                m++;
                ry = 0;
                if (m > 12) {
                    m = 1;
                    y++;
                }
                break;
            }
        }
        if (m == 0) {
            m = 12;
            y--;
        }
        // var ri: any = {};
        // ri.Y = y;
        // ri.M = m;
        // ri.R = ry;
        // ri.D = d;
        // ri.N = n;
        // F *= 24;
        // ri.h = Math.floor(F);
        // F -= ri.h;
        // F *= 60;
        // ri.m = Math.floor(F);
        // F -= ri.m;
        // F *= 60;
        // ri.s = F;
        this.year = y;
        this.month = m;
        this.day = d;
        this.leap = ry === 1;
        this.days = n;
        F *= 24;
        this.hour = Math.floor(F);
        F -= this.hour;
        F *= 60;
        this.minute = Math.floor(F);
        F -= this.minute;
        F *= 60;
        this.second = F;
    }

    toHash() {
        return {D:this.day,M:this.month,N:this.days,R:this.leap,Y:this.year,h:this.hour,m:this.minute,s:this.second};
    }

   // static PI2: number = Math.PI * 2;
}
