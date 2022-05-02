
//***********************************//
//《天球参考系变换及其应用》第9章    //
// 目录结构：                        //
// 根目录(D:/)                       //
//     CRSTrans                      //
//         common                    //
//         chapter 9                 //
//            bin                    //
//            DB                     //
//            dcu                    //
//            source                 //
//***********************************//
unit UStmp;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs,Math,StdCtrls, ComCtrls, ToolWin, ExtCtrls,
  DB, DBTables, Grids, DBGrids, Mask,ImgList,UBaseOper,UAstr;

type
  TForm1 = class(TForm)
    ToolBar1: TToolBar;
    StatusBar1: TStatusBar;
    CoolBar1: TCoolBar;
    Panel2: TPanel;
    Label1: TLabel;
    cbJD: TComboBox;
    DBGrid1: TDBGrid;
    TablePhase: TTable;
    FloatField1: TFloatField;
    FloatField4: TFloatField;
    FloatField5: TFloatField;
    FloatField6: TFloatField;
    StringField1: TStringField;
    DSource1: TDataSource;
    tbPhase: TToolButton;
    tbSolarTerm: TToolButton;
    TableST: TTable;
    TableSTUT: TFloatField;
    TableSTY: TFloatField;
    TableSTM: TFloatField;
    TableSTD: TFloatField;
    TableSTBT: TStringField;
    Panel1: TPanel;
    Label2: TLabel;
    edYears: TEdit;
    meDate: TMaskEdit;
    TableSTSTN: TStringField;
    ImageList1: TImageList;
    TablePhasePhSN: TStringField;
    procedure FormCreate(Sender: TObject);
    function CheckDate:boolean;
//    procedure CalcuJd;
    procedure cbJDChange(Sender: TObject);
    procedure cbJDExit(Sender: TObject);
//    procedure tbLunarEclipseClick(Sender: TObject);
//    procedure tbSolarEclipse1Click(Sender: TObject);
    procedure tbPhaseClick(Sender: TObject);
    procedure tbSolarTermClick(Sender: TObject);
{    procedure tbSolarTerm1Click(Sender: TObject); }
    procedure cbJDKeyPress(Sender: TObject; var Key: Char);
    procedure meDateKeyPress(Sender: TObject; var Key: Char);
    procedure meDateExit(Sender: TObject);
//    procedure ToolButton1Click(Sender: TObject);
    procedure edYearsKeyPress(Sender: TObject; var Key: Char);
    procedure edYearsChange(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}
const
  {
  SMD0=0.8273621195988;     // 297°51′01″.307/360°日月平角距常数项
  SMDDot=0.033863191990265; //（1236＋307°06′41″.328/360）/36525
  SL0=280.4664472;          // 太阳平黄经常数项
  SLDot=0.9856473599513271; // 太阳黄经一次项系数
  }
  SyzygyName:array[0..3]of string=('朔','上弦','望','下弦');
  ecname:array[0..5]of string=('日偏食','日全食','日环食','月偏食','月全食','半影食');
  SolarTermname:array[0..23]of string=('春分','清明','谷雨','立夏','小满','芒种',
                                '夏至','小暑','大暑','立秋','处暑','白露',
                                '秋分','寒露','霜降','立冬','小雪','大雪',
                                '冬至','小寒','大寒','立春','雨水','惊蛰');
var
  Phasek,SolarK:integer;

    //////////////////////////////////////////////////////////////////////////
    // Moonk 为从J2000开始的月相序数，0对应J2000之后的第一个朔日，向后为正，//
    // 除以4的余数 0,1,2,3 分别对应于朔，上弦，望和下弦                     //
    // SolarK 为从J2000开始的节气序数，0对应于J2000之后的第一个春分日       //
    //（1999年12月8日6时31.6分），SoalrK mod 24＝0，1，..,23                //
    // 依次对应于春分，清明，..,惊蛰节气                                    //
    //////////////////////////////////////////////////////////////////////////
  jd0:extended;
  TL:integer;               // 时间区间长度，单位为年
{  ch,lunar:boolean;}
    ///////////////////////////////////////////////
    // ch 日期转换处理信号灯，避免多重处理       //
    // lunar  控制 ShadowCenterDis 过程的操作    //
    // forwd  控制连续计算的方向                 //
    ///////////////////////////////////////////////
{
  pss,psm:TVector;
  vs,vm,vms:TVector;
  ps,ss,pm,sm,rs,rms,jdu:extended;
  lamda,fei,nt,ftime,l1,l2:extended;
  tf:textfile;///////////////
}

