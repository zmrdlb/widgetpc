/**
 * @fileoverview 常用正则表达式
 * @version 1.0 | 2017-01-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * */
 define({
     /**
     * 是否为Email
     * @param {String} agr1
     * @return {boolean} flag
     */
    isEmail: function (text) {
      var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return reg.test(text);
    },

    /**
     * 是否为合法手机号
     * @param {string}  text
     * @returns {boolean}
     */
    isMobile: function (text) {
      var reg = /^(1[2-8][0-9])\d{8}$/;
      return reg.test(text);
    },
    /**
     * 是否为中文字符
     * @param {string}  text
     * @returns {boolean}
     */
    isChinese: function (text) {
      var reg = /^[\u4e00-\u9fff]{0,}$/;
      return reg.test(text);
    },

    /**
     * 是否为英文字符
     * @param {string}  text
     * @returns {boolean}
     */
    isEnglish: function (text) {
      var reg = /^[A-Za-z]+$/;
      return reg.test(text);
    },
    /**
     * 是否为合法身份证有效证
     * @param {String} text
     * @returns {boolean} flag
     */
    isIdcard: function (str) {
        return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(str);
    },

    /**
     * 是否为合法Url
     * @param {String} target
     * @returns {boolean} flag
     */
    isUrl: function (target) {
      return /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(target);
    },

    /**
     * 判断银行卡号是否正确
     * @param cardNumber {String} or {Number}
     * @returns {boolean} flag
     */
     isCardno: function (cardNumber) {
        return /^(\d{16}|\d{18,19})$/.test(cardNumber);
     }
 });
