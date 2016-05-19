/**
 * @fileoverview 频道广播控制器，用于模块通信
 * @version 1.0 | 2015-06-29 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 更多详细信息参考代码里对应定义方法或属性位置的注释说明
 * 	register {Function} 注册频道
 * @example
 *  requirejs(['libchannel/listener'],function($listener){
 * 	  var loginChannel = $listener.register(['loginSuccess','loginFail']);
 *    loginChannel.loginSuccess.add(function(){console.log('登录成功')});
 *    loginChannel.loginSuccess.fire();
 *  });
 * */
define(['$'],function($){
	return {
		/**
		 * 注册频道 
         * @param {Array} evtarr 频道列表
		 */
		register: function(evtarr){
			var that = {};
			if($.isArray(evtarr)){
				$.each(evtarr,function(i,name){
			      that[name] = $.Callbacks();
			    });
			}
			return that;
		}
	};
});