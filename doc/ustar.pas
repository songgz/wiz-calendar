    //*******************************//
    //《天球参考系变换及其应用》     //
    // 本单元处理:                   //
    //     日月火星的坐标速度        //
    //     天文坐标变换              //
    //     节气月相计算              //
    //     日月食计算                //
    //*******************************//
unit UAstr;
interface
uses
  SysUtils,Classes,Dialogs,Math,UBaseOper,DB, DBTables;
type
  THeadF = Record
    title:string[60];
      //起始儒略日，终止儒略日，一个数据记录所覆盖时间段的长度
    ss:array[1..3]of real;
    AU,EMRat:real;                     //天文单位，地月质量比
    Pt:array[1..3,1..3]of integer;     //索引数组,不用
    reserve:array[1..815]of byte;     //保留数组
  end;
  TEms=class(Tobject)
    FileName:string;            // 历表文件名
    FStream:TFileStream;        // 文件流变量
    HeadF:THeadF;               // 头记录变量
    RecSz,BSize,Nrb:integer;    // 数据记录字节数，系数数组元素数, 记录指针
    t,tv:real;                  // 时间，记录相对时间
    // 2007.12.15 修改，用于 MSM 文件读取
    Buf:array[1..119]of real;
    // 天体坐标速度数据，第一下标对应于天体,第二下标1-3对应于坐标，4-6对应于速度
    Pv:array[1..3,1..6]of real;
    Pc,Vc:array[0..12]of real;    // 切比雪夫多项式及其导数多项式的值
    velo:boolean;                 // 处理速度标志，缺省为True
    Constructor Ini;              // 构造函数
    Destructor Free;           // 析构函数
    Procedure InterP(Nb:integer); // 计算序数为Nb的天体的数据
    Procedure State(const Nb:integer=0);  // 计算月亮、太阳和火星的地心坐标速度
  end;
  TYmd=class(TObject)
    year,month,day:integer;
    fday,jd,DeltaT:extended;
    procedure DateToJd;
    procedure JdToDate;
    procedure StrToDate(s:string;var w:integer);overload;
    function DateToStr:string;
  end;

  TEclipse=class(TObject)
    // lunar true 处理月食，false 处理日食，
    // geoc 选择坐标原点：true，地心，false ，测站，Shadowcenter 调用
    lunar,geoc:boolean;
    // VEStation 测站的地球参考系坐标，VCStation 测站的天球参考系坐标
    VEStation,VCStation:TVector;
    // BPN 由天球坐标至中介坐标的变换矩阵，QR 由天球坐标至地球坐标的变换矩阵
    BPN,QR:TMatrix;
    // 食的类型，朔望月序数，沙罗序列数，在沙罗序列中的序数
    ec,LunaN,SarN{,SNum}:integer;
    //初亏，复圆时刻，太阳方位角，地平高度
    TP:array[1..2,0..2]of extended;
    //全食始，食既，生光，全食终的时刻，太阳方位角，地平高度
    TU:array[1..4,0..2]of extended;
    // 食甚时刻，赤经相合时刻，影心距，gamma，食分, (全)食长，地面点经度，纬度
    tmin,nt,rmin,gamma,g,duration,long,lat:extended;
    // 太阳地平坐标
    Azm,Alt:extended;
    // 测站大地坐标
    glong,glat,ghight:extended;
//    constructor Ini;
//    procedure GCMatrix(const tm:extended);
//    procedure LocalSEclipse;
    function CalcuEclipse(const tm:extended):integer;
  private
    // vrp 成影天体P的日心视向径，
    // vrq 受影天体Q的日心视向径，
    // vqo 贝塞尔平面上测站至影心的向径，
    // uqo 测站至影心的单位向量，
    // norm 贝塞尔平面法向量，指向太阳.
    vrp,vrq,vqo,uqo,norm:TVector;
    // rp vrp 向量的长度
    // rqn 向量vrq在vrp方向的投影
    // u1 半影半径，
    // u2 本影半径，
    r,rp,rqn,u1,u2:extended;
    //  ex 天体圆面与影锥的关系：true 外切，false 内切，
    //  um 选择影锥：true 本影，false 半影，
    // total 中心食的类型：true 全食，false 环食
    ex,um,total:boolean;
    // RadiusP 成影天体P的半径, RadiusQ 受影天体Q的半径
    RadiusP,RadiusQ:extended;

    function PenumbraRadius(const t:extended):extended;
    function UmbraRadius(const t:extended):extended;
    function ShadowCenterDis(const t:extended):extended;
    function StationLimbDis(const t:extended):extended;
    function TangentDis(const t:extended):extended;
    function EarthRadius(rs:TVector;var longt,latt:extended):extended;
    function DiffSMRa(const t:extended):extended;
    function PositionAng:extended;
    procedure SunHrzCoord(const r:TVector);
    function SNS(LN:integer;var XN:integer):integer;
  end;

const

  AsToR = 4.848136811095359936E-6;  // 角秒化弧度因子
  J0 = 2451545.0;                   // J 2000.0历元
  JC = 36525.0;                     // 儒略世纪日数
  Eps0 = 84381.448*AsToR;           // 历元黄赤交角
  secondperday=86400;               // 每日秒数

  MAsToR = AsToR/1000.0;            // 毫角秒化弧度因子
  TurnAs = 1296000.0;               // 圆周角秒数
  NutNum = 77;                      // 章动项数
  EENum  = 33;                      // 二分差附加项级数项数
                                    // 天文单位，km
  AU=149597870.691;
  CLight=299792.458*86400/AU;       // 光速，天文单位/日

  RSun=696000.0/AU;       // 单位为AU
  REarth=6378.14/AU;      // 取自 The Astronomical Almanac, 2007
  RMoon=1737.4/AU;
  flat=0.0033528197;      // 1/298.25642，地球椭球体扁率
  e2=2*flat-flat*flat;

  CommonPath='D:\CRSTrans\common\';
  
  // 说明天文坐标系变换类
type
  TCoorTrans=class(TObject)
    FileName:string;            // 章动系数文件名
    FStream:TFileStream;        // 文件流变量
    t:extended;                 // TT日期，儒略世纪数
    Epsa,DPsi,DEps:extended;
    Nals:array[1..NutNum,1..5]of integer;        // 章动项引数组合的系数
    Cls :array[1..NutNum,1..6]of extended;        // 章动项振幅
    ENals:array[1..EENum,1..8]of integer;       // 二分差项引数组合的系数
    ECls :array[1..EENum,1..2]of extended;       // 二分差项振幅
    // 三参数变换的数据结构
    // 极坐标和无转动原点展开式
      // 基本幅角，与El,Elp,F,D,Om和LVe,Le,pA重合
    ArgF:array[1..14]of extended;
      // 非多项式部分振幅，第一下标对应项序数，第二下标依次对应正弦和余弦
      // 项序数按X,Y和s+XY/2三个表达式的次序统一计算，单位为微角秒
    CNPoly:array[1..2941,1..2]of extended;
    Nijk:array[1..2941,1..14]of shortint;
    // 地球自转参数
    Epara:array[0..5]of extended;
    pX,pY,ps:extended;                         // 极向量坐标，无转动原点位置角
    // 调试变量,预置为true, 若重置为false,则 CBPN2000 不考虑历元偏置
    Bi:boolean;                                
    RFile:textfile;                            // 调试记录文件
    str:string;                                // 调试变量
    TableE:TTable;

    constructor Ini(Tab:TTable);
    destructor Free;
    procedure JulianCentury(const Jd:extended);
    procedure Nu2000B;                          // 计算黄经章动DPsi和倾角章动DEps
    function Bias:TMatrix;                      // 生成框架偏置矩阵
    function Precession:TMatrix;                // 生成岁差矩阵
    function Nutation:TMatrix;                  // 生成章动矩阵
    function CBPN2000:TMatrix;                  // 返回真天矩阵
    function ERA2000(ut1:extended):extended;    // 返回地球自转角
    function GST2000(ut1:extended;mean:boolean=false):extended;    // 返回格林尼治恒星时
    function EECT2000(t:extended):extended;     // 返回春分点补充项
    function POM2000(xp,yp:extended):TMatrix;   // 返回极移矩阵
    function TToC2000(W,Q:TMatrix;Theta:extended):TMatrix;  // 返回地天矩阵
    // 返回力学时tt的地天矩阵，Q为中天矩阵，极移忽略
    function TToC(Q:TMatrix;tt:extended):TMatrix;
    procedure BaseArg(mode:integer=0);
    procedure XYs2000A;
    function BPN2000:TMatrix;
    procedure EarthOrienP(const UTC:extended);
  end;
var
  Ems:TEms;
  Date:TYmd;
  CoorTrans:TCoorTrans;
  Eclipse:TEclipse;

function UTCToTAI (const UTC:extended;var DeltaAT:extended):extended;
function TTToUTC(const tt:extended;var DT:extended):extended;
function DeltaT(tt:extended):extended;
procedure UpdateBulletinB(const postfix:string;Table1:TTable);
//procedure EarthOrienP(const UTC:extended;TableB,TableE:Ttable;
//                                     var p:array of extended);
function UT1MinusUTC(const t:extended;TableB,TableE:Ttable):extended;
procedure GenerCoeFile;                     // 生成章动参数级数系数文件
procedure GenerEECoeFile;
function ApparentPosition(tt:extended;Nb:integer;Ec:boolean=false):TVector;
function SolarLong(const t:extended):extended;
function SolarMeanT(const L:extended):extended;
function SolarMeanT1(const D:extended):extended;
function SolarTrueT(const SolarK:integer):extended;
function PhaseT(const PhaseK:integer):extended;
function GetSolarK(jd:extended):integer;
function GetPhaseK(jd:extended):integer;
function GeodeticCoord(const x:TVector;var rou,lambda,phi,h:extended):extended;
//function GeodeticCoord_new(const x:TVector;var rou,lambda,phi,h:extended):extended;
function GeocentrCoord(const lambda,phi,h:extended):TVector;
function Refraction(const alt:extended):extended;
function SunHrzCoord(jd,lambda,fei,height:extended):TVector;
function RTS(jd,lambda,fei:extended;Nb:integer):TVector;

implementation
const
  L0=280.4664472-360.0;         // J0时的太阳黄经，度
  DL=0.9856473599513271;  // 太阳黄经变率，度/日
  D0=297.85019547;        // J0时的日月角距，度
  DD=12.190749115591;     // 日月角距变率，度/日
constructor TEms.Ini;             // 构造函数
begin
  FileName:=CommonPath+'MSM.data';           // 文件名
  BSize:=119;
  RecSz:=8* BSize;                // 数据记录字节数
                                  // 创建文件流变量
  FStream:=TFileStream.Create(FileName,fmOpenRead);
  FStream.read(HeadF,Sizeof(THeadF)); // 读入头记录
  velo:=True;
  Nrb:=0;                          // 记录指针置初值
  Pc[0]:=1.0;                     // 切比雪夫多项式初值
  Vc[0]:=0.0;
  Vc[1]:=1.0;
end;
destructor TEms.Free;
begin
  FStream.Free;             // 释放文件流变量
end;
// 计算序数为Nb的天体的地心数据
// Nb = 1,2,3 对应于月球，太阳，火星
Procedure TEms.InterP(Nb:integer); 
var
  Ps,Ncf,i,j,k:integer;
  VFac,tc:real;
begin
  Ps:=(Nb-1)*39+3;                 //系数始位置
  Ncf:=13;                         //系数数，阶数+1
