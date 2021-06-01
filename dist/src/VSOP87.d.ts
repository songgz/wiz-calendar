export declare class VSOP87 {
    private xt;
    constructor(xt: number);
    orbit(zn: number, t: number, n: number): number;
    static xzb: number[];
    static orbits: number[][];
    static R2A: number;
    static earth: VSOP87;
}
