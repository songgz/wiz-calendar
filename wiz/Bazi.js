var Lunisolar = (function (global) {
    "use strict";

    var rad2mrad = function(v){ //对超过0-2PI的角度转为0-2PI
        v = v % (2 * Math.PI);
        if(v < 0) return v + 2 * Math.PI;
        return v;
    };

    var rad2rrad = function(v){//对超过-PI到PI的角度转为-PI到PI
        v = v % (2 * Math.PI);
        if(v <= -Math.PI) return v + 2 * Math.PI;
        if(v > Math.PI) return v - 2 * Math.PI;
        return v;
    };

    var llrConv = function (JW,E){ //球面坐标旋转
        //黄道赤道坐标变换,赤到黄E取负
        var r = [], J = JW[0], W = JW[1];
        r[0] = Math.atan2( Math.sin(J) * Math.cos(E) - Math.tan(W) * Math.sin(E), Math.cos(J) );
        r[1]= Math.asin( Math.cos(E) * Math.sin(W) + Math.sin(E) * Math.cos(W) * Math.sin(J) );
        r[2] = JW[2];
        r[0] = rad2mrad(r[0]);
        return r;
    };

    var pty_zty2 = function(t){ //时差计算(低精度),误差约在1秒以内,t力学时儒略世纪数
        var L = ( 1753470142 + 628331965331.8 * t + 5296.74 * t * t )/1000000000 + Math.PI;
        var z = [];
        var E = (84381.4088 - 46.836051 * t) / global.Angle.R2A;
        z[0] = global.Ephem.earth.lon(t, 5) + Math.PI;
        z[1] = 0; //地球坐标
        z = llrConv( z, E ); //z太阳地心赤道坐标
        L = rad2rrad(L - z[0]);
        return L / (2 * Math.PI); //单位是周(天)
    };

    var bz = global.Bazi = global.Bazi || function (jde, J, timezone) { //命理八字计算。jd为格林尼治UT(J2000起算),J为本地经度,返回在物件ob中
        this.zone = timezone || (new Date()).getTimezoneOffset() / 60;
        this.J = (J || 116.383333) / global.Angle.R2D;
        this.jde = jde;
        this.mjd = jde + this.zone / 24  - global.JDate.J2000;

        var c, v;
        var jd2 = this.mjd + global.JDate.dt_T(this.mjd); //力学时
        var w = global.Ephem.sun.aLon( jd2 / 36525, -1 ); //此刻太阳视黄经
        var k = Math.floor((w / (2 * Math.PI) * 360 + 45 + 15 * 360) / 30); //1984年立春起算的节气数(不含中气)
        this.mjd += pty_zty2(jd2 / 36525) + this.J / Math.PI / 2; //本地真太阳时(使用低精度算法计算时差)
        this.trueSolarTime = global.JDate.timeStr(this.mjd);    //bz_zty真太阳时

        var ts = this.trueSolarTime.split(':');
        var m = ((ts[0] - 0) % 2 == 0) ? 60 + (ts[1] - 0) : ts[1] - 0;
        this.ebMomentIndex = Math.floor(m / 10) % 12;
        this.hsMonthIndex = ((this.hsHourIndex % 5) * 2 + this.ebMomentIndex % 10) % 10; //五鼠遁

        this.mjd += 13 / 24; //转为前一日23点起算(原jd为本日中午12点起算)
        var D = Math.floor(this.mjd);
        var SC = Math.floor((this.mjd - D) * 12); //日数与时辰

        v = Math.floor(k / 12 + 6000000);
        this.hsYearIndex = v % 10;
        this.ebYearIndex = v % 12;
        v = k + 2 + 60000000;
        this.hsMonthIndex = v % 10;
        this.ebMonthIndex = v % 12;
        v = D - 6 + 9000000;
        this.hsDayIndex = v % 10;
        this.ebDayIndex = v % 12;
        v = (D - 1) * 12 + 90000000 + SC;
        this.hsHourIndex = v % 10;
        this.ebHourIndex = v % 12;

        v -= SC;
        this.bz_JS = ''; //全天纪时表
        for(var i = 0; i < 13; i++){ //一天中包含有13个纪时
            c = global.Dict.Gan[(v + i) % 10] + global.Dict.Zhi[(v + i) % 12]; //各时辰的八字
            if(SC == i) this.bz_js = c, c = '<font color=red>'+c+'</font>'; //红色显示这时辰
            this.bz_JS += (i ? ' ': '') + c;
        }
    };

    bz.prototype = {
        valueOf: function () {
            return this.jde;
        },
        getYearHS: function() {
            return global.Dict.Gan[this.hsYearIndex];
        },
        getYearEB: function() {
            return global.Dict.Zhi[this.ebYearIndex];
        },
        getYear: function() {
            return this.getYearHS() + this.getYearEB();
        },
        getMonthHS :function(){
            return global.Dict.Gan[this.hsMonthIndex];
        },
        getMonthEB: function(){
            return global.Dict.Zhi[this.ebMonthIndex];
        },
        getMonth: function(){
            return this.getMonthHS() + this.getMonthEB();
        },
        getDayHS: function(){
            return global.Dict.Gan[this.hsDayIndex];
        },
        getDayEB: function(){
            return global.Dict.Zhi[this.ebDayIndex];
        },
        getDay: function(){
            return this.getDayHS() + this.getDayEB();
        },
        getHourHS: function(){
            return global.Dict.Gan[this.hsHourIndex];
        },
        getHourEB: function(){
            return  global.Dict.Zhi[this.ebHourIndex];
        },
        getHour: function(){
            return this.getHourHS() + this.getHourEB();
        },
        getMoment: function(){
            return global.Dict.Gan[this.hsMonthIndex] + global.Dict.Zhi[this.ebMomentIndex];
        }
    };


    return global;
})(Lunisolar || {});