//  Na:=1;                           //子区间数
                                   //计算归一化时间
  if abs(tv-1)<1.05e-16 then tc:=1
  else tc:=Frac(tv)*2.0-1.0;   //归一化时间
  //切比雪夫多项式置初值,Pc[0], Vc[0]和Vc[1]已在初始化时赋值            
  Pc[1]:=tc;     
  //递推计算切比雪夫多项式
  for i:=2 to Ncf-1 do Pc[i]:=2.0*tc*Pc[i-1]-Pc[i-2];
  //递推计算切比雪夫多项式的导数多项式
  if velo then for i:=2 to Ncf-1 do Vc[i]:=2.0*tc*Vc[i-1]+2*Pc[i-1]-Vc[i-2];
  VFac:=2.0/HeadF.ss[3];              // 时间由归一化单位化为日的因子
  // 计算坐标
  for i:=1 to 3 do begin               // 按分量循环
    Pv[Nb,i]:=0.0;                     // 累加器置初值
    for j:=0 to Ncf-1 do begin
      k:=Ps+(i-1)*Ncf+j;       // 系数下标
      Pv[Nb,i]:=Pv[Nb,i]+Pc[j]*Buf[k];
//      Pv[Nb,i]:=Pv[Nb,i]+Pc[j]*Buf[Nb,i,j];
    end;
  end;
  //计算速度，velo为处理速度标志，为False时不计算速度数据
  if velo then for i:=1 to 3 do begin               // 按分量循环
    Pv[Nb,i+3]:=0.0;
    for j:=0 to Ncf-1 do begin
      k:=Ps+(i-1)*Ncf+j;       // 系数下标
      Pv[Nb,i+3]:=Pv[Nb,i+3]+Vc[j]*Buf[k];
//      Pv[Nb,i+3]:=Pv[Nb,i+3]+Vc[j]*Buf[Nb,i,j];
    end;
    Pv[Nb,i+3]:=VFac*Pv[Nb,i+3];       // 化时间单位为日
  end;

end;

Procedure TEms.State(const Nb:integer=0);
            //************************************************************//
            // 读取月球、太阳和火星的地心位置速度， 单位为日，天文单位    //
            // 入口参数： t 力学时(TDB)日期                               //
            //            Nb 天体序数，Nb=1，2，3 对应月日火              //                    //
            // 出口参数   pv[Nb] 天体地心坐标和速度                       //
            // 2007.12.14 修改，原程序为读入质心系坐标后计算，            //
            // 改为直接读入，适用于文件 MSM.data                          //
            // 一次只处理一个天体，由于光行差需迭代，一次处理多个意义不大 //
            //************************************************************//
var
  Nr,i,j:integer;
begin
  for i:=1 to 3 do for j:=1 to 6 do Pv[i,j]:=0;            // 清状态数组
  //检查时间
  if (t<HeadF.ss[1])or(t>=HeadF.ss[2])then begin
    ShowMessage('Requested JED '+FloatToStr(t)+
     ' not within ephemeris limits,'+FloatToStr(HeadF.ss[1])+' '+
      FloatToStr(HeadF.ss[2]));
    exit;
  end;
  //计算记录序数和相对区间时间
  tv:=(t-HeadF.ss[1])/HeadF.ss[3];
  Nr:=Floor(tv)+2;                              //数据记录指针
  if t=HeadF.SS[2] then Nr:=Nr-1;               //末记录
  tv:=Frac(tv);
  //读入一个记录
  if Nr<>Nrb then begin
    FStream.Seek(RecSz*Nr,soFromBeginning);
    FStream.read(Buf,RecSz);
//    showmessage(inttostr(k));
    Nrb:=Nr;                                      //保存记录序数
  end;
  //计算天体数据,i=1~3 对应于地月球，太阳，火星
  InterP(Nb);
  for j:=1 to 6 do Pv[Nb,j]:=Pv[Nb,j]/HeadF.AU;
end;
procedure TYmd.DateToJd;
var
  u, w:extended;
begin
  // u为表示日期的变量，整数部分为年序数，十分位和百分位为日，
  // 千分位及以后各位为日的小数部分
    u:=year+(month+day/100.0)/100.0;
    // 变换年月序数，见1.3.1节
    if month<3 then begin
      month:=month+12;
      year:=year-1;
    end;
    w:=0;
    if u>1582.1014 then begin
      // 按格里历计算w
      w:=year/100.0;
      w:=-int(w)+int(w/4.0)+2;
      // 检查并处理不存在的日期
    end else if u>1582.1004 then showmessage('Error Date');
    // 计算儒略日
    u:=floor(365.25*year) +floor(30.6*(month+1)) + day
       +w +1720994.5;
    // 返回儒略日，包括日的小数
    jd:=u+fday;
    // 恢复自然年月序数
    if month>12 then begin
      month:=month-12;
      year:=year+1;
    end;
end;

procedure TYmd.JdToDate;
var
  w,s,d:extended;
  y1:integer;
//  t:TYmd;
begin
//  with t do begin
    // 分离出日的小数部分,儒略日的小数部分为0.5
    w:=Floor(jd)+0.5;
    // 调整日小数非负
    fday:=jd-w;
    if fday<0.0 then begin
      fday:=fday+1.0;
      w:=w-1.0;
    end;
//    jd:=w;
    s:=w-1721116.5;
    w:=0;
    year:=Floor(s/365.25);
    repeat
      y1:=year;
      if jd>=2299160.5 then w:=-Floor(year/100)+Floor(year/400)+2;
      year:=Floor((s-w)/365.25);
    until year=y1;
    s:=s-w;
    // 暂时保存s
    w:=s;
    // 积日
    s:=s-Floor(365.25*year);
    if s=0 then begin
      year:=year-1;
      s:=w-Floor(365.25*year);
    end;
    s:=s+122;
    month:=Floor(s/30.6)-1;
    d:=s-Floor(30.6*(month+1));
    if d=0 then begin
      month:=month-1;
      d:=s-Floor(30.6*(month+1));
    end;
    // 分离日和日的小数部分
    w:=d+fday;
    day:=Floor(w);
    fday:=w-day;
    // 化为自然年月序数
    if month>12 then begin
      month:=month-12;year:=year+1;
    end;
//  end;
//  Result:=t;
end;
//****************************************************************//
// 转换掩码为“#9999y99m90.099999d;1;_”的字符串为TYmd类型的记录  //
// 入口参数： s  公历年月日字符串                                 //
// 返回值： 0 输入合法；非0 输入非法                              //
// 出口参数 year,month,day,fday                                   //
//****************************************************************//

procedure TYmd.StrToDate(s:string;var w:integer);
var
  i,k:integer;
begin
  k:=Length(s)-1;
  //删去串尾的'd'
  s:=Copy(s,1,k);
  // 确定分隔符'y'的位置
  i:=Pos('y',s);
  // 提取年序数
  Val(Trim(Copy(s,1,i-1)),year,w);
  // w<>0 时，字符串含有非数字字符，退出处理
  if w<>0 then exit;
  // 提取月序数
  val(Trim(Copy(s,i+1,2)),month,w);
  if w<>0 then exit;
  // 确定小数点'.'的位置
  i:=Pos('.',s);
  // 提取日数
  Val(Trim(Copy(s,i-2,2)),day,w);
  if w<>0 then exit;
  if i>0 then Val('0'+Trim(Copy(s,i,k-i+1)),fday,w)
         else fday:=0.0;
end;

// 转换TYmd类型的记录为掩码是“#9999y99m90.099999d;1;_”的字符串

function TYmd.DateToStr:string;
var
  s,s1:string;
  i:integer;
begin
    s:=IntToStr(abs(year));
    s:=s+StringofChar(' ',4-length(s));
    if year>=0 then s:=' '+s else s:='-'+s;
    s1:=IntToStr(month);
    if month<10 then s1:=' '+s1;
    s:=s+'y'+s1+'m';
    s1:=FloatToStrF(day+fday,ffGeneral,7,0);
    if day<10 then s1:=' '+s1;
    if fday=0.0 then s1:=s1+'.0';
    for i:=1 to 7-length(s1) do s1:=s1+' ';
    s:=s+s1+'d';
    Result:=s;
end;

//**************************//
// 以下为天文参考系变换例程 //
//**************************//

//************************//
// 天文坐标变换类构造函数 //
//************************//
constructor TCoorTrans.Ini(Tab:TTable);
begin
  // 从数据文件 NuCoef.data 中将章动项幅角组合系数和振幅读入数组 Nals 和 Cls
  FStream:=TFileStream.Create(CommonPath+'NuCoef.data',fmOpenRead);
  FStream.Read(Nals,Sizeof(Nals));
  FStream.Read(Cls,Sizeof(Cls));
  FStream.Free;
  // 从数据文件 EECoef.data 中将春分点方程附加项幅角组合系数
  // 和振幅读入数组 ENals 和 ECls
  FStream:=TFileStream.Create(CommonPath+'EECoef.data',fmOpenRead);
  FStream.Read(ENals,Sizeof(ENals));
  FStream.Read(ECls,Sizeof(ECls));
  FStream.Free;
  // 从数据文件 XYsCoef.data 中将春分点方程附加项幅角组合系数
  // 和振幅读入数组 Nijk 和 CNPoly
  FStream:=TFileStream.Create(CommonPath+'XYsCoef.data',fmOpenRead);
  FStream.Read(Nijk,Sizeof(Nijk));
  FStream.Read(CNPoly,Sizeof(CNPoly));
  FStream.Free;
  // 创建调试文件
  Assign(RFile,'CheckRecord.txt');
  Rewrite(RFile);
  if Tab<>nil then TableE:=Tab;
end;
destructor TCoorTrans.Free;
begin
  CloseFile(RFile);
end;
//*****************************************************//
// 入口参数：Date TT日期，儒略日                       //
// 出口参数：t TT日期，儒略世纪                        //
//*****************************************************//
procedure TCoorTrans.JulianCentury(const Jd:extended);
begin
  t:=(Jd-J0)/JC;
end;
//*****************************************************//
// 入口参数：t TT 时间日期，历元儒略世纪数             //

//           ArgF[i],i=1..5, Delaunay 基本幅角         //
// 出口参数：Psi,Eps 黄经章动和倾角章动，单位：弧度    //
//*****************************************************//

procedure TCoorTrans.NU2000B;
const
  PPlan  = -0.135; // 行星对黄经章动的影响，单位为毫角秒
  EPlan  =  0.388; // 行星对倾角章动的影响
var
  i,k:integer;
  Arg,SArg,CArg:extended;
begin
 {
  // 按照Simon 等1994年的论文计算 Delaunay 基本幅角,单位为弧度
  // 月亮平近点角
  EL:= Remain (       485868.249036 +
                  1717915923.2178 *t,    TurnAs, k)*AsToR;
  // 太阳平近点角
  ELP:= Remain (     1287104.79305  +
                   129596581.0481 *t,    TurnAs, k)*AsToR;
  // 月亮平升交点角距
  F:= Remain (        335779.526232 +
                  1739527262.8478 *t,    TurnAs, k)*AsToR;
  // 日月平角距
  D:= Remain (       1072260.70369  +
                  1602961601.2090 *t,    TurnAs, k)*AsToR;
  // 月亮平升交点黄经
  OM:= Remain (       450160.398036 -
                     6962890.5431 *t,    TurnAs, k)*AsToR;
  }
  // 黄经章动和倾角章动置初值
  DPsi:=PPlan;
  DEps:=EPlan;
  for i:=NutNum downto 1 do begin

    // 计算幅角
    Arg:=0.0;
    for k:=1 to 5 do Arg:=Arg+Nals[i,k]*ArgF[k];
    Arg:=Remain(Arg,2.0*PI,k);

    {
    Arg:=Remain(Nals[i,1]*EL+Nals[i,2]*ELP+Nals[i,3]*F
               +Nals[i,4]*D+Nals[i,5]*OM,2.0*PI,k
               );
 }
    sincos(Arg,SArg,CArg);

    // 累加计算，单位为毫角秒
    DPsi:=DPsi+(Cls[i,1]+Cls[i,2]*t)*SArg+Cls[i,3]* CArg;
    DEps:=DEps+(Cls[i,4]+Cls[i,5]*t)*CArg+Cls[i,6]*SArg;
  end;
  // 化为弧度
  DPsi:=DPsi*MAsToR;
  DEps:=DEps*MAsToR;
