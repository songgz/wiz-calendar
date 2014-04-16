var Lunisolar = (function (global) {
    "use strict";
    var pi2 = Math.PI * 2;

    var myYuerun = function (y1, m1) {
        var w, ms, qi, hs, hs1, j;
        var pi2 = Math.PI * 2;
        w = (y1 - 2000 + (m1 + 10.5) / 12) * pi2;
        qi = global.Ephem.sun.qi_accurate(w);
        ms = global.Ephem.ms.aLon(qi / 36525, 10, 3);  //XL.MS_aLon
        ms = Math.floor((ms + 2) / pi2) * pi2;
        hs = global.Ephem.moon.so_accurate(ms);
        if (Math.floor(hs + 0.5) > Math.floor(qi + 0.5)) {
            hs1 = hs;
            hs = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            hs1 = global.Ephem.moon.so_accurate(ms);
        }
        if (Math.floor(hs + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w - pi2 / 12) + 0.5) && Math.floor(hs1 + 0.5) <= Math.floor(global.Ephem.sun.qi_accurate(w + pi2 / 24)+0.5)) {
            for (j = 0; j <= 5; j++) {
                w += pi2 / 12;
                ms += pi2;
                if (Math.floor(global.Ephem.moon.so_accurate(ms)+0.5) > Math.floor(global.Ephem.sun.qi_accurate(w)+0.5)) return 0;
            }
            return 1;
        } else return 0;
    };

    var myYmdtoJd = function(y1, m1, rm, d1){
        var w, ms, zq, hs, hs1, j;
        w = (y1 - 2000 + (m1 + 10) / 12) * pi2;
        zq = global.Ephem.sun.qi_accurate(w);
        ms = global.Ephem.ms.aLon(zq / 36525, 10, 3); //XL.MS_aLon
        ms = Math.floor((ms + 2) / pi2) * pi2;
        hs = global.Ephem.moon.so_accurate(ms);
        if (Math.floor(hs + 0.5) > Math.floor(zq + 0.5)) {
            hs1 = hs;
            hs = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            hs1 = global.Ephem.moon.so_accurate(ms);
        }
        if (Math.floor(hs + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w - pi2 / 24) + 0.5) && Math.floor(hs1 + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w + pi2 / 24)+0.5)) {
            for (j = 0; j <= 5; j++) {
                w += pi2 / 12;
                if (Math.floor(global.Ephem.moon.so_accurate(ms + j * pi2) + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w + j * pi2 / 12) + 0.5)) {
                    hs1 = hs;
                    hs = global.Ephem.moon.so_accurate(ms - 2 * pi2);
                    break;
                }
            }
        }
        if (rm) rm = myYuerun(y1, m1);
        if (rm == 0){
            return Math.floor(hs + d1 - 1 + 0.5);
        }else{
            return Math.floor(hs1 + d1 - 1 + 0.5);
        }
    };

    var myJdtoYmd = function (jd) {
        var F, ms, jd1, jd2, w1, w2, wn, y, m, d, n, fd, ry, j;
        var int2 = Math.floor;
        F = jd + 0.5 - Math.floor(jd + 0.5);
        jd = Math.floor(jd + 0.5) - global.JDate.J2000;
        ms = global.Ephem.ms.aLon(jd / 36525, 10, 3);
        ms = int2((ms + 2) / pi2) * pi2;
        jd1 = global.Ephem.moon.so_accurate(ms);
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

    var date = global.LunarDate = global.LunarDate || function () {
        this.jd = 0;
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.leap = 0;
        this.days = 0;

        switch (arguments.length) {
            case 0:
                this.jd = 0;
                break;
            case 1:
                this.jd = arguments[0] - global.JDate.J2000;
                var d = myJdtoYmd(arguments[0]);
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
                this.year = arguments[0];
                this.month = arguments[1];
                this.leap = arguments[2];
                this.day = arguments[3];
                this.jd = myYmdtoJd(this.year, this.month, this.leap, this.day);
                this.day = this.day - Math.floor(this.day)
                var t = this.day * 24;
                this.hour = Math.floor(t);
                t = (t - this.hour) * 60;
                this.minute = Math.floor(t);
                this.second = Math.floor((t - this.minute) * 60);
                break;
            default:
                this.year = arguments[0];
                this.month = arguments[1];
                this.day = arguments[2];
                this.leap = arguments[3];
                this.hour = arguments[4];
                this.minute = arguments[5];
                this.second = arguments[6];
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
            return this;
        }
    };

    return global;
})(Lunisolar || {});