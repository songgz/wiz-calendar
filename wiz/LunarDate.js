var Lunisolar = (function(global){
    "use strict";
    var pi2 = Math.PI * 2;

    var date = global.LunarDate = global.LunarDate || function (jd) {
        this.jd = jd - global.JDate.J2000;
        this.preNewMoonMS = 0;
        this.preNewMoonJD = 0;
        this.nextNewMoonJD = 0;
        this.preTermSun = 0;
        this.preTermJD = 0;

        this.getPreNewMoonJD = function (){
            this.preNewMoonMS = global.Ephem.ms.aLon(this.jd / 36525, 10, 3);
            this.preNewMoonMS = Math.floor(this.preNewMoonMS / pi2) * pi2;

            this.preNewMoonJD = global.Ephem.moon.so_accurate(this.preNewMoonMS);                              //定朔计算得出一个历月
            if (this.preNewMoonJD > this.jd) {
                this.preNewMoonMS -= pi2;
                this.preNewMoonJD = global.Ephem.moon.so_accurate(this.preNewMoonMS);
            }
            return this.preNewMoonJD;
        };

        this.getNextNewMoonJD = function(){
            this.preNewMoonMS += pi2;
            return this.nextNewMoonJD = global.Ephem.moon.so_accurate(this.preNewMoonMS);
        };

        this.getPreTerm = function(){
            this.preTermSun = global.Ephem.sun.aLon(this.preNewMoonJD / 36525, 3);
            this.preTermSun = Math.floor(this.preTermSun / pi2 * 24) * pi2 / 24;
            return this.preTermJD = global.Ephem.sun.qi_accurate(this.preTermSun);
        };

        this.calcMonth = function() {
            var pre = this.getPreNewMoonJD();
            var first = this.getPreTerm();
            var next = this.getNextNewMoonJD();
            var d;
            var jq = [];
            for (var j = 0; j < 3; ) {                             //定气计算该月所含节气及分布情况
                d = global.Ephem.sun.qi_accurate(this.preTermSun);
                alert(JD.JD2str(d + J2000));
                if(pre <= d && d < next){
                    j++;
                }else{
                    break;
                }
                jq[j] = d;
                this.preTermSun += pi2 / 24;
            }

            var termK = Math.floor(this.preTermSun / pi2 * 24) + 2;
            var yearH = Math.floor(termK / 24) + 1999;

            // /以节气情况确定月份
            var jq  = (termK % 24 + 24) % 24;
            var monthH = Math.floor(jq / 2);
            var fd = jq.length < 2 ? jq % 2 : 0;
            var leapMonth = jq.length == 1 ? fd : 0;
            for (var j = 0; fd && j <= 5; j++) {
                //确定非基准月份
                if (global.Ephem.sun.term_high(this.preTermSun + (j + 0.5) * pi2 / 12) < global.Ephem.moon.phases_high(this.preTermSun + (j + 1) * pi2)) {
                    monthH++;
                    monthH %= 12;
                    leapMonth = 0;
                    break;
                }
            }

        };
    };

    date.prototype = {
        getYear: function(){
            this.calcMonth();

        },
        getMonth: function(){

        },
        getDay: function(){

        }
    };


    date.toJD = function (y1, m1, rm, d1) { //ymdJd
        var w, ms, zq, hs, hs1, j;
        w = (y1 - 2000 + (m1 + 10) / 12) * pi2;
        zq = global.Ephem.sun.qi_accurate(w);
        ms = global.Ephem.ms.aLon(zq / 36525, 10, 3); //XL.MS_aLon
        ms = Math.floor((ms + 2) / pi2) * pi2;
        hs = global.Ephem.moon.so_accurate(ms);
        if (Math.floor(hs + 0.5) > Math.floor(zq + 0.5)) {
            hs1 = hs;
            hs = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            hs1 = global.Ephem.moon.so_accurate(ms);
        }
        if (Math.floor(hs + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w - pi2 / 24) + 0.5) && Math.floor(hs1 + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w + pi2 / 24) + 0.5)) {
            for (j = 0, w += pi2 / 12; j <= 5; j++) {
                if (Math.floor(global.Ephem.moon.so_accurate(ms + j * pi2) + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w + j * pi2 / 12) + 0.5)) {
                    hs1 = hs;
                    hs = global.Ephem.moon.so_accurate(ms - 2 * pi2);
                    break;
                }
            }
        }
        if (rm) rm = date.yuerun(y1, m1);
        if (rm == 0)return Math.floor(hs + d1 - 1 + 0.5) + global.JDate.J2000; else return Math.floor(hs1 + d1 - 1 + 0.5) + global.JDate.J2000;
    };

    date.yuerun = function (y1, m1) {
        var w, ms, qi, hs, hs1, j;
        var pi2 = Math.PI * 2;
        w = (y1 - 2000 + (m1 + 10.5) / 12) * pi2;
        qi = global.Ephem.sun.qi_accurate(w);
        w += pi2 / 24;
        ms = global.Ephem.ms.aLon(qi / 36525, 10, 3);  //XL.MS_aLon
        ms = Math.floor((ms + 2) / pi2) * pi2;
        hs = global.Ephem.moon.so_accurate(ms);
        if (Math.floor(hs + 0.5) > Math.floor(qi + 0.5)) {
            hs1 = hs;
            hs = global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            hs1 = global.Ephem.moon.so_accurate(ms);
        }
        if (Math.floor(hs + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w - pi2 / 12) + 0.5) && Math.floor(hs1 + 0.5) <= Math.floor(global.Ephem.sun.qi_accurate(w) + 0.5)) {
            for (j = 0; j <= 5; j++) {
                w += pi2 / 12;
                ms += pi2;
                if (Math.floor(global.Ephem.moon.so_accurate(ms) + 0.5) > Math.floor(global.Ephem.sun.qi_accurate(w) + 0.5))return 0;
            }
            return 1;
        } else return 0;
    };

    date.toYmd = function (jd) {
        var F, ms, jd1, jd2, w1, w2, wn, y, m, d, n, fd, ry, j;
        var int2 = Math.floor;
        F = jd + 0.5 - int2(jd + 0.5);
        jd = int2(jd + 0.5) - J2000;
        ms =global.Ephem.ms.aLon(jd / 36525, 10, 3);
        ms = int2((ms + 2) / pi2) * pi2;
        jd1 = Math.floor(global.Ephem.moon.so_accurate(ms));
        if (int2(jd1 + 0.5) > jd) {
            jd2 = jd1;
            jd1 =global.Ephem.moon.so_accurate(ms - pi2);
        } else {
            ms += pi2;
            jd2 = global.Ephem.moon.so_accurate(ms);
        }
        w1 = global.Ephem.sun.aLon(jd1 / 36525, 3);
        w1 = int2(w1 / pi2 * 24) * pi2 / 24;
        while (int2(global.Ephem.sun.qi_accurate(w1) + 0.5) < int2(jd1 + 0.5))w1 += pi2 / 24;
        w2 = w1;
        while (int2(global.Ephem.sun.qi_accurate(w2 + pi2 / 24) + 0.5) < int2(jd2 + 0.5))w2 += pi2 / 24;
        wn = int2((w2 + 0.1) / pi2 * 24) + 4;
        y = int2(wn / 24) + 1999;
        wn = (wn % 24 + 24) % 24;
        m = int2(wn / 2);
        d = jd - int2(jd1 + 0.5) + 1;
        n = int2(jd2 + 0.5) - int2(jd1 + 0.5);
        fd = w2 - w1 < pi2 / 20 ? wn % 2 : 0;
        ry = w2 == w1 ? fd : 0;
        for (j = 0, ms += pi2, w2 += 1.5 * pi2 / 12; fd && j <= 5; j++) {
            if (int2(global.Ephem.sun.qi_accurate(w2 + j * pi2 / 12) + 0.5) < int2(global.Ephem.moon.so_accurate(ms + j * pi2) + 0.5)) {
                m++;
                ry = 0;
                if (m > 12) {
                    m = 1;
                    y++;
                }
                break;
            }
        }
        if (m == 0) {
            m = 12;
            y--;
        }
        var ri = {};
        ri.Y = y;
        ri.M = m;
        ri.R = ry;
        ri.D = d;
        ri.N = n;
        F *= 24;
        ri.h = int2(F);
        F -= ri.h;
        F *= 60;
        ri.m = int2(F);
        F -= ri.m;
        F *= 60;
        ri.s = F;
        return ri;
    };

    var getNewMoon = function(jd){
        var ms = global.Ephem.ms.aLon(jd / 36525, 10, 3);
        ms = Math.floor(ms / pi2) * pi2;
        var jd0 = global.Ephem.moon.so_accurate(ms);                              //定朔计算得出一个历月
        if (jd0 > jd) {
            jd0 = global.Ephem.moon.so_accurate(ms - pi2);
        }
        return jd0;
    };

    //====================月朔气表======================
    date.yuesoqi = function (jd, n) {
        var int2 = Math.floor;
        var jd1, jd2, ms, w, jq, jqN, nh, yh, fd, ry, m, k;
        var s = "", s1 = "", s2 = "", s3 = "", Tq = [];
        n = n - 0;
        jd = jd - J2000;
        if (jd <= -4382622) {
            alert("超出范围!");
            return;
        }
        if (n < 1 || n > 50000) {
            alert("超出范围(1-20000)");
            return;
        }
        if (n > 2500 && Cp146.checked) {
            alert("纪日数据量太大！");
            return;
        }

        ms = global.Ephem.ms.aLon(jd / 36525, 10, 3);
        ms = int2((ms + 1) / pi2) * pi2;

        jd1 = global.Ephem.moon.so_accurate(ms);                              //定朔计算得出一个历月
        if (int2(jd1 + 0.5) > int2(jd + 0.5)) {
            ms -= pi2;
            jd1 = global.Ephem.moon.so_accurate(ms);
        }

        w = global.Ephem.sun.aLon(jd1 / 36525, 3);
        w = int2((w + 0.1) / pi2 * 24) * pi2 / 24;

        for (var i = 0; i < n; i++) {
            ms += pi2;
            jd2 = global.Ephem.moon.so_accurate(ms);
            for (jqN = i ? 1 : 0; jqN <= 3;) {                             //定气计算该月所含节气及分布情况
                Tq[jqN] = global.Ephem.sun.qi_accurate(w);
                s2 = JD.JD2str(Tq[jqN] + J2000);
                alert(s2);
                if(jd1 <= Tq[jqN] && Tq[jqN] < jd2){
                    jqN++
                }else{
                    break;
                }
                w += pi2 / 24;
//                if (int2(Tq[jqN] + 0.5) >= int2(jd2 + 0.5)) break;
//                if (int2(Tq[0] + 0.5) >= int2(jd1 + 0.5)) jqN++;
            }
            jq = int2(w / pi2 * 24 + 0.3) + 2;
            nh = int2(jq / 24) + 1999;    //以节气情况确定月份
            jq = (jq % 24 + 24) % 24;
            yh = int2(jq / 2);
            fd = jqN < 3 ? jq % 2 : 0;
            ry = jqN == 1 ? fd : 0;
            for (var j = 0; fd && j <= 5; j++) {                                  //确定非基准月份
                if (global.Ephem.sun.term_high(w + (j + 0.5) * pi2 / 12) < global.Ephem.moon.phases_high(ms + (j + 1) * pi2)) {
                    yh++;
                    yh %= 12;
                    ry = 0;
                    break;
                }
            }
            if (yh == 0)nh--;                                          //输出计算结果
            k = nh > 0 ? nh : 1 - nh;
            m = 1;
            while (k > Math.pow(10, m) - 1)m++;
            if (!i || (yh == 1 && ry == 0 && i && Cp147.checked)) {
                s1 += '<b>';
                if (nh < 1)s1 += '公元前';
                while (m > 0) {
                    m--;
                    s1 += global.Dict.numCn[int2(k / Math.pow(10, m))];
                    k %= Math.pow(10, m);
                }
                s1 += '年 ' + global.Dict.Gan[((nh + 6) % 10 + 10) % 10] + global.Dict.Zhi[((nh + 8) % 12 + 12) % 12] + '年(' + global.Dict.ShX[((nh + 8) % 12 + 12) % 12] + ')</b>';
                if (!i)s1 += ' ' + ((ry) ? '闰' : '') + global.Dict.ymc[(yh + 1) % 12] + '月起(' + n + '个月)：';
                s1 += '<br>';
            }
            alert(s1);
            s2 = global.JDate.JD2str(jd1 + global.JDate.J2000);
            if (Cp141.checked)s1 += s2.substr(0, s2.length - 8);
            k = int2(jd1 - 6 + 0.5);
            if (Cp142.checked && !Cp146.checked)s1 += JD.Weeks[(k % 7 + 12) % 7] + ' ';
            if (Cp146.checked)s1 += '<b>';
            j = i + 1;
            if (Cp148.checked)s1 += (j < 1000 ? (j < 100 ? (j < 10 ? '000' : '00') : '0') : '') + j + '&nbsp';
            if (Cp144.checked)s1 += ry ? '&#8195&#8195&nbsp' : obb.Gan[((nh % 5 + 7) % 5 * 2 + (yh + 11) % 12) % 10] + obb.Zhi[(yh + 1) % 12] + '&nbsp';
            s3 = obb.ymc[(yh + 1) % 12] + '月' + (int2(jd2 + 0.5) - int2(jd1 + 0.5) > 29 ? '大' : '小');
            if (s3.length < 4)s1 += ((ry) ? '&nbsp闰' : '· ') + s3 + '&nbsp'; else s1 += ((ry) ? '闰' : '·') + s3;
            if (Cp144.checked && !Cp146.checked)s1 += obb.Gan[(k % 10 + 10) % 10] + obb.Zhi[(k % 12 + 12) % 12];
            if (Cp145.checked)s1 += '(' + s2.substr(s2.length - 8, 8) + ')';
            for (j = 0; j < jqN; j++) {
                s1 += '&nbsp' + obb.jqmc[(jq - jqN + j + 27) % 24] + (Cp145.checked ? ' ' : '(') + obb.rmc[int2(Tq[j] + 0.5) - int2(jd1 + 0.5)];
                s2 = JD.JD2str(Tq[j] + J2000);
                if (Cp145.checked)s1 += '(' + s2.substr(s2.length - (Cp141.checked ? 14 : 8), (Cp141.checked ? 14 : 8));
                s1 += ')';
            }
            if (Cp146.checked)for (j = 0, s1 += '</b>'; j < int2(jd2 + 0.5) - int2(jd1 + 0.5); j++) {
                s2 = JD.JD2str(jd1 + J2000 + j);
                s1 += (j % 7) ? '&nbsp&nbsp&#8201' : '<br>';
                s1 += '<font color=';
                s1 += (j + int2(jd1 + 0.5) == int2(Tq[0] + 0.5) || j + int2(jd1 + 0.5) == int2(Tq[1] + 0.5) || j + int2(jd1 + 0.5) == int2(Tq[2] + 0.5) ? '"#0000E0">' : '"#000000">');
                s1 += obb.rmc[j] + '&#8201' + obb.Gan[((k + j) % 10 + 10) % 10] + obb.Zhi[((k + j) % 12 + 12) % 12];
                s1 += '</font>&#8201<font color=' + ((((k + j) % 7 + 11) % 7 > 4) ? '"#FF6000">' : '"#008040">');
                s1 += s2.substr(s2.length - 14, 5) + '&#8201' + JD.Weeks[((k + j) % 7 + 12) % 7] + '</font>';
            }
            s += s1 + '<br>';
            s1 = "";
            jd1 = jd2;
            Tq[0] = Tq[jqN];
        }
        s2 = '&nbsp&nbsp&nbsp&nbsp新法排月：将传统的“年首起月法”改为“节气定月法”，以历月所含各节气分布情况确定月份。所有月份包括基准月和非基准月两类：<br>&nbsp&nbsp&nbsp&nbsp一、<b>基准月</b><br>&nbsp&nbsp&nbsp&nbsp（一）独立基准月<br>&nbsp&nbsp&nbsp&nbsp1、“节与气同月”的月份，以此二节气确定月份，如：含有四月节（立夏）和四月气（小满）两个节气的月份为四月，无论此月是否包含其他任一节气。<br>&nbsp&nbsp&nbsp&nbsp2、“有气无节”的月份，以该中气确定月份，如：只包含五月气（夏至）而不包含其他任何节气的月份为五月。<br>&nbsp&nbsp&nbsp&nbsp（二）关联基准月<br>&nbsp&nbsp&nbsp&nbsp不是独立基准月的月份，如果其后连续5个月以上，每月包含的中气数均为1个， 则该月为关联基准月， 以所包含的中气确定月份，如果该月不包含中气，则为<b>闰月</b>。该月包含正月气就为正月，包含二月气则为二月，包含三月气则为三月，等等。闰月均位于一个独立基准月之后，此独立基准月为几月，则闰月为闰几月。<br>&nbsp&nbsp&nbsp&nbsp二、<b>非基准月</b><br>&nbsp&nbsp&nbsp&nbsp不符合基准月条件的月份为非基准月，依照前后的基准月按次序确定月份。一段连续非基准月由1—5个历月组成，其前、后相邻两月均为独立基准月。非基准月数量极少，在长达一万年的所有月份中，经统计仅占约0.3%。<br>&nbsp&nbsp&nbsp&nbsp三、<b>说明</b><br>&nbsp&nbsp&nbsp&nbsp“节气定月法”将没有包含中气的基准月置为闰月，含有中气的基准月和非基准月、以及没有中气的非基准月均为非闰月。<br>&nbsp&nbsp&nbsp&nbsp“节气定月法”使用定朔定气，并兼容使用平气法的定月规则及无中气月置闰法。因为在平气法中，每月仅包含一个中气，大致间隔30余月时有一个月无中气，中气在各月份中的分布情况是均匀的。即所有月份均属于新法的独立基准月与关联基准月，所有无中气的月份均为闰月，不存在定气法中的非基准月。所以在平气法中，新法即相当于“中气定月、无气置闰”，与平气法定月和置闰规则完全相同。<br>&nbsp&nbsp&nbsp&nbsp“节气定月法”将年首起月法的排月基准月份从年首月一个月（占月份数的8.1%）扩展到绝大多数月份（占月份数的99.7%），使月份与节气更加一致。从根本上解决了现行农历使用年首起月法造成的诸如1700年、1852年只含惊蛰和春分的月份定为正月，1833年、1985年以及2053、2167、2205等年份只含立春和雨水的月份定为上一年十二月等此类月份与节气不对应的问题。<br><br>';
        if (Cp149.checked)s = s2 + s;
        Cal14.innerHTML = s + '<br>';
    };

    return global;
})(Lunisolar || {});