end;

//***********************************//
// 入口参数：t TT 时间日期，儒略世纪 //
// 返回：    历天变换矩阵            //
//***********************************//
function TCoorTrans.Bias:TMatrix;
const
  // 框架偏置常数
  DRa0 = -0.01460  *AsToR;
  Ksi0 = -0.0166170*AsToR;
  Eta0 = -0.0068192*AsToR;
begin
  Result:=Rotate(1,Eta0);
  Result:=Product(Rotate(2,-Ksi0),Result);
  Result:=Product(Rotate(3,-DRa0),Result);
end;
//*************************************//
// 入口参数：t TT 时间日期，儒略世纪   //
// 返回：    岁差（平历）变换矩阵      //
//           Epsa，历元黄赤交角        //
//*************************************//
function TCoorTrans.Precession:TMatrix;
var
  Psia,Omaa,Chia:extended;
begin
  // 计算岁差参数
  Psia:=         (5038.47875  +
                 (  -1.07259  +
                 (  -0.001147) *t )*t )*t *AsToR;
  Omaa:= Eps0 +  (  -0.02524  +
                 (   0.05127  +
                 (  -0.007726 )*t )*t )*t *AsToR;
  Epsa:= Eps0 +  (  -46.84024 +
                 (   -0.00059 +
                 (    0.001813) *t )*t )*t *AsToR;
  Chia:=         (   10.5526  +
                 (   -2.38064  +
                 (   -0.001125) *t )*t )*t *AsToR;
  Result:=Rotate(3,-Chia);
  Result:=Product(Rotate(1,Omaa),Result);
  Result:=Product(Rotate(3,Psia),Result);
  Result:=Product(Rotate(1,-Eps0),Result);
end;
//***********************************//
// 入口参数：t TT 时间日期，儒略世纪 //
// 已调用 NU2000B 计算好 DPsi和DEps
//   调用 Presission 计算好 Epsa     //
// 返回：    章动（真平）变换矩阵    //
//***********************************//
function TCoorTrans.Nutation:TMatrix;
begin
  Result:=Rotate(1,Epsa+DEps);
  Result:=Product(Rotate(3,DPsi),Result);
  Result:=Product(Rotate(1,-Epsa),Result);
end;


//********************************************//
// 入口参数：t TT 时间日期，儒略世纪            //
// 返回：历元偏置,岁差，章动   矩阵(真天变换) //
//********************************************//
function TCoorTrans.CBPN2000:TMatrix;
begin
//  t:=(Date-J0)/JC;
//  JulianCentury(Jd);
  if Bi then Result:=Bias else Result:=Identity;
  Result:=Product(Result,Precession);
//  Result:=Precession;
  NU2000B;
  Result:=Product(Result,Nutation);
end;

//******************************************************//
// 从文本文件 tab5.3c.txt 读入章动系数数据              //
// 以二进制数据文件形式写入 NuCoef.data 文件            //
// tab5.3c.txt 是从 tab5.3a.txt 中截取前77 行数据得到的 //
//******************************************************//

procedure GenerCoeFile;
const
  Index:array[1..9] of integer=(0,1,2,4,5,3,0,6,0);
var
  cf:TextFile;
  i,j,k:integer;
  s,s1:string;
  FStream:TFileStream;
  Nals:array[1..NutNum,1..5]of integer;        // 章动项引数组合的系数
  Cls:array[1..NutNum,1..6]of extended;        // 章动项振幅
begin
  Assignfile(cf,'tab5.3c.txt');
  Reset(cf);
  for i:=1 to 4 do Readln(cf,s);
  for i:=1 to 77 do begin
    Readln(cf,s);
    for j:=1 to 5 do begin
      s:=trim(s);
      k:=pos(' ',s);
      s1:=copy(s,1,k-1);
      Nals[i,j]:=StrToInt(s1);
      delete(s,1,k);
    end;
    for j:=1 to 8 do begin
      s:=trim(s);
      k:=pos(' ',s);
      s1:=copy(s,1,k-1);
      if index[j]<>0 then Cls[i,index[j]]:=StrToFloat(s1);
      delete(s,1,k);
    end;
  end;
  Closefile(cf);
  FStream:=TFileStream.Create('NuCoef.data',fmCreate or fmOpenWrite);
  FStream.Write(Nals,Sizeof(Nals));
  FStream.Write(Cls,Sizeof(Cls));

  FStream.Free;
end;


//******************************************************//
// 从文本文件 tab5.4.txt 读入春分点方程附加项系数数据              //
// 以二进制数据文件形式写入 EECoef.data 文件            //
//                                                      //
//******************************************************//

procedure GenerEECoeFile;
var
  cf:TextFile;
  i,j,k,u:integer;
  s,s1:string;
  x:integer;
  FStream:TFileStream;
  ENals:array[1..EENum,1..8]of integer;       // 春分点项引数组合的系数
  ECls:array[1..EENum,1..2]of extended;       // 春分点项振幅
begin
  Assignfile(cf,'tab5.4.txt');
  Reset(cf);
  repeat
    Readln(cf,s);
  until Pos('j = 0  Nb of terms = 33',s)>0;
  Readln(cf,s);
  for i:=1 to 33 do begin
    Readln(cf,s);
    s:=trim(s);
    k:=pos(' ',s);
    delete(s,1,k);
    for j:=1 to 2 do begin
      s:=trim(s);
      k:=pos(' ',s);
      s1:=copy(s,1,k-1);
      ECls[i,j]:=StrToFloat(s1);
      delete(s,1,k);
    end;
    u:=1;
    for j:=1 to 13 do begin
      s:=trim(s);
      k:=pos(' ',s);
      s1:=copy(s,1,k-1);
      x:=StrToInt(s1);
      delete(s,1,k);
      if j in [1,2,3,4,5,7,8] then begin
        ENals[i,u]:= x;
        u:=u+1;
      end;
    end;
    ENals[i,8]:=StrToInt(s);
  end;
  Closefile(cf);
  FStream:=TFileStream.Create('EECoef.data',fmCreate or fmOpenWrite);
  FStream.Write(ENals,Sizeof(ENals));
  FStream.Write(ECls,Sizeof(ECls));

  FStream.Free;
end;


//*****************************************//
// 协调世界时化原子时                      //
// 入口参数：UTC，协调世界时，单位为日     //
// 出口参数：返回值 TAI，原子时，单位为日  //
//           deltaAT, TAI-UTC，单位为秒    //
//           越界时置 0
//*****************************************//

function UTCToTAI (const UTC:extended;var DeltaAT:extended):extended;
var
  i:integer;
//  delta:extended;
const
  // 实施调整的节点时刻
  TNode:array[0..38]of extended=
     ( 2437300.5,  2437512.5,  2437665.5,  2438334.5,  2438395.5,
      2438486.5,  2438639.5,  2438761.5,  2438820.5,  2438942.5,
      2439004.5,  2439126.5,  2439887.5,  2441317.5,  2441499.5,
      2441683.5,  2442048.5,  2442413.5,  2442778.5,  2443144.5,
      2443509.5,  2443874.5,  2444239.5,  2444786.5,  2445151.5,
      2445516.5,  2446247.5,  2447161.5,  2447892.5,  2448257.5,
      2448804.5,  2449169.5,  2449534.5,  2450083.5,  2450630.5,
      2451179.5,  2453736.5,  2454832.5,  2455927.5     );
  // 公式（13）中的参数，依次为J0, d0, mu
  Coef:array[0..12,1..3] of extended =
   ( (2437300.5,  1.4228180,  0.001296),  (2437300.5,  1.3728180,  0.001296),
     (2437665.5,  1.8458580,  0.0011232),  (2437665.5,  1.9458580,  0.0011232),
     (2438761.5,  3.2401300,  0.001296),  (2438761.5,  3.3401300,  0.001296),
     (2438761.5,  3.4401300,  0.001296),  (2438761.5,  3.5401300,  0.001296),
     (2438761.5,  3.6401300,  0.001296),  (2438761.5,  3.7401300,  0.001296),
     (2438761.5,  3.8401300,  0.001296),  (2439126.5,  4.3131700,  0.002592),
     (2439126.5,  4.2131700,  0.002592)
   );

begin
  // 预置返回值
  Result:=UTC;
  deltaAT:=0.0;
  // 检查入口参数是否在时间范围内；如果不在范围内，返回0；如果在范围内，
  // 确定所在时段的序数
  if (UTC< TNode [0])or(UTC> TNode [38]+1000.0) then begin
//    showmessage('JD out range');
    exit;
  end else for i:=0 to 37 do if (UTC>= TNode [i])and (UTC< TNode [i+1])then break;
  // 按时段序数分别调用公式（13）和（14）修改返回值
  if i<13 then  DeltaAT:=(Coef[i,2]+Coef[i,3]*(UTC-Coef[i,1]))
  else  DeltaAT:= i -3;
  Result:= Result+DeltaAT/secondperday;
end;
//
// 计算地球力学时与世界时之差 Delta T=TT-UT1
// 入口参数：tt 儒略日
// 返回值：  Delta T = TT-UT1

//
{
  }
function DeltaT(tt:extended):extended;
const
  aij1:array[0..10,0..9]of extended=(
(1600,1600  , 120 , -0.9808 , -0.01532 , 0.00014037,0,0,0,0),
(1700,1700  , 8.83 , 0.1603 , -0.0059285 , 0.00013336,-8.5179E-7,0,0,0),
(1800,1800  , 13.72 , -0.332447 , 0.0068612 , 0.0041116,-0.00037436,1.21272E-5,-1.699E-7,8.75E-10),
(1860,1860  , 7.62 , 0.5737 , -0.251754 , 0.01680668,-0.0004473624,4.28864E-6,0,0),
(1900,1920  , -2.97 , 1.494119 , -0.598939 , 0.0061966,-0.000197,0,0,0),
(1920,1920  , 21.20 , 0.84493 , -0.076100 , 0.0020936,0,0,0,0),
(1941,1950  , 29.07 , 0.407 , -0.0042918 , 3.926187E-4,0,0,0,0),
(1961,1975  , 45.45 , 1.067 , -0.00384615 , -0.0013927577,0,0,0,0),
(1986,2000  , 63.86 , 0.3345 , -0.060374 , 0.0017275,0.000651814,2.373599E-5,0,0),
(2005,2000  , 62.92 , 0.32217 , 0.005589 , 0,0,0,0,0),
(2050,0  , 0 , 0 , 0 , 0,0,0,0,0)
  );
  aij2:array[0..2,0..7]of extended=(
 ( -500,10583.6 , -1014.41 , 33.78311,-5.952053,-0.1798452,0.022174192,0.0090316521),
 (500  ,1574.2 , -556.01 , 71.23472 , 0.319781,-0.8503463,-0.005050998,0.0083572073),
 (1600,0,0,0,0,0,0,0)
  );
  // 第三行是必须的，否则执行 while 语句后出错.
var
  i,j:integer;
  y,dt:extended;
begin
  // 计算年数
  with Date do begin
    jd:=tt;
    JDToDate;
    y:=year+month/12.0+day/365.25; // ;
  end;
  dt:=0.0;
  if (y>=1600)and(y<=2050)then begin
    i:=0;
    while aij1[i+1,0]<y do i:=i+1;
    y:=y-aij1[i,1];
    for j:=9 downto 2 do dt:=dt*y+aij1[i,j];
  end else if (y>=-500)and(y<1600)then begin
    i:=0;
    while aij2[i+1,0]<y do inc(i);
    if i=1 then y:=y-1000.0;
    y:=y/100.0;
    for j:=7 downto 1 do begin
      dt:=dt*y+aij2[i,j];
    end;
  end else begin
    y:=(y-1820.0)/100.0;
    dt:=-20.0+32.0*y*y;
  end;
  Result:=dt;
