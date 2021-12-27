// Julian Date
import {Angle} from "./angle";
import {MoonPhase, Sun} from "./ephem";
import {SolarDate} from "./solar-date";
import {LunarDate} from "./lunar-date";

export class JDate {
    static J2000: number = 2451545.0; //2000年前儒略日数(2000-1-1 12:00:00格林威治平时)
    static DTS: number[] = [ // TD - UT1 世界时与原子时之差计算表
        -4000, 108371.7, -13036.80, 392.000, 0.0000,
        -500, 17201.0, -627.82, 16.170, -0.3413,
        -150, 12200.6, -346.41, 5.403, -0.1593,
        150, 9113.8, -328.13, -1.647, 0.0377,
        500, 5707.5, -391.41, 0.915, 0.3145,
        900, 2203.4, -283.45, 13.034, -0.1778,
        1300, 490.1, -57.35, 2.085, -0.0072,
        1600, 120.0, -9.81, -1.532, 0.1403,
        1700, 10.2, -0.91, 0.510, -0.0370,
        1800, 13.4, -0.72, 0.202, -0.0193,
        1830, 7.8, -1.81, 0.416, -0.0247,
        1860, 8.3, -0.13, -0.406, 0.0292,
        1880, -5.4, 0.32, -0.183, 0.0173,
        1900, -2.3, 2.06, 0.169, -0.0135,
        1920, 21.2, 1.69, -0.304, 0.0167,
        1940, 24.2, 1.22, -0.064, 0.0031,
        1960, 33.2, 0.51, 0.231, -0.0109,
        1980, 51.0, 1.29, -0.026, 0.0032,
        2000, 63.87, 0.1, 0, 0,
        2005, 64.7, 0.4, 0, 0, //一次项记为x,则 10x=0.4秒/年*(2015-2005),解得x=0.4
        2015, 69, 0, 0, 0];

    //输入公历年，返回秒Delta Time
    static deltaT(year: number) { //力学时和世界时之间的精确差值 ΔT = TD - UT
        let dts = JDate.DTS, i, t1, t2, t3, dt = 0;
        if ((year >= -4000) && (year < 2015)) {
            for (i = 0; i < dts.length; i += 5) {
                if (year < dts[i + 5]) {
                    t1 = (year - dts[i]) / (dts[i + 5] - dts[i]) * 10; //三次插值， 保证精确性
                    t2 = t1 * t1;
                    t3 = t2 * t1;
                    dt = dts[i + 1] + dts[i + 2] * t1 + dts[i + 3] * t2 + dts[i + 4] * t3;
                    break;
                }
            }
        } else {
            const jsd = 31; //加速度sjd是y1年之后的加速度估计。瑞士星历表jsd=31,NASA网站jsd=32,skmap的jsd=29
            let dy = (year - 1820) / 100;
            if (year > 2015 + 100) {
                dt = -20 + jsd * dy * dy;
            } else {
                var v = -20 + jsd * dy * dy;
                dy = (2015 - 1820) / 100;
                var dv = -20 + jsd * dy * dy - 69;
                dt = v - dv * (2015 + 100 - year) / 100;
            }
        }
        return dt;
    }

    /**
     *
     * @param mjd - J2000.0算起的儒略日
     * @return - 单位天
     */
    static dt_T(mjd: number) {
        return JDate.deltaT(mjd / 365.2425 + 2000) / 86400.0;
    }

    static gd2jd(y: number, m: number, d: number, h1: number = 0, m1: number = 0, s1: number = 0) {
        let time = (h1 * 3600 + m1 * 60 + s1) / 86400;
        d += time;
        var n = 0, G = 0;
        if (y * 372 + m * 31 + Math.floor(d) >= 588829) {
            G = 1;
        }
        if (m <= 2) {
            m += 12;
            y--;
        }
        if (G) {
            n = Math.floor(y / 100);
            n = 2 - n + Math.floor(n / 4);
        }
        return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + n - 1524.5;
    }

