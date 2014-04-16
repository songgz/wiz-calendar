var Lunisolar = (function (global) {
    "use strict";
    var date = global.SolarDate = global.SolarDate || function (jde) {
        this.jde = jde;
    };

    date.prototype = {
        getWeek: function(){
            return (this.jde + 1 + 7000000) % 7;
        },
        toLD: function(){
            return new global.LunarDate(this.jde);
        }
    };


    return global;
})(Lunisolar || {});