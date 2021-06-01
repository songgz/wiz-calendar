declare class Nutation {
    constructor();
    lon(t: number): number;
    static nutB: number[];
}
export declare let nutation: Nutation;
export declare let earth: {
    lon: (t: number, n: number) => number;
    v: (t: number) => number;
};
export declare let sun: {
    gxcLon: (t: number) => number;
    aLon: (t: number, n: number) => number;
    aLon_t: (W: number) => number;
    aLon_t2: (W: number) => number;
    qi_accurate: (W: number) => number;
    qi_accurate2: (jd: number) => number;
    term_high: (W: number) => number;
    term_low: (W: number) => number;
};
export declare let moon: {
    lon: (t: number, n: number) => number;
    v: (t: number) => number;
    gxcLon: (t: number) => number;
    phases_high: (W: number) => number;
    phases_low: (W: number) => number;
    so_accurate: (W: number) => number;
    so_accurate2: (jd: number) => number;
};
export declare let ms: {
    aLon: (t: number, m: number, s: number) => number;
    aLon_t: (W: number) => number;
    aLon_t2: (W: number) => number;
};
export {};
