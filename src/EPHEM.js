var EPHEM = (function () {
    var rad = 180 * 3600 / Math.PI; //每弧度的角秒数

    var eph = {};

    eph.nutation = (function () {
            var nutB = [//中精度章动计算表
                2.1824, -33.75705, 36e-6, -1720, 920,
                3.5069, 1256.66393, 11e-6, -132, 57,
                1.3375, 16799.4182, -51e-6, -23, 10,
                4.3649, -67.5141, 72e-6, 21, -9,
                0.04, -628.302, 0, -14, 0,
                2.36, 8328.691, 0, 7, 0,
                3.46, 1884.966, 0, -5, 2,
                5.44, 16833.175, 0, -4, 2,
                3.69, 25128.110, 0, -3, 0,
                3.55, 628.362, 0, 2, 0];

            return {
                lon: function (t) { //只计算黄经章动
                    var i, a, t2 = t * t, dL = 0, B = nutB;
                    for (i = 0; i < B.length; i += 5) {
                        if (i == 0) a = -1.742 * t; else a = 0;
                        dL += (B[i + 3] + a) * Math.sin(B[i] + B[i + 1] * t + B[i + 2] * t2);
                    }
                    return dL / 100 / rad;
                }
            };
        })();

    eph.earth = (function () {
            return {
                lon: function (t) {
                    //alert(XL0_calc(0,0, t,64) + '=' + VSOP87.earth.orbL(t));
                    return VSOP87.earth.orbL(t);
                    //return XL0_calc(0,0, t,64) //xt星体,zn坐标号,t儒略世纪数,n计算项数
                },

                v: function (t) { //地球速度,t是世纪数,误差小于万分3
                    var f = 628.307585 * t;
                    return 628.332 + 21 * Math.sin(1.527 + f) + 0.44 * Math.sin(1.48 + f * 2) + 0.129 * Math.sin(5.82 + f) * t + 0.00055 * Math.sin(4.21 + f) * t * t;
                },

                lon_t: function (W) { //已知地球真黄经求时间
                    var t, v = 628.3319653318;
                    t = ( W - 1.75347          ) / v;
                    v = this.v(t);   //v的精度0.03%，详见原文
                    t += ( W - this.lon(t, 10) ) / v;
                    v = this.v(t);   //再算一次v有助于提高精度,不算也可以
                    t += ( W - this.lon(t, -1) ) / v;
                    return t;
                }


            };
        })();

    eph.sun = (function(){
            return {
                aLon_t2: function(W) {
                    var t, L, v = 628.3319653318;
                    t = (W - 1.75347 - Math.PI) / v;
                    t -= (0.000005297 * t * t + 0.0334166 * Math.cos(4.669257 + 628.307585 * t) + 0.0002061 * Math.cos(2.67823 + 628.307585 * t) * t) / v;
                    t += (W - eph.earth.lon(t) - Math.PI + (20.5 + 17.2 * Math.sin(2.1824 - 33.75705 * t)) / rad) / v;
                    return t;
                },
                aLon: function (t) {  //太阳视黄经
                    return eph.earth.lon(t) + eph.nutation.lon(t) + this.gxcLon(t) + Math.PI; //注意，这里的章动计算很耗时
                },
                gxcLon: function(t) {
                    var v = -0.043126 + 628.301955 * t - 0.000002732 * t * t;
                    var e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;
                    return (-20.49552 * (1 + e * Math.cos(v))) / rad;
                }
            }

        })();

    eph.moon = (function () {
            return {
                lon: function (t) {
                    return MPP02.moon.orbL(t);  //  XL1_calc(0,t,n)  //月球经度计算,返回Date分点黄经,传入世纪数,n是项数比例
                },

                v: function (t) { //月球速度计算,传入世经数
                    var v = 8399.71 - 914 * Math.sin(0.7848 + 8328.691425 * t + 0.0001523 * t * t); //误差小于5%
                    v -= 179 * Math.sin(2.543 + 15542.7543 * t)  //误差小于0.3%
                        + 160 * Math.sin(0.1874 + 7214.0629 * t)
                        + 62 * Math.sin(3.14 + 16657.3828 * t)
                        + 34 * Math.sin(4.827 + 16866.9323 * t)
                        + 22 * Math.sin(4.9 + 23871.4457 * t)
                        + 12 * Math.sin(2.59 + 14914.4523 * t)
                        + 7 * Math.sin(0.23 + 6585.7609 * t)
                        + 5 * Math.sin(0.9 + 25195.624 * t)
                        + 5 * Math.sin(2.32 - 7700.3895 * t)
                        + 5 * Math.sin(3.88 + 8956.9934 * t)
                        + 5 * Math.sin(0.49 + 7771.3771 * t);
                    return v;
                },

                m_lon_t: function (W) { //已知真月球黄经求时间
                    var t, v = 8399.70911033384;
                    t = ( W - 3.81034          ) / v;
                    t += ( W - this.lon(t, 3) ) / v;
                    v = this.v(t);  //v的精度0.5%，详见原文
                    t += ( W - this.lon(t, 20) ) / v;
                    t += ( W - this.lon(t, -1) ) / v;
                    return t;
                }
            };
        })();


    return eph;
})();