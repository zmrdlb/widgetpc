/**
 * @fileoverview 字符串截取，一个中文2个字节
 * @version 1.0.0 | 2015-10-27 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 方法
 * @example
 *   requirejs(['libbase/bLength'],function($bLength){
    	$bLength('我aa到底占用多少个字节');
     });
 */
define(['libstr/bLength','libbase/checkDataType'],function($bLength,$checkDataType){
    /**
     * @param {String} *str 待截取的字符串
     * @param {Number} *lens 字节数
     * @param {Function} callback(rnum) rnum:实际截取后的字符串里面包含的字节数
     * @return 截取后字符串
     */
	return function(str, lens, callback){
		if(arguments.length < 2 || lens < 0){
			return '';
		}else if($bLength(str) <= lens){
			return str;
		}else{
			//将*替换成空格，将占用2个字符的汉字替换成**，并赋值给变量s
			var s = str.replace(/\*/g, ' ').replace(/[^\x00-\xff]/g, '**');
			/**
			 * 1. 变量s截取指定字符数lens，赋值为伪变量w_s；然后将w_s里面的**替换成一个空格，再将*替换成空（对于一个中文被截断的情况做舍弃处理）。
			 * 2. 此时w_s的长度即代表计算后str要截取的字符串长度
			 * 3. 对于str截取操作
			 */
			var w_s = s.slice(0, lens);
			var cutnum = 0; //记录中文被截断，被忽略的字节数
			str = str.slice(0, w_s.replace(/\*\*/g, ' ').replace(/\*/g, function(){
			    cutnum++;
			    return '';
			}).length);
			if($checkDataType.isFunction(callback)){
			    callback(w_s.length-cutnum);
			}
			return str;
		}
	};
});
