import {Vsop87} from "./vsop-87";
import {JulianDate} from "./julian-date";
import {Mpp02} from "./mpp-02";
import {Angle} from "./angle";
import {MoonPhase, MoonPhaseName} from "./MoonPhase";
import {SolarTerm, SolarTermName} from "./solar-term";

export class Nutation {
    /**
     * 求黄经章动
     * @param mjc - J2000.0算起的儒略世纪数
     */
    static long(mjc: number): number {
        let i, a, jc2 = Math.pow(mjc, 2), dL = 0, B = Nutation.nutB;
        for (i = 0; i < B.length; i += 5) {
            if (i == 0) a = -1.742 * mjc; else a = 0;
            dL += (B[i + 3] + a) * Math.sin(B[i] + B[i + 1] * mjc + B[i + 2] * jc2);
        }
        return dL / 100 / Angle.R2A;
    }

    static nutB: number[] = [//中精度章动计算表
        2.1824, -33.75705, 36e-6, -1720, 920,
        3.5069, 1256.66393, 11e-6, -132, 57,
        1.3375, 16799.4182, -51e-6, -23, 10,
        4.3649, -67.5141, 72e-6, 21, -9,
        0.04, -628.302, 0, -14, 0,
        2.36, 8328.691, 0, 7, 0,
        3.46, 1884.966, 0, -5, 2,
        5.44, 16833.175, 0, -4, 2,
        3.69, 25128.110, 0, -3, 0,
        3.55, 628.362, 0, 2, 0];
}

export class Earth {
    /**
     * 求地球的黄经
     * @param mjc - J2000.0算起的儒略世纪数
     * @param n - 计算项数，控制精度
     */
    static long(mjc: number, n: number): number {
        return Vsop87.earth.orbit(0, mjc, n);
    }

    /**
     * 求地球的速度，误差小于0.0003
     * @param mjc - J2000.0算起的儒略世纪数
     */
    static v(mjc: number) {
        const f = 628.307585 * mjc;
        return 628.332 + 21 * Math.sin(1.527 + f) + 0.44 * Math.sin(1.48 + f * 2) + 0.129 * Math.sin(5.82 + f) * mjc + 0.00055 * Math.sin(4.21 + f) * mjc * mjc;
    }
}


export class Sun {
    mjd = 0;
    private springEquinoxes: number | undefined;
    private solarTerms: {[key: number]: SolarTerm} = {};

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

    getSolarTerm(solarTermName: SolarTermName): SolarTerm {
        if(this.solarTerms[solarTermName] === undefined) {
            this.solarTerms[solarTermName] = new SolarTerm(Sun.mjd((this.getSpringEquinoxes() + solarTermName / 24) * Angle.PI2), solarTermName);
        }
        return this.solarTerms[solarTermName];
    }


    /**
     * 太阳黄经平速度，单位为弧度/儒略世纪
     */
    static MeanV = 628.3319653318;

    //太阳黄经速度,力学时t为J2000起算的儒略世纪数
    static v(t: number) {
        return  628.332 +21 * Math.sin(1.527+628.307585*t);
    }

    /***
     * 求太阳的黄经光行差
     * @param mjc - J2000.0算起的儒略世纪数
     */
    static longAberration(mjc: number): number {
        const jc2 = Math.pow(mjc, 2);
        const v = -0.043126 + 628.301955 * mjc - 0.000002732 * jc2; //平近点角
        const e = 0.016708634 - 0.000042037 * mjc - 0.0000001267 * jc2; //地球轨道偏心率
        return (-20.49552 * (1 + e * Math.cos(v))) / Angle.R2A;
    }

    /**
     * 求某时刻，太阳的视黄经
     * 章动计算很耗时
     * @param mjc - J2000.0算起的儒略世纪数
     * @param n - 计算项数，项数越大精度越高
     * @return - 返回太阳视黄经，单位弧度
     */
    static aLong(mjc: number, n: number): number {
        return Sun.long(mjc, n) + Nutation.long(mjc) + Sun.longAberration(mjc);
    }

    /**
     * 求某时刻，太阳黄经
     * @param mjc - J2000.0算起的儒略世纪数，动力学时
     * @param n - 计算项数，项数越大精度越高
     * @return - 返回太阳黄经，单位弧度
     */
    static long(mjc: number, n: number) {
        return Earth.long(mjc, n) + Math.PI;
    }

