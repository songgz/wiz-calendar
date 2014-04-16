var Lunisolar = (function (global) {
    "use strict";
    var month = global.SolarMonth = global.SolarMonth || function (year, month) {
        this.year = year;
        this.month = month;
        this.jd0 =  Math.floor(global.JDate.gd2jd(this.year, this.month, 1, 12, 0, 0));

        if((this.month + 1) > 12){
            this.jd1 =  Math.floor(global.JDate.gd2jd(this.year + 1, 1, 1, 12, 0, 0));
        }else{
            this.jd1 =  Math.floor(global.JDate.gd2jd(this.year, this.month + 1, 1, 12, 0, 0));
        }

        this.days =this.jd1 - this.jd0;
        this.week= (this.jd0 + 1 + 7000000) % 7; //本月第一天的星期
        this.jzYear = this.year -1984 + 12000;  //所属公历年对应的农历干支纪年

    };

    month.prototype = {
        getYearGanZhi: function(){
            return  global.Dict.Gan[this.jzYear % 10] + global.Dict.Zhi[this.jzYear % 12];  //干支纪年
        },
        getYearShuXing: function(){
            return global.Dict.ShX[this.jzYear % 12]; //该年对应的生肖
        },
        getYearHao: function(){
            return global.Util.getNH(this.year);
        },
        getFirstDay: function(){
            return new global.SolarDate(this.jd0);
        },
        eachDay: function(fn){
            for(var i = 0; i < this.days; i++){
                var ob = {};
                ob.d0 = Bd0 + i; //儒略日,北京时12:00
                ob.di = i;     //公历月内日序数
                ob.y  = By;    //公历年
                ob.m  = Bm;    //公历月
                ob.dn = Bdn;   //公历月天数
                ob.week0 = this.w0; //月首的星期
                ob.week  = (this.w0+i)%7; //当前日的星期
                ob.weeki = int2((this.w0+i)/7); //本日所在的周序号
                ob.weekN = int2((this.w0+Bdn-1)/7) + 1;  //本月的总周数
            }
        }

    };

    return global;
})(Lunisolar || {});