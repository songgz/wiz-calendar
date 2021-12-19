var Lunisolar = (function (global) {
    "use strict";
    var pi2 = global.Ephem.PI2;
    var month = global.LunarMonth = global.LunarMonth || function (jd) {
        this.mjd = jd - global.JDate.J2000;
        this.preNewMoonMS = 0;
        this.preTermSun = 0;
        this.first = 0;
        this.last = 0;
        this.jq = 0;

        this.preNewMoonMS = global.Ephem.ms.aLon(this.jd / 36525, 10, 3);
        this.preNewMoonMS = Math.floor((this.preNewMoonMS+1) / pi2) * pi2;
        var nm = global.Ephem.moon.so_accurate(this.preNewMoonMS);                              //定朔计算得出一个历月
        if (Math.round(nm) > Math.round(this.jd)) {
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

    month.prototype = {
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

    return global;
})(Lunisolar || {});
