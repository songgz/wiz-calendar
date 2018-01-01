function year2Ayear(c){ //传入普通纪年或天文纪年，传回天文纪年
 var y = String(c).replace(/[^0-9Bb\*-]/g,'');
 var q = y.substr(0,1);
 if( q=='B' || q=='b' || q=='*' ){ //通用纪年法(公元前)
   y = 1-y.substr(1,y.length);
   if(y>0) { alert('通用纪法的公元前纪法从B.C.1年开始。并且没有公元0年'); return -10000; }
 }
 else y -= 0;
 if( y < -4712 )   alert('超过B.C. 4713不准'); 
 if( y > 9999  )   alert('超过9999年的农历计算很不准。');
 return y;
}

function showHelp(f){
 var s;
 if(f==0){ help.innerHTML='', help.style.display='none'; return; }
 if(f==1) s='exphelp1';
 if(f==2)
  s='　1、“北/南”钩上，表示表中方位0度为正北，适用于南半球，此时表中左西右东。<br>'
 　+'　2、日食放大图中，红圆为太阳，黄圆为月亮，它们纵向距离是赤纬差，横向则是赤经差,左东右西。(均不含大气折射修正)。<br>'
   +'　3、月食放大图中，深黑圆是地球本影在距离地心R处的截面，R是该时刻地月质心距。淡黑圆是地球半影，定义方式与本影的相似。月食发生时，还会出现一个小灰圆，表示月亮，其大小决定于月亮的地心视半径。图中影子中心与月亮中心的纵向差为它们的赤纬差，横向差为赤经差，左东右西，月东行。不考虑地标对月食的影响。<br>'
   +'　4、“UTC/TD”钩上，表示当前输入的是当地时间，不打钩，表示力学时。<br>'
   +'　5、日食发生时，表中可能会出现一个小三角形，它的顶角表示月影轴与地球的交点，在该位置上此刻发生中心食。软件没用帮助用户计算该处发生全食还是环食，用户可以把该处的地标输入，重新计算即可精确判断。<br>'
   +'　6、“NASA”钩上,使用保守日月边缘,结果与NASA网站提供的数据相同<br>'
   +'　7、本图表中，东经为正，西经为负。';
 if(f==3){
  s='';
 }
 if(f==4){
  s='　1、<b>黄经一、黄纬一：</b>日心当日黄道平分点坐标，含有岁差，不含章动和光行时改正；坐标中心建立在日心，x轴指向当日平春风点，z轴垂直当日黄道面，y轴方向矢等于z叉乘x。<br>'
   +'　2、<b>视赤经、视赤纬：</b>地心当日赤道真分点坐标，含有岁差，含有章动和光行时改正；坐标中心平移到地心(周年运动视差改正,地球公转相关)，x轴指向当日真春风点，z轴垂直当日赤道面，y轴方向矢等于z叉乘x。视黄经、视黄纬也是视坐标，不过坐标轴基面是黄道面而不是赤道面。<br>'
   +'　3、<b>站赤经、站赤纬：</b>站心当日赤道真分点坐标，含有岁差，含有章动和光行时改正；坐标中心平移到观测站(周日运动视差改正,地球自转相关)，x轴指向当日真春风点，z轴垂直当日赤道面，y轴方向矢等于z叉乘x。<br>'
   +'　4、<b>距离：</b>现以伽利略时空观解释它。以太阳系质心(SSB)作为坐标原点，并以遥远的星系作为坐标轴的方向创建的坐标系是一个比较理想的惯性坐标系，当我们把坐标中心平移到地心，并假想某瞬间与SSB保持相对静止或匀速动动，这样的坐标系仍然是惯性系。此类坐标系中，牛顿定律可以直接使用。坐标系中，两物体的“静止距离”就是牛顿定律应用所需的距离。当然，天体在运动，你找不到静止的时刻，所以人们很早就引入了“某一刻、某一瞬间距离”的概念，可理解为“瞬间相对惯性系静止距离”。用光直线构成的视差三角可以直接测量距离，然而光无法瞬时传播，所以得不到所要的瞬间距离，需要进行修正。软件中，<b>日心距、地心距</b>是“瞬间静止距离”，“光行距”指在惯性坐标中（如SSB坐标）“看到”光线离开天体，并在t时刻与地心观测者相遇，此间光行的距离为光行距。设光行时间为T，光速为c，光行距为D，显然，t-T时刻天体的出的光，在t时刻接收，所以软中用t-T时刻天体位置与t时刻观测位置的差值代表光行距D。计算前，T是个估值，不必很精确，得到T后就可算出D。如果认为D不够精确，可用D/c重算T，进而再次算出D，但这已经应用了光速不变原理，更严格精确的计算应采用相对论原理，但已经达到本软件星历的极限精度，没有必要考虑相对论变换。<b>视距离</b>指t-T时刻的地心距，它同样隐藏着相对性原理。<br>'
   +'　5、<b>方位角</b>从正南开始向西测量，即地平经圈起点在正南，正南为0度，正西为90度，正北180度，正东270度；<b>高度角</b>指天体在地平坐标中的纬度，在真高度角大于零时，对高度角进行了大气折射修正。<br>'
   +'　6、星历基于VSOP87(fit to DE200)，进行了截断处理，并适当与DE405拟合修正。<br>'
   +'　7、J2000+-500年精度(d = 10^-6AU ; J2000+-4千年范围内精度低数倍)：<br>'
   +'　　<b>星体  黄经　　 黄纬　距离，　星体  黄经　　 黄纬　距离</b><br>'
   +'　　地球 0.1角秒 0.1角秒 0.1d，　水星 0.2角秒 0.2角秒 0.2d<br>'
   +'　　金星 0.2角秒 0.2角秒 0.2d，　火星 0.5角秒 0.5角秒 1.0d<br>'
   +'　　木星 0.5角秒 0.5角秒 3.0d，　土星 0.5角秒 0.5角秒 5.0d<br>'
   +'　　天王 1.0角秒 1.0角秒 20 d，　海王 1.0角秒 1.0角秒 40d<br>'
   +'　<b>精度比对(2008-Jan-01 00:00 TT 火星)</b><br>'
   +'　JPL　　视赤经 05h 59m 27.4967s 视赤纬+26°56\'27.538 光行距 0.607248116601418 AU<br>'
   +'　本软件 视赤经 05h 59m 27.50s 　视赤纬 26°56\'27.55　光行距 0.60724808 AU<br>'
   +'　　　　　误差　　　　　 0s　　　　　　　　　　　0.012　　　　0.00000003 AU<br>';

 }
 if(f==5){
   s='　升降交点：当日平分点黄纬为零，并显示平分点黄经<br>'
    +'　行星合日指视黄经相合(2008中国天文年历521页),应注意中科院云南天文台给出的是视赤经合日http://www.ynao.ac.cn/sp/forecast';
 }
 if(f==6){
   s='　1、输入表中RA为J2000平赤径,DEC为J2000平赤纬,自行1为赤经年自行(时秒/年),自行2为赤纬年自行(角秒/年)。<br>'
    +'　2、输入表中带*号的行参与计算,不带*号的行不计算。<br>'
    +'　3、周年视差单位是角秒。<br>'
    +'　4、忽略短周期章动指不计算周期小于35天的章动项，以便与中国天文年历比对。<br>'
    +'  5、星座资料包括：汉语、缩写、面积(平方度)、中心赤经 (时分)、中心赤纬(度分)、象限角、族、星座英文名';
 }
 help.style.display='block';
 help.innerHTML = '<a href="javascript:showHelp(0)">关闭</a><br>'+s;
}

    //html月历生成,结果返回在lun中,curJD为当前日期(用于设置今日标识)
  var yueLiHTML=function(By,Bm,curJD){
    var month = new Lunisolar.SolarMonth(By,Bm); 
    var pg='<table border=0 cellpadding=3 cellspacing=1 width="100%">';     
    pg += '<tr><td colspan=7>';
    pg += '<span>'+month.getYearHao() +' 农历'+month.getYearGanZhi()+'年【'+month.getYearShuXing()+'年】'+'</span>';
    pg += '</td></tr>'; //显示年号
    //月历处理
    pg += '<tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>';
    var w0 = month.getWeek(0);
    var days = month.days;
    var ws = Math.ceil((days + w0) / 7);
    var d = 0;
    for(var i = 0; i < ws; i++){
      pg += '<tr>';
      for(var j=0; j < 7; j++){        
          d = ((i * 7) + j) - w0;
          if(d >= 0 && d < days){
            pg += '<td>' + (d + 1) + month.getLunarDayName(d) + '</td>';
          }else{
            pg += '<td></td>';
          }    
      }
      pg += '</tr>';
    }
    pg += '</table>';
    return pg;
};


