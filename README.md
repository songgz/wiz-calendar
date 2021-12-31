WizCalendar（巫师万年历）
===
巫师万年历是一款采用天文算法实现的高精度万年历模块。提供了简便易用的API，清晰易读的面向对像代码设计，可以很容易地开发一个万年历和进行历法研究。
主要参考了寿星万年历。

### 如何使用：
同时支持javascript和typescript两种语言。
1. 通过npm安装
   ```
   > npm i wiz-calendar
   ```
2. 导入模块

   javascript导入方式：
   ```typescript
   const {SolarDate, LunarDate, JulianDate} = require("wiz-calendar");
   ```
   
   typescript导入方式：
   ```typescript
   import {SolarDate, LunarDate, JulianDate} from 'wiz-calendar';
   ```
### 基本用法：
1. 阳历转阴历
    ```typescript
   let solar = new SolarDate(1977, 5, 18);
   let lunar: LunarDate = solar.getLunarDate();
   lunar.format('formatDate'); //1977-04-01+0
    ```
2. 阴历转阳历
   ```typescript
   let lunar = new LunarDate(1977,4,1);
   let solar: SolarDate = lunar.getSolarDate(); 
   solar.format('formatDate'); //1977-05-18
    ```
3. 阳历转儒略日
    ```typescript
   let solar = new SolarDate(1977, 5, 18);
   let julian: JulianDate = solar.getJulianDate(); 
   julian.jd(); //2443282
    ```
4. 阴历转儒略日
    ```typescript
   let lunar = new LunarDate(1977, 4, 1, 12);
   let julian: JulianDate = lunar.getJulianDate(); 
   julian.jd(); //2443282
    ```
5. 儒略日转阳历
    ```typescript
    let mjd = 5225.942824074067; //J2000算起的儒略日
    let julian = new JulianDate();
    let solar: SolarDate = julian.getSolarDate();
    solar.format('datetime'); //2014-04-23 10:37:40
    ```
6. 儒略日转阴历
   ```typescript
   let mjd = -8263; //J2000算起的儒略日
   let julian = new JulianDate(mjd);
   let lunar: LunarDate = julian.getLunarDate();
   lunar.format('datetime'); //1977-04-01+0 12:00:00
    ```
7. 获取二十四节气
   ```typescript
   let lunar = new LunarDate(1977,4,1);
   let julian: JulianDate = lunar.getSolarTerm(SolarTermName.WinterSolstice);
   ```
8. 阴历干支纪历
   ```typescript
   let lunar = new LunarDate(1977,4,1);
   lunar.getYearStem() + lunar.getYearBranch(); //丁巳
   lunar.getMonthStem() + lunar.getMonthBranch(); //乙巳
   lunar.getDayStem() + lunar.getDayBranch(); //乙亥
   ```
9. 获取命理八字
   ```typescript
   //2014-4-23 10:37:40   
   //甲午年 戊辰月 甲子日 己巳时 真太阳 10:24:48
   let eight = new EightChar(5225.942824074067);
   eight.getYear(); //甲午
   eight.getMonth(); //戊辰
   eight.getDay(); //甲子
   eight.getHour(); //己巳
   ```
10. 其它略

