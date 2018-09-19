"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LunarDate_1 = require("./LunarDate");
var SolarDate = /** @class */ (function () {
    function SolarDate(jde) {
        this.jde = jde;
    }
    SolarDate.prototype.valueOf = function () {
        return this.jde;
    };
    SolarDate.prototype.getWeek = function () {
        return (this.jde + 1 + 7000000) % 7;
    };
    SolarDate.prototype.toLD = function () {
        return new LunarDate_1.LunarDate(this.jde);
    };
    return SolarDate;
}());
//# sourceMappingURL=SolarDate.js.map