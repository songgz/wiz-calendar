import {LunarDate} from "./lunar-date";
import {JDate} from "./j-date";

export class SolarDate {
    jde = 0;
    year = 0;
    month = 0;
    day = 0;
    hour = 0;
    minute = 0;
    second = 0;
    firsDay = 0;



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
                this.jde = Math.floor(JDate.gd2jd(this.year, this.month, this.day, this.hour, this.minute, this.day));
                break;

        }

    }

    fromJDE(jde: number){
        this.jde = jde;

    }

    valueOf() {
        return this.jde;
    }

    getWeek(){
        return (this.jde + 1 + 7000000) % 7;
    }

    toLD(){
        return new LunarDate(this.jde);
    }
}