{
function MeanT(const D:extended):extended;
  ////////////////////////////////////////////////////
  // 计算并返回日月平角距为D的时刻，单位为力学时日  //
  ////////////////////////////////////////////////////
var
  d1,t,t1:extended;
  u:extended;   ///////////////////////////////
  s:string;     ///////////////////////////////
begin
  D1:=D-SMD0;                //各系数单位为周
  t:=D1/SMDDot;
  result:=J0+t;
end;

function SyzygyN(JD:extended):integer;
  ///////////////////////////////
  //计算并返回邻近JD的月相序数 //
  ///////////////////////////////
var
  t:extended;
  D:extended;
begin
  t:=JD-J0;
  D:=SMD0+(SMDDot+(-3.9855e-15+2.9634e-22*t)*t)*t;
  Result:=round(4*D);
end;
function SolarTermN(JD:extended):integer;
  ///////////////////////////////
  //计算并返回邻近JD的节气序数 //
  ///////////////////////////////
var
  t:extended;
begin
  t:=JD-J0;
  Result:=round((SL0+SLDot*t)/15.0);
end;
}
{
procedure SMECood(const t:extended;var rs,rm:TVector);
  //////////////////////////////////////////////////
  //计算太阳和月球的地心坐标,太阳坐标修正光行差  ///
  // 030609修改，因De单元已修改，直接计算地心坐标 //
  //////////////////////////////////////////////////
var
  i:integer;
  dt,dt1,r:extended;
begin
  De.Ett:=t;
  De.State;
  for i:=1 to 3 do rm[i]:=De.pv[2,i];   // 月球地心坐标
  for i:=1 to 3 do rs[i]:=De.pv[3,i];   // 太阳地心坐标
  dt:=Vlength(rs)/CLight;
  dt1:=0;
  while abs(dt-dt1)>1e-8 do begin        // 修正光行差
    dt1:=dt;
    De.Ett:=t-dt;
    De.State;
    for i:=1 to 3 do rs[i]:=De.pv[3,i];
    dt:=Vlength(rs)/CLight;
  end;
end;
function DiffSMLong(const t:extended):extended;
   //////////////////////////////////////////////////////////
   //计算太阳和月球的地心向径，黄经，黄纬分别送入pss和psm，//
   //返回日月视角距，单位为度                              //
   //////////////////////////////////////////////////////////
var
  i:integer;
  r,jt,eps:extended;
begin
  De.Ett:=t;
  De.State;          // 在窗体 Crearte过程中已预置计算日月的地心坐标 030609
  for i:=1 to 3 do begin
    xb.x[i]:=De.pv[3,i];
    xb.v[i]:=De.pv[3,i+3];
  end;
  r:=VLength(xb.x);
  VComb(xb.x,xb.v,1.0,-r/CLight);            //修正光行差
  jt:=(t-J2000)/36525.0;
  Eps:=23.43929111*RD+(-46.8150+(-0.00059+0.001813*jt)*jt)*jt*RDS; //平黄赤交角
  xb.EqToEc(eps);
  XyzToRls(xb.x,pss[1],pss[2],pss[3]);      //太阳地心向径，黄经，黄纬
  for i:=1 to 3 do xb.x[i]:=De.pv[2,i];
  xb.EqToEc(eps);
  XyzToRls(xb.x,psm[1],psm[2],psm[3]);      //月球地心向径，黄经，黄纬
  Result:=formatDeg((psm[2]-pss[2])/RD);    //日月视角距
  if Result>315.0 then Result:=Result-360.0;
end;

function TrueT(const MoonK:integer):extended;
   ///////////////////////////////////////////////////////////
   // 计算日月视角距为90×MoonK度的时刻,                    //
   // MooK为月相序数，MoonK＝0对应于J2000之前的第一个朔日   //
   //（1999年12月8日6时31.6分），                           //
   // MoonK mod 4＝0，1，2，3 依次对应于朔，上弦，望和下弦  //
   // 返回的时刻为力学时                                    //
   ///////////////////////////////////////////////////////////
var
  getJD,jd1,L:extended;
  k,i:integer;
begin
  getJD:=MeanT(0.25*moonK);
  k:=MoonK mod 4;
  if k<0 then k:=k+4;
  Result:=FindRoot(DiffSMLong,90.0*k,getJD-1.0,getJD+1.0,1.0e-11); // eps取1.0e-11 时计算2446692.31的望时刻时不收敛
  writeln(tf,floattostr(result-getJD));
end;


function SolarLong(const t:extended):extended;
   /////////////////////////////////
   //计算返回太阳视黄经，单位为度 //
   /////////////////////////////////
var
  i:integer;
  PN:TMatrix;
  eps,lt,lt1:extended;
begin
  De.Ett:=t;
  De.State;
  for i:=1 to 3 do begin
    xb.x[i]:=De.pv[3,i];                   // 太阳地心坐标
    xb.v[i]:=De.pv[3,i+3];
  end;
                                            // 修正光行差
  xb.x:=VComb(xb.x,xb.v,1.0,-VLength(xb.x)/CLight);   
  PN:=PNMatrix(t,false,eps);                // 岁差章动矩阵
  xb.x:=Product(PN,xb.x);                   // 真赤道坐标
  xb.EqToEc(eps);                           // 真黄道坐标
  XyzToRls(xb.x,pss[1],pss[2],pss[3]);      //太阳地心向径，黄经，黄纬
  Result:=FormatDeg(RadToDeg(pss[2]));
end;
function SolarMeanT(const D:extended):extended;
  //////////////////////////////////////////////////
  // 计算并返太阳平黄经为D的时刻，单位为力学时日  //
  //////////////////////////////////////////////////
var
  DL1,t,t1,DL,JT,g,p1,p2:extended;
begin
  DL1:=D-SL0;                //各系数单位为周
  t:=DL1/SLDot;
  t1:=0;
  while abs(t-t1)>1e-8 do begin
    t1:=t;
    JT:=t/36525.0;
    g:=DegToRad((129596581.04-(0.562+0.012*JT)*JT)*JT/3600+357.5291);
    p1:=(6892.745-(17.344+0.052*JT)*JT)/3600;
    p2:=(71.977-0.361*JT)/3600;
    DL:=DL1-3.0361e-4*JT*JT-p1*sin(g)-p2*sin(2*g);
    t:=DL/SLDot;
  end;
  result:=J2000+t;
end;
function SolarTrueT(const SolarT:integer):extended;
   ///**********************************************//
   // 计算太阳黄经为15×SoalrK度的时刻,                         //
   // 入口参数：SolarT，节气序数，0对应于J2000之后的第一个春分日  //
   //           SolarT mod 24＝0，1，..,23     //
   //           依次对应于春分，清明，..,惊蛰节气 //                                 ///
   // 返回值：力学时                                        //
   //***********************************************//                                                        ///
var
  getJD:extended;
  k:integer;
begin
  k:=SolarT mod 24;
  if k<0 then k:=k+24;
  getJD:=SolarMeanT(15.0*SolarT);
  result:=FindRoot(SolarLong,15.0*k,getJD-0.1,getJD+0.1,1.0e-9);
end;

function ShadowCenterDis(const t:extended):extended;
  ////////////////////////////////////////////////////////////////////
  // lunar 为 false 时计算并返回时刻 t 月影中心的地心距离，单位为AU //
  // lunar 为 true 时计算并返回时刻 t 地影中心的月心距离，单位为AU  //
  // 调用前预置单元逻辑变量 lunar                                   //            //
  // 同时置好vs,vm ,rs,vms 各量                                     //
  ////////////////////////////////////////////////////////////////////

var
  normal:TVector;
begin
//  SMECood(t,vs,vm);              // 取太阳和月球的地心向径，已修正光行差
  if lunar then begin
    vs:=VMinus(vs,vm);           // 太阳的月心向径
    vm:=Product(vm,-1.0);        // 地球的月心向径
  end;
  vms:=VMinus(vs,vm);
  rms:=VLength(vms);
  normal:=Product(vms,1.0/rms);    // Bessel 平面法向量
  rs:=Product(vs,normal);          // 太阳至月影中心的距离
  vms:=VComb(vs,normal,1.0,-rs);   // 月影中心的地心向径
  Result:=VLength(vms);
end;

function DiffSMRa(const t:extended):extended;
  ////////////////////////////////////
  //计算并返回太阳和月亮的赤经差    //
  ////////////////////////////////////
var
  PN:TMatrix;
  r,amoon,asun,d,LDiffer,eps:extended;
begin
  SMECood(t,vs,vm);
  xb.x:=vm;
  PN:=PNMatrix(t,false,eps);               // 岁差章动矩阵
  xb.x:=Product(PN,xb.x);                  // 月亮真赤道坐标
  XyzToRls(xb.x,r,amoon,d);                //月亮向径，赤经，赤纬
  if amoon>PI then amoon:=amoon-2*PI;
  xb.x:=vs;
  xb.x:=Product(PN,xb.x);                  //太阳 真赤道坐标
  XyzToRls(xb.x,r,asun,d);                 //太阳向径，赤经，赤纬
  if asun>PI then asun:=asun-2*PI;
  LDiffer:=asun-amoon;
  if LDiffer>=PI then LDiffer:=LDiffer-2*PI;
  if LDiffer<-PI then LDiffer:=LDiffer+2*PI;     //日月赤经差
  Result:=LDiffer;
end;

function JudgeSolarEclipse(var t,fec:extended):integer;
  //////////////////////////////////////////////////////////////
  // 判断时刻t邻近日食的发生及种类                            //
  // 入口时 t 为朔时刻，出口时，t 为日月最小角距的世界时时刻  //
  // 如发生日食，t为食甚时时刻，返回食的类型：                //
  // 1 偏食  2 全食  3 环食                                   //
  // fec 为食分，单元变量 nt 为日月赤经相合时刻，北京时间     //
  // 如无食，返回 0                                           //
  //////////////////////////////////////////////////////////////
var
  d,RUmbra,RPenumbra,c:extended;
begin
  lunar:=false;
                          // 计算月影中心地心距取极小值的时刻,精确至9秒
  d:=GoldMinimum(ShadowCenterDis,t-0.05,t+0.05,1.0e-4,t);
                          //计算本影半径,单位为AU
  RUmbra:=(rs*(1.0-RMoon/RSun)-rms)/
    sqrt((rms/RSun*AU)*(rms/RSun*AU)-(1.0-RMoon/RSun)*(1.0-RMoon/RSun));
                          //计算半影半径,单位为AU
  Result:=0;
  RPenumbra:=(rs*(1.0+RMoon/RSun)-rms)/
    sqrt((rms/RSun*AU)*(rms/RSun*AU)-(1.0+RMoon/RSun)*(1.0+RMoon/RSun));
  if d-REarth/AU<RUmbra then begin
    c:=rs-rms/(1.0-RMoon/RSun);                    // 日影中心至影锥顶点的距离
    if c<=0 then Result:=2 else Result:=3;         // 日全食,日环食
    fec:=(RPenumbra-RUmbra)/(RPenumbra+RUmbra);    // 食分
  end else if d-REarth/AU<RPenumbra then begin
    Result:=1;
    fec:=(RPenumbra-d+REarth/AU)/(RPenumbra+RUmbra);
  end;
  if Result>1 then begin
    nt:=FindRoot(DiffSMRa,0.0,t-0.1,t+0.1,1.0e-6);// 计算赤经相合时刻
    nt:=TDBToUT(nt)-1/6;
    nt:=frac(nt);
  end;
end;

function JudgeLunarEclipse(var t,fec:extended):integer;
  //////////////////////////////////////////////////////////////////
  // 判断时刻t邻近月食的发生及种类                                //
  // 入口时 t 为朔时刻，出口时，t 为地影中心月心距取极小值的时刻  //
  // 如发生月食，t为食甚时时刻，返回食的类型：                    //
  // 4 偏食  5 全食  6 半影食                                     //
  // fec 为食分，                                                 //
  // 如无食，返回 0                                               //
  //////////////////////////////////////////////////////////////////
var
  tt,d,RUmbra,RPenumbra,c:extended;
begin
  lunar:=true;             // 为调用 ShadowCenterDis 预置逻辑变量
                           // 计算地影中心月心距取极小值的时刻，精确至9秒
  d:=GoldMinimum(ShadowCenterDis,t-0.05,t+0.05,1.0e-4,t);
                           //计算本影半径,单位为AU
  RUmbra:=(rms-rs*(1.0-REarth/RSun))/
    sqrt((rms/RSun*AU)*(rms/RSun*AU)-(1.0-REarth/RSun)*(1.0-REarth/RSun));
                           //计算半影半径,单位为AU
  RPenumbra:=(rs*(1.0+REarth/RSun)-rms)/
    sqrt((rms/RSun*AU)*(rms/RSun*AU)-(1.0+REarth/RSun)*(1.0+REarth/RSun));
  Result:=0;
  if d-RMoon/AU<RUmbra then begin
    if d+RMoon/AU<RUmbra then Result:=5 else Result:=4;   // 全食和偏食                                                 // 本影食
    fec:=(RUmbra+RMoon/AU-d)/2.0/RMoon*AU;                // 食分
  end else if d-RMoon/AU<RPenumbra then begin
    Result:=6;                                            // 半影食
    fec:=(RPenumbra+RMoon/AU-d)/2.0/RMoon*AU;
  end;
end;       
}

