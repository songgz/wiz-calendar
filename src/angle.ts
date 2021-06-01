export const PI2: number = 2 * Math.PI;
export const D2R: number = Math.PI / 180.0;
export const R2D: number = 180.0 / Math.PI;
export const R2A: number = 3600 * R2D; //每弧度的角秒数

export class Angle {
    private theta: number = 0;

    constructor(theta: number){
        this.theta = theta;
        this.theta = this.toNormaliseRad();
    }

    valueOf() {
        return this.theta;
    }

    toString() {
        return this.theta + "";
    }

    toNormaliseRad() {
        return this.theta - Math.floor(this.theta / PI2) * PI2;
    }

    toDeg() {
        return this.theta * R2D;
    }

    static inPI2(rad: number) {
        rad = rad % PI2;
        if (rad < 0) {
            rad += PI2;
        }
        return rad;
    }
}

export class Rad extends Angle {

}

export class Deg extends Angle {

}
