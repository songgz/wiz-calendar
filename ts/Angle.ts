class Angle {
    private rad: number;

    constructor(rad: number){
        this.rad = rad || 0;
    }

    static PI2: number = 2 * Math.PI;
    static  D2R: number = Math.PI / 180.0;
    static R2D: number = 180.0 / Math.PI;
    static R2A: number = 180 * 3600 / Math.PI;  //3600.0 * (180 / Math.PI); //每弧度的角秒数

    static inPI2(rad: number) {
        rad = rad % Angle.PI2;
        if (rad < 0) {
            rad += Angle.PI2;
        }
        return rad;
    }
}