procedure TForm1.FormCreate(Sender: TObject);
begin
  Date:=TYmd.create;
  Ems:=TEms.Ini;               //初始化Ems对象
  CoorTrans:=TCoorTrans.Ini(nil);
  jd0:=2451545.0;                   //J2000.0
  with Date do begin
    year:=2000;
    month:=1;
    day:=1;
    fday:=0.5;
  end;
  TL:=5;
  PhaseK:=GetPhaseK(jd0);
  SolarK:=GetSolarK(jd0);
end;
{
procedure TForm1.CalcuJd;
  /////////////////////////////////////////////
  // 由年月日框的文本计算并更新儒略日框文本  //
  // 更新节气序数和月相序数                  //
  /////////////////////////////////////////////
var
  d:extended;
  s:string;
begin
  s:=meDate.Text;
  if ch then exit;
  with Date do begin
    year:=StrToInt(trim(copy(s,1,5)));
    month:=StrToInt(trim(copy(s,7,2)));
    d:=StrToFloat(trim(copy(s,10,9)));
    day:=Round(Int(d));
    fday:=d-day;
  end;
  ch:=true;
  Date.DateToJd;
  jd0:=Date.getJD;             // 换算儒略日
  PhaseK:=GetPhaseK(jd0);               // 计算节气序数
  SolarK:=GetSolarK(jd0);           // 计算月相序数
  s:=FloatToStr(jd0);
  if frac(jd0)=0 then s:=s+'.0';
  cbjd.text:=s;
  ch:=false;
end;
}
procedure TForm1.cbJDChange(Sender: TObject);
var
  k:integer;
