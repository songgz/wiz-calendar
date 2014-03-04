var Angle = function (rad) {
    this.rad = Angle.inPI2(rad);
};

Angle.D2R = Math.PI / 180.0;
Angle.R2D = 180.0 / Math.PI;
Angle.PI2 = 2 * Math.PI;
Angle.R2A = 180 * 3600 / Math.PI; // 3600.0 * (180 / Math.PI); //每弧度的角秒数