    static gd2jd1(Y: number, M: number, D: number, h?: number, m?: number, s?: number) {
        Y = Y || 2000;
        M = M || 1;
        D = D || 1;
        h = h || 0;
        m = m || 0;
        s = s || 0;
        D += (h + m / 60 + s / 3600) / 24;
        let a = 0, b = 0;
        if (M <= 2) {
            M += 12;
            Y -= 1;
        }
        if (Y * 372 + M * 31 + Math.floor(D) >= 588829) {
            a = Math.floor(Y / 100);
            b = 2 - a + Math.floor(a / 4);
        }
        return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + b - 1524.5;
    }

    static DD(jd: number) {
        let r: any = {};
        var D = Math.floor(jd + 0.5), F = jd + 0.5 - D, c;
        if (D >= 2299161) c = Math.floor((D - 1867216.25) / 36524.25), D += 1 + c - Math.floor(c / 4);
        D += 1524;
        r.Y = Math.floor((D - 122.1) / 365.25);
        D -= Math.floor(365.25 * r.Y);
        r.M = Math.floor(D / 30.601);
        D -= Math.floor(30.601 * r.M);
        r.D = D;
        if (r.M > 13) r.M -= 13, r.Y -= 4715; else r.M -= 1, r.Y -= 4716;
        F *= 24;
        r.h = Math.floor(F);
        F -= r.h;
        F *= 60;
        r.m = Math.floor(F);
        F -= r.m;
        F *= 60;
        r.s = Math.round(F);
        return r;
    }

    static DD2str(r: any) {
        var Y = "     " + r.Y, M = "0" + r.M, D = "0" + r.D;
        var h = r.h, m = r.m, s = Math.floor(r.s + .5);
        if (s >= 60) s -= 60, m++;
        if (m >= 60) m -= 60, h++;
        h = "0" + h;
        m = "0" + m;
        let s2 = "0" + s;
        Y = Y.substr(Y.length - 5, 5);
        M = M.substr(M.length - 2, 2);
        D = D.substr(D.length - 2, 2);
        h = h.substr(h.length - 2, 2);
        m = m.substr(m.length - 2, 2);
        s2 = s2.substr(s2.length - 2, 2);
        return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    }

    static JD2str(jd: number) {
        var r = this.DD(jd);
        return this.DD2str(r);
    }

    static timeStr(jd: number) { //提取jd中的时间(去除日期)
        let h, m, s;
        jd += 0.5;
        jd = (jd - Math.floor(jd));
        s = Math.floor(jd * 86400 + 0.5);
        h = Math.floor(s / 3600);
        s -= h * 3600;
        m = Math.floor(s / 60);
        s -= m * 60;
        h = "0" + h;
        m = "0" + m;
        s = "0" + s;
        return h.substr(h.length - 2, 2) + ':' + m.substr(m.length - 2, 2) + ':' + s.substr(s.length - 2, 2);
    }

    static getTime(mjd: number) {
        let jd = mjd + 0.5;
        jd = (jd - Math.floor(jd));
        let s = Math.floor(jd * 86400 + 0.5);
        let h = Math.floor(s / 3600);
        s -= h * 3600;
        let m = Math.floor(s / 60);
        s -= m * 60;
        return h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0');
    }

    static llrConv(JW: number[], E: number) {
        var r = [], J = JW[0], W = JW[1];
        r[0] = Math.atan2(Math.sin(J) * Math.cos(E) - Math.tan(W) * Math.sin(E), Math.cos(J));
        r[1] = Math.asin(Math.cos(E) * Math.sin(W) + Math.sin(E) * Math.cos(W) * Math.sin(J));
        r[2] = JW[2];
        r[0] = Angle.rad2mrad(r[0]);
        return r;
    }

    static apparentSolarTime(mjd: number) {
        let L = (1753470142 + 628331965331.8 * mjd + 5296.74 * mjd * mjd) / 1000000000 + Math.PI;
        let z = [];
        let E = (84381.4088 - 46.836051 * mjd) / Angle.R2A;
        z[0] = Sun.long(mjd, 5), z[1] = 0;
        z = JDate.llrConv(z, E);
        L = Angle.rad2rrad(L - z[0]);
        return L / Angle.PI2;
    }


