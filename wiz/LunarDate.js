var Lunisolar = (function (global) {
    "use strict";
    var pi2 = Math.PI * 2;

    var date = global.LunarDate = global.LunarDate || function (jd) {
        this.jd = jd - global.JDate.J2000;
        this.preNewMoonMS = 0;
        this.preTermSun = 0;
        this.first = 0;
        this.last = 0;
        this.jq = 0;

        this.preNewMoonMS = global.Ephem.ms.aLon(this.jd / 36525, 10, 3);
        this.preNewMoonMS = Math.floor((this.preNewMoonMS+1) / pi2) * pi2;
        var nm = global.Ephem.moon.so_accurate(this.preNewMoonMS);                              //定朔计算得出一个历月
        if (Math.round(nm) > Math.round( this.jd )) {
            this.preNewMoonMS -= pi2;
        }

        this.getNewMoonJD = function () {
            return global.Ephem.moon.so_accurate(this.preNewMoonMS);
        };

        this.initPreTerm = function(){
            this.preTermSun = global.Ephem.sun.aLon(this.getNewMoonJD() / 36525, 3);
            this.preTermSun = Math.floor((this.preTermSun + 0.1) / pi2 * 24) * pi2 / 24;
        };

        this.getTermJD = function () {
            return global.Ephem.sun.qi_accurate(this.preTermSun);
        };

        this.calcMonth = function () {
            this.first = this.getNewMoonJD();
            this.initPreTerm();
            this.preNewMoonMS += pi2;
            this.last = this.getNewMoonJD();
            var d = 0;
            this.terms = [];
            for (var j = 0; j < 4; j++) {                         //定气计算该月所含节气及分布情况
                d = this.getTermJD();
                this.preTermSun += pi2 / 24;
                if (Math.round(d) >= Math.round(this.last)) break;
                if (Math.round(d) >= Math.round(this.first)) this.terms.push(d);
            }
            var termK = Math.floor(this.preTermSun / pi2 * 24 + 0.3) + 2;
            this.yearH = Math.floor(termK / 24) + 1999;

            // /以节气情况确定月份
            this.jq = (termK % 24 + 24) % 24;
            this.monthH = Math.floor(this.jq / 2);
            var fd = this.terms.length < 3 ? this.jq % 2 : 0;
            this.leapMonth = this.terms.length == 1 ? fd : 0;
            for (var j = 0; fd && j <= 5; j++) {
                //确定非基准月份
                if (Math.round(global.Ephem.sun.term_high(this.preTermSun + (j + 0.5) * pi2 / 12)) < Math.round(global.Ephem.moon.phases_high(this.preTermSun + (j + 1) * pi2))) {
                    this.monthH++;
                    this.monthH %= 12;
                    this.leapMonth = 0;
                    break;
                }
            }
            if (this.monthH == 0) this.yearH--;
        };
        this.calcMonth();
    };

    var numberToChinese = function(num){
        var str = num.toString();
        var tmp = [];
        for(var i = 0; i < str.length; i++){
            tmp.push(Lunisolar.Dict.numCn[str.charAt(i)]);
        }
        return tmp.join('');
    };

    date.prototype = {
        nextMonth: function () {
            this.calcMonth();
        },
        getShuxing: function(){
            return Lunisolar.Dict.ShX[((this.yearH + 8) % 12 + 12) % 12];
        },
        getYearGanzhi: function(){
            return Lunisolar.Dict.Gan[((this.yearH + 6) % 10 + 10) % 10] + Lunisolar.Dict.Zhi[((this.yearH + 8) % 12 + 12) % 12];
        },
        getYear: function () {
            return this.yearH;
        },
        getYearName: function(){
            return numberToChinese(this.yearH);
        },
        getMonth: function(){
            return this.monthH;
        },
        getMonthName: function () {
            return (this.monthH < 11 && this.monthH > 0 ? "　" : "") + Lunisolar.Dict.ymc[(this.monthH + 1) % 12];
        },
        getMonthGanzhi: function(){
            var k = Math.round(this.first - 6);
            return Lunisolar.Dict.Gan[(k % 10 + 10) % 10] + Lunisolar.Dict.Zhi[(k % 12 + 12) % 12];
        },
        isLeapMonth: function(){
            return this.leapMonth;
        },
        getLeapMonthName: function(){
            return this.leapMonth == 1 ? "闰" : "　";
        },
        getMonthDaXiao: function(){
            return this.getDays() > 29 ? '大' : '小';
        },
        getDays: function () {
            return Math.round(this.last) - Math.round(this.first);
        },
        getTerms: function(){
            return this.terms;
        },
        getTermsDate: function(){
            var tms = [];
            for(var j = 0; j < this.terms.length; j++){
                tms.push(Lunisolar.Dict.jqmc[(this.jq - this.terms.length  + j + 27) % 24] + Lunisolar.Dict.rmc[Math.round(this.terms[j]) - Math.round(this.first)] +  Lunisolar.JDate.JD2str(this.terms[j] + Lunisolar.JDate.J2000) );
            }
            return tms.join(" ");
        },
        getDayGanzhi: function(j){
            var k = Math.round(this.first - 6);
            return Lunisolar.Dict.Gan[((k + j) % 10 + 10) % 10] + Lunisolar.Dict.Zhi[((k + j) % 12 + 12) % 12];

        },
        getFirstDate: function(){
            return Lunisolar.JDate.JD2str(this.first + Lunisolar.JDate.J2000);
        },
        getFirstDay: function(){
            return this.getFirstDate().substr(0, this.getFirstDate().length - 8);
        },
        getFirstTime: function() {
            return  this.getFirstDate().substr(this.getFirstDate().length - 8, 8);
        },
        getFirstWeek: function(){
            var k = Math.round(this.first - 6);
            return Lunisolar.Dict.Weeks[(k % 7 + 12) % 7]
        }
    };


    date.toJD = function (y1, m1, rm, d1) { //ymdJd
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
        if (rm == 0)return Math.floor(hs + d1 - 1 + 0.5) + global.JDate.J2000; else return Math.floor(hs1 + d1 - 1 + 0.5) + global.JDate.J2000;
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
                if (Math.floor(global.Ephem.moon.so_accurate(ms) + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w) + 0.5))return 0;
            }
            return 1;
        } else return 0;
    };

    date.toYmd = function (jd) {
        var F, ms, jd1, jd2, w1, w2, wn, y, m, d, n, fd, ry, j;
        var int2 = Math.floor;
        F = jd + 0.5 - int2(jd + 0.5);
        jd = int2(jd + 0.5) - J2000;
        ms = global.Ephem.ms.aLon(jd / 36525, 10, 3);
        ms = int2((ms + 2) / pi2) * pi2;
        jd1 = Math.floor(global.Ephem.moon.so_accurate(ms));
        if (int2(jd1 + 0.5) > jd) {
            jd2 = jd1;
            jd1 = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            jd2 = global.Ephem.moon.so_accurate(ms);
        }
        w1 = global.Ephem.sun.aLon(jd1 / 36525, 3);
        w1 = int2(w1 / pi2 * 24) * pi2 / 24;
        while (int2(global.Ephem.sun.qi_accurate(w1) + 0.5) < int2(jd1 + 0.5))w1 += pi2 / 24;
        w2 = w1;
        while (int2(global.Ephem.sun.qi_accurate(w2 + pi2 / 24) + 0.5) < int2(jd2 + 0.5))w2 += pi2 / 24;
        wn = int2((w2 + 0.1) / pi2 * 24) + 4;
        y = int2(wn / 24) + 1999;
        wn = (wn % 24 + 24) % 24;
        m = int2(wn / 2);
        d = jd - int2(jd1 + 0.5) + 1;
        n = int2(jd2 + 0.5) - int2(jd1 + 0.5);
        fd = w2 - w1 < pi2 / 20 ? wn % 2 : 0;
        ry = w2 == w1 ? fd : 0;
        for (j = 0, ms += pi2, w2 += 1.5 * pi2 / 12; fd && j <= 5; j++) {
            if (int2(global.Ephem.sun.qi_accurate(w2 + j * pi2 / 12) + 0.5) < int2(global.Ephem.moon.so_accurate(ms + j * pi2) + 0.5)) {
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