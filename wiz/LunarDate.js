var Lunisolar = (function(global){
    "use strict";
    var date = global.LunarDate = global.LunarDate || function () {};

    date.toJD = function (y1, m1, rm, d1) { //ymdJd
        var w, ms, zq, hs, hs1, j;
        var pi2 = Math.PI * 2;
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
        if (Math.floor(hs + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w - pi2 / 24) + 0.5) && Math.floor(hs1 + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w + pi2 / 24) + 0.5)) {
            for (j = 0, w += pi2 / 12; j <= 5; j++) {
                if (Math.floor(global.Ephem.moon.so_accurate(ms + j * pi2) + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w + j * pi2 / 12) + 0.5)) {
                    hs1 = hs;
                    hs = global.Ephem.moon.so_accurate(ms - 2 * pi2);
                    break;
                }
            }
        }
        if (rm) rm = date.yuerun(y1, m1);
        if (rm == 0)return Math.floor(hs + d1 - 1 + 0.5) + J2000; else return Math.floor(hs1 + d1 - 1 + 0.5) + J2000;
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
        if (Math.floor(hs + 0.5) > Math.floor(qi + 0.5)) {
            hs1 = hs;
            hs = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            hs1 = global.Ephem.moon.so_accurate(ms);
        }
        if (Math.floor(hs + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w - pi2 / 12) + 0.5) && Math.floor(hs1 + 0.5) <= Math.floor(global.Ephem.sun.qi_accurate(w) + 0.5)) {
            for (j = 0; j <= 5; j++) {
                w += pi2 / 12;
                ms += pi2;
                if (Math.floor(global.Ephem.sun.so_accurate(ms) + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w) + 0.5))return 0;
            }
            return 1;
        } else return 0;
    };

    return global;
})(Lunisolar || {});