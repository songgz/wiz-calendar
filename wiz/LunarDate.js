var Lunisolar = (function (global) {
    "use strict";
    var pi2 = Math.PI * 2;

    var date = global.LunarDate = global.LunarDate || function (jd) {
        this.jd = NaN;
        this.lunar = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
            leap: 0,
            days: 0
        };

        this.yuerun = function (y1, m1) {
            var w, ms, qi, hs, hs1, j;
            var pi2 = Math.PI * 2;
            w = (y1 - 2000 + (m1 + 10.5) / 12) * pi2;
            qi = global.Ephem.sun.qi_accurate(w);
            w += pi2 / 24;
            ms = global.Ephem.ms.aLon(qi / 36525, 10, 3);  //XL.MS_aLon
            ms = Math.floor((ms + 2) / pi2) * pi2;
            hs = global.Ephem.moon.so_accurate(ms);
            if (Math.round(hs) > Math.round(qi)) {
                hs1 = hs;
                hs = global.Ephem.moon.so_accurate(ms - pi2);
            } else {
                ms += pi2;
                hs1 = global.Ephem.moon.so_accurate(ms);
            }
            if (Math.round(hs) > Math.round(global.Ephem.sun.qi_accurate(w - pi2 / 12)) && Math.round(hs1) <= Math.round(global.Ephem.sun.qi_accurate(w))) {
                for (j = 0; j <= 5; j++) {
                    w += pi2 / 12;
                    ms += pi2;
                    if (Math.round(global.Ephem.moon.so_accurate(ms)) > Math.round(global.Ephem.sun.qi_accurate(w))) return 0;
                }
                return 1;
            } else return 0;
        };

        this.YmdtoJd = function(y1, m1, rm, d1){
            var w, ms, zq, hs, hs1, j;
            w = (y1 - 2000 + (m1 + 10) / 12) * pi2;
            zq = global.Ephem.sun.qi_accurate(w);
            ms = global.Ephem.ms.aLon(zq / 36525, 10, 3); //XL.MS_aLon
            ms = Math.floor((ms + 2) / pi2) * pi2;
            hs = global.Ephem.moon.so_accurate(ms);
            if (Math.round(hs) > Math.round(zq)) {
                hs1 = hs;
                hs = global.Ephem.moon.so_accurate(ms - pi2);
            } else {
                ms += pi2;
                hs1 = global.Ephem.moon.so_accurate(ms);
            }
            if (Math.round(hs) > Math.round(global.Ephem.sun.qi_accurate(w - pi2 / 24)) && Math.round(hs1) > Math.round(global.Ephem.sun.qi_accurate(w + pi2 / 24))) {
                for (j = 0, w += pi2 / 12; j <= 5; j++) {
                    if (Math.round(global.Ephem.moon.so_accurate(ms + j * pi2)) > Math.round(global.Ephem.sun.qi_accurate(w + j * pi2 / 12))) {
                        hs1 = hs;
                        hs = global.Ephem.moon.so_accurate(ms - 2 * pi2);
                        break;
                    }
                }
            }
            if (rm) rm = this.yuerun(y1, m1);
            if (rm == 0){
                return Math.round(hs + d1 - 1);
            }else{
                return Math.round(hs1 + d1 - 1);
            }
        };

        this.JdtoYmd = function (jd) {
            var F, ms, jd1, jd2, w1, w2, wn, y, m, d, n, fd, ry, j;
            var int2 = Math.floor;
            F = jd + 0.5 - Math.round(jd);
            jd = Math.round(jd) - global.JDate.J2000;
            ms = global.Ephem.ms.aLon(jd / 36525, 10, 3);
            ms = int2((ms + 2) / pi2) * pi2;
            jd1 = global.Ephem.moon.so_accurate(ms);
            if (Math.round(jd1) > jd) {
                jd2 = jd1;
                jd1 = global.Ephem.moon.so_accurate(ms - pi2);
            } else {
                ms += pi2;
                jd2 = global.Ephem.moon.so_accurate(ms);
            }
            w1 = global.Ephem.sun.aLon(jd1 / 36525, 3);
            w1 = int2(w1 / pi2 * 24) * pi2 / 24;
            while (Math.round(global.Ephem.sun.qi_accurate(w1)) < Math.round(jd1)) {
                w1 += pi2 / 24
            }
            w2 = w1;
            while (Math.round(global.Ephem.sun.qi_accurate(w2 + pi2 / 24)) < Math.round(jd2)) {
                w2 += pi2 / 24
            }
            wn = int2((w2 + 0.1) / pi2 * 24) + 4;
            y = int2(wn / 24) + 1999;
            wn = (wn % 24 + 24) % 24;
            m = int2(wn / 2);
            d = jd - Math.round(jd1) + 1;
            n = Math.round(jd2) - Math.round(jd1);
            fd = w2 - w1 < pi2 / 20 ? wn % 2 : 0;
            ry = w2 == w1 ? fd : 0;
            for (j = 0, ms += pi2, w2 += 1.5 * pi2 / 12; fd && j <= 5; j++) {
                if (Math.round(global.Ephem.sun.qi_accurate(w2 + j * pi2 / 12)) < Math.round(global.Ephem.moon.so_accurate(ms + j * pi2))) {
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
            var ri = {};
            ri.Y = y;
            ri.M = m;
            ri.R = ry;
            ri.D = d;
            ri.N = n;
            F *= 24;
            ri.h = int2(F);
            F -= ri.h;
            F *= 60;
            ri.m = int2(F);
            F -= ri.m;
            F *= 60;
            ri.s = F;
            return ri;
        };

        switch (arguments.length) {
            case 0:
                this.jd = 0;
                break;
            case 1:
                this.jd = jd - global.JDate.J2000;
                var d = this.JdtoYmd(jd);
                this.lunar.year = d.Y;
                this.lunar.month = d.M;
                this.lunar.day = d.D;
                this.lunar.leap = d.R;
                this.lunar.hour = d.h;
                this.lunar.minute = d.m;
                this.lunar.second = d.s;
                this.lunar.days = d.N;
                break;
            case 4:
                this.lunar.year = arguments[0];
                this.lunar.month = arguments[1];
                this.lunar.leap = arguments[2];
                this.lunar.day = arguments[3];
                this.jd = this.YmdtoJd(this.lunar.year, this.lunar.month, this.lunar.leap, this.lunar.day);
                var t = (this.lunar.day - Math.floor(this.lunar.day)) * 24;
                this.lunar.hour = Math.floor(t);
                t = (t - this.lunar.hour) * 60;
                this.lunar.minute = Math.floor(t);
                this.lunar.second = Math.floor((t - this.lunar.minute) * 60);
                break;
            default:
                this.lunar.year = arguments[0];
                this.lunar.month = arguments[1];
                this.lunar.day = arguments[2];
                this.lunar.leap = arguments[3];
                this.lunar.hour = arguments[4];
                this.lunar.minute = arguments[5];
                this.lunar.second = arguments[6];
                break;
        }

    };

    date.prototype = {
        valueOf: function () {
            return this.jd + global.JDate.J2000;
        },
        toJD: function(){
            return this.valueOf();
        },
        toLD: function(){
            return this.lunar;
        }
    };

    date.toJD = function (y1, m1, rm, d1) { //ymdJd
        var w, ms, zq, hs, hs1, j;
        w = (y1 - 2000 + (m1 + 10) / 12) * pi2;
        zq = global.Ephem.sun.qi_accurate(w);
        ms = global.Ephem.ms.aLon(zq / 36525, 10, 3); //XL.MS_aLon
        ms = Math.floor((ms + 2) / pi2) * pi2;
        hs = global.Ephem.moon.so_accurate(ms);
        if (Math.round(hs) > Math.round(zq)) {
            hs1 = hs;
            hs = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            hs1 = global.Ephem.moon.so_accurate(ms);
        }
        if (Math.round(hs) > Math.round(global.Ephem.sun.qi_accurate(w - pi2 / 24)) && Math.round(hs1) > Math.round(global.Ephem.sun.qi_accurate(w + pi2 / 24))) {
            for (j = 0, w += pi2 / 12; j <= 5; j++) {
                if (Math.round(global.Ephem.moon.so_accurate(ms + j * pi2)) > Math.round(global.Ephem.sun.qi_accurate(w + j * pi2 / 12))) {
                    hs1 = hs;
                    hs = global.Ephem.moon.so_accurate(ms - 2 * pi2);
                    break;
                }
            }
        }
        if (rm) rm = date.yuerun(y1, m1);
        if (rm == 0) return Math.round(hs + d1 - 1) + global.JDate.J2000; else return Math.round(hs1 + d1 - 1) + global.JDate.J2000;
    };

    date.yuerun = function (y1, m1) {
        var w, ms, qi, hs, hs1, j;
        var pi2 = Math.PI * 2;
        w = (y1 - 2000 + (m1 + 10.5) / 12) * pi2;
        qi = global.Ephem.sun.qi_accurate(w);
        w += pi2 / 24;
        ms = global.Ephem.ms.aLon(qi / 36525, 10, 3);  //XL.MS_aLon
        ms = Math.floor((ms + 2) / pi2) * pi2;
        hs = global.Ephem.moon.so_accurate(ms);
        if (Math.round(hs) > Math.round(qi)) {
            hs1 = hs;
            hs = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            hs1 = global.Ephem.moon.so_accurate(ms);
        }
        if (Math.round(hs) > Math.round(global.Ephem.sun.qi_accurate(w - pi2 / 12)) && Math.round(hs1) <= Math.round(global.Ephem.sun.qi_accurate(w))) {
            for (j = 0; j <= 5; j++) {
                w += pi2 / 12;
                ms += pi2;
                if (Math.round(global.Ephem.moon.so_accurate(ms)) > Math.round(global.Ephem.sun.qi_accurate(w))) return 0;
            }
            return 1;
        } else return 0;
    };

    date.toYmd = function (jd) {
        var F, ms, jd1, jd2, w1, w2, wn, y, m, d, n, fd, ry, j;
        var int2 = Math.floor;
        F = jd + 0.5 - Math.floor(jd + 0.5);
        jd = Math.floor(jd + 0.5) - global.JDate.J2000;
        ms = global.Ephem.ms.aLon(jd / 36525, 10, 3);
        ms = int2((ms + 2) / pi2) * pi2;
        jd1 =global.Ephem.moon.so_accurate(ms);
        if (Math.floor(jd1 + 0.5) > jd) {
            jd2 = jd1;
            jd1 = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            jd2 = global.Ephem.moon.so_accurate(ms);
        }
        w1 = global.Ephem.sun.aLon(jd1 / 36525, 3);
        w1 = int2(w1 / pi2 * 24) * pi2 / 24;
        while (Math.floor(global.Ephem.sun.qi_accurate(w1) + 0.5) < Math.floor(jd1 + 0.5)) {
            w1 += pi2 / 24
        }
        w2 = w1;
        while (Math.floor(global.Ephem.sun.qi_accurate(w2 + pi2 / 24) + 0.5) < Math.floor(jd2 + 0.5)) {
            w2 += pi2 / 24
        }
        wn = int2((w2 + 0.1) / pi2 * 24) + 4;
        y = int2(wn / 24) + 1999;
        wn = (wn % 24 + 24) % 24;
        m = int2(wn / 2);
        d = jd - Math.floor(jd1 + 0.5) + 1;
        n = Math.floor(jd2 + 0.5) - Math.floor(jd1 + 0.5);
        fd = w2 - w1 < pi2 / 20 ? wn % 2 : 0;
        ry = w2 == w1 ? fd : 0;
        for (j = 0, ms += pi2, w2 += 1.5 * pi2 / 12; fd && j <= 5; j++) {
            if (Math.floor(global.Ephem.sun.qi_accurate(w2 + j * pi2 / 12) + 0.5) < Math.floor(global.Ephem.moon.so_accurate(ms + j * pi2) + 0.5)) {
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
        var ri = {};
        ri.Y = y;
        ri.M = m;
        ri.R = ry;
        ri.D = d;
        ri.N = n;
        F *= 24;
        ri.h = int2(F);
        F -= ri.h;
        F *= 60;
        ri.m = int2(F);
        F -= ri.m;
        F *= 60;
        ri.s = F;
        return ri;
    };

    var getNewMoon = function (jd) {
        var ms = global.Ephem.ms.aLon(jd / 36525, 10, 3);
        ms = Math.floor(ms / pi2) * pi2;
        var jd0 = global.Ephem.moon.so_accurate(ms);                              //定朔计算得出一个历月
        if (jd0 > jd) {
            jd0 = global.Ephem.moon.so_accurate(ms - pi2);
        }
        return jd0;
    };

    return global;
})(Lunisolar || {});