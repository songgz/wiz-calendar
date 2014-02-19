var SSQ = (function(){
    //  619-01-21开始16598个朔日修正表 d0=1947168
    var suoS = ["EqoFscDcrFpmEsF2DfFideFelFpFfFfFiaipqti1ksttikptikqckstekqttgkqttgkqteksttikptikq2fjstgjqttjkqttgkqt",
    "ekstfkptikq2tijstgjiFkirFsAeACoFsiDaDiADc1AFbBfgdfikijFifegF1FhaikgFag1E2btaieeibggiffdeigFfqDfaiBkF",
    "1kEaikhkigeidhhdiegcFfakF1ggkidbiaedksaFffckekidhhdhdikcikiakicjF1deedFhFccgicdekgiFbiaikcfi1kbFibef",
    "gEgFdcFkFeFkdcfkF1kfkcickEiFkDacFiEfbiaejcFfffkhkdgkaiei1ehigikhdFikfckF1dhhdikcfgjikhfjicjicgiehdik",
    "cikggcifgiejF1jkieFhegikggcikFegiegkfjebhigikggcikdgkaFkijcfkcikfkcifikiggkaeeigefkcdfcfkhkdgkegieid",
    "hijcFfakhfgeidieidiegikhfkfckfcjbdehdikggikgkfkicjicjF1dbidikFiggcifgiejkiegkigcdiegfggcikdbgfgefjF1",
    "kfegikggcikdgFkeeijcfkcikfkekcikdgkabhkFikaffcfkhkdgkegbiaekfkiakicjhfgqdq2fkiakgkfkhfkfcjiekgFebicg",
    "gbedF1jikejbbbiakgbgkacgiejkijjgigfiakggfggcibFifjefjF1kfekdgjcibFeFkijcfkfhkfkeaieigekgbhkfikidfcje",
    "aibgekgdkiffiffkiakF1jhbakgdki1dj1ikfkicjicjieeFkgdkicggkighdF1jfgkgfgbdkicggfggkidFkiekgijkeigfiski",
    "ggfaidheigF1jekijcikickiggkidhhdbgcfkFikikhkigeidieFikggikhkffaffijhidhhakgdkhkijF1kiakF1kfheakgdkif",
    "iggkigicjiejkieedikgdfcggkigieeiejfgkgkigbgikicggkiaideeijkefjeijikhkiggkiaidheigcikaikffikijgkiahi1",
    "hhdikgjfifaakekighie1hiaikggikhkffakicjhiahaikggikhkijF1kfejfeFhidikggiffiggkigicjiekgieeigikggiffig",
    "gkidheigkgfjkeigiegikifiggkidhedeijcfkFikikhkiggkidhh1ehigcikaffkhkiggkidhh1hhigikekfiFkFikcidhh1hit",
    "cikggikhkfkicjicghiediaikggikhkijbjfejfeFhaikggifikiggkigiejkikgkgieeigikggiffiggkigieeigekijcijikgg",
    "ifikiggkideedeijkefkfckikhkiggkidhh1ehijcikaffkhkiggkidhh1hhigikhkikFikfckcidhh1hiaikgjikhfjicjicgie",
    "hdikcikggifikigiejfejkieFhegikggifikiggfghigkfjeijkhigikggifikiggkigieeijcijcikfksikifikiggkidehdeij",
    "cfdckikhkiggkhghh1ehijikifffffkhsFngErD1pAfBoDd1BlEtFqA2AqoEpDqElAEsEeB2BmADlDkqBtC1FnEpDqnEmFsFsAFn",
    "llBbFmDsDiCtDmAB2BmtCgpEplCpAEiBiEoFqFtEqsDcCnFtADnFlEgdkEgmEtEsCtDmADqFtAFrAtEcCqAE1BoFqC1F1DrFtBmF",
    "tAC2ACnFaoCgADcADcCcFfoFtDlAFgmFqBq2bpEoAEmkqnEeCtAE1bAEqgDfFfCrgEcBrACfAAABqAAB1AAClEnFeCtCgAADqDoB",
    "mtAAACbFiAAADsEtBqAB2FsDqpFqEmFsCeDtFlCeDtoEpClEqAAFrAFoCgFmFsFqEnAEcCqFeCtFtEnAEeFtAAEkFnErAABbFkAD",
    "nAAeCtFeAfBoAEpFtAABtFqAApDcCGJ"].join('');

    //1645-09-23开始7567个节气修正表
    var qiS = ["FrcFs22AFsckF2tsDtFqEtF1posFdFgiFseFtmelpsEfhkF2anmelpFlF1ikrotcnEqEq2FfqmcDsrFor22FgFrcgDscFs22FgEe",
    "FtE2sfFs22sCoEsaF2tsD1FpeE2eFsssEciFsFnmelpFcFhkF2tcnEqEpFgkrotcnEqrEtFermcDsrE222FgBmcmr22DaEfnaF22",
    "2sD1FpeForeF2tssEfiFpEoeFssD1iFstEqFppDgFstcnEqEpFg11FscnEqrAoAF2ClAEsDmDtCtBaDlAFbAEpAAAAAD2FgBiBqo",
    "BbnBaBoAAAAAAAEgDqAdBqAFrBaBoACdAAf1AACgAAAeBbCamDgEifAE2AABa1C1BgFdiAAACoCeE1ADiEifDaAEqAAFe1AcFbcA",
    "AAAAF1iFaAAACpACmFmAAAAAAAACrDaAAADG0"].join('');

    function jieya(s){ //气朔解压缩
        var o="0000000000",o2=o+o;
        s=s.replace(/J/g,'00');
        s=s.replace(/I/g,'000');
        s=s.replace(/H/g,'0000');
        s=s.replace(/G/g,'00000');
        s=s.replace(/t/g,'02');
        s=s.replace(/s/g,'002');
        s=s.replace(/r/g,'0002');
        s=s.replace(/q/g,'00002');
        s=s.replace(/p/g,'000002');
        s=s.replace(/o/g,'0000002');
        s=s.replace(/n/g,'00000002');
        s=s.replace(/m/g,'000000002');
        s=s.replace(/l/g,'0000000002');
        s=s.replace(/k/g,'01');
        s=s.replace(/j/g,'0101');
        s=s.replace(/i/g,'001');
        s=s.replace(/h/g,'001001');
        s=s.replace(/g/g,'0001');
        s=s.replace(/f/g,'00001');
        s=s.replace(/e/g,'000001');
        s=s.replace(/d/g,'0000001');
        s=s.replace(/c/g,'00000001');
        s=s.replace(/b/g,'000000001');
        s=s.replace(/a/g,'0000000001');
        s=s.replace(/A/g,o2+o2+o2);
        s=s.replace(/B/g,o2+o2+o);
        s=s.replace(/C/g,o2+o2);
        s=s.replace(/D/g,o2+o);
        s=s.replace(/E/g,o2);
        s=s.replace(/F/g,o);
        return s;
    };

    var SB = jieya(suoS);  //定朔修正表解压
    var QB = jieya(qiS);   //定气修正表解压

    var suoKB = [//朔直线拟合参数
        1457698.231017,29.53067166, // -721-12-17 h=0.00032 古历·春秋
        1546082.512234,29.53085106, // -479-12-11 h=0.00053 古历·战国
        1640640.735300,29.53060000, // -221-10-31 h=0.01010 古历·秦汉
        1642472.151543,29.53085439, // -216-11-04 h=0.00040 古历·秦汉
        1683430.509300,29.53086148, // -104-12-25 h=0.00313 汉书·律历志(太初历)平气平朔
        1752148.041079,29.53085097, //   85-02-13 h=0.00049 后汉书·律历志(四分历)
        1807665.420323,29.53059851, //  237-02-12 h=0.00033 晋书·律历志(景初历)
        1883618.114100,29.53060000, //  445-01-24 h=0.00030 宋书·律历志(何承天元嘉历)
        1907360.704700,29.53060000, //  510-01-26 h=0.00030 宋书·律历志(祖冲之大明历)
        1936596.224900,29.53060000, //  590-02-10 h=0.01010 随书·律历志(开皇历)
        1939135.675300,29.53060000, //  597-01-24 h=0.00890 随书·律历志(大业历)
        1947168.00//  619-01-21
    ];

    var qiKB = [//气直线拟合参数
        1640650.479938,15.21842500, // -221-11-09 h=0.01709 古历·秦汉
        1642476.703182,15.21874996, // -216-11-09 h=0.01557 古历·秦汉
        1683430.515601,15.218750011, // -104-12-25 h=0.01560 汉书·律历志(太初历)平气平朔 回归年=365.25000
        1752157.640664,15.218749978, //   85-02-23 h=0.01559 后汉书·律历志(四分历) 回归年=365.25000
        1807675.003759,15.218620279, //  237-02-22 h=0.00010 晋书·律历志(景初历) 回归年=365.24689
        1883627.765182,15.218612292, //  445-02-03 h=0.00026 宋书·律历志(何承天元嘉历) 回归年=365.24670
        1907369.128100,15.218449176, //  510-02-03 h=0.00027 宋书·律历志(祖冲之大明历) 回归年=365.24278
        1936603.140413,15.218425000, //  590-02-17 h=0.00149 随书·律历志(开皇历) 回归年=365.24220
        1939145.524180,15.218466998, //  597-02-03 h=0.00121 随书·律历志(大业历) 回归年=365.24321
        1947180.798300,15.218524844, //  619-02-03 h=0.00052 新唐书·历志(戊寅元历)平气定朔 回归年=365.24460
        1964362.041824,15.218533526, //  666-02-17 h=0.00059 新唐书·历志(麟德历) 回归年=365.24480
        1987372.340971,15.218513908, //  729-02-16 h=0.00096 新唐书·历志(大衍历,至德历) 回归年=365.24433
        1999653.819126,15.218530782, //  762-10-03 h=0.00093 新唐书·历志(五纪历) 回归年=365.24474
        2007445.469786,15.218535181, //  784-02-01 h=0.00059 新唐书·历志(正元历,观象历) 回归年=365.24484
        2021324.917146,15.218526248, //  822-02-01 h=0.00022 新唐书·历志(宣明历) 回归年=365.24463
        2047257.232342,15.218519654, //  893-01-31 h=0.00015 新唐书·历志(崇玄历) 回归年=365.24447
        2070282.898213,15.218425000, //  956-02-16 h=0.00149 旧五代·历志(钦天历) 回归年=365.24220
        2073204.872850,15.218515221, //  964-02-16 h=0.00166 宋史·律历志(应天历) 回归年=365.24437
        2080144.500926,15.218530782, //  983-02-16 h=0.00093 宋史·律历志(乾元历) 回归年=365.24474
        2086703.688963,15.218523776, // 1001-01-31 h=0.00067 宋史·律历志(仪天历,崇天历) 回归年=365.24457
        2110033.182763,15.218425000, // 1064-12-15 h=0.00669 宋史·律历志(明天历) 回归年=365.24220
        2111190.300888,15.218425000, // 1068-02-15 h=0.00149 宋史·律历志(崇天历) 回归年=365.24220
        2113731.271005,15.218515671, // 1075-01-30 h=0.00038 李锐补修(奉元历) 回归年=365.24438
        2120670.840263,15.218425000, // 1094-01-30 h=0.00149 宋史·律历志 回归年=365.24220
        2123973.309063,15.218425000, // 1103-02-14 h=0.00669 李锐补修(占天历) 回归年=365.24220
        2125068.997336,15.218477932, // 1106-02-14 h=0.00056 宋史·律历志(纪元历) 回归年=365.24347
        2136026.312633,15.218472436, // 1136-02-14 h=0.00088 宋史·律历志(统元历,乾道历,淳熙历) 回归年=365.24334
        2156099.495538,15.218425000, // 1191-01-29 h=0.00149 宋史·律历志(会元历) 回归年=365.24220
        2159021.324663,15.218425000, // 1199-01-29 h=0.00149 宋史·律历志(统天历) 回归年=365.24220
        2162308.575254,15.218461742, // 1208-01-30 h=0.00146 宋史·律历志(开禧历) 回归年=365.24308
        2178485.706538,15.218425000, // 1252-05-15 h=0.04606 淳祐历 回归年=365.24220
        2178759.662849,15.218445786, // 1253-02-13 h=0.00231 会天历 回归年=365.24270
        2185334.020800,15.218425000, // 1271-02-13 h=0.00520 宋史·律历志(成天历) 回归年=365.24220
        2187525.481425,15.218425000, // 1277-02-12 h=0.00520 本天历 回归年=365.24220
        2188621.191481,15.218437494, // 1280-02-13 h=0.00015 元史·历志(郭守敬授时历) 回归年=365.24250
        2322147.76// 1645-09-21
    ];

    var qi_high = function(W){ //较高精度气
        var t = XL.S_aLon_t2(W)*36525;
        t = t - dt_T(t)+8/24;
        var v = ( (t+0.5) %1 ) * 86400;
        if(v<1200 || v >86400-1200) t = XL.S_aLon_t(W)*36525 - dt_T(t)+8/24;
        return  t;
    };

    var so_high = function(W){ //较高精度朔
        var t = XL.MS_aLon_t2(W)*36525;
        t = t - dt_T(t)+8/24;
        var v = ( (t+0.5) %1 ) * 86400;
        if(v<1800 || v >86400-1800) t = XL.MS_aLon_t(W)*36525 - dt_T(t)+8/24;
        return  t;
    };

    var so_low = function(W){ //低精度定朔计算,在2000年至600，误差在2小时以内(仍比古代日历精准很多)
        var v = 7771.37714500204;
        var t  = ( W + 1.08472 )/v, L;
        t -= ( -0.0000331*t*t
            + 0.10976 *Math.cos( 0.785 + 8328.6914*t)
            + 0.02224 *Math.cos( 0.187 + 7214.0629*t)
            - 0.03342 *Math.cos( 4.669 +  628.3076*t ) )/v
            + (32*(t+1.8)*(t+1.8)-20)/86400/36525;
        return t*36525 + 8/24;
    };

    var qi_low = function(W){ //最大误差小于30分钟，平均5分
        var t,L,v= 628.3319653318;
        t =  ( W - 4.895062166 )/v; //第一次估算,误差2天以内
        t -= ( 53*t*t + 334116*Math.cos( 4.67+628.307585*t) + 2061*Math.cos( 2.678+628.3076*t)*t )/v/10000000; //第二次估算,误差2小时以内

        L = 48950621.66 + 6283319653.318*t + 53*t*t //平黄经
            +334166 * Math.cos( 4.669257+  628.307585*t) //地球椭圆轨道级数展开
            +3489 * Math.cos( 4.6261  + 1256.61517*t ) //地球椭圆轨道级数展开
            +2060.6 * Math.cos( 2.67823 +  628.307585*t ) * t  //一次泊松项
            - 994 - 834*Math.sin(2.1824-33.75705*t); //光行差与章动修正

        t -= (L/10000000 -W )/628.332 + (32*(t+1.8)*(t+1.8)-20)/86400/36525;
        return t*36525 + 8/24;
    };

    return {
        calc: function(jd,qs){ //jd应靠近所要取得的气朔日,qs='气'时，算节气的儒略日
            jd += 2451545;
            var i,D,n;
            var B = suoKB, pc = 14;
            if(qs == '气') B = qiKB, pc=7;
            var f1=B[0]-pc, f2=B[B.length-1]-pc, f3=2436935;

            if( jd<f1 || jd>=f3 ){ //平气朔表中首个之前，使用现代天文算法。1960.1.1以后，使用现代天文算法 (这一部分调用了qi_high和so_high,所以需星历表支持)
                if(qs == '气')
                  return Math.floor( qi_high ( Math.floor((jd+pc-2451259)/365.2422*24) * Math.PI/12 ) +0.5 ); //2451259是1999.3.21,太阳视黄经为0,春分.定气计算
                else
                  return Math.floor( so_high ( Math.floor((jd+pc-2451551)/29.5306) * Math.PI*2 )      +0.5 ); //2451551是2000.1.7的那个朔日,黄经差为0.定朔计算
            }

            if( jd>=f1 && jd<f2 ) { //平气或平朔
                for(i=0; i<B.length; i+=2){
                    if(jd+pc<B[i+2]) break
                };
                D = B[i] + B[i+1] * Math.floor( (jd+pc-B[i])/B[i+1] );
                D = Math.floor(D+0.5);
                if(D == 1683460) D++; //如果使用太初历计算-103年1月24日的朔日,结果得到的是23日,这里修正为24日(实历)。修正后仍不影响-103的无中置闰。如果使用秦汉历，得到的是24日，本行D不会被执行。
                return D-2451545;
            }

            if( jd>=f2 && jd<f3){ //定气或定朔
                if(qs=='气'){
                    D = Math.floor( qi_low( Math.floor((jd+pc-2451259)/365.2422*24) * Math.PI/12 ) +0.5 ); //2451259是1999.3.21,太阳视黄经为0,春分.定气计算
                    n = this.QB.substr( Math.floor((jd-f2)/365.2422*24),1 ); //找定气修正值
                }else{
                    D = Math.floor( so_low( Math.floor((jd+pc-2451551)/29.5306) * Math.PI*2 )     +0.5 ); //2451551是2000.1.7的那个朔日,黄经差为0.定朔计算
                    n = this.SB.substr( Math.floor((jd-f2)/29.5306),1 ); //找定朔修正值
                }
                if(n=="1") return D+1;
                if(n=="2") return D-1;
                return D;
            }
        }

    };

})();