begin
  // 从儒略日编辑框中读取儒略日字符串并转化为浮点数
  // 如字符串中有非数字字符，k<>0，退出转换
  val(cbJd.text,Date.JD,k);
  if k<>0 then exit;
  //  JD:=StrToFloat(cbJd.text);
  // 转换为年月日
  Date.JdToDate;
  // 转换为字符串送入年月日编辑框
  meDate.Text:=Date.DateToStr;
  jd0:=StrToFloat(cbJD.text);
  SolarK:=GetSolarK(jd0);
  PhaseK:=GetPhaseK(jd0);
end;

procedure TForm1.cbJDExit(Sender: TObject);
  // 将儒略日框的内容存入下拉框
begin
  cbJD.Items.Insert(0,cbJD.text);
end;
{
procedure WriteEclipse(Dir:String);

  // 写日/月食文件
var
  s,s1,s2,x,y,y1,m,m1:string;
  FileEclipse:TextFile;
  i,j,k,yi,L:integer;
const
  Title:string='食   月 日 时 分干支 食分  ';
  Line:String='─────────────────';
begin
  L:=StrToInt(form1.edyears.Text);
  k:=Date.year;
  if k<=0 then begin
    s1:='BC';
    s:='('+s1+IntToStr(-k+L+1)+'-'+s1+IntToStr(-k+2)+')';
  end else begin              
    s1:='AD';
    s:='('+s1+IntToStr(k-L)+'-'+s1+IntToStr(k-1)+')';
  end;

  AssignFile(FileEclipse,Dir+s+'.txt');
  Rewrite(FileEclipse);
  WriteLn(FileEclipse,'');
  s:='  '+s1+'    '+Title;
  WriteLn(FileEclipse,s,s,s);
  WriteLn(FileEclipse,Line,Line,Line);
  with form1.TableEclipse do begin
    DisableControls;
    first;
    i:=1;
    s2:='';
    while not EOf do begin
      yi:=FieldByName('y').AsInteger;
      if yi<=0 then yi:=-(yi-1);
      s:=IntToStr(yi);
      while length(s)<5 do s:=' '+s;
      s:=s+' ';
      s:=s+FieldByName('ECL').AsString+' ';
      s1:=FieldByName('m').AsString;
      if length(s1)=1 then s1:=' '+s1;
      s:=s+s1+' ';
      s1:=FieldByName('d').AsString;
      if length(s1)=1 then s1:=' '+s1;
      s:=s+s1+' ';
      s:=s+FieldByName('BT').AsString;
//      s:=s+JDToGz(FieldByName('ut').Asfloat+1/3);
      s1:=FloatTostr(FieldByName('FC').Asfloat);
      if length(s1)=1 then s1:=s1+'.00';
      if length(s1)<4 then for k:=1 to 4-length(s1)do s1:=s1+'0';
      s:=s+' '+s1+'  ';
      s2:=s2+s;
      if i mod 3=0 then begin
        WriteLn(FileEclipse,s2);
        s2:='';
      end;  
      next;
      inc(i);
    end;
    if i mod 3=0 then WriteLn(FileEclipse,s2);
    EnableControls;
  end;
  CloseFile(FileEclipse);
end;

procedure WriteSyzygy(Dir:string);
  // 写月相文件
var
  s,s1,x,m,m1:string;
  FileSyzygy:TextFile;
  y,y1,i,j0,j,k,sk:integer;
begin
  AssignFile(FileSyzygy,Dir+'月相.txt');
  Rewrite(FileSyzygy);
  WriteLn(FileSyzygy,' ');
  with Form1.TableSyzygy do begin
    DisableControls;
    first;
    y1:=1000000;
    s:='';
    y:=FieldByName('y').AsInteger;
    m:=FieldByName('m').AsString;
    while not EOf do begin            //处理一条记录
      if (y<>y1)then begin            // 处理年起始行
        if s<>'' then begin           // 填充上年末行
          if sk<8 then for k:=sk to 7 do  s:=s+' -- -- ------';
          x:=m1;
          if length(x)=1 then x:=' '+x;
          s:=s+'  '+x+'月';
          WriteLn(FileSyzygy,s);
        end;
        if y<0 then s:='BC'+IntToStr(abs(y)+1)else s:='AD'+InttoStr(y);
        WriteLn(FileSyzygy,s);      //写年标题
        y1:=y;
        if abs(y) mod 2=1 then begin
          s:='月相       朔         上弦          望          下弦          朔          上弦          望          下弦       月相';
          WriteLn(FileSyzygy,s);
        end;
        sk:=0;
        x:=m;
        if length(x)=1 then x:=' '+x;
        s:=x+'月';
        s1:=FieldByName('syzygy').AsString;
        for k:=0 to 3 do if s1=syzygyname[k] then j:=k+1;
        for k:=1 to j-1 do s:=s+' -- -- ------';
        sk:=j-1;
      end;
      if (sk=8)and(s<>'') then begin          // 写一行
        x:=m1;
        if length(x)=1 then x:=' '+x;
        s:=s+' '+x+'月';
        WriteLn(FileSyzygy,s);
        sk:=0;
        x:=m;
        if length(x)=1 then x:=' '+x;
        s:=x+'月';
      end;
      x:=FieldByName('d').AsString;
      if length(x)=1 then x:='  '+x;
      s:=s+x;
      s:=s+' '+FieldByName('BT').AsString;
//      s:=s+JDToGz(FieldByName('ut').Asfloat+1/3);
      sk:=sk+1;
      next;
      if EOF then begin
          if sk<8 then for k:=sk to 7 do  s:=s+' -- -- ------';
          WriteLn(FileSyzygy,s);
      end else begin
        m1:=m;
        m:=FieldByName('m').AsString;
        y:=FieldByName('y').AsInteger;
        s1:=FieldByName('syzygy').AsString;
        for k:=0 to 3 do if s1=syzygyname[k] then j:=k+1;
      end;
    end;
    EnableControls;
  end;
  CloseFile(FileSyzygy);
end;

procedure WriteSolarTerm(Dir:string);
  // 写节气文件
var
  s,s1,m,m1,x:string;
  FileSt:TextFile;
  y,y1,i,j,k:integer;
const
  NumberPerLine=6;
begin
  AssignFile(FileSt,Dir+'节气.txt');
  Rewrite(FileSt);
  WriteLn(FileSt,'');
  with Form1.TableSt do begin
    DisableControls;
    first;
    y1:=100000;
    s:='';
    s1:='';
    y:=FieldByName('y').AsInteger;
    while not EOf do begin
      if y1<>y then begin
        y1:=y;
        WriteLn(FileSt,s);
        if y>0 then s:='AD '+IntToStr(y) else s:='BC '+IntToStr(abs(y-1));
        WriteLn(FileSt,s);
        j:=0;                     //每行节气数置初值
        s:='';
      end;
      if j=NumberPerLine then begin           //控制每行节气数
        j:=0;
        WriteLn(FileSt,s);
        s:='';
      end;
      if j>0 then s:=s+' ';
      s:=s+FieldByName('STN').AsString+' ';
      x:=FieldByName('m').AsString;
      if length(x)=1 then x:=' '+x;
      s:=s+x;
      x:=FieldByName('d').AsString;
      if length(x)=1 then x:=' '+x;
      s:=s+' '+x+' '+FieldByName('BT').AsString;
//      s:=s+' '+JDToGz(FieldByName('UT').Asfloat+1/3);
      next;
      if EOF then begin
        WriteLn(FileSt,s);
      end else begin
        j:=j+1;
        y:=FieldByName('y').AsInteger;
      end;
    end;
    enablecontrols;
  end;
  CloseFile(FileSt);
end;
}
  //********************************************//
  // 检查jd0和TL给定的日期是否在可处理范围内    //
  // 如在范围内，返回 true 否则 返回 false并提示//
  //********************************************//
