var Lunisolar = (function(global){
    "use strict";
    var angle = global.Angle = global.Angle || function (rad) {
        //this.rad = Angle.inPI2(rad);
    };
    angle.PI2 = 2 * Math.PI;
    angle.D2R = Math.PI / 180.0;
    angle.R2D = 180.0 / Math.PI;    
    angle.R2A = 180 * 3600 / Math.PI;  //3600.0 * (180 / Math.PI); //每弧度的角秒数

    angle.inPI2 = function (rad) {
        rad = rad % angle.PI2;
        if (rad < 0) {
            rad += angle.PI2;
        }
        return rad;
    };

    var Angle = function(rad){
        this.rad = rad;
    };

    

    return global;
})(Lunisolar || {});