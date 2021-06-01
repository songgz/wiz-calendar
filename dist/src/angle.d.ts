export declare const PI2: number;
export declare const D2R: number;
export declare const R2D: number;
export declare const R2A: number;
export declare class Angle {
    private theta;
    constructor(theta: number);
    valueOf(): number;
    toString(): string;
    toNormaliseRad(): number;
    static inPI2(rad: number): number;
}
export declare class Rad extends Angle {
}
export declare class Deg extends Angle {
}
