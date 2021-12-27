WizCalendar（巫师万年历）
===
主要参考许剑伟的寿星万年历，构造易用的万年历代码库。

基本用法：
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
    let julian = new JulianDate(2456770.942824074);
    let solar: SolarDate = julian.getSolarDate();
    solar.format('datetime'); //2014-04-23 10:37:40
    ```
6. 儒略日转阴历
   ```typescript
   let julian = new JulianDate(2443282);
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
   let eight = new EightChar(2456770.942824074);
   eight.getYear(); //甲午
   eight.getMonth(); //戊辰
   eight.getDay(); //甲子
   eight.getHour(); //己巳
   ```
10. 其它略