//返回公历某一个月的'公农回'三合历
var yueLiCalc=function(By,Bm){
  var i,j,k,c,Bd0,Bdn;
  //日历物件初始化
  JD.h=12, JD.m=0, JD.s=0.1;
  JD.Y=By; JD.M=Bm; JD.D=1;          Bd0 = int2(JD.toJD()) - J2000;  //公历月首,中午
  JD.M++; if(JD.M>12) JD.Y++,JD.M=1; Bdn = int2(JD.toJD()) - J2000 - Bd0; //本月天数(公历)

  this.w0= (Bd0 + J2000 +1+7000000)%7; //本月第一天的星期
  this.y = By; //公历年份
  this.m = Bm; //公历月分
  this.d0 =Bd0;
  this.dn= Bdn;

  //所属公历年对应的农历干支纪年
  c = By -1984 + 12000;
  this.Ly  = obb.Gan[c%10]+obb.Zhi[c%12];  //干支纪年
  this.ShX = obb.ShX[c%12]; //该年对应的生肖
  this.nianhao = obb.getNH(By);

  var D,w,ob,ob2;

  //提取各日信息

  for(i=0,j=0;i<Bdn;i++){
    ob = this.lun[i];
    ob.d0 = Bd0+i; //儒略日,北京时12:00
    ob.di = i;     //公历月内日序数
    ob.y  = By;    //公历年
    ob.m  = Bm;    //公历月
    ob.dn = Bdn;   //公历月天数
    ob.week0 = this.w0; //月首的星期
    ob.week  = (this.w0+i)%7; //当前日的星期
    ob.weeki = int2((this.w0+i)/7); //本日所在的周序号
    ob.weekN = int2((this.w0+Bdn-1)/7) + 1;  //本月的总周数
    JD.setFromJD(ob.d0+J2000); ob.d = JD.D; //公历日名称

    //农历月历
    if(!SSQ.ZQ.length || ob.d0<SSQ.ZQ[0] || ob.d0>=SSQ.ZQ[24]) //如果d0已在计算农历范围内则不再计算
      SSQ.calcY(ob.d0);
    var mk = int2( (ob.d0-SSQ.HS[0])/30 );  if(mk<13 && SSQ.HS[mk+1]<=ob.d0) mk++; //农历所在月的序数

    ob.Ldi = ob.d0 - SSQ.HS[mk];   //距农历月首的编移量,0对应初一
    ob.Ldc = obb.rmc[ob.Ldi];      //农历日名称
    ob.cur_dz = ob.d0-SSQ.ZQ[0];   //距冬至的天数
    ob.cur_xz = ob.d0-SSQ.ZQ[12];  //距夏至的天数
    ob.cur_lq = ob.d0-SSQ.ZQ[15];  //距立秋的天数
    ob.cur_mz = ob.d0-SSQ.ZQ[11];  //距芒种的天数
    ob.cur_xs = ob.d0-SSQ.ZQ[13];  //距小暑的天数
    if(ob.d0==SSQ.HS[mk]||ob.d0==Bd0){ //月的信息
      ob.Lmc  = SSQ.ym[mk]; //月名称
      ob.Ldn  = SSQ.dx[mk]; //月大小
      ob.Lleap= (SSQ.leap&&SSQ.leap==mk)?'闰':''; //闰状况
      ob.Lmc2 = mk<13?SSQ.ym[mk+1]:"未知"; //下个月名称,判断除夕时要用到
    }else{
      ob2=this.lun[i-1];
      ob.Lmc  = ob2.Lmc,   ob.Ldn  = ob2.Ldn;
      ob.Lleap= ob2.Lleap, ob.Lmc2 = ob2.Lmc2;
    }
    var qk=int2( (ob.d0-SSQ.ZQ[0]-7)/15.2184 ); if(qk<23 && ob.d0>=SSQ.ZQ[qk+1]) qk++; //节气的取值范围是0-23
    if(ob.d0==SSQ.ZQ[qk]) ob.Ljq=obb.jqmc[qk];
    else ob.Ljq='';

    ob.yxmc = ob.yxjd = ob.yxsj ='';//月相名称,月相时刻(儒略日),月相时间串
    ob.jqmc = ob.jqjd = ob.jqsj ='';//定气名称,节气时刻(儒略日),节气时间串

    //干支纪年处理
    //以立春为界定年首
    D = SSQ.ZQ[3] + (ob.d0<SSQ.ZQ[3]?-365:0) + 365.25*16-35; //以立春为界定纪年
    ob.Lyear =  Math.floor(D/365.2422+0.5); //农历纪年(10进制,1984年起算)
    //以下几行以正月初一定年首
    D = SSQ.HS[2]; //一般第3个月为春节
    for(j=0;j<14;j++){ //找春节
      if(SSQ.ym[j]!='正'||SSQ.leap==j&&j) continue;
      D = SSQ.HS[j];
      if(ob.d0<D) { D-=365; break; } //无需再找下一个正月
    }
    D = D + 5810;  //计算该年春节与1984年平均春节(立春附近)相差天数估计
    ob.Lyear0 =  Math.floor(D/365.2422+0.5); //农历纪年(10进制,1984年起算)

    D = ob.Lyear +12000;  ob.Lyear2 = obb.Gan[D%10]+obb.Zhi[D%12]; //干支纪年(立春)
    D = ob.Lyear0+12000;  ob.Lyear3 = obb.Gan[D%10]+obb.Zhi[D%12]; //干支纪年(正月)
    ob.Lyear4 = ob.Lyear0+1984+2698; //黄帝纪年


    //纪月处理,1998年12月7(大雪)开始连续进行节气计数,0为甲子
    mk = int2( (ob.d0 - SSQ.ZQ[0])/30.43685 );  if(mk<12 && ob.d0>=SSQ.ZQ[2*mk+1]) mk++;  //相对大雪的月数计算,mk的取值范围0-12

    D = mk + int2( (SSQ.ZQ[12]+390)/365.2422 )*12 + 900000; //相对于1998年12月7(大雪)的月数,900000为正数基数
    ob.Lmonth = D%12;
    ob.Lmonth2 = obb.Gan[D%10]+obb.Zhi[D%12];

    //纪日,2000年1月7日起算
    D = ob.d0 - 6 + 9000000;
    ob.Lday2 = obb.Gan[D%10]+obb.Zhi[D%12];

    //星座
    mk = int2( (ob.d0-SSQ.ZQ[0]-15)/30.43685 );  if( mk<11 && ob.d0>=SSQ.ZQ[2*mk+2] ) mk++; //星座所在月的序数,(如果j=13,ob.d0不会超过第14号中气)
    ob.XiZ = obb.XiZ[(mk+12)%12]+'座';
    //回历
    oba.getHuiLi(ob.d0,ob);
    //节日
    ob.A = ob.B = ob.C = ''; ob.Fjia = 0;
    oba.getDayName(ob,ob); //公历
    obb.getDayName(ob,ob); //农历
  }

  //以下是月相与节气的处理
  var d, xn, jd2= Bd0+dt_T(Bd0)-8/24;
  //月相查找
  w = XL.MS_aLon( jd2/36525,10,3 );
  w = int2( (w-0.78)/Math.PI*2 ) * Math.PI/2;
  do {
   d = obb.so_accurate(w);
   D = int2(d+0.5);
   xn = int2(w/pi2*4+4000000.01)%4;
   w += pi2/4;
   if(D>=Bd0+Bdn) break;
   if(D<Bd0) continue;
   ob = this.lun[D-Bd0];
   ob.yxmc = obb.yxmc[xn]; //取得月相名称
   ob.yxjd = d;
   ob.yxsj = JD.timeStr(d);
  } while(D+5<Bd0+Bdn);

  //节气查找
  w = XL.S_aLon( jd2/36525, 3 );
  w = int2( (w-0.13)/pi2*24 ) *pi2/24;
  do {
   d = obb.qi_accurate(w);
   D = int2(d+0.5);
   xn = int2(w/pi2*24+24000006.01)%24;
   w += pi2/24;
   if(D>=Bd0+Bdn) break;
   if(D<Bd0) continue;
   ob = this.lun[D-Bd0];
   ob.jqmc = obb.jqmc[xn]; //取得节气名称
   ob.jqjd = d;
   ob.jqsj = JD.timeStr(d);
  } while(D+12<Bd0+Bdn);
 };