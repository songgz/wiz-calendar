import {LunarDate} from "./lunar-date";
import {JulianDate} from "./julian-date";
import {SolarTerm, SolarTermName} from "./solar-term";

export class SolarDate {
    private jde: number | undefined;
    year = 0;
    month = 0;
    day = 0;
    hour = 0;
    minute = 0;
    second = 0;
    firsDay = 0;
    private julianDate: JulianDate | undefined;
    private lunarDate: LunarDate | undefined;

    constructor(year: number, month: number, day: number, hr?: number, min?: number, sec?: number);
    constructor(...options: any[]) {
        switch (options.length) {
            case 0:
                break;
            case 1:
                break;
            case 3:
            case 4:
            case 5:
            case 6:
                this.year = options[0];
                this.month = options[1];
                this.day = options[2];
                this.hour = options[3] || 0;
                this.minute = options[4] || 0;
                this.second = options[5] || 0;
                break;

        }

    }

    toHash() {
        return {
            year: this.year,
            month: this.month,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            second: this.second
        };
    }

    getJD() {
        return this.getJulianDate().jd();
    }

    getJulianDate() {
        if(this.julianDate === undefined){
            this.julianDate = new JulianDate(JulianDate.gd2jd(this.year, this.month, this.day, this.hour, this.minute, this.second) - JulianDate.J2000);
            this.julianDate.setSolarDate(this);
        }
        return this.julianDate;
    }

    setJulianDate(value: JulianDate) {
        this.julianDate = value;
    }

    getLunarDate() {
        if(this.lunarDate === undefined) {
            this.lunarDate = this.getJulianDate().getLunarDate();
        }
        return this.lunarDate;
    }

    getSolarTerm(solarTermName: SolarTermName) {
        return this.getJulianDate().getSolarTerm(solarTermName);
    }

    fromJDE(jde: number){
        this.jde = jde;

    }

    valueOf() {
        return this.getJD();
    }

    getWeek(){
        return (this.getJD() + 1 + 7000000) % 7;
    }

    date() {
        return this.year + '-' + this.month.toString().padStart(2, '0') + '-' + this.day.toString().padStart(2, '0');
    }

    time() {
        return this.hour.toString().padStart(2, '0') + ':' + this.minute.toString().padStart(2, '0') + ':' + this.second.toString().padStart(2, '0');
    }

    format(form: string) {
        let str = '';
        switch (form) {
            case 'date':
                str = this.date();
                break
            case 'time':
                str = this.time();
                break;
            case 'datetime':
                str = this.date() + ' ' + this.time();
                break;
        }
        return str;
    }
}
