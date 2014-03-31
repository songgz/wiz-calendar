var Lunisolar  = (function (global) {
    "use strict";
    var i18n = global.I18n = global.I18n || {};
    var localize = {};
    /*
     * i18n setting
     */
    i18n.set = function (options) {
        localize = options;
    };

    /*
     * Core of the strings replace

     * String without variables.
     * i18n._('Hellow World');
     * return 您好世界！

     * String with variables.
     * i18n._('Hello %1, Nice to meet you', 'John');
     * return 你好 John, 很高興認識你

     * i18n._('My name is %1, I\'m %2 years old', 'Mary', 15);
     * return 我的名字是 Mary, 我今年 15 歲
     */
    i18n.t = function (string) {
        try {
            string = string.toString() || '';
            var args = arguments,
                pattern = (args.length > 0) ? new RegExp('%([1-' + args.length.toString() + '])', 'g') : null,
                str = localize.hasOwnProperty(string) ? localize[string] : string;
            return String(str).replace(pattern, function (match, index) { return args[index]; });
        } catch (ignore) {
            console.dir(ignore.message);
        }
    };

    return global
})(Lunisolar || {});