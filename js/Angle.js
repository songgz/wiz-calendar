"use strict";
var Angle = /** @class */ (function () {
    function Angle(rad) {
        this.rad = rad || 0;
    }
    Angle.inPI2 = function (rad) {
        rad = rad % Angle.PI2;
        if (rad < 0) {
            rad += Angle.PI2;
        }
        return rad;
    };
    Angle.PI2 = 2 * Math.PI;
    Angle.D2R = Math.PI / 180.0;
    Angle.R2D = 180.0 / Math.PI;
    Angle.R2A = 180 * 3600 / Math.PI; //3600.0 * (180 / Math.PI); //每弧度的角秒数
    return Angle;
}());
//# sourceMappingURL=Angle.js.map