    /**
     * 根据太阳视黄经，求近似时间，单位为儒略世纪数
     * @param aLong - 太阳的视黄经
     */
    private static approxJC(aLong: number): number {
        return (aLong - 1.75347 - Math.PI) / Sun.MeanV;
    }

    /**
     * 根据太阳视黄经，求时间，单位为儒略世纪数
     * @param aLong - 太阳视黄经
     * @return - J2000.0算起的儒略世纪数，0时区
     */
    static mjce(aLong: number) {
        let t = this.approxJC(aLong); //近似儒略世纪数
        let v = Earth.v(t); //v的精度0.03%，详见原文
        t += (aLong - Sun.aLong(t, 10)) / v;
        v = Earth.v(t); //再算一次v有助于提高精度,不算也可以
        t += (aLong - Sun.aLong(t, -1)) / v;
        return t;
    }

    /**
     * 根据太阳视黄经，求东八区时间，单位儒略日
     * 高精度
     * @param aLong - 太阳视黄经
     * @return - mjd 东八区儒略日
     * TT=UTC+64.184s
     * 计算的区时=已知区时－（已知区时的时区-要计算区时的时区）。（注：东时区为正，西时区为负）
     */
    static mjd(aLong: number): number {
        const t = Sun.mjce(aLong) * 36525;
        return t - JulianDate.dt_T(t) - (0 - JulianDate.Timezone) / 24;
    }

    /**
     * 根据太阳视黄经，求时间，单位为儒略世纪数。
     * 高速低精度,最大误差不超过600秒
     * @param aLong - 太阳视黄经
     */
    static jc2(aLong: number): number {
        let t = (aLong - 1.75347 - Math.PI) / Sun.MeanV;
        t -= (0.000005297 * t * t + 0.0334166 * Math.cos(4.669257 + 628.307585 * t) + 0.0002061 * Math.cos(2.67823 + 628.307585 * t) * t) / Sun.MeanV;
        t += (aLong - Earth.long(t, 8) - Math.PI + (20.5 + 17.2 * Math.sin(2.1824 - 33.75705 * t)) / Angle.R2A) / Sun.MeanV;
        return t;
    }

    static term_high(W: number) { //较高精度气（已知太阳视黄经反求时间）
        let t = Sun.jc2(W) * 36525;
        t = t - JulianDate.dt_T(t) + 8 / 24;
        const v = ((t + 0.5) % 1) * 86400;
        if (v < 1200 || v > 86400 - 1200) {
            t = Sun.mjce(W) * 36525 - JulianDate.dt_T(t) + 8 / 24;
        }
        return  t;
    }

    static term_low(W: number) { //最大误差小于30分钟，平均5分（已知太阳视黄经反求时间）
        let t, L, v = 628.3319653318;
        t = ( W - 4.895062166 ) / v; //第一次估算,误差2天以内
        t -= ( 53 * t * t + 334116 * Math.cos(4.67 + 628.307585 * t) + 2061 * Math.cos(2.678 + 628.3076 * t) * t ) / v / 10000000; //第二次估算,误差2小时以内
        L = 48950621.66 + 6283319653.318 * t + 53 * t * t //平黄经
            + 334166 * Math.cos(4.669257 + 628.307585 * t) //地球椭圆轨道级数展开
            + 3489 * Math.cos(4.6261 + 1256.61517 * t) //地球椭圆轨道级数展开
            + 2060.6 * Math.cos(2.67823 + 628.307585 * t) * t  //一次泊松项
            - 994 - 834 * Math.sin(2.1824 - 33.75705 * t); //光行差与章动修正
        t -= (L / 10000000 - W ) / 628.332 + (32 * (t + 1.8) * (t + 1.8) - 20) / 86400 / 36525;
        return t * 36525 + 8 / 24;
    }

    /**
     * 求某时刻临近的节气，返回东八区的儒略日时间
     * 高精度
     * @param mjd - J2000.0算起的儒略日时间
     * @return - 东八区儒略日
     */
    static closestSolarTerm(mjd: number) { //精气
        const d = Math.PI / 12;
        const w = Math.floor((mjd + 293) / 365.2422 * 24) * d;
        const a = Sun.mjd(w);
        if (a - mjd > 5) return Sun.mjd(w - d);
        if (a - mjd < -5) return Sun.mjd(w + d);
        return a;
    }
}

