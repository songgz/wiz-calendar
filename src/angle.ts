import './extension'
export class Angle {
    static PI2: number = 2 * Math.PI;
    static D2R: number = Math.PI / 180.0;
    static R2D: number = 180.0 / Math.PI;
    static R2A: number = 3600 * Angle.R2D; //每弧度的角秒数= 弧秒

    static fromRad(v: number): Angle {
        return new Angle(v);
    }

    static fromDeg(v: number): Angle {
        return new Angle(v * Angle.D2R);
    }

    static fromArcsec(v: number): Angle {
        return new Angle(v / Angle.R2A);
    }

    static rad2mrad(v: number) {
        v = v % (2 * Math.PI);
        if (v < 0) return v + 2 * Math.PI;
        return v;
    }

    static rad2rrad(v: number) {
        v = v % (2 * Math.PI);
        if (v <= -Math.PI) return v + 2 * Math.PI;
        if (v > Math.PI) return v - 2 * Math.PI;
        return v;
    }

    private theta: number = 0.0;

    constructor(theta: number){
        this.theta = theta;
        this.toNormaliseRad();
    }

    valueOf(): number {
        return this.theta;
    }

    toString() {
        return this.toDMS;
    }

    toNormaliseRad(): number {
        this.theta = this.theta - Math.int(this.theta / Angle.PI2) * Angle.PI2;
        return this.theta;
    }

    toDeg() {
        return this.theta * Angle.R2D;
    }

    toDMS2() {
        let sym = Math.sign(this.theta);
        let dd = Math.abs(this.toDeg());
        let d = Math.int(dd);
        let m = Math.int((dd - d) * 60);
        let s = (dd - d - m / 60) * 3600;
        return (sym * d).toString() + '°' + m.toString() + '’' + s.toString() + '”';
    }

    toDMS(formate?: boolean) {
        let d = this.theta;
        //tim=0输出格式示例: -23°59' 48.23"
        //tim=1输出格式示例: 18h 29m 44.52s
        let s = "+";
        let w1 = "°", w2 = "’", w3 = "”";
        if (d < 0) d = -d, s = '-';
        if (formate) {
            d *= 12 / Math.PI;
            w1 = "h ", w2 = "m ", w3 = "s ";
        } else {
            d *= 180 / Math.PI;
        }
        let a = Math.floor(d);
        d = (d - a) * 60;
        let b = Math.floor(d);
        d = (d - b) * 60;
        let c = Math.floor(d);
        d = (d - c) * 100;
        d = Math.floor(d + 0.5);
        if (d >= 100) d -= 100, c++;
        if (c >= 60) c -= 60, b++;
        if (b >= 60) b -= 60, a++;
        let a1 = "  " + a, b1 = "0" + b, c1 = "0" + c, d1 = "0" + d;
        s += a1.substr(a1.length - 3, 3) + w1;
        s += b1.substr(b1.length - 2, 2) + w2;
        s += c1.substr(c1.length - 2, 2) + ".";
        s += d1.substr(d1.length - 2, 2) + w3;
        return s;
    }

    cos() {
        return Math.cos(this.theta);
    }

    sin() {
        return Math.sin(this.theta);
    }

    tan() {
        return Math.tan(this.theta);
    }

    add(rad: number) {
        return new Angle(this.theta + rad);
    }

    sub(rad: number) {
        return new Angle(this.theta - rad);
    }

    mul(rad: number) {
        this.theta = Angle.inPI2(this.theta * rad);
        return this;
    }

    static inPI2(rad: number) {
        rad = rad % Angle.PI2;
        if (rad < 0) {
            rad += Angle.PI2;
        }
        return rad;
    }

}

export class Rad extends Angle {

}

export class Deg extends Angle {

}


