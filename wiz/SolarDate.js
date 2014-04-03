var Lunisolar = (function (global) {
    "use strict";
    var date = global.SolarDate = global.SolarDate || function (jd) {
        this.jd = jd;
    };

    return global;
})(Lunisolar || {});