end;
{
// 近似公式
function TTToUT(t:extended):extended;
var
  tt,x:real;
begin
//  x:=0;
  if t<2067314.5 then begin
    tt:=(t-2378496.0)/JC;
    x:=1360.0+(320.0+44.3*tt)*tt;
  end else if t<2316770.5 then begin
    tt:=(t-2396758.0)/JC;
    x:=22.5*tt*tt;
  end else if t<2488069.5 then begin
    tt:=(t-2385801.0)/JC;
    x:=-17.0+25.5*tt*tt;
  end else begin
    tt:=(t-2378496.0)/JC;
    x:=25.5*tt*tt;
  end;
  result:=t-x/86400.0;

end;
}
// ********************************//
// 由地球力学时求协调世界时        //
// 入口参数：tt 地球力学时儒略日   //
// 出口参数: DT=TT-UTC (秒)        //
// 返回参数：协调世界时            //
// ********************************//
function TTToUTC(const tt:extended;var DT:extended):extended;
var
  delt,utc:extended;
begin
  //
  if UTCToTAI(tt,delt)<>0then begin
    utc:=tt-(delt+32.184)/secondperday;
    UTCToTAI(utc,delt);
    utc:=tt-(delt+32.184)/secondperday;
    Result:=utc;
    DT:=delt+32.184;
  // 超出IERS公布的数据范围时用近似多项式计算，忽略UTC与UT1之差
  end else begin
    DT:=DeltaT(tt);
    Result:=tt-DT/secondperday;
  end;
end;

//***********************************************************//
// 根据文件 bulletinb_IAU2000-xxx.txt 更新数据表BulletinB.DB    //
// 入口参数：postfix，文件名后缀字符串                        //
//           Table1， 数据表组件                             //
//***********************************************************//
procedure UpdateBulletinB(const postfix:string;Table1:TTable);
var
  i,j,k,n:integer;
  s,s1:string;
  Eopc:array[1..4]of extended;
  EopFile:TextFile;
begin
  Table1.Active;	// 打开数据库
  AssignFile(EopFile,'bulletinb_IAU2000-'+postfix+'.txt');
  Reset(EopFile);
  // 搜索文件的第二部分
  repeat
    Readln(EopFile,s);
  until  Pos('2 - SMOOTHED VALUES',s)<>0;	// 搜索至第二部分首行结束循环
  for i:=1 to 5 do Readln(EopFile,s); 	// 跳过说明行和域名行
  Readln(EopFile,s); 	//读取一行
//  i:=1;  	// 记录序数(循环变量)置初值
  // 按记录循环
  repeat
    s:=trim(s);
    n:=Length(s);
    k:=Pos(' ',s);
    s:=copy(s,k+1,n);
    s:=trim(s);
    k:=Pos(' ',s);
    s:=copy(s,k+1,n);
    s:=trim(s);
    j:=1;    	// 字段序数置初值
    // 按字段循环
    repeat
      k:=Pos(' ',s);      	// 根据分隔符提取域的数据
      if k>1 then begin
        s1:=copy(s,1,k);
        s:=copy(s,k+1,n);
        s:=trim(s);
        n:=Length(s);
      end else s1:=s;
      Eopc[j]:=StrToFloat(s1);      	// 写入记录数组
      if j=1 then Eopc[j]:=Eopc[j]+2400000.5;	// 修正儒略日化为儒略日
      j:=j+1; 	// 修改字段序数
    until j=5;
    // 送入数据库
    with Table1 do begin
      SetKey;	// 置查找模式
      FieldByName('JD').AsFloat:=Eopc[1];	// 置查找值
      if GotoKey then begin
        edit;	// 查找成功，置修改模式
        for j:=2 to 4 do fields[j-1].AsFloat:=Eopc[j];
        post;
      end else begin
        last;	// 查找不成功，置添加模式
        append;
        for j:=1 to 4 do fields[j-1].AsFloat:=Eopc[j];
        post;
      end;
    end;
//    i:=i+1; 	// 修改记录序数
    Readln(EopFile,s); 	//读取一行
  until Pos('IERS, B ',s)>0;	// 至第二部分末行结束循环
  CloseFile(EopFile);	// 关文件
  Table1.Active:=false;	// 关数据库
end;
//***********************************************************//
//根据数据表BulletinB.db,Epoch.db 计算 UT1-UTC               //
// 入口参数：UTC，协调世界时，单位为日                       //
//           TableB，与BullebinB.DB接口的数据表组件          //
//           TableE，与Eopc.DB接口的数据表组件               //
// 返回参数：如日期在数据表范围内返回 ut1-utc，否则返回0     //
//***********************************************************//
function UT1MinusUTC(const t:extended;TableB,TableE:Ttable):extended;
var
  y,yb,ye,x:extended;                	// 年数，插值变量
  ymd:TYmd;	// 日期类对象，见2.6节
  xa:array[0..1,0..5]of extended;
  i:integer;
begin
  // 读取TableB数据的日期范围
  with TableB do begin
    Active:=True;
    First;
    yb:=Fields[0].AsFloat;
    Last;
    ye:=Fields[0].AsFloat;
  end;
  if (t>=yb) and (t<=ye) then begin
  // 数据的日期在TableB范围内
    with TableB do begin
      SetKey;
      FindNearest([t]);
      if t<Fields[0].AsFloat then prior;
      xa[0,0]:=Fields[0].AsFloat;
      xa[1,0]:=Fields[3].AsFloat;
      next;
      xa[0,1]:=Fields[0].AsFloat;
      xa[1,1]:=Fields[3].AsFloat;
      Active:=False;
    end;
    x:=(t- xa[0,0])/(xa[0,1]-xa[0,0]);
    Result:= xa[1,0]+x*((xa[1,1]-xa[1,0]));
    exit;
  end;
  // 数据的日期不在TableB范围内，计算年数 y 作为插值变量
  TableB.Active:=False;
  ymd:=TYmd.Create;	// 创建日期类对象
  with ymd do begin
    jd:=t;
    JdToDate;
    Month:=1;
    Day:=0;
    DateToJd;	// 计算年首儒略日
    y:=year+(t-jd-fday)/365.2425;	// 计算插值变量
    free;	// 释放日期类对象
  end;
  // 读取始末记录日期
  with TAbleE do begin
    last;
    ye:=Fields[0].AsFloat;
    first;	// 定位于始记录
    yb:=Fields[0].AsFloat;
    if (y<yb)or(y>ye)then begin
      // 处理日期越界，返回0
   {   showmessage('Date is out of range'+char($0A)
               +FloatToStr(yb)+' to '+FloatToStr(ye)+char($0A)
               +'Date is '+FloatToStr(y));      }
   //   if y>ye then last;	// 定位于末记录
      Result:=0.0;
      exit;
    end;
    // 定位最接近的记录
    active:=true;
    SetKey; 	// 置查找模式
    // 搜索年数最接近的记录
    FindNearest([y]);
    MoveBy(-3); 	// 前移两个记录
    yb:=Fields[0].AsFloat;
    // 读取连续5条记录至xa数组
    for i:=0 to 4 do begin
      // 同一字段数据在数组中按行排列
      xa[1,i]:=Fields[3].AsFloat;
      next;
    end;
    // 插值计算5个参数，注意实参xa[i]的用法
    Result:=Interpolate((y-yb)/0.2,xa[1]);
  end;
end;

//************************************************************//
// 根据数据表Eopc4.DB 内插计算地球自转参数                    //
// 入口参数：UTC，协调世界时，单位为日                        //
//                                                            //
//           TableE，与Eopc4.DB接口的数据表组件               //
// 出口参数：p[0..5]，地球自转参数数组，所含参数依次为：x，y，//
//           ut1-utc, LOD, dX，dY .                           //
//************************************************************//
procedure TCoorTrans.EarthOrienP(const UTC:extended);
var
  y,yb,ye,x:extended;                	// 年数，插值变量    MJD,
  xa:array[0..5,0..1]of extended;
  i,j:integer;
begin
  // 计算修正儒略日
  y:=utc-2400000.5;
  with TAbleE do begin
    // 读取始末记录日期
    last;
    ye:=Fields[0].AsFloat;
    first;	// 定位于始记录
    yb:=Fields[0].AsFloat;
    if (y<yb)or(y>ye)then begin
      // 处理日期越界，参数置零
//      showmessage('Date is out of range'+char($0A)
//               +FloatToStr(yb)+' to '+FloatToStr(ye)+char($0A)
//               +'Date is '+FloatToStr(y));
//      if y>ye then last;	// 定位于末记录
      for i:=0 to 5 do Epara[i]:=0.0;
      exit;
    end;
    // 定位最接近的记录
    active:=true;
    SetKey; 	// 置查找模式
    // 搜索日期最接近的记录
    FindNearest([y]);
    if Fields[0].AsFloat>y then prior;
    // 线性插值
    yb:=Fields[0].AsFloat;
    for j:=0 to 5 do xa[j,0]:=Fields[j+1].AsFloat;
    next;
    ye:=Fields[0].AsFloat;
    for j:=0 to 5 do xa[j,1]:=Fields[j+1].AsFloat;
    x:=(y- yb)/(ye-yb);
    for j:=0 to 5 do Epara[j]:= xa[j,0]+x*((xa[j,1]-xa[j,0]));
  end;
end;

//*************************//
// 返回地球自转角          //
// 入口参数：ut1，UT1日期   //
//*************************//
function TCoorTrans.ERA2000(ut1:extended):extended;
var
  Tu,Fu,Theta:extended;
  k:integer;
begin
  Tu:=ut1-J0;
  Fu:=Frac(Tu);
  Theta:=2.0*PI * ( Fu + 0.7790572732640
                        + 0.00273781191135448 * Tu );
  Result:=Remain(Theta,2.0*PI,k);
end;
//*********************************************************//
// 返回二分差补充项                                        //
// 入口参数：t，TT日期，儒略世纪数                         //
//           BaseArg[i] (i=1..5,7,8,14), 基本幅角          //
//*********************************************************//
function TCoorTrans.EECT2000(t:extended):extended;
var
  i,k:integer;
  Arg,SArg,CArg:extended;
begin
  {
  // 计算 Delaunay 基本引数,单位为弧度
  // 月亮平近点角等5个日月引数已在Nu2000B中计算
  // 行星章动引数
  LVe:= Remain ( 3.176146697   + 1021.3285546211 *t,   2*PI, k);
  LE := Remain ( 1.753470314   +  628.3075849991 *t,   2*PI, k);
  pA := Remain ( 0.024381750*t +    0.00000538691*t*t, 2*PI, k);
  }
  // 黄经章动和倾角章动置初值
  Result:=0.0;
  for i:=EENum downto 1 do begin

    // 计算幅角
    Arg:=0.0;
    for k:=1 to 5 do Arg:=Arg+ENals[i,k]*ArgF[k];
    for k:=6 to 7 do Arg:=Arg+ENals[i,k]*ArgF[k+1];
    Arg:=Arg+ENals[i,8]*ArgF[14];
    Arg:=Remain(Arg,2.0*PI,k);
   {
    Arg:=Remain(ENals[i,1]*EL  + ENals[i,2]*ELP + ENals[i,3]*F
               +ENals[i,4]*D   + ENals[i,5]*OM
               +ENals[i,6]*LVe + ENals[i,7]*LE  + ENals[i,8]*pA,
               2.0*PI,k );
   }
    sincos(Arg,SArg,CArg);
    // 累加计算，单位为微角秒
    Result:=Result + ECls[i,1]*SArg + ECls[i,2]* CArg;
  end;
  REsult:=Result - 0.87*sin(ArgF[5]);
  // 化为弧度
  Result:=Result*MAsToR*1e-3;
