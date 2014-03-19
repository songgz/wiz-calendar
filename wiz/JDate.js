var Lunisolar = (function(global){
    "use strict";
    var jd = global.JDate = global.JDate || function (jd) {
        this.jd = jd;
    };

    jd.J2000 = 2451545.0; //2000年前儒略日数(2000-1-1 12:00:00格林威治平时)
    jd.DTS = [ // TD - UT1 计算表
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

    jd.dt = function (year) { //力学时和世界时之间的精确差值 ΔT = TD - UT
        var dts = jd.DTS, i, t1, t2, t3, dt = 0;
        if ((year >= -4000) && (year < 2015)) {
            for (i = 0; i < dts.length; i += 5) {
                if (year < dts[i + 5]) {
                    t1 = (year - dts[i]) / (dts[i + 5] - dts[i]) * 10;
                    t2 = t1 * t1;
                    t3 = t2 * t1;
                    dt = dts[i + 1] + dts[i + 2] * t1 + dts[i + 3] * t2 + dts[i + 4] * t3;
                    break;
                }
            }
        } else {
            var jsd = 31; //sjd是y1年之后的加速度估计。瑞士星历表jsd=31,NASA网站jsd=32,skmap的jsd=29
            var dy = (year - 1820) / 100;
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
    };

    jd.dt_T = function (t) {
        return jd.dt(t / 365.2425 + 2000) / 86400.0;
    };

    jd.DD = function (jd) {
        var r = {};
        var D = Math.floor(jd + 0.5), F = jd + 0.5 - D, c;
        if (D >= 2299161)c = Math.floor((D - 1867216.25) / 36524.25), D += 1 + c - Math.floor(c / 4);
        D += 1524;
        r.Y = Math.floor((D - 122.1) / 365.25);
        D -= Math.floor(365.25 * r.Y);
        r.M = Math.floor(D / 30.601);
        D -= Math.floor(30.601 * r.M);
        r.D = D;
        if (r.M > 13)r.M -= 13, r.Y -= 4715; else r.M -= 1, r.Y -= 4716;
        F *= 24;
        r.h = Math.floor(F);
        F -= r.h;
        F *= 60;
        r.m = Math.floor(F);
        F -= r.m;
        F *= 60;
        r.s = F;
        return r;
    };
    jd.DD2str = function (r) {
        var Y = "     " + r.Y, M = "0" + r.M, D = "0" + r.D;
        var h = r.h, m = r.m, s = int2(r.s + .5);
        if (s >= 60)s -= 60, m++;
        if (m >= 60)m -= 60, h++;
        h = "0" + h;
        m = "0" + m;
        s = "0" + s;
        Y = Y.substr(Y.length - 5, 5);
        M = M.substr(M.length - 2, 2);
        D = D.substr(D.length - 2, 2);
        h = h.substr(h.length - 2, 2);
        m = m.substr(m.length - 2, 2);
        s = s.substr(s.length - 2, 2);
        return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    };
    jd.JD2str = function (jd) {
        var r = this.DD(jd);
        return this.DD2str(r);
    };

    return global;
})(Lunisolar || {})





