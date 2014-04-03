Lunisolar.I18n.set({
    "shortMonths": ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"],
    "longMonths": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    "shortDays": ["日", "一", "二", "三", "四", "五", "六"],
    "longDays": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
});

//Date.prototype.format = function (format) {
//    var returnStr = '', replace = Date.replaceChars, curChar = '';
//    replace.reload();
//    for (var i = 0; i < format.length; i++) {
//        curChar = format.charAt(i);
//        returnStr += (replace[curChar] ? replace[curChar].call(this) : curChar)
//    }
//    return returnStr
//};
//
//Date.replaceChars = {reload: function () {
//    Date.replaceChars.shortMonths = localize.hasOwnProperty('shortMonths') ? localize.shortMonths : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//    Date.replaceChars.longMonths = localize.hasOwnProperty('longMonths') ? localize.longMonths : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//    Date.replaceChars.shortDays = localize.hasOwnProperty('shortDays') ? localize.shortDays : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//    Date.replaceChars.longDays = localize.hasOwnProperty('longDays') ? localize.longDays : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
//}, shortMonths: [], longMonths: [], shortDays: [], longDays: [], d: function () {
//    return(this.getUTCDate() < 10 ? '0' : '') + this.getUTCDate()
//}, D: function () {
//    return Date.replaceChars.shortDays[this.getUTCDay()]
//}, j: function () {
//    return this.getUTCDate()
//}, l: function () {
//    return Date.replaceChars.longDays[this.getUTCDay()]
//}, N: function () {
//    return this.getDay() + 1
//}, S: function () {
//    return(this.getUTCDate() % 10 === 1 && this.getUTCDate() !== 11 ? 'st' : (this.getUTCDate() % 10 === 2 && this.getUTCDate() !== 12 ? 'nd' : (this.getUTCDate() % 10 == 3 && this.getUTCDate() != 13 ? 'rd' : 'th')))
//}, w: function () {
//    return this.getUTCDay()
//}, z: function () {
//    return''
//}, W: function () {
//    return''
//}, F: function () {
//    return Date.replaceChars.longMonths[this.getUTCMonth()]
//}, m: function () {
//    return(this.getUTCMonth() < 9 ? '0' : '') + (this.getUTCMonth() + 1)
//}, M: function () {
//    return Date.replaceChars.shortMonths[this.getUTCMonth()]
//}, n: function () {
//    return this.getUTCMonth() + 1
//}, t: function () {
//    return''
//}, L: function () {
//    return''
//}, o: function () {
//    return''
//}, Y: function () {
//    return this.getUTCFullYear()
//}, y: function () {
//    return('' + this.getUTCFullYear()).substr(2)
//}, a: function () {
//    var set = localize.hasOwnProperty('setting') ? localize.setting : setting;
//    return this.getUTCHours() < 12 ? set.AM : set.PM
//}, A: function () {
//    var set = localize.hasOwnProperty('setting') ? localize.setting : setting;
//    return this.getUTCHours() < 12 ? set.AM : set.PM
//}, B: function () {
//    return''
//}, g: function () {
//    return this.getUTCHours() % 12 || 12
//}, G: function () {
//    return this.getUTCHours()
//}, h: function () {
//    return((this.getUTCHours() % 12 || 12) < 10 ? '0' : '') + (this.getUTCHours() % 12 || 12)
//}, H: function () {
//    return(this.getUTCHours() < 10 ? '0' : '') + this.getUTCHours()
//}, i: function () {
//    return(this.getUTCMinutes() < 10 ? '0' : '') + this.getUTCMinutes()
//}, s: function () {
//    return(this.getUTCSeconds() < 10 ? '0' : '') + this.getUTCSeconds()
//}, e: function () {
//    return''
//}, I: function () {
//    return''
//}, O: function () {
//    return(-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'
//}, T: function () {
//    var m = this.getUTCMonth();
//    this.setMonth(0);
//    var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1');
//    this.setMonth(m);
//    return result
//}, Z: function () {
//    return-this.getTimezoneOffset() * 60
//}, c: function () {
//    return''
//}, r: function () {
//    return this.toString()
//}, U: function () {
//    return this.getUTCTime() / 1000
//}};
//