end;

//*********************************************************//
// 返回格林尼治恒星时，单位为弧度                          //
// 入口参数：ut1，UT1日期                                  //
//           t，TT日期，儒略世纪数                         //
//           mean 计算平恒星时标志                         //
//           Epsa，历元黄赤交角（在 Precession 方法中计算）//
//           Dpsi，黄经章动 （在 Nutation 方法中计算）     //
// 返回值：mean 为 true 时为平恒星时，false 时为真恒星时   //
//         单位为弧度                                      //
//*********************************************************//
function TCoorTrans.GST2000(ut1:extended;mean:boolean=false):extended;
var
  era:extended;
  k:integer;
begin
  // TT时间历元儒略世纪数送 t
  //JulianCentury(TT);
  // 地球自转角
  Result:=ERA2000 ( ut1 );
//  str:='经典地球自转角  '+floattostr(era);
//  Writeln(RFile,str);
//  str:='Dpsi=  '+floattostr(Dpsi)+'   Epsa=  '+floattostr(Epsa);
//  Writeln(RFile,str);
  // 格林尼治真（视）恒星时
  Result:=Result{ERA2000 ( ut1 ) }+
                             (    0.014506   +
                             ( 4612.15739966 +
                             (  + 1.39667721 +
                             (  - 0.00009344 +
                             (  + 0.00001882 )
                                      * t ) * t ) * t ) * t ) * AsToR;
  // 格林尼治平恒星时
  if mean then exit;
  // 二分差
  Result:=Result+Dpsi*cos(Epsa)+EECT2000(t);
  Result:=Remain(Result,2.0*PI,k);
end;
//****************************************************//
// 返回极移矩阵                                       //
// 根据IERS 2000规范，第6章（6.14）式                    //
// 入口参数：xp, yp，天极(中间极)在地球坐标系内的坐标
//          单位 角秒
//****************************************************//
function TCoorTrans.POM2000(xp,yp:extended):TMatrix;
var
  R:TMatrix;
  sp:extended;
begin
  sp:=-47e-6*t*AsToR;               // 地球系无转动修正量
  R:=Rotate(1,yp*AsToR);
  R:=Product(Rotate(2,xp*AsToR),R);
  Result:=Product(Rotate(3,-sp),R);
end;
//***********************************************//
// 返回地球参考系至天球参考系转换（地变天）矩阵  //
// 根据IERS 2000规范，第x讲（12）式              //
// 入口参数：W，极移矩阵                      //
//           Q，真天矩阵                      //
//           Theta，格林尼治恒星时               //
//***********************************************//
function TCoorTrans.TToC2000(W,Q:TMatrix;Theta:extended):TMatrix;
var
  R:TMatrix;
begin
  R:=Product(Rotate(3,-Theta),W);    //地球自转矩阵左乘极移矩阵
  Result:=Product(Q,R);              //右乘岁差章动矩阵
end;


//***********************************************************************//
// 计算14个基本幅角，按版本A                                             //
// 入口参数 t: TT日期，儒略世纪数                                        //
//          mode: 计算模式，0－2，缺省为0                                //
// 出口参数 ArgF: 单位为弧度                                             //
//          mode=0 时 全部14个基本幅角                                   //
//          mode=1 时 5个 Delaunay 基本幅角                              //
//          mode=2 时 5个 Delaunay 基本幅角，2个行星平近点角，黄经总岁差 //
//***********************************************************************//
procedure TcoorTrans.BaseArg(mode:integer=0);
const
  // Delaunay 基本幅角多项式的系数
  coef1to5:array[1..5,0..4]of double=
  ( ( 485868.249036,  715923.2178, 31.8792,  0.051635, -0.00024470),
    (1287104.793048, 1292581.0481, -0.5532,  0.000136, -0.00001149),
    ( 335779.526232,  295262.8478,-12.7512, -0.001037,  0.00000417),
    (1072260.703692, 1105601.2090, -6.3706,  0.006593, -0.00003169),
    ( 450160.398036, -482890.5431,  7.4722,  0.007702, -0.00005939)
   );
  // Delaunay 基本幅角每世纪变化整周数
  turns:array[1..5]of integer=(1325,99,1342,1236,-5);
  // 大行星平近点角和黄经总岁差多项式的系数
  coef6to14:array[6..14,0..1]of double=
  ( (4.402608842, 2608.7903141574),  (3.176146697, 1021.3285546211),
    (1.753470314,  628.3075849991),  (6.203480913,  334.0612426700),
    (0.599546497,   52.96909626410), (0.874016757,   21.32991049600),
    (5.481293872,    7.4781598567),  (5.311886287,    3.8133035638),
    (0.024381750,    0.00000538691)
   );
var
  i,k:integer;
begin
  for i:=1 to 5 do ArgF[i]:=
      Remain(poly(t,coef1to5[i])*AsToR + Frac(turns[i]*t)*2.0*PI, 2.0*PI, k);
  if mode=1 then exit;
  for i:=6 to 14 do if (mode=2)and(i in [7,8,14])or(mode=0) then
             ArgF[i]:=Remain(poly(t,coef6to14[i]), 2.0*PI, k);
  ArgF[14]:=ArgF[14]*t;
end;

{
procedure TcoorTrans.CalcuBaseArg;
var
  k:integer;
begin
   // 月亮平近点角
      ArgF[1] := Remain (  ( 485868.249036  +
                        (    715923.2178 +
                        (       31.8792  +
                        (      0.051635  +
                        (     -0.00024470   )
                              *t ) * t ) * t ) * t ) * AsToR
                               + Frac ( 1325*t ) * 2.0*PI,  2.0*PI , k );
// 太阳平近点角  
      ArgF[2] := Remain (  ( 1287104.793048  +
                        (  1292581.0481  +
                        (        -0.5532  +
                        (      +0.000136  +
                        (      -0.00001149  )
                              * t ) * t ) * t ) * t ) * AsToR
                               + Frac ( 99*t ) *2.0*PI,  2.0*PI , k );
//月亮平升交点角距
      ArgF[3] := Remain (  (  335779.526232  +
                        (  295262.8478    +
                        (     -12.7512    +
                        (      -0.001037  +
                        (       0.00000417  )
                              * t ) * t ) * t ) * t ) * AsToR
                              + Frac ( 1342*t ) * 2.0*PI ,  2.0*PI , k);
// 日月平角距
      ArgF[4] := Remain (  (  1072260.703692  +
                        (  1105601.2090    +
                        (      -6.3706     +
                        (       0.006593   +
                        (      -0.00003169   )
                               * t ) * t ) * t ) * t ) * AsToR
                               + Frac ( 1236*t ) * 2.0*PI,  2.0*PI , k );
//月亮升交点平黄经
      ArgF[5] := Remain (   (  450160.398036  +
                         ( -482890.5431    +
                         (       7.4722    +
                         (       0.007702  +
                         (      -0.00005939  )
                               * t ) * t ) * t ) * t ) * AsToR
                               + Frac ( -5*t ) * 2.0*PI,  2.0*PI , k);
      ArgF[ 6] := Remain ( 4.402608842 + 2608.7903141574 * t,  2.0*PI , k);
      ArgF[ 7] := Remain ( 3.176146697 + 1021.3285546211 * t ,  2.0*PI , k);
      ArgF[ 8] := Remain ( 1.753470314 +  628.3075849991 * t,  2.0*PI , k);
      ArgF[ 9] := Remain ( 6.203480913 +  334.0612426700 * t,  2.0*PI , k);
      ArgF[10] := Remain ( 0.599546497 +   52.96909626410 * t,  2.0*PI , k);
      ArgF[11] := Remain ( 0.874016757 +   21.32991049600 * t,  2.0*PI , k);
      ArgF[12] := Remain ( 5.481293872 +    7.4781598567 * t,  2.0*PI , k);
      ArgF[13] := Remain ( 5.311886287 +    3.8133035638 * t,  2.0*PI , k);
      ArgF[14] :=        ( 0.024381750 +    0.00000538691 * t ) * t;
end;
}
// *****************************************************
// 计算极坐标X，Y和无转动原点位置角s                   //
// 入口参数 t: TT日期，儒略世纪数                      //
//          BaseArg, 14个基本参数                      //
// 出口参数  px,py,ps: 极向量坐标，无转动原点位置角    //
//*****************************************************//
procedure TcoorTrans.XYs2000A;
const
  // 极坐标和无转动原点展开式非多项式部分项数，第一下标对应表达式，第二下标对应和式
  Mij:array[1..3,0..4]of integer
      =((1306,   253,    36,    4,    1),
        ( 962,   277,    30,    5,    1),
        (  33,     3,    25,    4,    1)
       );
  // 多项式部分系数，第一下标对应表达式，第二下标对应t的幂次，按升幂排列，单位为微角秒
  CPoly:array[1..3,0..5]of extended
      =( (-16616.99, 2004191742.88,    -427219.05, -198620.54,   -46.05,  5.98),
         ( -6950.78,     -25381.99,  -22407250.99,    1842.28,  1113.06,  0.99),
         (    94.0,        3808.35,       -119.94,  -72574.09,    27.70, 15.61)
       );
var
  pn,tn,i,j,k:integer;
  si:array[0..5]of double; //extended;
  pa,Alfa,sa,ca:extended;
//  RFile:Textfile;
//  s:string;
begin
//  assignfile(RFile,'CheckRecord.txt');
//  rewrite(RFile);
//  s:='t=   '+floattostr(t);
//  writeln(RFile,s);
  // 计算14个基本幅角
//  BaseArg;
{
  for i:=1 to 14 do begin
    s:='argF('+inttostr(i)+')=   '+floattostr(argf[i]);
    writeln(RFile,s);
  end;
}
  // 加项序数赋初值
  tn:=1;
  for pn:=1 to 3 do begin
    // 处理一个输出量
    for i:=0 to 5 do si[i]:=CPoly[pn,i];
{
  for i:=0 to 5 do begin
    s:='si('+inttostr(i)+')=   '+floattostr(si[i]);
    writeln(RFile,s);
  end;
}  
    for j:=0 to 4 do begin
       // 处理一个加项
      for i:=1 to Mij[pn,j] do begin
        // 计算基本幅角及其正弦、余弦
        Alfa:=0.0;
        for k:=1 to 14 do Alfa:=Alfa+Nijk[tn,k]*ArgF[k];
        sincos(Alfa,sa,ca);
        // 累加计算和式
{        
    s:='CNPoly['+inttostr(tn)+',1]='+floattostr(CNPoly[tn,1])+
       '           '+'CNPoly['+inttostr(tn)+',2]='+floattostr(CNPoly[tn,2]);
    writeln(RFile,s);
}
        si[j]:=si[j]+CNPoly[tn,1]*sa+CNPoly[tn,2]*ca;
        // 修改加项序数
        tn:=tn+1;
      end;
    end;
    // 计算参数多项式,si 为系数数组，按t的升幂排列
    pa:=poly(t,si);
    // 化为弧度
    pa:=pa*1e-6*AsToR;
    case pn of
      1:pX:=pa;
      2:pY:=pa;
      3:ps:=pa-pX*pY/2.0;
    end;
  end;
{
    s:='px=   '+floattostr(px);
    writeln(RFile,s);
    s:='py=   '+floattostr(py);
    writeln(RFile,s);
    s:='ps=   '+floattostr(ps);
    writeln(RFile,s);
}
end;

function TcoorTrans.BPN2000:TMatrix;
var
  X2,Y2,R2,A,AXY:extended;
  RL:TMatrix;