function TForm1.CheckDate:boolean;
var
  getJD:real;
begin
  getJD:=jd0+365.25*(TL+0.03);
  Result:=true;
  if (getJD<2415020.5)or(getJD>2488076.5) then begin
    showmessage('所给日期越界，请重新输入。');
    Result:=false;
  end;
end;
{
procedure TForm1.tbSolarEclipse1Click(Sender: TObject);
  //处理日食计算
var
  jd1,jd0,jdu1,fec,LDiffer,temp:extended;
  ymd,ymdl:TYMD;
  k,ec:integer;
  mr,sr:TVector;
  s:string;
begin
  if not CheckDate then exit;
  if L<>0 then begin
    with TableEclipse do while not (EOF and BOF) do delete;
    jd0:=Ems.t;
    TableEclipseNT.Visible:=true;
  end ;

  statusbar1.panels[3].Text:='';
  Repeat
    while MoonK mod 4<>0 do if forwd then Inc(MoonK) else Dec(MoonK);
    repeat
      getJD:=PhaseT(MoonK);                      //朔时刻
      ec:=JudgeSolarEclipse(getJD,fec);         // 检查日食及其类型
      if forwd then MoonK:=MoonK+4 else MoonK:=MoonK-4;
    until ec>0;
    jdu:=TDBToUT(getJD);
    ymd:=JDToYmd(jdu+1/3);     //东经120度标准时
    jd1:=getJD;
    if L<>0 then with TableEclipse do begin
      append;
      FieldByName('ECL').asstring:=ecName[ec-1];
      FieldByName('UT').asfloat:=jdu;
      FieldByName('Y').asInteger:=ymd.year;
      FieldByName('M').asInteger:=ymd.month;
      FieldByName('D').asfloat:=ymd.day;
      FieldByName('BT').asString:=DayToHms(ymd.fday,false);
      s:=FloatTostr(RoundTo(fec,-3));
      if length(s)<5 then for k:=length(s)+1 to 5 do s:=s+'0';
      FieldByName('FC').asString:=s;
      if (ec=2)or(ec=3)then FieldByName('NT').asString:=DayToHms(nt,false);  //赤经相合时刻
      post;
    end else begin
      with ymd do statusbar1.panels[0].Text:='食甚 '+IntToStr(year)+' '+IntToStr(month)+' '
              +IntToStr(day)+' '+DayToHms(fday,false);
      statusbar1.panels[1].Text:=ecName[ec-1];
      statusbar1.panels[2].Text:='食分 '+FloatToStr(RoundTo(fec,-2));
      if (ec=2)or(ec=3)then statusbar1.panels[3].Text:='赤经相合 '+DayToHms(nt,false)
      else  statusbar1.panels[3].Text:='';
    end;
  until (L=0)or(abs(jdu-jd0)>365.25*(abs(L)+0.03));
  if L<>0 then begin
    s:=meymd.Text;
    k:=StrtoInt(copy(s,1,5))+L ;            //  更新年月日
    meymd.Text:=IntToStr(k)+copy(s,6,13);
    meymdExit(Self);
    if CheckBox2.Checked then WriteEclipse('..\文件\日食\');
  end;
end;

procedure TForm1.tbLunarEclipseClick(Sender: TObject);
  // 处理月食计算
var
  getJD,jd0,jdu,jd1,fec:extended;
  ymd:TYMD;
  k,ec:integer;
  mr,sr:TVector;
  s:string;
begin
  if not CheckDate then exit;
  if L<>0 then begin
    jd0:=De.Ett;
    TableEclipseNT.Visible:=false;
    with TableEclipse do while not (EOF and BOF) do delete;
  end;
  statusbar1.panels[3].Text:='';
  Repeat
    while (MoonK-2) mod 4<>0 do if forwd then Inc(MoonK) else Dec(MoonK);
    repeat
      getJD:=TrueT(MoonK);         //望时刻
      ec:=JudgeLunarEclipse(getJD,fec);
      if forwd then MoonK:=MoonK+4 else MoonK:=MoonK-4;
    until ec>0;
    jdu:=TDBToUT(getJD);
    ymd:=JDToYmd(jdu+1/3);     //东经120度标准时
    if L<>0 then with TableEclipse do begin
      append;
      FieldByName('ECL').asstring:=ecname[ec-1];
      FieldByName('UT').asfloat:=jdu;
      FieldByName('Y').asInteger:=ymd.year;
      FieldByName('M').asInteger:=ymd.month;
      FieldByName('D').asfloat:=ymd.day;
      FieldByName('BT').asString:=DayToHms(ymd.fday,false);
      s:=FloatTostr(RoundTo(fec,-3));
      if length(s)<5 then for k:=length(s)+1 to 5 do s:=s+'0';
      FieldByName('FC').asString:=s;
     post;
    end else begin
      with ymd do statusbar1.panels[0].Text:='食甚 '+IntToStr(year)+' '+IntToStr(month)+' '
              +IntToStr(day)+' '+DayToHms(fday,false);
      statusbar1.panels[1].Text:=ecName[ec-1];
      statusbar1.panels[2].Text:='食分 '+FloatToStr(RoundTo(fec,-2));
       statusbar1.panels[3].Text:='';
    end;
  until (L=0)or(abs(jdu-jd0)>365.25*(abs(L)+0.03));
  if L<>0 then begin
    s:=meymd.Text;
    k:=StrtoInt(copy(s,1,5))+L ;            //  更新年月日
    meymd.Text:=IntToStr(k)+copy(s,6,13);
    meymdExit(Self);
    if CheckBox2.Checked then WriteEclipse('..\文件\月食\');
  end;
end;
}
//**************************************//
// 处理月相计算                         //
// 入口参数：SoalrK，节气序数           //
//**************************************//
procedure TForm1.tbPhaseClick(Sender: TObject);
var
  d,dt:extended;
  k:integer;
  s:string;
begin
  // 检查并处理日期越界
  if not CheckDate then exit;
  if TL<>0 then begin
    // 连续计算模式，设置数据库组件属性，清月相数据表
    DSource1.DataSet:=TablePhase;
    TablePhase.Active:=true;
    with DSource1.DataSet as TTable do while not (EOF and BOF) do delete;
  end;
  Repeat
    // 处理一个月相
    // 计算序数为PhaseK的月相
    d:=PhaseT(PhaseK);
    // 化为东经120度标准时
    Date.getJD:=TTToUTC(d,dt)+1.0/3.0;
    // 化为年月日
    Date.JDToDate;
    // 计算月相序数主值
    k:=PhaseK mod 4;
    if k<0 then k:=k+4 ;
    if TL<>0 then with TablePhase do begin
      // 连续计算模式，数据写入月相数据库
      append;
      FieldByName('PhSN').asString:=SyzygyName[k];
      FieldByName('UT').asfloat:=d;
      FieldByName('Y').asInteger:=Date.year;
      FieldByName('M').asInteger:=Date.month;
      FieldByName('D').asfloat:=Date.day;
      FieldByName('BT').asString:=DayToHms(Date.fday,true);
      post;
    end else begin
      // 离散计算模式，数据写入状态条
      with Date do statusbar1.panels[0].Text:=IntToStr(year)+' '
        +IntToStr(month)+' '+IntToStr(day)+' '+DayToHms(fday,false);
      statusbar1.panels[1].Text:=syzygyName[k];
      statusbar1.panels[2].Text:='';
      statusbar1.panels[3].Text:='';
    end;
    // 修改月相序数
    if TL>=0 then PhaseK:=PhaseK+1 else PhaseK:=PhaseK-1;
    // 结束循环的条件：1. 离散模式，2. 日期越出时间区间
  until (TL=0)or(abs(Date.getJD-jd0)>365.25*(abs(TL)+0.03));
  if TL<>0 then begin
    // 连续模式时更新meData和cbJD框的日期数字
    s:=meDate.Text;
    k:=StrtoInt(copy(s,1,5))+TL ;
    meDate.Text:=IntToStr(k)+copy(s,6,13);
    meDateExit(Self);
  end;
end;
//**************************************//
// 处理节气计算                         //
// 入口参数：SoalrK，节气序数           //
//           forward                    //
//**************************************//
procedure TForm1.tbSolarTermClick(Sender: TObject);
var
  d,dt:extended;
  k:integer;
  s:string;
begin
  // 检查并处理日期越界
  if not CheckDate then exit;
  if TL<>0 then begin
    // 连续计算模式，设置数据库组件属性，清节气数据表
    DSource1.DataSet:=TableSt;
    TableSt.active:=true;
    with DSource1.DataSet as TTable do while not (EOF and BOF) do delete;
  end;
  Repeat
    // 处理一个节气
    // 计算序数为SolarK的节气
    d:=SolarTrueT(SolarK);
    // 化为东经120度标准时
    Date.getJD:=TTToUTC(d,dt)+1/3;
    // 化为年月日
    Date.JDToDate;
    // 计算节气序数主值
    k:=SolarK mod 24;
    if k<0 then k:=k+24 else k:=k;
    if TL<>0 then with TableSt do begin
      // 连续计算模式，数据写入节气数据库
      append;
      FieldByName('STN').asstring:=SolarTermName[k];
      FieldByName('UT').asfloat:=d;
      FieldByName('Y').asInteger:=Date.year;
      FieldByName('M').asInteger:=Date.month;
      FieldByName('D').asfloat:=Date.day;
      FieldByName('BT').asString:=DayToHms(Date.fday,true);
      post;
    end else begin
      // 离散计算模式，数据写入状态条
      with Date do statusbar1.panels[0].Text:=IntToStr(year)+' '
      +IntToStr(month)+' '+IntToStr(day)+' '+ DayToHms(fday,true);
      statusbar1.panels[1].Text:=SolarTermName[k];
      statusbar1.panels[2].Text:='';
      statusbar1.panels[3].Text:='';
    end;
    // 修改节气序数
    if TL>=0 then SolarK:=SolarK+1 else SolarK:=SolarK-1;
    // 结束循环的条件：1. 离散模式，2. 日期越出时间区间
  until (TL=0)or(abs(d-jd0)>365.25*(abs(TL)+0.1));
  if TL<>0 then begin
    // 连续模式时更新meData和cbJD框的日期数字
    s:=meDate.Text;
    k:=StrtoInt(copy(s,1,5))+TL ;
    meDate.Text:=IntToStr(k)+copy(s,6,13);
    meDateExit(Self);
  end;
end;


procedure TForm1.cbJDKeyPress(Sender: TObject; var Key: Char);
begin
  if not(key in ['0'..'9','.',#8])then begin
    key:=#0;
    beep;
  end;  
end;

procedure TForm1.meDateKeyPress(Sender: TObject; var Key: Char);
begin
  if not (key in['0'..'9','.','-',#8])then begin
    key:=#0;
    Beep;
  end;
end;

procedure TForm1.meDateExit(Sender: TObject);
var
  w:integer;
begin
  // 从日期编辑框中读入数据并分离年月日和日小数，分别写入Tymd记录的对应分量并返回
  Date.StrToDate(meDate.text,w);
  // 转换为儒略日并输出到儒略日编辑框
  Date.DateToJd;
  cbJd.text:=FloatToStr(Date.getJD);
  if pos('.',cbJd.text)=0 then cbJd.text:=cbJd.text+'.0';
  jd0:=Date.getJD;
  SolarK:=GetSolarK(jd0);
  PhaseK:=GetPhaseK(jd0);
end;

procedure TForm1.edYearsChange(Sender: TObject);
var
  s:string;
begin
  s:=edyears.Text;
  TL:=StrToInt(s);
end;

{
function DisShadow(const t:extended;half:boolean):extended;
  // 计算测站至月影边缘的距离,单位为km，入口量为力学时，地理经度，纬度
var
  tu,x,lms,snf1,snf2,r,lsc,JD,UT:extended;
  rs,rm,ro,rms,vn,vs,vshadow:TVector;
begin
  SMECood(t,rs,rm);                    // 日月地心坐标,太阳坐标已修正光行差
  JD:=int(t)+0.5;
  UT:=TDBToUT(t)-JD;
  if UT<0 then begin
    JD:=JD-1.0;
    UT:=UT+1.0;
  end;
  ro:=StationPos(JD,UT,lamda,fei);     //测站地心坐标
  rms:=VMinus(rs,rm);
  lms:=VLength(rms);
  snf1:=(rsun+rmoon)/lms/au;
  snf2:=(rsun-rmoon)/lms/au;
  vn:=VUnit(rms);                       // Bessel 平面法向量
  rs:=VMinus(rs,ro);
  rm:=VMinus(rm,ro);                    // 测站为原点
  x:=product(rs,vn);
  vshadow:=VComb(rs,vn,1.0,-x);          //月影中心的向径
  lsc:=VLength(vshadow)*au;               // 测站至月影中心的距离,km
  l1:=((x-lms)*snf1*au+rmoon)/sqrt(1-snf1*snf1);   //月亮半影半径,km
  l2:=((x-lms)*snf2*au-rmoon)/sqrt(1-snf2*snf2);   //月亮本影半径,km
  l2:=abs(l2);
  if Half then Result:=lsc-l1 else Result:=lsc-l2;
end;

procedure FindTime(const t1,t2,y1,y2:extended;half:boolean);
var
  y:extended;
begin
  ftime:=(t1+t2)/2.0;
  y:=DisShadow(ftime,half);
  if (abs(ftime-t1)<1e-8)or(abs(y)<1e-5)then exit;
  if y*y1<0 then FindTime(t1,ftime,y1,y,half)
  else  FindTime(ftime,t2,y,y2,half);
end;

procedure FindMindis( a,b:extended;var ts,xs:extended);
var
  t,dt,x,u,ux,uy:real;
begin
  if a>b then begin
    u:=a;
    a:=b;
    b:=u;
  end;
  dt:=(b-a)/10.0;
  t:=a-dt;
  repeat
    t:=t+dt;
    u:=Disshadow(t,false);
    if u<xs then begin
      xs:=u;
      ts:=t;
    end;
  until t>=b;
  if (b-a)>=1e-6 then findMinDis(ts-dt,ts+dt,ts,xs);
end;
}
procedure TForm1.edYearsKeyPress(Sender: TObject; var Key: Char);
begin
  if not (Key in ['0'..'9','-',#8]) then Key:=#0;
end;


end.

// 2003年6月18日修改版
// BaseOper单元增加 FindRoot和 GoldMinimum函数，各量用此两函数计算
// 太阳和月亮坐标直接读出地心坐标，日月食改用向量法计算
// 2003 年 7 月 2日 完成优化


procedure TForm1.tbSolarTermClick(Sender: TObject);
  // 处理节气计算
var
  getJD,jd0,jdu,jd1:extended;
  ymd:TYMD;
  k:integer;
  mr,sr:TVector;
  s:string;
begin
  if not CheckDate then exit;
  if L<>0 then begin
    DSource.DataSet:=TableSt;
    TableSt.active:=true;
    with DSource.DataSet as TTable do while not (EOF and BOF) do delete;
    jd0:=De.Ett;
  end;
  Repeat
    getJD:=SolarTrueT(SolarK);
    jdu:=TDBToUT(getJD);
    ymd:=JDToYmd(jdu+1/3);     //东经120度标准时
    k:=SolarK mod 24;
    if k<0 then k:=k+24 else k:=k;
    if L<>0 then with TableSt do begin
      append;
      FieldByName('STN').asstring:=SolarTermName[k];
      FieldByName('UT').asfloat:=jdu;
      FieldByName('Y').asInteger:=ymd.year;
      FieldByName('M').asInteger:=ymd.month;
      FieldByName('D').asfloat:=ymd.day;
      FieldByName('BT').asString:=DayToHms(ymd.fday,false);
      post;
    end else begin
      with ymd do statusbar1.panels[0].Text:=IntToStr(year)+' '+IntToStr(month)+' '
              +IntToStr(day)+' '+DayToHms(fday,false);
      statusbar1.panels[1].Text:=SolarTermName[k];
      statusbar1.panels[2].Text:='';
      statusbar1.panels[3].Text:='';
    end;
    if forwd then SolarK:=SolarK+1 else SolarK:=SolarK-1;
  until (L=0)or(abs(jdu-jd0)>365.25*(abs(L)+0.1));
  if L<>0 then begin
    s:=meymd.Text;
    k:=StrtoInt(copy(s,1,5))+L ;            //  更新年月日
    meymd.Text:=IntToStr(k)+copy(s,6,13);
    meymdExit(Self);
    if CheckBox2.Checked then WriteSolarTerm('..\文件\节气\');
  end;
end;


procedure TForm1.ToolButton1Click(Sender: TObject);
                    // 给定测站坐标计算日食
const
  vms=360198.4;     //  月影速度，km/day
var
  JD,UT,t,t1,t2,x1,x2,ts,te,tfull,tfulls,tfulle,fc:extended;
  fs:TextFile;
  s:string;
  Ymd:TYmd;
begin
{  fei:=-15.41666667; //地理纬度
  lamda:=28.2833333; //地理经度
  fei:=31.241388889; //地理纬度 上海国际会议中心
  lamda:=121.4916667; //地理经度
  fei:=31.239444444; //地理纬度 上海人民广场
  lamda:=121.4691667; //地理经度
  fei:=43.783333333; //地理纬度 乌鲁木齐
  lamda:=87.6166667; //地理经度
  h:=1893.3;                        }
  fei:=25.033333333; //地理纬度 昆明
  lamda:=102.7166667; //地理经度
  h:=912.6;
  t2:=2444285.87;
  x2:=DisShadow(t2,true);
  x1:=x2;
  while x1*x2>0 do begin
    x1:=x2;
    t1:=t2;
    t2:=t2+x2/vms;
    x2:=DisShadow(t2,true);
  end;
  findtime(t1,t2,x1,x2,true);     //初亏
  ts:=TDBToUT(ftime);
  t2:=2444285.926;
  x2:=DisShadow(t2,false);
  x1:=x2;
  while x1*x2>0 do begin
    x1:=x2;
    t1:=t2;
    t2:=t2+x2/vms;
    x2:=DisShadow(t2,false);
  end;
  findtime(t1,t2,x1,x2,false);     //全食始
  tfulls:=TDBToUT(ftime);
  t2:=ftime+1e-5;
  x2:=DisShadow(t2,false);
  x1:=x2;
  while x1*x2>0 do begin
    x1:=x2;
    t1:=t2;
    t2:=t2-x2/vms;
    x2:=DisShadow(t2,false);
  end;
  findtime(t1,t2,x1,x2,false);
  tfulle:=TDBToUT(ftime);    // 全食终
  t2:=ftime;
  x2:=DisShadow(t2,true);
  x1:=x2;
  while x1*x2>0 do begin
    x1:=x2;
    t1:=t2;
    t2:=t2-x2/vms;
    x2:=DisShadow(t2,true);
  end;
  findtime(t1,t2,x1,x2,true);     //复圆
  te:=TDBToUT(ftime);
  x1:=0;
  FindMindis(tfulls,tfulle,ftime,x1);
  tfull:=TDBToUT(ftime);    // 食甚
  fc:=(l1+l2)/(l1-l2);
  assignfile(fs,'日食时刻.txt');
  Rewrite(fs);
  WriteLn(fs,' ');
  Ymd:=JDToYmd(ts);
  with ymd do s:=IntToStr(year)+' '+IntToStr(month)+' '
              +IntToStr(day);
  WriteLn(fs,s);
  s:=DayToHms(ymd.fday,true);
  WriteLn(fs,'初亏   '+s);
  Ymd:=JDToYmd(tfulls);
  with ymd do s:=DayToHms(fday,true);

  WriteLn(fs,'全食始   '+s);
  Ymd:=JDToYmd(tfull);
  with ymd do s:=DayToHms(fday,true);

  WriteLn(fs,'食甚   '+s);
  Ymd:=JDToYmd(tfulle);
  with ymd do s:=DayToHms(fday,true);

  WriteLn(fs,'全食终   '+s);
  Ymd:=JDToYmd(te);
  with ymd do s:=DayToHms(fday,true);

  WriteLn(fs,'复圆   '+s);
  WriteLn(fs,'食分   '+FloatTostr(RoundTo(fc,-3)));

  closeFile(fs);
end;
// 修改记录域对齐设置
// Project|Options 菜单项，Compiler 页，Code generation 栏
// Record field alignment 框置值为 1
