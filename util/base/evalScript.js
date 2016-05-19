/**
 * @fileoverview 手动执行js代码
 * @version 1.0 | 2015-07-01 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['libbase/evalScript'],function($evalScript){
 * 	 $evalScript('console.log(1)');
 * });
 * */
define(function(){
	/**
	 * @param {String} jscode js代码字符串 
	 */
	return function(jscode) {
	    if (window.execScript) {
	        window.execScript(jscode);
	        return;
	    }
	    window.eval.call(window,jscode);
	};
});