begin
  XYs2000A;
  X2 := pX*pX;
  Y2 := pY*pY;
  R2 := X2 + Y2;
  A := 1.0 / ( 1.0 + sqrt ( 1.0 - R2 ) );
  AXY := A*pX*pY;
  // 生成右矩阵

  RL[1,1] := 1.0-A*X2;
  RL[1,2] := -AXY;
  RL[1,3] := pX;
  RL[2,1] := -AXY;
  RL[2,2] := 1.0-A*Y2;
  RL[2,3] := pY;
  RL[3,1] := -pX;
  RL[3,2] := -pY;
  RL[3,3] := 1.0-A*R2;

  Result:= product(RL,Rotate(3,ps));
end;

// 返回力学时tt的地天矩阵，Q为中天矩阵，极移忽略
function TcoorTrans.TToC(Q:TMatrix;tt:extended):TMatrix;
var
  theta,dt:extended;
begin

    Theta:=GST2000(TTToUTC(tt,dt)+Epara[2]/secondperday);
    Result:=Product(Q,Rotate(3,-theta));
end;

// *************************************************//
//  计算天文大气折射（蒙气差）                      //
//  入口参数                                        //
//    alt: 真地平高度，单位为度                     //
//  返回值  蒙气差，单位为度                        //
//          视高度＝真高度+蒙气差                   //
//  Φ.Samundsson ，Astronomical Algrithms， p102   //
// 2009.10.9 调试                                   //
//**************************************************//
function Refraction(const alt:extended):extended;
begin
  Result:=0.017034/tan(degToRad(alt+10.3/(alt+5.11)));
end;

//**************************************************//
// 计算月球、太阳、火星视位置                       //
// 入口参数：t TT 日期                              //
//           Nb 天体序数，见 TEms.State             //
//           Ec=false 黄道坐标                      //
// 返回值：地心距，AU；视赤经，视赤纬 (Ec=false)    //
//                     视黄经，视黄纬 (Ec=true)     //
//**************************************************//
function ApparentPosition(tt:extended;Nb:integer;Ec:boolean=false):TVector;
var
  j:integer;
  t0:extended;
  r,tao:extended;
  x,v:TVector;
  BPN:TMatrix;
begin
  // 计算经典变换岁差章动矩阵，章动版本B
  with CoorTrans do begin
    t:=(tt-J0)/JC;
    BaseArg;
    Bi:=true;
    BPN:=CBPN2000;
    BPN:=MTransp(BPN);
    if Ec then begin
      // 旋转至黄道参考系
      BPN:=Product(Rotate(1,Epsa+DEps),BPN);
    end;
  end;
  with Ems do begin
    t0:=tt;                 
    t:=t0;
    State(Nb);
    for j:=1 to 3 do begin
      x[j]:=pv[Nb,j];
      v[j]:=pv[Nb,j+3];
    end;
    // 真地心距
    r:=VLength(x);
    result[1]:=r;
    // 光行时近似值
    tao:=r/CLight;
    // 修正光行差
    t:=t0-tao;
    State(Nb);
    for j:=1 to 3 do begin
      x[j]:=pv[Nb,j];
      v[j]:=pv[Nb,j+3];
    end;
    x:=VUnit(x,r);
    x:=Product(BPN,x);
    CartesianToPolar(x,result[1],result[2],result[3]);
    result[1]:=r;
  end;
end;
function SolarMeanT(const L:extended):extended;
  //**********************************************//
  // 计算并返太阳黄经为L的近似时刻                //
  // 入口参数：L  太阳平黄经，单位为度            //
  // 返回值： 力学时儒略日                        //
  //**********************************************//
const
  p1=6892.745/3600.0;
var
  t,t1,jc,DLam0,DLam,Lp:extended;
begin
  DLam0:=L-L0;
  t:=DLam0/DL;
  repeat
    t1:=t;
    jc:=t/36525.0;
    Lp:=DegToRad(357.52910918+129596581.0481*jc/3600.0);
    DLam:=DLam0-p1*sin(Lp);
    t:=DLam/DL;
  until abs(t-t1)<1e-6;
  result:=J0+t;
end;
function SolarMeanT1(const D:extended):extended;
  //**********************************************//
  // 计算并返太阳平黄经为D的时刻，单位为力学时日  //
  //**********************************************//
const
  SL0=280.4664472;         // 度
  DSL=0.9856473599513271;  // 度/日
var
  DL1,t,t1,DL,JT,g,p1,p2:extended;
begin
  DL1:=D-SL0;                //各系数单位为周
  t:=DL1/DSL;
  t1:=0;
  while abs(t-t1)>1e-8 do begin
    t1:=t;
    JT:=t/36525.0;
    g:=DegToRad((129596581.04-(0.562+0.012*JT)*JT)*JT/3600+357.5291);
    p1:=(6892.745-(17.344+0.052*JT)*JT)/3600;
    p2:=(71.977-0.361*JT)/3600;
    DL:=DL1-3.0361e-4*JT*JT-p1*sin(g)-p2*sin(2*g);
    t:=DL/DSL;
  end;
  result:=J0+t;
end;
{
procedure Swap(var x,y:extended);overload;
var
  z:extended;
begin
  z:=x; x:=y; y:=z;
end;
procedure Swap(var x,y:longint);overload;
var
  z:longint;
begin
  z:=x; x:=y; y:=z;
end;
}
   //*****************************//
   //计算返回的太阳视黄经，单位为度//
   //入口参数：t TT时刻           //
   //返回值：太阳视黄经，单位为度 //
   //*****************************//
function SolarLong(const t:extended):extended;
var
  u:extended;
begin
  u:=RadToDeg(ApparentPosition(t,2,true)[2]);
  Result:=FormatDeg(u);
end;
function SolarTrueT(const SolarK:integer):extended;
   //***********************************************************//
   // 计算太阳黄经为15×SoalrK度的时刻,                         //
   // SoalrK为节气序数，SoalrK＝0对应于J2000之后的第一个春分日  //
   //（1999年12月8日6时31.6分），SoalrK mod 24＝0，1，..,23     //
   // 依次对应于春分，清明，..,惊蛰节气                         //                                 ///
   // 返回的时刻为力学时                                        //
   //***********************************************************//                                                          ///
var
  jd:extended;
  k:integer;
begin
  k:=SolarK mod 24;
  if k<0 then k:=k+24;
  jd:=SolarMeanT(15.0*SolarK);
  result:=FindRoot(SolarLong,15.0*k,jd-0.1,jd+0.1,1.0e-9);
end;
//****************************//
// 计算日月视角距             //
// 入口参数：t TT时刻         //
// 返回值：  日月视角距，弧度 //
//****************************//
function SMAngularDis(const t:extended):extended;
var
  u:extended;
begin
  u:=RadToDeg(ApparentPosition(t,2,true)[2]);
  u:=RadToDeg(ApparentPosition(t,1,true)[2])-u;
  Result:=FormatDeg(u);
  if Result>315.0 then Result:=Result-360.0;
end;
function PhaseT(const PhaseK:integer):extended;
   //***********************************************************//
   // 计算月相                                                  //
   // 入口参数：PhaseK 月相序数，0对应于J2000之后的第一个朔     //
   //           PhaseK mod 4＝0，1，2，3 依次对应于             //
   //           朔，上弦，望和下弦                              //
   // 返回值：  力学时                                          //
   //***********************************************************//
var
  jd:extended;
  k:integer;
begin
  k:=PhaseK mod 4;
  if k<0 then k:=k+4;
  jd:=J0+(90*PhaseK-D0+360.0)/DD;
  result:=FindRoot(SMAngularDis,90.0*k,jd-1.0,jd+1.0,1.0e-7);
end;
//************************************//
// 粗略计算力学时 jd 后邻节气的序数   //
// 入口参数： jd 力学时               //
// 返回值：后邻节气序数               //
//************************************//
function GetSolarK(jd:extended):integer;
begin
  Result:=round((L0+DL*(JD-J0))/15.0);
end;
function GetPhaseK(jd:extended):integer;
var
  t:extended;
  D:extended;
begin
  t:=JD-J0;
  D:=D0+DD*t-360.0;
  Result:=floor(D/90.0);
end;

//**********************************//
// 计算月球、地球的日心视向径       //
// 入口参数：tt TT 日期              //
// 出口参数：vre 地球日心视向径     //
//           vrm 月球日心视向径     //
//**********************************//
procedure EMCoord(tt:extended;var vre,vrm:TVector);
var
  i,j:integer;
  t0:extended;
  r,tao:extended;
  x:TVector;
begin
  with Ems do begin
    t0:=tt;
    for i:=1 to 2 do begin
      // 分别处理月球和太阳
      t:=t0;
      State(i);
      for j:=1 to 3 do x[j]:=pv[i,j];
      // 真地心距
      r:=VLength(x);
      // 光行时近似值
      tao:=r/CLight;
      // 修正光行差
      t:=t0-tao;
      State(i);
      // 置出口参数，化为日心向径
      for j:=1 to 3 do if i=1 then vrm[j]:=pv[i,j] else vre[j]:=-pv[i,j];
    end;
    vrm:=VPlus(vre,vrm);
  end;
end;
{
constructor TEclipse.ini;
begin
  // 测站坐标置零，即关于地心计算
  geoc:=true;
  VZero(VEStation);
end;
}

  //******************************************************//
  // 计算关于受影天体中心/测站(Q)的影心距，单位为AU       //
  // 入口参数： t TT日期                                  //
  //            geoc 为true 时关于中心，false 关于测站    //
  //                                                      //
  //            VEStation 为测站地心向径(地球系)          //
  //返回值：受影天体中心/测站(Q)的影心距，单位为AU        //
  // 返回参数：                                           //
  //           vqo   Q 至影心的向径                       //
  //           uqo   vqo方向的单位向量                    //
  //           rqn    向量vrq在vrp方向的投影              //
  //           rp     向量vrp 的长度                      //
  //           norm   基本面法向量                        //
  //           vrq    Q 的日心向径                        //
  //                                                      //
  //******************************************************//
function TEclipse.ShadowCenterDis(const t:extended):extended;
begin
  // 计算成影天体P 的日心视向径vrp 和测站的日心视向径vrq
  if lunar then EMCoord(t,vrp,vrq) else begin
    EMCoord(t,vrq,vrp);
    // 修正至测站坐标系，VCStation为时间的函数
    if not geoc then begin
      // 由地球中介系至天球参考系的变换矩阵(忽略极移)
      CoorTrans.EarthOrienP(t);
      QR:=CoorTrans.TToC(BPN,t);
      // 测站的天球参考系坐标
      VCStation:=Product(QR,VEStation);
      // 测站日心视向径
      vrq:=VPlus(vrq,VCStation);
    end;
  end;
  norm:=VUnit(vrp,rp);                    // 基本面法向量
  norm:=product(-1.0,norm);
  rqn:=Product(vrq,norm);                 // 向量vrp在 norm 方向的投影
  vqo:=VComb(vrq,norm,-1.0,rqn);          // 天体Q 或测站至影心的向径
  uqo:=VUnit(vqo,Result);                 // 返回影心距，
                                          // uqo为测站至影心方向的单位向量
end;
//***********************************//
// 计算天体 P 半影半径           //
// 入口参数：t TT日期（实际不用）
//           RadiusP 成影天体P半径，单位 千米 //
//           rp 成影天体日心距             //
//           rqn 受影天体向径在法向的投影
// 返回参数：u1 半影半径，单位 AU    //
//***********************************//
function TEclipse.PenumbraRadius(const t:extended):extended;
var
  R,rpToRS2:extended;
begin
//  if lunar then p:=1.010085{0.99834}*RadiusP else
//  p:=RadiusP;
  rpToRS2:=rp/RSun;
  rpToRS2:=rpToRS2*rpToRS2;
  R:=1.0+RadiusP/RSun;
  // 半影半径
  u1:=(-rqn*R-rp)/sqrt(rpToRS2-R*R);
  if lunar then  u1:=1.019*u1;  // 1+1/128
  Result:=u1;
end;