export class Moon {
    mjd = 0;
    private moonPhases: {[key: number]: MoonPhase} = {};
    private newMoonALongD: number | undefined;
    private newMoon: number | undefined;
    private nextNewMoon: number | undefined;

    constructor(mjd: number) {
        this.mjd = mjd;
    }

    getNewMoonALongD(): number {
        if(this.newMoonALongD === undefined) {
            let ms = SunMoon.aLongD((this.mjd) / 36525, 10, 3);
            this.newMoonALongD = Math.floor((ms + 2) / Angle.PI2) * Angle.PI2; //朔日

            let newMoon = SunMoon.mjd(this.newMoonALongD);
            if (Math.floor(newMoon + 0.5) > Math.floor(this.mjd + 0.5)) {
                this.newMoonALongD -= Angle.PI2;
            }
        }
        return this.newMoonALongD;
    }

    getNewMoon() {
        if(this.newMoon === undefined) {
            this.newMoon = SunMoon.mjd(this.getNewMoonALongD());
        }
        return this.newMoon;
    }

    getNextNewMoon() {
        if (this.nextNewMoon === undefined) {
            this.nextNewMoon = SunMoon.mjd(this.getNewMoonALongD() + Angle.PI2);
        }
        return this.nextNewMoon;
    }

    getMoonPhase(moonphaseName: MoonPhaseName) {
        if (this.moonPhases[moonphaseName] === undefined) {
            let mjd = SunMoon.mjd(this.getNewMoonALongD() + (moonphaseName / 4.0) * Angle.PI2);
            let phase = new MoonPhase(mjd, moonphaseName);

            this.moonPhases[moonphaseName] = phase;
        }
        return this.moonPhases[moonphaseName];
    }





    /**
     * 根据时间，计算月球黄经
     * @param jc - 儒略世纪数
     * @param n - 精度的计算项数
     */
    static long(jc: number, n: number) {
        return Mpp02.moon.orbit(0, jc, n);
    }

    /**
     * 根据时间，计算月球速度
     * @param mjc - J2000.0算起的儒略世纪数
     */
    static v(mjc: number) {
        let v = 8399.71 - 914 * Math.sin(0.7848 + 8328.691425 * mjc + 0.0001523 * mjc * mjc); //误差小于5%
        v -= 179 * Math.sin(2.543 + 15542.7543 * mjc)  //误差小于0.3%
            + 160 * Math.sin(0.1874 + 7214.0629 * mjc)
            + 62 * Math.sin(3.14 + 16657.3828 * mjc)
            + 34 * Math.sin(4.827 + 16866.9323 * mjc)
            + 22 * Math.sin(4.9 + 23871.4457 * mjc)
            + 12 * Math.sin(2.59 + 14914.4523 * mjc)
            + 7 * Math.sin(0.23 + 6585.7609 * mjc)
            + 5 * Math.sin(0.9 + 25195.624 * mjc)
            + 5 * Math.sin(2.32 - 7700.3895 * mjc)
            + 5 * Math.sin(3.88 + 8956.9934 * mjc)
            + 5 * Math.sin(0.49 + 7771.3771 * mjc);
        return v;
    }

    /**
     * 求某时刻月球黄经光行差，误差0.07
     * @param mjc - J2000.0算起的儒略世纪数
     */
    static longAberration(mjc: number) {
        return -3.4E-6;
    }

    /**
     * 求某时刻临近的朔日
     * @param jd - 儒略日
     */
    static closestNewMoon(jd: number) {
        let w = Math.floor((jd + 8) / 29.5306) * Angle.PI2; //合朔时的日月黄经差
        return SunMoon.mjd(w);
    }

    static closestNewMoon2(mjd: number) {
        let ms = SunMoon.aLongD(mjd / 36525, 10, 3);
        ms = Math.floor((ms + 2) / Angle.PI2) * Angle.PI2; //合朔时的日月黄经差
        //console.log(ms);
        return SunMoon.mjd(ms);
    }
}

