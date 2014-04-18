var Lunisolar = (function (global) {
    "use strict";
    var month = global.SolarMonth = global.SolarMonth || function (year, month) {
        this.year = year;
        this.month = month;
        this.firstDay =  new global.SolarDate(Math.floor(global.JDate.gd2jd(this.year, this.month, 1, 12, 0, 0)));

        if((this.month + 1) > 12){
            this.lastDay =  new global.SolarDate(Math.floor(global.JDate.gd2jd(this.year + 1, 1, 1, 12, 0, 0)));
        }else{
            this.lastDay =  new global.SolarDate(Math.floor(global.JDate.gd2jd(this.year, this.month + 1, 1, 12, 0, 0)));
        }

        this.days = this.lastDay - this.firstDay;
        this.week= (this.firstDay + 1 + 7000000) % 7; //本月第一天的星期 //月首的星期
        this.jzYear = this.year -1984 + 12000;  //所属公历年对应的农历干支纪年
        this.firstLunarDay = this.firstDay.toLD();
        this.lastLunarDay = this.lastDay.toLD();

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
            return this.firstDay;
        },
        getLunarDay: function(offset){
            var index = this.firstLunarDay.day  + offset;
            if (index > this.firstLunarDay.days){
               if(this.lastLunarDay.month - this.firstLunarDay.month <= 1 ){
                   index = index % this.lastLunarDay.days;
               }else{
                   var d = new global.LunarDate(this.firstDay + offset);
                   index = index % d.days + 1;
               }
            }
            return index;
        },
        getLunarDayName: function(offset){
            var d = this.getLunarDay(offset)
            if(d === 1){
                var l = new global.LunarDate(this.firstDay + offset);
                return l.getMonthName() + "月" + (l.days > 29 ? "大" : "小");
            }
            return global.Dict.rmc[this.getLunarDay(offset) - 1];
        },
        getWeek: function(offset){
            return (this.week + offset) % 7;
        },
        getWeekName: function(offset){
            return global.Dict.Weeks[this.getWeek(offset)];
        },
        getWeekNo: function(offset){ //本日所在的周序号
            return Math.floor((this.week + offset) / 7);
        },
        getWeeks: function(offset){ //本月的总周数
            return Math.floor((this.week + offset - 1) / 7) + 1;
        },
        getJDE: function(offset){
            return this.firstDay + offset;    //儒略日,北京时12:00
        },
        getLunarDate: function(offset){
            return new global.LunarDate(this.getJDE(offset));
        }
    };

    return global;
})(Lunisolar || {});