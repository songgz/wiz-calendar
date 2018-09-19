import {JDate} from "./JDate"
import * as Ephem from "./Ephem"

let int2 = function(v: number) { return Math.floor(v); };

export class LunarDate {
    private jd: number;
    private year: number;
    private month: number;
    private day: number;
    private hour: number;
    private minute: number;
    private second: number;
    private leap: number;
    private days: number;

    constructor(...options: number[]){
        this.jd = 0;
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.leap = 0;
        this.days = 0;

        switch (options.length) {
            case 0:
                this.jd = 0;
                break;
            case 1:
                this.jd = options[0] - JDate.J2000;
                var d = this.jdYmd(options[0]);
                this.year = d.Y;
                this.month = d.M;
                this.day = d.D;
                this.leap = d.R;
                this.hour = d.h;
                this.minute = d.m;
                this.second = d.s;
                this.days = d.N;
                break;
            case 4:
                this.year = options[0];
                this.month = options[1];
                this.leap = options[2];
                this.day = options[3];
                this.jd = this.ymdJd(this.year, this.month, this.leap, this.day);
                var t = this.day;
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

    private yuerun(y1: number, m1: number) {
        var w, ms, qi, hs, hs1, j;
        w = (y1 - 2000 + (m1 + 10.5) / 12) * LunarDate.PI2;
        qi = Ephem.sun.qi_accurate(w);
        w += LunarDate.PI2 / 24;
        ms = Ephem.ms.aLon(qi / 36525, 10, 3);
        ms = Math.floor((ms + 2) / LunarDate.PI2) * LunarDate.PI2;
        hs = Ephem.moon.so_accurate(ms);
        if (Math.floor(hs + 0.5) > int2(qi + 0.5)) {
            hs1 = hs;
            hs = Ephem.moon.so_accurate(ms - LunarDate.PI2);
        } else {
            ms += LunarDate.PI2;
            hs1 = Ephem.moon.so_accurate(ms);
        }
        if (Math.floor(hs + 0.5) > Math.floor(Ephem.sun.qi_accurate(w - LunarDate.PI2 / 12) + 0.5) && Math.floor(hs1 + 0.5) <= Math.floor(Ephem.sun.qi_accurate(w) + 0.5)) {
            for (j = 0; j <= 5; j++) {
                w += LunarDate.PI2 / 12;
                ms += LunarDate.PI2;
                if (Math.floor(Ephem.moon.so_accurate(ms) + 0.5) > Math.floor(Ephem.sun.qi_accurate(w) + 0.5))return 0;
            }
            return 1;
        } else return 0;
    }

    private ymdJd(y1: number, m1: number, rm: number, d1: number) {
        var w, ms, zq, hs, hs1, j;
        w = (y1 - 2000 + (m1 + 10) / 12) * LunarDate.PI2;
        zq = Ephem.sun.qi_accurate(w);
        ms = Ephem.ms.aLon(zq / 36525, 10, 3);
        ms = Math.floor((ms + 2) / LunarDate.PI2) * LunarDate.PI2;
        hs = Ephem.moon.so_accurate(ms);
        if (Math.floor(hs + 0.5) > Math.floor(zq + 0.5)) {
            hs1 = hs;
            hs = Ephem.moon.so_accurate(ms - LunarDate.PI2);
        } else {
            ms += LunarDate.PI2;
            hs1 = Ephem.moon.so_accurate(ms);
        }
        if (Math.floor(hs + 0.5) > int2(Ephem.sun.qi_accurate(w - LunarDate.PI2 / 24) + 0.5) && Math.floor(hs1 + 0.5) > int2(Ephem.sun.qi_accurate(w + LunarDate.PI2 / 24) + 0.5)) {
            for (j = 0, w += LunarDate.PI2 / 12; j <= 5; j++) {
                if (Math.floor(Ephem.moon.so_accurate(ms + j * LunarDate.PI2) + 0.5) > Math.floor(Ephem.sun.qi_accurate(w + j * LunarDate.PI2 / 12) + 0.5)) {
                    hs1 = hs;
                    hs = Ephem.moon.so_accurate(ms - 2 * LunarDate.PI2);
                    break;
                }
            }
        }
        if (rm)rm = this.yuerun(y1, m1);
        if (rm == 0)return Math.floor(hs + d1 - 1 + 0.5) + JDate.J2000; else return Math.floor(hs1 + d1 - 1 + 0.5) + JDate.J2000;
    }

    private jdYmd(jd: number) {
        var F, ms, jd1, jd2, w1, w2, wn, y, m, d, n, fd, ry, j;
        F = jd + 0.5 - Math.floor(jd + 0.5);
        jd = Math.floor(jd + 0.5) - JDate.J2000;
        ms = Ephem.ms.aLon(jd / 36525, 10, 3);
        ms = Math.floor((ms + 2) / LunarDate.PI2) * LunarDate.PI2;
        jd1 = Ephem.moon.so_accurate(ms);
        if (Math.floor(jd1 + 0.5) > jd) {
            jd2 = jd1;
            jd1 = Ephem.moon.so_accurate(ms - LunarDate.PI2);
        } else {
            ms += LunarDate.PI2;
            jd2 = Ephem.moon.so_accurate(ms);
        }
        w1 = Ephem.sun.aLon(jd1 / 36525, 3);
        w1 = Math.floor(w1 / LunarDate.PI2 * 24) * LunarDate.PI2 / 24;
        while (Math.floor(Ephem.sun.qi_accurate(w1) + 0.5) < Math.floor(jd1 + 0.5))w1 += LunarDate.PI2 / 24;
        w2 = w1;
        while (Math.floor(Ephem.sun.qi_accurate(w2 + LunarDate.PI2 / 24) + 0.5) < Math.floor(jd2 + 0.5))w2 += LunarDate.PI2 / 24;
        wn = Math.floor((w2 + 0.1) / LunarDate.PI2 * 24) + 4;
        y = Math.floor(wn / 24) + 1999;
        wn = (wn % 24 + 24) % 24;
        m = Math.floor(wn / 2);
        d = jd - Math.floor(jd1 + 0.5) + 1;
        n = Math.floor(jd2 + 0.5) - Math.floor(jd1 + 0.5);
        fd = w2 - w1 < LunarDate.PI2 / 20 ? wn % 2 : 0;
        ry = w2 == w1 ? fd : 0;
        for (j = 0, ms += LunarDate.PI2, w2 += 1.5 * LunarDate.PI2 / 12; fd && j <= 5; j++) {
            if (Math.floor(Ephem.sun.qi_accurate(w2 + j * LunarDate.PI2 / 12) + 0.5) < Math.floor(Ephem.moon.so_accurate(ms + j * LunarDate.PI2) + 0.5)) {
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
        var ri: any = {};
        ri.Y = y;
        ri.M = m;
        ri.R = ry;
        ri.D = d;
        ri.N = n;
        F *= 24;
        ri.h = Math.floor(F);
        F -= ri.h;
        F *= 60;
        ri.m = Math.floor(F);
        F -= ri.m;
        F *= 60;
        ri.s = F;
        return ri;
    }

    static PI2: number = Math.PI * 2;
}