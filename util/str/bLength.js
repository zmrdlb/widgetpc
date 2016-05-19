/**
 * @fileoverview 返回一个字符串的字符个数，一个中文2个字符
 * @version 1.0.0 | 2015-10-27 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 方法
 * @example
 *   requirejs(['str/bLength'],function($bLength){
    	$bLength('我aa到底占用多少个字符');
     });
 */
define(function(){
	return function(str){
		if (!str) {
			return 0;
		}
		var aMatch = str.match(/[^\x00-\xff]/g);
		return (str.length + (!aMatch ? 0 : aMatch.length));
	};
});