//***********************************//
// 计算天体 P 本影半径           //
// 入口参数：t TT日期（实际不用）
//           Rp 成影天体P半径，单位 千米 //
//           rqn 受影天体向径在法向的投影
// 出口参数：                        //
//           u2 本影半径，单位 AU    //
//           total 中心食类型        //
//             true 全食             //
//             false 环食            //
//***********************************//
function TEclipse.UmbraRadius(const t:extended):extended;
var
  R,rpToRS2,c:extended;
begin
//  if lunar then p:=1.010085{0.99834}*RadiusP else
//  p:=RadiusP;
  rpToRS2:=rp/RSun;
  rpToRS2:=rpToRS2*rpToRS2;
  R:=1.0-RadiusP/RSun;
  c:=-rqn*R-rp;
  // 本影半径
  u2:=c/sqrt(rpToRS2-R*R);
  // 中心食类型
  total:=(c<=0);

  if lunar then  u2:=1.0178*u2;  // 1+1/73 ,1.005
  Result:=u2;
end;
// ***************************************//
//  计算时刻 tm 由地球参考系到天球参考系的变换矩阵
//  入口参数 t：力学时
//           BPN: 中天矩阵
//  出口参数 QR： 地天矩阵
//****************************************//
{
procedure TEclipse.GCMatrix(const tm:extended);
var
  theta:extended;
begin
  with CoorTrans do begin
    Theta:=GST2000(TTToUTC(tm)+UT1MinusUTC(tm,TabB,TabE)/secondperday);
    QR:=Product(BPN,Rotate(3,-theta));
  end;
end;
}
//************************************//
//按地球椭球修正测站地心距            //
//入口参数：tm 力学时                 //
//          rs 测站地心向径（天球系） //
//          QR 地天变换矩阵
//返回参数：测站地心距                //
//出口参数：           //
//          测站的地球参考系经纬度      //
//          longt rs 的地心经度        //
//          latt  rs 的地心纬度       //
//************************************//
function TEclipse.EarthRadius(rs:TVector;var longt,latt:extended):extended;
var
  w:extended;
begin
  VEStation:=Product(MTransp(QR),rs);
  CartesianToPolar(VEStation,w,longt,latt);
  // 按地球椭球修正测站地心距
  Result:=REarth*sqrt(1.0-(2*flat-flat*flat)*sin(latt)*sin(latt));
end;
//*************************************************//
// 计算太阳地平高度和方位角                        //
// 入口参数：r  太阳关于测站的视向径               //
//           long 测站大地经度                     //
//           lat  测站大地纬度                     //
// 出口参数：Azm 太阳地平方位角，从北向东度量      //
//           Alt 太阳地平高度                      //
//                                                 //
//*************************************************//
procedure TEclipse.SunHrzCoord(const r:TVector);
var
  vct:TVector;
  w:extended;
begin
  //
  // 变换至中介坐标系
  vct:=product(MTransp(QR),r);
  // 变换至测站时角系
  vct:=product(Rotate(3,long),vct);
  // 变换至测站地平系，方位角以北点为起点，向东计算
  vct:=product(Rotate(2,PI/2.0-lat),vct);
  vct:=product(Rotate(3,PI),vct);
  vct[2]:=-vct[2];
  CartesianToPolar(vct,w,Azm,Alt);
  // 地平方位角和高度化为度
  Azm:=RadToDeg(Azm);
  Alt:=RadToDeg(Alt);
  // 地平高度修正蒙气差
  // Alt:=Alt+Refraction(Alt);
end;

  //************************************************//
  // 判断时刻 t 邻近食的发生及种类                  //
  // 入口参数：tm 朔望时刻，                        //
  //           lunar  待处理食的类型                //
  //           geoc   true 关于地心处理             //
  //                  false 关于测站处理            //
  //           VEStation 为测站地心向径(地球参考系) //
  //           geoc 为true时置零                    //
  // 出口参数：tmin  影心距取极小值的时刻           //
  //                 如发生食，为食甚时刻           //
  //           rmin 影心距极小值                    //
  //           g  食分                              //
  // 返回值：  食的类型                             //
  //           0 无食                               //
  //           1 日偏食    2 日全食   3 日环食      //
  //           4 全环食    5半影月食  6月偏食       //
  //           7  月全食                            //
  //************************************************//
function TEclipse.CalcuEclipse(const tm:extended):integer;
var
  w,w1,rr,zeta:extended;
  i:integer;
  vct:TVector;
  geoc0:boolean;
begin
  // 置成影天体与受影天体半径
  if lunar then begin
    RadiusP:=REarth;
    RadiusQ:=RMoon;
  end else begin
    RadiusP:=RMoon;
    RadiusQ:=REarth;
  end;
  // 计算影心距取极小值的时刻，精确至0.1秒
  tmin:=tm;
  if not geoc then with CoorTrans do begin
    // 生成近视时刻 tmin 的中天矩阵BPN
    JulianCentury(tmin);
    BaseArg;
    BPN:=CBPN2000;
  end;
  rmin:=GoldMinimum(ShadowCenterDis,tm-0.1,tm+0.1,1.0e-7,tmin);
  // 计算影心距极小时的半影和本影半径
  PenumbraRadius(tmin);
  UmbraRadius(tmin);
  // 判断有食无食及食的类型
  // 返回值置初值
  ec:=0;
  Result:=0;
  if geoc then rr:=rmin-RadiusQ else begin
    // 若测站在贝塞尔平面背面，无食退出
    vct:=VUnit(VCStation,w);
    if (product(norm,vct)<-0.17)then exit;
    rr:=rmin;
  end;
  // 无食，退出
  if rr>u1 then exit;
  // 有食，计算沙罗序列数，判断食的类型
  SarN:=SNS(LunaN,i);
  if rr>=abs(u2)then begin
    // 半影食，日偏食或半影月食
    if not lunar then ec:=1 else ec:=5;
  end else begin
    if not lunar then begin
      // 本影食,日全食或日环食
      if total then ec:=2 else ec:=3;
      g:=(u1-u2)/(u1+u2);
    end else
    // 月偏食或月全食
    if rmin+RadiusQ>=abs(u2) then ec:=6 else ec:=7;
  end;
  // 计算输出参数
  // 赤经相合时刻
  nt:=FindRoot(DiffSMRa,0.0,tmin-0.1,tmin+0.1,1.0e-7);

  // 食甚时刻 tmin 的中天矩阵BPN和天地矩阵QR
  with CoorTrans do begin
    JulianCentury(tmin);
    BaseArg;
    BPN:=CBPN2000;
    EarthOrienP(tmin);
  end;
  QR:=CoorTrans.TToC(BPN,tmin);

  // 影心距
  gamma:=rmin/Rearth;
  // 地球自转轴向量
  for i:=1 to 3 do vct[i]:=BPN[i,3];
  w:=product(uqo,vct);
  if not((w>=0)xor lunar)then gamma:=-gamma;

  // 分情形计算食分等参数
  case ec of
    1:begin
        // 日偏食
        if not geoc then begin
          g:=(u1-rmin)/(u1+u2);
          vct:=product(vrq,-1.0);
          SunHrzCoord(vct);
        end else begin
           // 地面点向径，地心天球参考系
          vct:=Product(uqo,REarth);
          R:=EarthRadius(vct,w,w1);
          g:=(u1+R-rmin)/(u1+u2);
        end;
      end;
    2,3: begin
      // 日全食及日环食
      // 食甚时影轴与地面交点的坐标，经纬度
      if geoc then begin
        if rmin<=Rearth then zeta:=sqrt(Rearth*Rearth-rmin*rmin)else zeta:=0.0;
        // 地面点向径，地心天球参考系
        vct:=VComb(vqo,norm,1.0,zeta);
        // 按地球椭球修正地面点地心距
        R:=EarthRadius(vct,w,w1);
        if rmin<=R then zeta:=sqrt(R*R-rmin*rmin)else zeta:=0.0;
        vct:=VComb(vqo,norm,1.0,zeta);
        vct:=Product(MTransp(QR),vct);
        // 计算大地经纬度
        lat:=GeodeticCoord(vct,R,long,lat,w);
        // 按地面点重新计算影心距和影半径
        geoc:=false;
        ShadowCenterDis(tmin);
        PenumbraRadius(tmin);
        UmbraRadius(tmin);
        geoc:=true;
      end;
      g:=(u1-u2)/(u1+u2);
      // 全环食
      if (ec=3)and total then ec:=4;
      // 太阳视向径
      vct:=product(vrq,-1.0);
      SunHrzCoord(vct);
      // 计算全（环）食长 duration
      if alt<=0.0 then duration:=0.0 else begin
        w:=0.0;
        um:=true;
        geoc0:=geoc;
        geoc:=false;
        duration:=findroot(StationLimbDis,w,tmin-0.02,tmin,1.0e-7);
        w1:=findroot(StationLimbDis,w,tmin,tmin+0.02,1.0e-7);
        geoc:=geoc0;
        duration:=w1-duration;
      end;
    end;
    5,6,7: begin
      // 月食
      g:=(-u2+RadiusQ-rmin)/2.0/RadiusQ;
      // 计算月亮最大食在天顶的地点
      // 月球地心向径
      vct:=VMinus(vrq,vrp);
      vct:=Product(MTransp(QR),vct);
      CartesianToPolar(vct,w,long,lat);
    end;
  end;
  // 交食各阶段发生和结束的时刻
  for i:=1 to 2 do TP[i,0]:=0.0;
  for i:=1 to 4 do TU[i,0]:=0.0;
  w:=0.0;
  // 半影外切，半影月食或日偏食始终时刻
  ex:=true;
  um:=false;
  if geoc then begin
    TP[1,0]:=FindRoot(TangentDis,w,tmin-0.5,tmin,1.0e-7);
    TP[2,0]:=FindRoot(TangentDis,w,tmin,tmin+0.5,1.0e-7);
  end else begin
    TP[1,0]:=FindRoot(StationLimbDis,w,tmin-0.5,tmin,1.0e-7);
    TP[1,1]:=PositionAng;
    TP[2,0]:=FindRoot(StationLimbDis,w,tmin,tmin+0.5,1.0e-7);
    TP[2,1]:=PositionAng;
  end;
  if (ec<>1)and(ec<>5)then begin
    //本影外切，月偏食，日全食始终时刻
    ex:=true;
    um:=true;
    w:=0;
    if geoc then begin
      TU[1,0]:=FindRoot(TangentDis,w,tmin-0.1,tmin,1.0e-7);
      TU[4,0]:=FindRoot(TangentDis,w,tmin,tmin+0.1,1.0e-7);
    end else begin
      TU[1,0]:=FindRoot(StationLimbDis,w,tmin-0.5,tmin,1.0e-7);
      TU[4,0]:=FindRoot(StationLimbDis,w,tmin,tmin+0.5,1.0e-7);
    end;
    //本影内切，日全食食既，生光；月全食始终时刻
    if (ec<>6)and geoc then begin
      ex:=false;
      TU[2,0]:=FindRoot(TangentDis,w,tmin-0.1,tmin,1.0e-7);
      TU[3,0]:=FindRoot(TangentDis,w,tmin,tmin+0.1,1.0e-7);
    end;
  end;
  if ec=7 then duration:=(TU[3,0]-TU[2,0])*1440.0;
  Result:=ec;
end;
//**************************************************************************************//
// 由地球参考系坐标计算经度，测地纬度和地心距,新公式,依据Satellite Orbits, 2009.9 修改  //
// 入口参数：x 测站向径，地球参考系，单位为 AU                                          //
// 出口参数：rou 地心距, lambda 经度，h 海拔高程，phi 地心纬度                          //
// 返回值：大地纬度                                                                     //
//**************************************************************************************//
function GeodeticCoord(const x:TVector;var rou,lambda,phi,h:extended):extended;
// const
//  e2=2*flat-flat*flat;
var
  r2,dz,dz_old,z,sphi,N:extended;
