var JDate = function (jd) {
    this.jd = jd;
};

JDate.J2000 = 2451545.0; //2000年前儒略日数(2000-1-1 12:00:00格林威治平时)
JDate.DTS = [ // TD - UT1 计算表
    -4000, 108371.7, -13036.80, 392.000, 0.0000,
    -500, 17201.0, -627.82, 16.170, -0.3413,
    -150, 12200.6, -346.41, 5.403, -0.1593,
    150, 9113.8, -328.13, -1.647, 0.0377,
    500, 5707.5, -391.41, 0.915, 0.3145,
    900, 2203.4, -283.45, 13.034, -0.1778,
    1300, 490.1, -57.35, 2.085, -0.0072,
    1600, 120.0, -9.81, -1.532, 0.1403,
    1700, 10.2, -0.91, 0.510, -0.0370,
    1800, 13.4, -0.72, 0.202, -0.0193,
    1830, 7.8, -1.81, 0.416, -0.0247,
    1860, 8.3, -0.13, -0.406, 0.0292,
    1880, -5.4, 0.32, -0.183, 0.0173,
    1900, -2.3, 2.06, 0.169, -0.0135,
    1920, 21.2, 1.69, -0.304, 0.0167,
    1940, 24.2, 1.22, -0.064, 0.0031,
    1960, 33.2, 0.51, 0.231, -0.0109,
    1980, 51.0, 1.29, -0.026, 0.0032,
    2000, 63.87, 0.1, 0, 0,
    2005, 64.7, 0.4, 0, 0, //一次项记为x,则 10x=0.4秒/年*(2015-2005),解得x=0.4
    2015, 69, 0, 0, 0];


JDate.dt = function (year) { //力学时和世界时之间的精确差值 ΔT = TD - UT
    var dts = JDate.DTS, i, t1, t2, t3, dt = 0;
    if ((year >= -4000) && (year < 2015)) {
        for (i = 0; i < dts.length; i += 5) {
            if (year < dts[i + 5]) {
                t1 = (year - dts[i]) / (dts[i + 5] - dts[i]) * 10;
                t2 = t1 * t1;
                t3 = t2 * t1;
                dt = dts[i + 1] + dts[i + 2] * t1 + dts[i + 3] * t2 + dts[i + 4] * t3;
                break;
            }
        }
    } else {
        var jsd = 31; //sjd是y1年之后的加速度估计。瑞士星历表jsd=31,NASA网站jsd=32,skmap的jsd=29
        var dy = (year - 1820) / 100;
        if (year > 2015 + 100) {
            dt = -20 + jsd * dy * dy;
        } else {
            var v = -20 + jsd * dy * dy;
            dy = (2015 - 1820) / 100;
            var dv = -20 + jsd * dy * dy - 69;
            dt = v - dv * (2015 + 100 - year) / 100;
        }
    }
    return dt;
};