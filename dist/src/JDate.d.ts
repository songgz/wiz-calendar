export declare class JDate {
    private jdn;
    constructor(jdn: number);
    valueOf(): number;
    static DTS: number[];
    static J2000: number;
    static dt(year: number): number;
    static dt_T(mjd: number): number;
    static gd2jd(Y: number, M: number, D: number, h: number, m: number, s: number): number;
    static DD(jd: number): any;
    static DD2str(r: any): string;
    static JD2str(jd: number): string;
    static timeStr(jde: number): string;
}