    static fromUTC(Y: number, M: number, D: number, h?: number, m?: number, s?: number) {
        return new JDate(JDate.gd2jd(Y, M, D, h, m, s));
    }

    static fromJd(jd: number) {
        return new JDate(jd - JDate.J2000);
    }

    //UTC 时间和本地时间之间的时差，以天为单位。
    static Timezone = -(new Date()).getTimezoneOffset() / 60;

    private readonly mjd: number;
    private deltaT: number | undefined;
    private solarDate: SolarDate | undefined;
    private lunarDate: LunarDate | undefined;

    constructor(mjd: number = 0) {
        this.mjd = mjd;
    }

    valueOf() {
        return this.mjd;
    }

    toJD() {
        return this.mjd + JDate.J2000;
    }

    getDeltaT(): number {
        if (this.deltaT === undefined) {
            this.deltaT = JDate.dt_T(this.mjd);
        }
        return this.deltaT;
    }

    toMjdUtc() {
        return this.mjd - this.getDeltaT();
    }

    toJdUtc() {
        return this.toMjdUtc() + JDate.J2000;
    }

    getSolarDate() {
        if (this.solarDate === undefined){
            let d = JDate.DD(this.toJD());
            this.solarDate = new SolarDate(d.Y, d.M, d.D, d.h, d.m, d.s);
            this.solarDate.setJDate(this);
        }
        return this.solarDate;
    }

    getLunarDate() {
        if (this.lunarDate === undefined) {
            let nextNewMoon, w1, w2, wn, y, m, d, n, fd, ry;
            let jd = this.toJD();
            let F = jd + 0.5 - Math.floor(jd + 0.5);
            let mjd = Math.floor(jd + 0.5) - JDate.J2000;
            let ms = MoonPhase.aLongD(mjd / 36525, 10, 3);
            ms = Math.floor((ms + 2) / Angle.PI2) * Angle.PI2; //合朔
            let newMoon = MoonPhase.mjdUTC(ms);

            if (Math.floor(newMoon + 0.5) > mjd) {
                nextNewMoon = newMoon;
                newMoon = MoonPhase.mjdUTC(ms - Angle.PI2);
            } else {
                ms += Angle.PI2;
                nextNewMoon = MoonPhase.mjdUTC(ms);
            }

            let solarTermRad24 = Angle.PI2 / 24;
            let solarTermRad12 = Angle.PI2 / 12;

            w1 = Sun.aLong(newMoon / 36525, 3);
            w1 = Math.floor(w1 / solarTermRad24) * solarTermRad24; //节气
            while (Math.floor(Sun.mjdUTC(w1) + 0.5) < Math.floor(newMoon + 0.5)) {
                w1 += solarTermRad24;
            }
            w2 = w1;
            while (Math.floor(Sun.mjdUTC(w2 + solarTermRad24) + 0.5) < Math.floor(nextNewMoon + 0.5)) {
                w2 += solarTermRad24;
            }
            wn = Math.floor((w2 + 0.1) / solarTermRad24) + 4; //节气数
            y = Math.floor(wn / 24) + 2000 - 1;
            wn = (wn % 24 + 24) % 24;
            m = Math.floor(wn / 2);
            d = mjd - Math.floor(newMoon + 0.5) + 1;
            n = Math.floor(nextNewMoon + 0.5) - Math.floor(newMoon + 0.5);
            fd = w2 - w1 < Angle.PI2 / 20 ? wn % 2 : 0;
            ry = w2 == w1 ? fd : 0;
            ms += Angle.PI2;
            w2 += 1.5 * solarTermRad12;
            for (let j = 0; fd && j <= 5; j++) {
                if (Math.floor(Sun.mjdUTC(w2 + j * solarTermRad12) + 0.5) < Math.floor(MoonPhase.mjdUTC(ms + j * Angle.PI2) + 0.5)) {
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
            ri.s = Math.round(F);
            this.lunarDate = new LunarDate(ri.Y, ri.M, ri.D, ri.R!==0, ri.h, ri.m, ri.s);
            this.lunarDate.setJDate(this);
        }
        return this.lunarDate;
    }


}
