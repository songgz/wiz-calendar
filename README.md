WizCalendar（巫师万年历）
===
高精度，长跨度的万年历，易用的API。

基本用法：
1. 阳历转阴历
    ```typescript
   let solar = new SolarDate(1977, 5, 18);
   let lunar = solar.getLunarDate();
   lunar.format('date'); //1977-04-01
    ```
2. 阴历转阳历
   ```typescript
   let lunar = new LunarDate(1977,4,1);
   let solar = lunar.getSolarDate(); 
   solar.format('date'); //1977-05-18
    ```
3. 阳历转儒略日
    ```typescript
   let solar = new SolarDate(1977, 5, 18);
   let julian = solar.getJulianDate(); 
   julian.jdTT(); //2443282
    ```
4. 阴历转儒略日
    ```typescript
   let lunar = new LunarDate(1977, 4, 1, 12);
   let julian = lunar.getJulianDate(); 
   julian.jdTT(); //2443282
    ```
5. 儒略日转阳历
    ```typescript
    let julian = JulianDate.fromJdTT(2456770.942824074);
    let solar = julian.getSolarDate();
    solar.format('datetime'); //2014-04-23 10:37:40
    ```
6. 儒略日转阴历
   ```typescript
   let julian = JulianDate.fromJdTT(2443282);
   let lunar = julian.getLunarDate();
   lunar.format('datetime'); //1977-04-01 12:00:00
    ```
7. 其它略