begin
 // 计算地心球坐标
 CartesianToPolar(x,rou,lambda,phi);
 r2:=x[1]*x[1]+x[2]*x[2];
 dz:=e2*x[3];
 dz_old:=1.0;
 while abs(dz-dz_old)/REarth>1e-18 do begin
   dz_old:=dz;
   z:=x[3]+dz;
   sphi:=z/sqrt(r2+z*z);
   dz:=REarth*e2*sphi/sqrt(1.0-e2*sphi*sphi);
 end;
 h:=sqrt(r2+z*z)-REarth/sqrt(1.0-e2*sphi*sphi);
 Result:=arcsin(sphi);
end;
//***********************************************************************//
// 由测站大地经度，纬度和海拔高度计算地球参考系坐标                      //
// 入口参数：lambda,phi 测地经度，纬度，单位为弧度，h 海拔高度 单位为米  //
// 返回参数：测站的地心向径，地球参考系，单位为AU                        //
//***********************************************************************//
function GeocentrCoord(const lambda,phi,h:extended):TVector;
var
  sf,cf,sl,cl,N,u,hh:extended;
//const
//  e2=2*flat-flat*flat;
begin
 hh:=h/AU/1000.0;
 sincos(lambda,sl,cl);
 sincos(phi,sf,cf);
 N:=REarth/sqrt(1.0-e2*sf*sf);
 u:=(N+hh)*cf;
 Result[1]:=u*cl;;
 Result[2]:=u*sl;
 Result[3]:=(N*(1.0-e2)+hh)*sf;
end;
  //*******************************************************//
  // 计算并返回太阳/对日点与月亮的赤经差                   //
  // 入口参数：t 力学时                                    //
  //           lunar 处理类型（日食/月食）                 //
  // 返回值：                                              //
  //           lunar 为false 时为太阳和月亮的赤经差        //
  //           lunar 为true 时为对日点和月亮的赤经差       //
  //*******************************************************//
function TEclipse.DiffSMRa(const t:extended):extended;
var
  vs,vm:TVector;
  LDiffer:extended;
begin
  vs:=ApparentPosition(t,1);
  vm:=ApparentPosition(t,2);
  LDiffer:=vs[2]-vm[2];
  if lunar then LDiffer:=LDiffer-PI;
  if LDiffer>=PI then LDiffer:=LDiffer-2*PI;
  if LDiffer<-PI then LDiffer:=LDiffer+2*PI;
  //日月赤经差
  Result:=LDiffer;
end;
//***************************************************//
// 计算并返回力学时t P 天体影锥至 Q 天体边缘的距离   //
// 日食时为月影边缘至地面边缘的距离                  //
// 月食时为地影边缘至月面边缘的距离                  //
// 入口参数：                                        //
//           t 力学时                                //
//           ex true 外切，false 内切                //
//           um true 本影，false 半影                //
//           BPN 中天矩阵                            //
//           norm 贝塞尔平面法向量                   //
//                                                   //
//返回值：距离                                       //
//***************************************************//
function TEclipse.TangentDis(const t:extended):extended;
var
  w,w1,QRadius,SRadius:extended;
begin
  // 计算影心距
  r:=ShadowCenterDis(t);
  // 受影天体半径，日食时为影心距方向的地球半径
  if lunar then QRadius:=RMoon else QRadius:=EarthRadius(uqo,w,w1);
  // 计算影半径 SRadius
  if um then begin
    UmbraRadius(t);
    if total then SRadius:=-u2 else SRadius:=u2;
  end else begin
    PenumbraRadius(t);
    SRadius:=u1;
  end;
  if ex then Result:=SRadius+QRadius
  else if not lunar then Result:=QRadius-SRadius else Result:=SRadius-QRadius;
  Result:=r-Result;                 
end;

//***********************************************//
// 计算测站至本/半影边缘的距离                   //
// 入口参数：  tt 力学时                         //
//             BPN 中天矩阵                      //
//             VEStation 测站向径（地球系）      //
// 返回值：    测站与本影边缘的距离，向外为正    //
//***********************************************//
function TEclipse.StationLimbDis(const t:extended):extended;
var
  u:extended;
begin
  // 计算测站与本影边缘的距离
  geoc:=false;
  u:=ShadowCenterDis(t);
  if um then UmbraRadius(t)else PenumbraRadius(t);
  // 全环食
  if um then if total then Result:=u+u2 else Result:=-u+u2
  else Result:=-u+u1;
end;
//********************************************************//
// 计算测站日食时日月视切点的方位角，从日面顶点向东计算   //
// 入口参数：QR 天球-地球坐标系变换矩阵                   //
//           VCStation 测站地心向径，天球参考系；天顶方向 //
//           norm 基本面法向量                            //
//           uqo 影心距方向单位向量，日月视圆面切点方向   //
// 返回值： 方位角                                        //
//********************************************************//
function TEclipse.PositionAng:extended;
var
  vec,vec1,vp:TVector;
  w:extended;
  i:integer;
begin
  // 取极向量
  for i:=1 to 3 do vp[i]:=QR[i,3];
  // 计算日面顶点方向的单位向量
  // 测站向径即天顶方向
  vec:=Product(Product(VCStation,norm),norm);
  // 天顶方向在基本面内的投影即日面顶点方向
  vec:=VMinus(VCStation,vec);
  vec:=VUnit(vec,w);
  // 判断由日面顶点方向 vec向日月视圆面切点方向 uqo 的转向
  // 该方向为顺时针（向东）时，vec1与基本面法向量同向，角(norm,vp)大于90度，w<0;
  // 该方向为逆时针（向西）时，vec1与基本面法向量反向，角(norm,vp)小于90度，w>0;
  product(vec,uqo,vec1);
  w:=product(vec1,vp);
  // 计算方位角，
  Result:=arccos(product(vec,uqo));
  if w>=0 then Result:=2*PI-Result;
end;
//************************************************//
// 计算沙罗序数和inex序数，检验无误，2009.5.15    //
// 入口参数：LN J2000 朔望月序数                  //
// 出口参数：XN inex 序数                         //
// 返回值：沙罗序数                               //
//************************************************//
function TEclipse.SNS(LN:integer;var XN:integer):integer;
var
  DN,SN:integer;
begin
  // 修改朔望月序数至原点
  if lunar then DN:=LN+57103 else DN:=LN+60389;
  SN:=38*DN;
//  XN:=-61*DN;
  while SN>98 do SN:=SN-223;
  while SN<-60 do SN:=SN+223;
  XN:=round((DN-358*SN)/223);
  Result:=SN;
end;
//******************************************//
// 计算太阳地平高度和方位角                 //
// 入口参数：jd  世界时儒略日               //
//           long 测站大地经度，度          //
//           lat  测站大地纬度              //
//           height 测站海拔高度，米        //
// 返回向量：太阳站心距                     //
//           太阳地平方位角，从南向西度量   //
//           太阳地平高度                   //
//******************************************//
function SunHrzCoord(jd,lambda,fei,height:extended):TVector;
var
  DT,tt,tao:extended;
  theta,dis,azimuth,altitude:extended;
  rs,rp,r,p:TVector;
  j:integer;
  BPN,QR:TMatrix;
begin
  //  jd:=jd0-1.0/3.0;
  // 测站地心坐标，不做极移变换
  Dt:=DeltaT(jd)/secondperday;
  // 力学时
  tt:=jd+Dt;
  // 测站地心向径
  rs:=GeocentrCoord(DegToRad(lambda),DegToRad(fei),height);
  // 读太阳地心坐标
  with EMS do begin
    t:=tt;
    State(2);
    for j:=1 to 3 do rp[j]:=pv[2,j];
  end;
  with CoorTrans do begin
    // 生成时刻 tt 的中天矩阵BPN
    JulianCentury(tt);
    BaseArg;
    BPN:=CBPN2000;
    Theta:=GST2000(TTToUTC(tt,dt));
    QR:=Product(BPN,Rotate(3,-theta));
  end;
  QR:=MTransp(QR);
  rp:=Product(QR,rp);
  // 站心向径
  r:=VMinus(rp,rs);
  // 光行时
  tao:=VLength(r)/CLight;
  // 修正光行差
  tt:=tt-tao;
  with EMS do begin
    t:=tt;
    State(2);
    for j:=1 to 3 do rp[j]:=pv[2,j];
  end;
  rp:=Product(QR,rp);
  r:=VMinus(rp,rs);
  p:=Product(Rotate(3,DegToRad(lambda)),r);
  p[2]:=-p[2];
  p:=Product(Rotate(2,-DegToRad(-90+fei)),p);
  CartesianToPolar(p,Result[1],Result[2],Result[3]);
  if Result[2]>PI then Result[2]:=Result[2]-2.0*PI;
end;
//****************************************************//
// 计算天体升起、中天和落下的时刻                     //
// 入口参数：jd 北京时儒略日                          //
//           lambda 测站大地经度（度）                //
//           fei    测站大地纬度                      //
//           Nb     天体序数，Nb=1，2，3 对应月日火   //
// 返回值：向量的三个坐标依次为中天、升起和落下北京时 //
//****************************************************//
function RTS(jd,lambda,fei:extended;Nb:integer):TVector;
const
  TwoPI=2.0*PI;
  StToUt=0.997269566;
var
  delta,alpha,alt0:extended;
  tt,Dt,gst0:extended;
  ch0,h0,s0,s1,s2:extended;
  u:extended;
  r:TVector;
  k:integer;
//****************************//
// 恒星时迭代过程             //
// 入口参数：st 恒星时近似值  //
//           c  计算中天标志  //
//****************************//
function interp(st:extended;c:boolean):extended;
var
  s,gst,t,ds,h,alt:extended;
begin
  s:=st;
  repeat
    // 恒星时
    gst:=gst0+TwoPI*s;
    gst:=remain(gst,TwoPI,k);
    // 世界时
    t:=jd+s*StToUt;
    // 天体视位置
    r:=ApparentPosition(t+Dt,Nb);
    // 时角
    h:=-r[2]+lambda+gst;
    // 时角修正量
    if not c then begin
      // 地平高度
      alt:=arcsin(sin(fei)*sin(r[3])+cos(fei)*cos(r[3])*cos(h));
      ds:=-(alt-alt0)/(TwoPI*cos(fei)*cos(r[3])*sin(h))
    end else ds:=h/TwoPI;
    s:=s-ds;
  until abs(ds)<1e-15;
  Result:=s;
end;
begin
  // TT-UT1，单位为日
  Dt:=DeltaT(jd)/secondperday;    
  Dt:=DeltaT(jd+Dt)/secondperday;
  // 天体视位置初值，取北京时正午
  r:=ApparentPosition(jd+0.5+Dt,Nb);
  // 地平高度初值，角分
  if Nb=2 then alt0:=-50 else alt0:=-34;
  alt0:=DegToRad(alt0/60);
  // 对月亮的修正
  if Nb=1 then alt0:=alt0+(REarth-RMoon)/r[1];
  // 北京时0时的恒星时
  gst0:=CoorTrans.GST2000(jd,true);
  // 时角初值
  ch0:=(sin(DegToRad(alt0))-sin(fei)*sin(r[3]))/cos(fei)/cos(r[3]);
  h0:=arccos(ch0);
  // 上中天时刻初值
  s0:=(r[2]-lambda-gst0)/TwoPI;
  s0:=remain(s0,1,k);
  // 升起时刻初值
  s1:=s0-h0/TwoPI;
  s1:=remain(s1,1,k);
  // 落下时刻初值
  s2:=s0+h0/TwoPI;
  s2:=remain(s2,1,k);
  // 迭代计算
  Result[1]:=interp(s1,false)*StToUt;
  Result[2]:=interp(s0,true)*StToUt;
  Result[3]:=interp(s2,false)*StToUt;
end;

end.


