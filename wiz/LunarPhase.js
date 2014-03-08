var Lunisolar = (function(global){
    "use strict";
    var lunar = global.LunarPhase = global.LunarPhase || function () {};

    lunar.corrections = global.Util.unzip('EqoFscDcrFpmEsF1DfFideFelFpFfFfFiaipqti3ksttikptikqckstekqttgkqttgkqteksttikptikq1fjstgjqttjkqttgkqtekstfkptikq1tijstgjiFkirFsAeACoFsiDaDiADc3AFbBfgdfikijFifegF3FhaikgFag3E1btaieeibggiffdeigFfqDfaiBkF3kEaikhkigeidhhdiegcFfakF3ggkidbiaedksaFffckekidhhdhdikcikiakicjF3deedFhFccgicdekgiFbiaikcfi3kbFibefgEgFdcFkFeFkdcfkF3kfkcickEiFkDacFiEfbiaejcFfffkhkdgkaiei3ehigikhdFikfckF3dhhdikcfgjikhfjicjicgiehdikcikggcifgiejF3jkieFhegikggcikFegiegkfjebhigikggcikdgkaFkijcfkcikfkcifikiggkaeeigefkcdfcfkhkdgkegieidhijcFfakhfgeidieidiegikhfkfckfcjbdehdikggikgkfkicjicjF3dbidikFiggcifgiejkiegkigcdiegfggcikdbgfgefjF3kfegikggcikdgFkeeijcfkcikfkekcikdgkabhkFikaffcfkhkdgkegbiaekfkiakicjhfgqdq1fkiakgkfkhfkfcjiekgFebicggbedF3jikejbbbiakgbgkacgiejkijjgigfiakggfggcibFifjefjF3kfekdgjcibFeFkijcfkfhkfkeaieigekgbhkfikidfcjeaibgekgdkiffiffkiakF3jhbakgdki3dj3ikfkicjicjieeFkgdkicggkighdF3jfgkgfgbdkicggfggkidFkiekgijkeigfiskiggfaidheigF3jekijcikickiggkidhhdbgcfkFikikhkigeidieFikggikhkffaffijhidhhakgdkhkijF3kiakF3kfheakgdkifiggkigicjiejkieedikgdfcggkigieeiejfgkgkigbgikicggkiaideeijkefjeijikhkiggkiaidheigcikaikffikijgkiahi3hhdikgjfifaakekighie3hiaikggikhkffakicjhiahaikggikhkijF3kfejfeFhidikggiffiggkigicjiekgieeigikggiffiggkidheigkgfjkeigiegikifiggkidhedeijcfkFikikhkiggkidhh3ehigcikaffkhkiggkidhh3hhigikekfiFkFikcidhh3hitcikggikhkfkicjicghiediaikggikhkijbjfejfeFhaikggifikiggkigiejkikgkgieeigikggiffiggkigieeigekijcijikggifikiggkideedeijkefkfckikhkiggkidhh3ehijcikaffkhkiggkidhh3hhigikhkikFikfckcidhh3hiaikgjikhfjicjicgiehdikcikggifikigiejfejkieFhegikggifikiggfghigkfjeijkhigikggifikiggkigieeijcijcikfksikifikiggkidehdeijcfdckikhkiggkhghh3ehijikifffffkhsFngErD3pAfBoDd3BlEtFqA1AqoEpDqElAEsEeB1BmADlDkqBtC3FnEpDqnEmFsFsAFnllBbFmDsDiCtDmAB1BmtCgpEplCpAEiBiEoFqFtEqsDcCnFtADnFlEgdkEgmEtEsCtDmADqFtAFrAtEcCqAE3BoFqC3F3DrFtBmFtAC1ACnFaoCgADcADcCcFfoFtDlAFgmFqBq1bpEoAEmkqnEeCtAE3bAEqgDfFfCrgEcBrACfAAABqAAB3AAClEnFeCtCgAADqDoBmtAAACbFiAAADsEtBqAB1FsDqpFqEmFsCeDtFlCeDtoEpClEqAAFrAFoCgFmFsFqEnAEcCqFeCtFtEnAEeFtAAEkFnErAABbFkADnAAeCtFeAfBoAEpFtAABtFqAApDcCGJ');
    lunar.coefficients = [//朔直线拟合参数
        1457698.231017, 29.53067166, // -721-12-17 h=0.00032 古历·春秋
        1546082.512234, 29.53085106, // -479-12-11 h=0.00053 古历·战国
        1640640.735300, 29.53060000, // -221-10-31 h=0.01010 古历·秦汉
        1642472.151543, 29.53085439, // -216-11-04 h=0.00040 古历·秦汉
        1683430.509300, 29.53086148, // -104-12-25 h=0.00313 汉书·律历志(太初历)平气平朔
        1752148.041079, 29.53085097, //   85-02-13 h=0.00049 后汉书·律历志(四分历)
        1807665.420323, 29.53059851, //  237-02-12 h=0.00033 晋书·律历志(景初历)
        1883618.114100, 29.53060000, //  445-01-24 h=0.00030 宋书·律历志(何承天元嘉历)
        1907360.704700, 29.53060000, //  510-01-26 h=0.00030 宋书·律历志(祖冲之大明历)
        1936596.224900, 29.53060000, //  590-02-10 h=0.01010 随书·律历志(开皇历)
        1939135.675300, 29.53060000, //  597-01-24 h=0.00890 随书·律历志(大业历)
        1947168.00//  619-01-21
    ];
    lunar.monthCn = ['十一', '十二', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    lunar.phaseCache = {};

    lunar.prototype = {
        getNewMoon: function(jd) {
            jd += 2451545;
            var i, D = 0, n;
            var B = lunar.coefficients, pc = 14;
            var f1 = B[0] - pc, f2 = B[B.length - 1] - pc, f3 = 2436935;

            if (jd < f1 || jd >= f3) { //平朔表中首个之前，使用现代天文算法。1960.1.1以后，使用现代天文算法 (这一部分调用了qi_high和so_high,所以需星历表支持)
                D = Math.floor(global.Ephem.moon.phases_high(Math.floor((jd + pc - 2451551) / 29.5306) * Math.PI * 2) + 0.5); //2451551是2000.1.7的那个朔日,黄经差为0.定朔计算
            }

            if (jd >= f1 && jd < f2) { //平朔
                for (i = 0; i < B.length; i += 2) {
                    if (jd + pc < B[i + 2]) break
                }
                ;
                D = B[i] + B[i + 1] * Math.floor((jd + pc - B[i]) / B[i + 1]);
                D = Math.floor(D + 0.5);
                if (D == 1683460) D++; //如果使用太初历计算-103年1月24日的朔日,结果得到的是23日,这里修正为24日(实历)。修正后仍不影响-103的无中置闰。如果使用秦汉历，得到的是24日，本行D不会被执行。
                D = D - 2451545;
            }

            if (jd >= f2 && jd < f3) { //定朔
                D = Math.floor(global.Ephem.moon.phases_low(Math.floor((jd + pc - 2451551) / 29.5306) * Math.PI * 2) + 0.5); //2451551是2000.1.7的那个朔日,黄经差为0.定朔计算
                n = lunar.corrections.substr(Math.floor((jd - f2) / 29.5306), 1); //找定朔修正值
                D = D + (n ? n - 2 : n);
            }

            return D;
        },

        getNewMoons: function(terms){
            var jd = terms[0].JD, firstDay = this.getNewMoon(jd), ar = [];
            if (firstDay > jd) {
                firstDay -= 29.53;
            }
            if (lunar.phaseCache[firstDay]) {
                ar = lunar.phaseCache[firstDay];
            } else {
                for (var i = 0; i < 15; i++) {
                    ar.push({
                        JD: this.getNewMoon(firstDay + 29.5306 * i),
                        index: i
                    });
                    if (i) {
                        ar[i - 1].days = ar[i].JD - ar[i - 1].JD;
                    }
                }
                if (ar[13].JD <= terms[24].JD) {
                    for (i = 1; ar[i + 1].JD > terms[2 * i].JD && i < 13; i++) {
                    }
                    ar[i].isLeap = true;
                    for (; i < 14; i++) {
                        ar[i].index--;
                    }
                }
                for (i = 0; i < 14; i++) {
                    ar[i].name = (ar[i].isLeap ? '闰' : '') + lunar.monthCn[ar[i].index % 12];
                    ar[i].nextName = (ar[i+1].isLeap ? '闰' : '') + lunar.monthCn[ar[i+1].index % 12];
                    if (ar[i].index == 2) {
                        ar.zyIndex = i;
                    }
                }
                lunar.phaseCache[firstDay] = ar;
            }
            return ar;
        }
    };

    return global;
})(Lunisolar || {});
