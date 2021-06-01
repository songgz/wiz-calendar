import {LunarDate} from "./LunarDate";

class SolarDate {
    private  jde: number;

    constructor(jde: number){
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