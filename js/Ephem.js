"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VSOP87_1 = require("./VSOP87");
var JDate_1 = require("./JDate");
var MPP02_1 = require("./MPP02");
var PI2 = Math.PI * 2;
var R2A = 180 * 3600 / Math.PI; //3600.0 * (180 / Math.PI); //每弧度的角秒数
var Nutation = /** @class */ (function () {
    function Nutation() {
    }
    Nutation.prototype.lon = function (t) {
        var i, a, t2 = t * t, dL = 0, B = Nutation.nutB;
        for (i = 0; i < B.length; i += 5) {
            if (i == 0)
                a = -1.742 * t;
            else
                a = 0;
            dL += (B[i + 3] + a) * Math.sin(B[i] + B[i + 1] * t + B[i + 2] * t2);
        }
        return dL / 100 / R2A;
    };
    Nutation.nutB = [
        2.1824, -33.75705, 36e-6, -1720, 920,
        3.5069, 1256.66393, 11e-6, -132, 57,
        1.3375, 16799.4182, -51e-6, -23, 10,
        4.3649, -67.5141, 72e-6, 21, -9,
        0.04, -628.302, 0, -14, 0,
        2.36, 8328.691, 0, 7, 0,
        3.46, 1884.966, 0, -5, 2,
        5.44, 16833.175, 0, -4, 2,
        3.69, 25128.110, 0, -3, 0,
        3.55, 628.362, 0, 2, 0
    ];
    return Nutation;
}());
exports.nutation = new Nutation();
exports.earth = {
    lon: function (t, n) {
        return VSOP87_1.VSOP87.earth.orbit(0, t, n);
    },
    v: function (t) {
        var f = 628.307585 * t;
        return 628.332 + 21 * Math.sin(1.527 + f) + 0.44 * Math.sin(1.48 + f * 2) + 0.129 * Math.sin(5.82 + f) * t + 0.00055 * Math.sin(4.21 + f) * t * t;
    }
};
exports.sun = {
    gxcLon: function (t) {
        var v = -0.043126 + 628.301955 * t - 0.000002732 * t * t;
        var e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;
        return (-20.49552 * (1 + e * Math.cos(v))) / R2A;
    },
    aLon: function (t, n) {
        return exports.earth.lon(t, n) + exports.nutation.lon(t) + this.gxcLon(t) + Math.PI; //注意，这里的章动计算很耗时
    },
    aLon_t: function (W) {
        var t, v = 628.3319653318; //太阳黄经平速度
        t = (W - 1.75347 - Math.PI) / v; //求近似值t，世纪数
        v = exports.earth.v(t); //v的精度0.03%，详见原文
        t += (W - exports.sun.aLon(t, 10)) / v;
        v = exports.earth.v(t); //再算一次v有助于提高精度,不算也可以
        t += (W - exports.sun.aLon(t, -1)) / v;
        return t;
    },
    aLon_t2: function (W) {
        var t, v = 628.3319653318;
        t = (W - 1.75347 - Math.PI) / v;
        t -= (0.000005297 * t * t + 0.0334166 * Math.cos(4.669257 + 628.307585 * t) + 0.0002061 * Math.cos(2.67823 + 628.307585 * t) * t) / v;
        t += (W - exports.earth.lon(t, 8) - Math.PI + (20.5 + 17.2 * Math.sin(2.1824 - 33.75705 * t)) / R2A) / v;
        return t;
    },
    qi_accurate: function (W) {
        var t = exports.sun.aLon_t(W) * 36525;
        return t - JDate_1.JDate.dt_T(t) + 8 / 24;
    },
    qi_accurate2: function (jd) {
        var d = Math.PI / 12;
        var w = Math.floor((jd + 293) / 365.2422 * 24) * d;
        var a = exports.sun.qi_accurate(w);
        if (a - jd > 5)
            return exports.sun.qi_accurate(w - d);
        if (a - jd < -5)
            return exports.sun.qi_accurate(w + d);
        return a;
    },
    term_high: function (W) {
        var t = exports.sun.aLon_t2(W) * 36525;
        t = t - JDate_1.JDate.dt_T(t) + 8 / 24;
        var v = ((t + 0.5) % 1) * 86400;
        if (v < 1200 || v > 86400 - 1200) {
            t = exports.sun.aLon_t(W) * 36525 - JDate_1.JDate.dt_T(t) + 8 / 24;
        }
        return t;
    },
    term_low: function (W) {
        var t, L, v = 628.3319653318;
        t = (W - 4.895062166) / v; //第一次估算,误差2天以内
        t -= (53 * t * t + 334116 * Math.cos(4.67 + 628.307585 * t) + 2061 * Math.cos(2.678 + 628.3076 * t) * t) / v / 10000000; //第二次估算,误差2小时以内
        L = 48950621.66 + 6283319653.318 * t + 53 * t * t //平黄经
            + 334166 * Math.cos(4.669257 + 628.307585 * t) //地球椭圆轨道级数展开
            + 3489 * Math.cos(4.6261 + 1256.61517 * t) //地球椭圆轨道级数展开
            + 2060.6 * Math.cos(2.67823 + 628.307585 * t) * t //一次泊松项
            - 994 - 834 * Math.sin(2.1824 - 33.75705 * t); //光行差与章动修正
        t -= (L / 10000000 - W) / 628.332 + (32 * (t + 1.8) * (t + 1.8) - 20) / 86400 / 36525;
        return t * 36525 + 8 / 24;
    }
};
exports.moon = {
    lon: function (t, n) {
        return MPP02_1.MPP02.moon.orbit(0, t, n); //  XL1_calc(0,t,n)  //月球经度计算,返回Date分点黄经,传入世纪数,n是项数比例
    },
    v: function (t) {
        var v = 8399.71 - 914 * Math.sin(0.7848 + 8328.691425 * t + 0.0001523 * t * t); //误差小于5%
        v -= 179 * Math.sin(2.543 + 15542.7543 * t) //误差小于0.3%
            + 160 * Math.sin(0.1874 + 7214.0629 * t)
            + 62 * Math.sin(3.14 + 16657.3828 * t)
            + 34 * Math.sin(4.827 + 16866.9323 * t)
            + 22 * Math.sin(4.9 + 23871.4457 * t)
            + 12 * Math.sin(2.59 + 14914.4523 * t)
            + 7 * Math.sin(0.23 + 6585.7609 * t)
            + 5 * Math.sin(0.9 + 25195.624 * t)
            + 5 * Math.sin(2.32 - 7700.3895 * t)
            + 5 * Math.sin(3.88 + 8956.9934 * t)
            + 5 * Math.sin(0.49 + 7771.3771 * t);
        return v;
    },
    gxcLon: function (t) {
        return -3.4E-6;
    },
    phases_high: function (W) {
        var t = exports.ms.aLon_t2(W) * 36525;
        t = t - JDate_1.JDate.dt_T(t) + 8 / 24;
        var v = ((t + 0.5) % 1) * 86400;
        if (v < 1800 || v > 86400 - 1800) {
            t = exports.ms.aLon_t(W) * 36525 - JDate_1.JDate.dt_T(t) + 8 / 24;
        }
        return t;
    },
    phases_low: function (W) {
        var v = 7771.37714500204;
        var t = (W + 1.08472) / v;
        t -= (-0.0000331 * t * t
            + 0.10976 * Math.cos(0.785 + 8328.6914 * t)
            + 0.02224 * Math.cos(0.187 + 7214.0629 * t)
            - 0.03342 * Math.cos(4.669 + 628.3076 * t)) / v
            + (32 * (t + 1.8) * (t + 1.8) - 20) / 86400 / 36525;
        return t * 36525 + 8 / 24;
    },
    so_accurate: function (W) {
        var t = exports.ms.aLon_t(W) * 36525;
        return t - JDate_1.JDate.dt_T(t) + 8 / 24;
    },
    so_accurate2: function (jd) {
        return exports.moon.so_accurate(Math.floor((jd + 8) / 29.5306) * Math.PI * 2);
    }
};
exports.ms = {
    aLon: function (t, m, s) {
        return exports.moon.lon(t, m) + exports.moon.gxcLon(t) - (exports.earth.lon(t, s) + exports.sun.gxcLon(t) + Math.PI);
    },
    aLon_t: function (W) {
        var t, v = 7771.37714500204;
        t = (W + 1.08472) / v;
        t += (W - exports.ms.aLon(t, 3, 3)) / v;
        v = exports.moon.v(t) - exports.earth.v(t); //v的精度0.5%，详见原文
        t += (W - exports.ms.aLon(t, 20, 10)) / v;
        t += (W - exports.ms.aLon(t, -1, 60)) / v;
        return t;
    },
    aLon_t2: function (W) {
        var t, v = 7771.37714500204;
        t = (W + 1.08472) / v;
        var L, t2 = t * t;
        t -= (-0.00003309 * t2 + 0.10976 * Math.cos(0.784758 + 8328.6914246 * t + 0.000152292 * t2) + 0.02224 * Math.cos(0.18740 + 7214.0628654 * t - 0.00021848 * t2) - 0.03342 * Math.cos(4.669257 + 628.307585 * t)) / v;
        L = exports.moon.lon(t, 20) - (4.8950632 + 628.3319653318 * t + 0.000005297 * t * t + 0.0334166 * Math.cos(4.669257 + 628.307585 * t) + 0.0002061 * Math.cos(2.67823 + 628.307585 * t) * t + 0.000349 * Math.cos(4.6261 + 1256.61517 * t) - 20.5 / R2A);
        v = 7771.38 - 914 * Math.sin(0.7848 + 8328.691425 * t + 0.0001523 * t * t) - 179 * Math.sin(2.543 + 15542.7543 * t) - 160 * Math.sin(0.1874 + 7214.0629 * t);
        t += (W - L) / v;
        return t;
    }
};
//# sourceMappingURL=Ephem.js.map