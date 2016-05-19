/**
 * @fileoverview 通用字符串截取组件，适用于含双字节字符的字符串截取并添加自定义后缀。
 * @version 1.0.0 | 2015-10-27 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 方法
 * @example
 *   requirejs(['libbase/getSubStr'],function($getSubStr){
    	$getSubStr('我想回家',7); //执行结果输出：我想...
    	$getSubStr('我想回家',8); //执行结果输出：我想回家
     });
 */
define(['libbase/bLength','libbase/leftB','libbase/checkDataType'], function($bLength,$leftB,$checkDataType) {
  /**
   * 字符串截取，并添加指定后缀，默认是...
   * @param {String} *str 待截取的字符串
   * @param {Number} *len 整数，总共显示几个字符，包含suffix的字符数
   * @param {String} suffix 后缀，默认是...
   * @param {Function} callback(rnum) rnum:实际截取后的字符串里面包含的字节数
   * @return 截取后字符串
   */
  return function(str, len, suffix, callback) {
  	if(arguments.length < 2 || !$checkDataType.isString(str) || !$checkDataType.isNumber(len) || len <= 0){
  		return '';
  	}
  	
    var resultStr = str;
    len = Math.floor(len);
    suffix = !$checkDataType.isString(suffix)? '...': suffix;
    var suffixBufferLen = $bLength(suffix);
    if (suffixBufferLen >= len) {
    	throw new Error('[getSubStr]: suffix is too long.');
  	}
  	var rnum = $bLength(str); //截取后实际的字节数
  	if (rnum > len) {
    	resultStr = $leftB(str, len - suffixBufferLen, function(num){
    	    rnum = num;
    	}) + suffix;
 	}
 	if($checkDataType.isFunction(callback)){
        callback(rnum);
    }
    return resultStr;
  };
});