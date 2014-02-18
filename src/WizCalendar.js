(function () {
  this.WC = this.WC || {
    name: 'WizCalendar',
    version: '0.0.1',
    build: ''
  };

  if (0.9.toFixed(0) !== '1') {
    Number.prototype.toFixed = (function () {
      var oldToFixed = Number.prototype.toFixed;
      return function (precision) {
        var power = Math.pow(10, precision || 0);
        return oldToFixed.call((Math.round(this * power) / power), precision);
      };
    })();
  }


  var int = this.WC.int = function (v) {
    return Math[v < 0 ? 'ceil' : 'floor'](v);
  };

  var Angle = this.WC.Angle = function (rad) {
    this.rad = Angle.inPI2(rad);
  };

  Angle.D2R = Math.PI / 180.0;
  Angle.R2D = 180.0 / Math.PI;
  Angle.PI2 = 2 * Math.PI;
  Angle.R2A = 180 * 3600 / Math.PI; // 3600.0 * (180 / Math.PI); //每弧度的角秒数

  Angle.rad = function (rad) {
    return new Angle(rad);
  };

  Angle.deg = function (deg) {
    return new Angle(deg * Angle.D2R);
  };

  Angle.arc = function (arc) {
    return new Angle(arc / Angle.R2A);
  };

  Angle.inPI2 = function (rad) {
    rad = rad % Angle.PI2;
    if (rad < 0) {
      rad += Angle.PI2;
    }
    return rad;
  };

  Angle.normalizeRad = function(rad) {
    return rad % Angle.PI2;
  };

  Angle.normalizeDeg = function(deg) {
    return deg % 360;
  };

  Angle.prototype = {
    valueOf: function () {
      return this.rad;
    },
    toString: function () {
      return this.rad + "";
    },
    inPI2: function () {
      return Angle.inPI2(this.rad);
    },
    toDeg: function () {
      return this.rad * Angle.R2D;
    },
    toDMS: function (formate) {
      var d = this.rad;
      //tim=0输出格式示例: -23°59' 48.23"
      //tim=1输出格式示例: 18h 29m 44.52s
      var s = "+";
      var w1 = "°", w2 = "’", w3 = "”";
      if (d < 0) d = -d, s = '-';
      if (formate) {
        d *= 12 / Math.PI;
        w1 = "h ", w2 = "m ", w3 = "s ";
      } else {
        d *= 180 / Math.PI;
      }
      var a = Math.floor(d);
      d = (d - a) * 60;
      var b = Math.floor(d);
      d = (d - b) * 60;
      var c = Math.floor(d);
      d = (d - c) * 100;
      d = Math.floor(d + 0.5);
      if (d >= 100) d -= 100, c++;
      if (c >= 60) c -= 60, b++;
      if (b >= 60) b -= 60, a++;
      a = "  " + a, b = "0" + b, c = "0" + c, d = "0" + d;
      s += a.substr(a.length - 3, 3) + w1;
      s += b.substr(b.length - 2, 2) + w2;
      s += c.substr(c.length - 2, 2) + ".";
      s += d.substr(d.length - 2, 2) + w3;
      return s;
    },
    cos: function () {
      return Math.cos(this.rad);
    },
    sin: function () {
      return Math.sin(this.rad);
    },
    tan: function () {
      return Math.tan(this.rad);
    },
    add: function (rad) {
      this.rad = Angle.inPI2(this.rad + rad);
      return this;
    },
    sub: function (rad) {
      this.rad = Angle.inPI2(this.rad - rad);
      return this;
    },
    mul: function (rad) {
      this.rad = Angle.inPI2(this.rad * rad);
      return this;
    },
    div: function (rad) {
      this.rad = Angle.inPI2(this.rad * rad);
      return this;
    }
  };

  //---JDate------------------------------------------------------------------
  var JDate = this.WC.JDate = function (jd) {
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

  JDate.dt2 = function (jd) { //传入儒略日(J2000起算),计算UTC与原子时的差(单位:日)
    return JDate.dt(jd / 365.2425 + 2000) / 86400.0;
  };

  JDate.gd2jd = function (Y, M, D, h, m, s) {
    var jd = 0;
    Y = Y || 2000;
    M = M || 1;
    D = D || 1;
    h = h || 0;
    m = m || 0;
    s = s || 0;
    D += (h + m / 60 + s / 3600) / 24;
    var a = 0, b = 0;
    if (M <= 2) {
      M += 12;
      Y -= 1;
    }
    if (Y * 372 + M * 31 + int(D) >= 588829) {
      a = int(Y / 100);
      b = 2 - a + int(a / 4);
    }
    jd = int(365.25 * (Y + 4716)) + int(30.6001 * (M + 1)) + D + b - 1524.5;
    //if (UTC = 1) jd += JDate.dt(Y);
    return jd;
  };

  JDate.jd2gd = function (jd) { //儒略日数转公历,UTC=1表示目标公历是UTC
    var gd = {};
    //if (UTC = 1) jd -= JDate.dt2(jd - JDate.J2000);
    jd += 0.5;
    var A = int(jd), F = jd - A, D; //取得日数的整数部份A及小数部分F
    if (A > 2299161) {
      D = int((A - 1867216.25) / 36524.25), A += 1 + D - int(D / 4)
    }
    ;
    A += 1524; //向前移4年零2个月
    gd.Y = int((A - 122.1) / 365.25);//年
    D = A - int(365.25 * gd.Y); //去除整年日数后余下日数
    gd.M = int(D / 30.6001);    //月数
    gd.D = D - int(gd.M * 30.6001);//去除整月日数后余下日数
    gd.Y -= 4716;
    gd.M--;
    if (gd.M > 12) gd.M -= 12;
    if (gd.M <= 2) gd.Y++;
    //日的小数转为时分秒
    F *= 24;
    gd.h = int(F);
    F -= gd.h;
    F *= 60;
    gd.m = int(F);
    F -= gd.m;
    F *= 60;
    gd.s = int(F * 100) / 100;
    return gd;
  };

  JDate.Dint_dec = function (jd, shiqu, int_dec) { //算出:jd转到当地UTC后,UTC日数的整数部分或小数部分
    //基于J2000力学时jd的起算点是12:00:00时,所以跳日时刻发生在12:00:00,这与日历计算发生矛盾
    //把jd改正为00:00:00起算,这样儒略日的跳日动作就与日期的跳日同步
    //改正方法为jd=jd+0.5-deltatT+shiqu/24
    //把儒略日的起点移动-0.5(即前移12小时)
    //式中shiqu是时区,北京的起算点是-8小时,shiqu取8
    var u = jd + 0.5 - JDate.dt2(jd) + shiqu / 24;
    if (int_dec) {
      return Math.floor(u); //返回整数部分
    } else {
      return u - Math.floor(u);   //返回小数部分
    }
  };

  JDate.gd = function (Y, M, D, h, m, s) {
    return new JDate(JDate.gd2jd(Y, M, D, h, m, s));
  };

  JDate.jd = function (jd) {
    return new JDate(jd);
  };

  JDate.utc = function (Y, M, D, h, m, s) {
    return new JDate(JDate.gd2jd(Y, M, D, h, m, s) + JDate.dt(Y));
  };

  JDate.prototype = {
    toJM: function () {
      return (this.jd - JDate.J2000) / 365250;
    },
    toJC: function () {
      return (this.jd - JDate.J2000) / 36525;
    },
    valueOf: function () {
      return this.jd;
    },
    toString: function () {
      return this.jd + "";
    },
    add: function (jd) {
      this.jd = this.jd + jd;
      return this;
    },
    sub: function (jd) {
      this.jd = this.jd - jd;
      return this;
    },
    mul: function (jd) {
      this.jd = this.jd * jd;
      return this;
    },
    div: function () {
      this.jd = this.jd / jd;
      return this;
    },
    toStr: function () {//日期转为串
      var d = JDate.jd2gd(this.jd);
      var Y = "   " + d.Y, M = "0" + d.M, D = "0" + d.D;
      var h = d.h, m = d.m, s = Math.floor(d.s + .5);
      if (s >= 60) s -= 60, m++;
      if (m >= 60) m -= 60, h++;
      h = "0" + h;
      m = "0" + m;
      s = "0" + s;
      Y = Y.substr(Y.length - 5, 5);
      M = M.substr(M.length - 2, 2);
      D = D.substr(D.length - 2, 2);
      h = h.substr(h.length - 2, 2);
      m = m.substr(m.length - 2, 2);
      s = s.substr(s.length - 2, 2);
      return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    },
    toUTC: function () {
      var d = JDate.jd2gd(this.jd - JDate.dt2(this.jd - JDate.J2000));
      var Y = "   " + d.Y, M = "0" + d.M, D = "0" + d.D;
      var h = d.h, m = d.m, s = Math.floor(d.s + .5);
      if (s >= 60) s -= 60, m++;
      if (m >= 60) m -= 60, h++;
      h = "0" + h;
      m = "0" + m;
      s = "0" + s;
      Y = Y.substr(Y.length - 5, 5);
      M = M.substr(M.length - 2, 2);
      D = D.substr(D.length - 2, 2);
      h = h.substr(h.length - 2, 2);
      m = m.substr(m.length - 2, 2);
      s = s.substr(s.length - 2, 2);
      return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    }
  };

  //=========黄赤交角及黄赤坐标变换===========
  var Coord = WC.Coord = function () {
    this.e1 = Angle.rad(0);
    this.e2 = Angle.rad(0);
    this.e3 = 0;
  };

  Coord.OBLS = [84381.448, -46.8150, -0.00059, 0.001813];//黄赤交角系数表
  Coord.PRE_P03 = {
    fi: [0, 5038.481507, -1.0790069, -0.00114045, +0.000132851, -9.51e-8], //fi黄经岁差
    w: [84381.406000, -0.025754, +0.0512623, -0.00772503, -4.67e-7, +3.337e-7], //w瞬时平赤面与历元黄面交角
    P: [0, 4.199094, +0.1939873, -0.00022466, -9.12e-7, +1.20e-8], //P
    Q: [0, -46.811015, +0.0510283, +0.00052413, -6.46e-7, -1.72e-8], //Q
    E: [84381.406000, -46.836769, -0.0001831, +0.00200340, -5.76e-7, -4.34e-8], //E瞬时平赤面与瞬时黄面交角（平黄赤交角）
    x: [0, 10.556403, -2.3814292, -0.00121197, +0.000170663, -5.60e-8], //x赤经岁差
    pi: [0, 46.998973, -0.0334926, -0.00012559, +1.13e-7, -2.2e-9],  //pi
    II: [629546.7936, -867.95758, +0.157992, -0.0005371, -0.00004797, +7.2e-8],  //II
    p: [0, 5028.796195, +1.1054348, +0.00007964, -0.000023857, +3.83e-8], //p
    th: [0, 2004.191903, -0.4294934, -0.04182264, -7.089e-6, -1.274e-7], //th
    Z: [2.650545, 2306.083227, +0.2988499, +0.01801828, -5.971e-6, -3.173e-7], //Z
    z: [-2.650545, 2306.077181, +1.0927348, +0.01826837, -0.000028596, -2.904e-7] //z
  };
  //Coord.PRES = [0, 50287.92262, 111.24406, 0.07699, -0.23479, -0.00178, 0.00018, 0.00001];//Date黄道上的岁差p iau2000
  Coord.ABE_E = [0.016708634, -0.000042037, -0.0000001267]; //离心率
  Coord.ABE_P = [102.93735 / Angle.R2D, 1.71946 / Angle.R2D, 0.00046 / Angle.R2D]; //近点
  Coord.ABE_L = [280.4664567 / Angle.R2D, 36000.76982779 / Angle.R2D, 0.0003032028 / Angle.R2D, 1 / 49931000 / Angle.R2D, -1 / 153000000 / Angle.R2D]; //太平黄经
  Coord.ABE_K = 20.49552 / Angle.R2A; //光行差常数
  Coord.NUTS = [//章动表
    2.1824391966, -33.757045954, 0.0000362262, 3.7340E-08, -2.8793E-10, -171996, -1742, 92025, 89,
    3.5069406862, 1256.663930738, 0.0000105845, 6.9813E-10, -2.2815E-10, -13187, -16, 5736, -31,
    1.3375032491, 16799.418221925, -0.0000511866, 6.4626E-08, -5.3543E-10, -2274, -2, 977, -5,
    4.3648783932, -67.514091907, 0.0000724525, 7.4681E-08, -5.7586E-10, 2062, 2, -895, 5,
    0.0431251803, -628.301955171, 0.0000026820, 6.5935E-10, 5.5705E-11, -1426, 34, 54, -1,
    2.3555557435, 8328.691425719, 0.0001545547, 2.5033E-07, -1.1863E-09, 712, 1, -7, 0,
    3.4638155059, 1884.965885909, 0.0000079025, 3.8785E-11, -2.8386E-10, -517, 12, 224, -6,
    5.4382493597, 16833.175267879, -0.0000874129, 2.7285E-08, -2.4750E-10, -386, -4, 200, 0,
    3.6930589926, 25128.109647645, 0.0001033681, 3.1496E-07, -1.7218E-09, -301, 0, 129, -1,
    3.5500658664, 628.361975567, 0.0000132664, 1.3575E-09, -1.7245E-10, 217, -5, -95, 3];
  Coord.NUTB = [//中精度章动计算表
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

  Coord.obl = function (jd) { //返回黄赤交角(常规精度),短期精度很高
    var t1 = jd.toJC(), t2 = t1 * t1, t3 = t2 * t1;
    return Angle.arc(Coord.OBLS[0] + Coord.OBLS[1] * t1 + Coord.OBLS[2] * t2 + Coord.OBLS[3] * t3);
  };
  Coord.trans = function (coord, e) { //黄赤转换(黄赤坐标旋转)
    //黄道赤道坐标变换,赤到黄e取负
    var sinE = Math.sin(e), cosE = Math.cos(e);
    var e2 = Math.asin(cosE * coord.e2.sin() + sinE * coord.e2.cos() * coord.e1.sin());
    var e1 = Math.atan2(coord.e1.sin() * cosE - coord.e2.tan() * sinE, coord.e1.cos());
    coord.e1 = Angle.rad(e1);
    coord.e2 = Angle.rad(e2);
  };
  Coord.prece = function (jd, sc) { //t是儒略世纪数,sc是岁差量名称,mx是模型
    var i, tn = 1, c = 0, p, t = jd.toJC();
    p = Coord.PRE_P03[sc];
    for (i = 0; i < p.length; i++, tn *= t) {
      c += p[i] * tn;
    }
    return c / Angle.R2A;
  };
  Coord.rePre = function (jd, coord) { //岁差
    //coord.e1.add(Coord.prece(jd, 'fi'));
//    var i, t = 1, v = 0, t1 = jd.toJM();
//    for (i = 1; i < 8; i++) {
//      t *= t1;
//      v += Coord.PRES[i] * t;
//    }
//    coord.e1.add((v + 2.9965 * t1) / Angle.R2A);
  };
  Coord.reAbe = function (jd, coord) { //光行差 //恒星周年光行差计算(黄道坐标中)
    var t1 = jd.toJC(), t2 = t1 * t1, t3 = t2 * t1, t4 = t3 * t1;
    var L = Coord.ABE_L[0] + Coord.ABE_L[1] * t1 + Coord.ABE_L[2] * t2 + Coord.ABE_L[3] * t3 + Coord.ABE_L[4] * t4;
    var p = Coord.ABE_P[0] + Coord.ABE_P[1] * t1 + Coord.ABE_P[2] * t2;
    var e = Coord.ABE_E[0] + Coord.ABE_E[1] * t1 + Coord.ABE_E[2] * t2;
    var dL = L - coord.e1, dP = p - coord.e1;
    coord.e1.sub(Coord.ABE_K * (Math.cos(dL) - e * Math.cos(dP)) / coord.e2.cos());
    coord.e2.sub(Coord.ABE_K * coord.e2.sin() * (Math.sin(dL) - e * Math.sin(dP)));
  };
  Coord.nutB = function (jd) { //中精度章动计算,t是世纪数
    var i, c, a, t = jd.toJC(), t2 = t * t, B = Coord.NUTB, d = {Lon: 0, Obl: 0};
    for (i = 0; i < B.length; i += 5) {
      c = B[i] + B[i + 1] * t + B[i + 2] * t2;
      if (i == 0) a = -1.742 * t; else a = 0;
      d.Lon += (B[i + 3] + a) * Math.sin(c);
      d.Obl += B[i + 4] * Math.cos(c);
    }
    d.Lon /= Angle.R2A * 100; //黄经章动
    d.Obl /= Angle.R2A * 100; //交角章动
    return d; //黄经章动,交角章动
  };
  Coord.reNut = function (jd) { //计算黄经章动及交角章动
//    var d = {Lon: 0, Obl: 0};
//    var t = jd.toJC();
//    var i, c, t1 = t, t2 = t1 * t1, t3 = t2 * t1, t4 = t3 * t1, t5 = t4 * t1;
//    for (i = 0; i < Coord.NUTS.length; i += 9) {
//      c = Coord.NUTS[i] + Coord.NUTS[i + 1] * t1 + Coord.NUTS[i + 2] * t2 + Coord.NUTS[i + 3] * t3 + Coord.NUTS[i + 4] * t4;
//      d.Lon += (Coord.NUTS[i + 5] + Coord.NUTS[i + 6] * t / 10) * Math.sin(c); //黄经章动
//      d.Obl += (Coord.NUTS[i + 7] + Coord.NUTS[i + 8] * t / 10) * Math.cos(c); //交角章动
//    }
//    d.Lon /= Angle.R2A * 10000; //黄经章动
//    d.Obl /= Angle.R2A * 10000; //交角章动
    return Coord.nutB(jd);
  };
  Coord.nutationRaDec = function (jd, coord) { //本函数计算赤经章动及赤纬章动
    var Ra = coord.e1, Dec = coord.e2;
    var E = Coord.obl(jd), sinE = Math.sin(E), cosE = Math.cos(E); //计算黄赤交角
    var d = Coord.reNut(jd);                 //计算黄经章动及交角章动
    var cosRa = Math.cos(Ra), sinRa = Math.sin(Ra);
    var tanDec = Math.tan(Dec);
    Coord.e1.add((cosE + sinE * sinRa * tanDec) * d.Lon - cosRa * tanDec * d.Obl); //赤经章动
    Coord.e2.add(sinE * cosRa * d.Lon + sinRa * d.Obl);  //赤纬章动
  };


  //=========黄赤交角及黄赤坐标变换===========




  function earCal(jd) {//返回地球位置,日心Date黄道分点坐标
    //var t = jd.toJC();
    var T = jd.toJM();
    var coord = new Coord();
    coord.e1 = Angle.rad(VSOP87.earth.orbL(T));
    coord.e2 = Angle.rad(VSOP87.earth.orbB(T));
    coord.e3 = Angle.rad(VSOP87.earth.orbR(T));
    return coord;
  }

  function sunCal2(jd) { //传回jd时刻太阳的地心视黄经及黄纬
    var sun = earCal(jd);
    sun.e1.add(Math.PI);
    sun.e2.mul(-1); //计算太阳真位置
    var d = Coord.reNut(jd);
    sun.e1.add(d.Lon);  //补章动
    Coord.reAbe(jd, sun); //补周年黄经光行差
    return sun;   //返回太阳视位置
  }

//==================月位置计算===================


  function moonCal(jd) {//返回月球位置,返回地心Date黄道坐标
    var t = jd.toJC();
    var coord = new Coord(); //地心Date黄道原点坐标(不含岁差)
    coord.e1 = Angle.rad(MPP02.moon.orbL(t));
    coord.e2 = Angle.rad(MPP02.moon.orbB(t));
    coord.e3 = Angle.rad(MPP02.moon.orbR(t));
    return coord;
  }

  function moonCal2(jd) { //传回月球的地心视黄经及视黄纬
    var moon = moonCal(jd);
    var d = Coord.reNut(jd);
    moon.e1.add(d.Lon); //补章动
    return moon;
  }

  function moonCal3(jd) { //传回月球的地心视赤经及视赤纬
    var moon = moonCal(jd);
    Coord.trans(moon, Coord.obl(jd));
    Coord.nutationRaDec(jd, moon); //补赤经及赤纬章动
    //如果黄赤转换前补了黄经章动及交章动,就不能再补赤经赤纬章动
    return moon;
  }

//==================地心坐标中的日月位置计算===================
  function jiaoCai(lx, jd, jiao) {
    //alert(jd);
    //lx=1时计算t时刻日月角距与jiao的差, lx=0计算t时刻太阳黄经与jiao的差
    var sun = earCal(jd); //计算太阳真位置(先算出日心坐标中地球的位置)
    sun.e1.add(Math.PI);
    sun.e2.mul(-1); //转为地心坐标
    Coord.reAbe(jd, sun);   //补周年光行差
    if (lx == 0) {
      var d = Coord.reNut(jd);
      sun.e1.add(d.Lon); //补黄经章动
      return Angle.inPI2(jiao - sun.e1);
    }
    var moon = moonCal(jd); //日月角差与章动无关
    return Angle.inPI2(jiao - (moon.e1 - sun.e1));
  }

//==================已知位置反求时间===================
  function jiaoCal(t1, jiao, lx) { //t1是J2000起算儒略日数
    //t1 = JDate.jd(t1 + JDate.J2000);
    //已知角度(jiao)求时间(t)
    //lx=0是太阳黄经达某角度的时刻计算(用于节气计算)
    //lx=1是日月角距达某角度的时刻计算(用于定朔望等)
    //传入的t1是指定角度对应真时刻t的前一些天
    //对于节气计算,应满足t在t1到t1+360天之间,对于Y年第n个节气(n=0是春分),t1可取值Y*365.2422+n*15.2
    //对于朔望计算,应满足t在t1到t1+25天之间,在此范围之外,求右边的根
    var t2 = t1, t = 0, v;
    if (lx == 0) t2 += 360; //在t1到t2范围内求解(范气360天范围),结果置于t
    else t2 += 25;
    jiao *= Math.PI / 180; //待搜索目标角
    //利用截弦法计算

    var v1 = jiaoCai(lx, JDate.jd(t1 + JDate.J2000), jiao);      //v1,v2为t1,t2时对应的黄经
    var v2 = jiaoCai(lx, JDate.jd(t2 + JDate.J2000), jiao);
    if (v1 < v2) v2 -= 2 * Math.PI;  //减2pi作用是将周期性角度转为连续角度
    var k = 1, k2, i; //k是截弦的斜率
    for (i = 0; i < 10; i++) {    //快速截弦求根,通常截弦三四次就已达所需精度
      k2 = (v2 - v1) / (t2 - t1);  //算出斜率
      if (Math.abs(k2) > 1e-15) k = k2;   //差商可能为零,应排除
      t = t1 - v1 / k;
      v = jiaoCai(lx, JDate.jd(t + JDate.J2000), jiao);//直线逼近法求根(直线方程的根)
      if (v > 1)   v -= 2 * Math.PI;    //一次逼近后,v1就已接近0,如果很大,则应减1周
      if (Math.abs(v) < 1e-8) break;   //已达精度
      t1 = t2, v1 = v2;
      t2 = t, v2 = v;     //下一次截弦
    }

    return t;
  }

//==================节气计算===================
  var jqB = new Array( //节气表
    "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露",
    "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至", "小寒", "大寒", "立春", "雨水", "惊蛰");

  var JQtest = WC.JQtest = function (jd) { //节气使计算范例,y是年分,这是个测试函数
    var i, q, s1, s2, j;
    document.write("节气:世界时 原子时<br>");
    for (i = 0; i < 24; i++) {
      q = jiaoCal(jd + (i * 15.2) - JDate.J2000, i * 15, 0) + JDate.J2000 + 8 / 24; //计算第i个节气(i=0是春风),结果转为北京时

      //JDate.setFromJD(q,1); s1=JDate.toStr(); //将儒略日转成世界时
      //JDate.setFromJD(q,0); s2=JDate.toStr(); //将儒略日转成日期格式(输出日期形式的力学时)
      j = JDate.jd(q);
      //alert(q);
      document.write(jqB[i] + " : " + j.toStr() + " " + s2 + "<br>"); //显示
    }
  }
//=================定朔弦望计算========================
  function dingSuo(y, arc) { //这是个测试函数
    var i, jd = 365.2422 * (y - 2000), q, s1, s2;
    document.write("月份:世界时 原子时<br>");
    for (i = 0; i < 12; i++) {
      q = jiaoCal(jd + 29.5 * i, arc, 1) + J2000 + 8 / 24;  //计算第i个节气(i=0是春风),结果转为北京时
      JDate.setFromJD(q, 1);
      s1 = JDate.toStr(); //将儒略日转成世界时
      JDate.setFromJD(q, 0);
      s2 = JDate.toStr(); //将儒略日转成日期格式(输出日期形式的力学时)
      document.write((i + 1) + "月 : " + s1 + " " + s2 + "<br>"); //显示
    }
  }

//=================农历计算========================
  /*****
   1.冬至所在的UTC日期保存在A[0],根据"规定1"得知在A[0]之前(含A[0])的那个UTC朔日定为年首日期
   冬至之后的中气分保存在A[1],A[2],A[3]...A[13],其中A[12]又回到了冬至,共计算13次中气
   2.连续计算冬至后14个朔日,即起算时间时A[0]+1
   14个朔日编号为0,1...12,保存在C[0],C[1]...C[13]
   这14个朔日表示编号为0月,1月,...12月0月的各月终止日期,但要注意实际终止日是新月初一,不属本月
   这14个朔日同样表示编号为1月,2月...的开始日期
   设某月编号为n,那么开始日期为C[n-1],结束日期为C[n],如果每月都含中气,该月所含的中气为A[n]
   注:为了全总计算出13个月的大小月情况,须算出14个朔日。
   3.闰年判断:含有13个月的年份是闰年
   当第13月(月编号12月)终止日期大于冬至日, 即C[12]〉A[12], 那么该月是新年,本年没月12月,本年共12个月
   当第13月(月编号12月)终止日期小等于冬至日,即C[12]≤A[12],那么该月是本年的有效月份,本年共13个月
   4.闰年中处理闰月:
   13个月中至少1个月份无中气,首个无中气的月置闰,在n=1...12月中找到闰月,即C[n]≤A[n]
   从农历年首的定义知道,0月一定含有中气冬至,所以不可能是闰月。
   首月有时很贪心,除冬至外还可能再吃掉本年或前年的另一个中气
   定出闰月后,该月及以后的月编号减1
   5.以上所述的月编号不是日常生活中说的"正月","二月"等月名称:
   如果"建子",0月为首月,如果"建寅",2月的月名"正月",3月是"二月",其余类推
   *****/
  var yueMing = new Array("正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "11", "12");

  var paiYue = WC.paiYue = function () { //农历排月序计算,可定出农历
    y = document.getElementById('in1').value - 0;
    var zq = [], jq = [], hs = []; //中气表,节气表,日月合朔表

    //从冬至开始,连续计算14个中气时刻
    var i, t1 = 365.2422 * (y - 2000) - 50; //农历年首始于前一年的冬至,为了节气中气一起算,取前年大雪之前
    for (i = 0; i < 14; i++) {  //计算节气(从冬至开始),注意:返回的是力学时
      zq[i] = jiaoCal(t1 + i * 30.4, i * 30 - 90, 0); //中气计算,冬至的太阳黄经是270度(或-90度)
      jq[i] = jiaoCal(t1 + i * 30.4, i * 30 - 105, 0); //顺便计算节气,它不是农历定朔计算所必需的
    }
    //在冬至过后,连续计算14个日月合朔时刻
    var dongZhiJia1 = zq[0] + 1 - JDate.Dint_dec(zq[0], 8, 0); //冬至过后的第一天0点的儒略日数
    hs[0] = jiaoCal(dongZhiJia1, 0, 1); //首月结束的日月合朔时刻
    for (i = 1; i < 14; i++) hs[i] = jiaoCal(hs[i - 1] + 25, 0, 1);
    //算出中气及合朔时刻的日数(不含小数的日数计数,以便计算日期之间的差值)
    var A = [], B = [], C = [];
    for (i = 0; i < 14; i++) { //取当地UTC日数的整数部分
      A[i] = JDate.Dint_dec(zq[i], 8, 1);
      B[i] = JDate.Dint_dec(jq[i], 8, 1);
      C[i] = JDate.Dint_dec(hs[i], 8, 1);
    }
    //闰月及大小月分析
    var tot = 12, nun = -1, yn = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 0]; //月编号
    if (C[12] <= A[12]) { //闰月分析
      yn[12] = 12, tot = 13; //编号为12的月是本年的有效月份,本年总月数13个
      for (i = 1; i < 13; i++) if (C[i] <= A[i]) break;
      for (nun = i - 1; i < 13; i++) yn[i - 1]--; //注意yn中不含农历首月(所以取i-1),在公历中农历首月总是去年的所以不多做计算
    }
    for (i = 0; i < tot; i++) { //转为建寅月名,并做大小月分析
      yn[i] = yueMing[(yn[i] + 10) % 12];           //转建寅月名
      if (i == nun)     yn[i] += "闰"; else yn[i] += "月"; //标记是否闰月
      if (C[i + 1] - C[i] > 29) yn[i] += "大"; else yn[i] += "小" //标记大小月
    }
    //显示
    var out = "节气  手表时      中气  手表时      农历月  朔的手表时\r\n";
    var j;
    for (i = 0; i < tot; i++) {
      var zm = (i * 2 + 18) % 24, jm = (i * 2 + 17) % 24; //中气名节气名
      j = JDate.jd(jq[i] + JDate.J2000 + 8 / 24, 1);
      out += jqB[jm] + ":" + j.toUTC() + " "; //显示节气
      j = JDate.jd(zq[i] + JDate.J2000 + 8 / 24, 1);
      out += jqB[zm] + ":" + j.toUTC() + " "; //显示中气
      j = JDate.jd(hs[i] + JDate.J2000 + 8 / 24, 1);
      out += yn[i] + ":" + j.toUTC() + "\r\n"; //显示日月合朔
    }
    document.getElementById('show1').innerText = out;
  };

})();