export class SunMoon {
    /**
     * 求某时刻月日视黄经的差值
     * @param mjc - J2000.0算起的儒略世纪数
     * @param mn - 月的精度计算项数
     * @param sn - 日的精度计算项数
     */
    static aLongD(mjc: number, mn: number, sn: number) {
        return Moon.long(mjc, mn) + Moon.longAberration(mjc) - (Sun.long(mjc, sn) + Sun.longAberration(mjc));
    }

    /**
     * 根据月日视黄经差，求时间，单位儒略世纪数
     * 高精度，低速度
     * @param aLongD - 月日视黄经差
     * @return - J2000.0算起的儒略世纪数，动力学时
     */
    static mjce(aLongD: number) {
        let t, v = 7771.37714500204;
        t = SunMoon.meanMJC(aLongD);
        t += ( aLongD - SunMoon.aLongD(t, 3, 3) ) / v;
        v = Moon.v(t) - Earth.v(t);  //v的精度0.5%，详见原文
        t += ( aLongD - SunMoon.aLongD(t, 20, 10) ) / v;
        t += ( aLongD - SunMoon.aLongD(t, -1, 60) ) / v;
        return t;
    }

    /**
     * 根据月日视黄经差，求时间，单位儒略世纪数
     * 低精度，高速度，误差不超过600秒(只验算了几千年)
     * @param aLongD - 月日视黄经差
     */
    static jc2(aLongD: number) {
        let t, v = 7771.37714500204;

        t = SunMoon.meanMJC(aLongD);
        let L, t2 = t * t;
        t -= ( -0.00003309 * t2 + 0.10976 * Math.cos(0.784758 + 8328.6914246 * t + 0.000152292 * t2) + 0.02224 * Math.cos(0.18740 + 7214.0628654 * t - 0.00021848 * t2) - 0.03342 * Math.cos(4.669257 + 628.307585 * t) ) / v;

        L = Moon.long(t, 20) - (4.8950632 + 628.3319653318 * t + 0.000005297 * t2 + 0.0334166 * Math.cos(4.669257 + 628.307585 * t) + 0.0002061 * Math.cos(2.67823 + 628.307585 * t) * t + 0.000349 * Math.cos(4.6261 + 1256.61517 * t) - 20.5 / Angle.R2A);
        //月日黄经差速度
        v = 7771.38 - 914 * Math.sin(0.7848 + 8328.691425 * t + 0.0001523 * t2) - 179 * Math.sin(2.543 + 15542.7543 * t) - 160 * Math.sin(0.1874 + 7214.0629 * t);
        t += ( aLongD - L ) / v;
        return t;
    }

    /**
     * 根据月日视黄经差，求东八区朔日时间，单位儒略日
     * 高精度
     * @param aLongD - 月日视黄经差
     * @return - J2000.0算起的儒略日
     */
    static mjd(aLongD: number): number {
        const t = SunMoon.mjce(aLongD) * 36525;
        return t - JulianDate.dt_T(t) - (0 - JulianDate.Timezone) / 24;
    }

    /**
     * 根据月日黄经差，求平时间
     * @param aLongD - 月日黄经差
     * @return - J2000.0算起的儒略世纪数
     */
    static meanMJC(aLongD: number) {
        return (aLongD + 1.08472) / 7771.37714500204;
    }

    static phases_high(W: number) { //较高精度朔
        let t = SunMoon.jc2(W) * 36525;
        t = t - JulianDate.dt_T(t) + 8 / 24;
        const v = ((t + 0.5) % 1) * 86400;
        if (v < 1800 || v > 86400 - 1800){
            t = SunMoon.mjce(W) * 36525 - JulianDate.dt_T(t) + 8 / 24;
        }
        return  t;
    }

    static phases_low(W: number) { //低精度定朔计算,在2000年至600，误差在2小时以内(仍比古代日历精准很多)
        const v = 7771.37714500204;
        let t = (W + 1.08472) / v;
        t -= ( -0.0000331 * t * t
                + 0.10976 * Math.cos(0.785 + 8328.6914 * t)
                + 0.02224 * Math.cos(0.187 + 7214.0629 * t)
                - 0.03342 * Math.cos(4.669 + 628.3076 * t) ) / v
            + (32 * (t + 1.8) * (t + 1.8) - 20) / 86400 / 36525;
        return t * 36525 + 8 / 24;
    }
}
