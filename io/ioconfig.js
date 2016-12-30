/**
 * @fileoverview io接口请求相关数据配置
 * @version 1.0 | 2015-06-28 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 更多详细信息参考代码里对应定义方法或属性位置的注释说明
 * 	login {JSON} 对于接口返回未登陆错误进行统一处理配置
 *  ioargs {JSON} io请求接口默认参数
 *  setTrans {Function} 设置接口配置
 *  getTrans {Function} 获取接口配置
 *  globalSetup {Function} 设置全局ajax配置
 * @example
 * requirejs(['libio/ioconfig'],function($ioconfig){
 * 	 //配置未登陆统一处理相关参数
	 $ioconfig.login.url = 'http://baidu.com/';
	 $ioconfig.login.filter = function(data){
		return data.code == 'A0003';
	 };
	 //配置接口
	 $ioconfig.setTrans([
		{name: 'inter1name', args: {url:baseUrl+'inter1.json',method:'GET'}},
		{name: 'inter2name', args: {url:baseUrl+'inter2.json',method:'GET',customconfig:{deallogin:false//不统一处理未登陆错误}}}
	 ]);
 * });
 * */
define(['$'],function($){
	//var iocache = {}; //接口的配置项缓存。格式为{intername；ioargs里面的参数配置项json格式}
	var that = {};
	/**
	 * 对于接口返回未登陆错误进行统一处理 配置。
	 */
	that.login = {
		url: '', //未登情况下跳转的页面
		key: 'go', //跳转到url指定页面传递当前页面地址的键值名称
		deal: function(data){}, //有的情况下，不是跳转登录url，而且弹登录弹层。则此时将url设置为''，将登陆弹层弹出处理写在此方法中
		filter: function(data){return false;} //如果此函数返回true则跳转url指定的页面。data是接口返回的数据
	};
	/**
     * 对于接口返回的业务错误进行统一处理 配置。
     * 如code == 'A0001' 算成功，其他都算失败
     */
	that.fail = {
	    funname: 'fail', //当发生业务错误的时候，调用的格式同于ioargs里的函数的函数名。默认是error
	    filter: function(data){return false;} //如果此函数返回true则说明当前接口返回业务错误信息。data是接口返回的数据
	    /**
	     * 如果接受业务错误信息统一处理，则可以按照以下方式填写：
	     * reqiurejs(['libio/ioconfig'],function($ioconfig){
	     *     $ioconfig.error = {
	     *         funname: 'fail',
	     *         filter: function(data){if(data && data.errcode != 0){return true;}}
	     *     };
	     *     $ioconfig.ioargs.fail = function(data){ alert(data.errmsg || '网络错误'); }
	     * });
	     */
	};
	that.ioargs = { //io请求默认的参数格式
		//同ajax参数官方说明项
		url: '',
		method: 'GET',
		contentType: 'application/x-www-form-urlencoded',
		dealdata: function(result){return result.data;}, //当业务处理成功时，返回统一处理的数据
		//自定义数据
		customconfig:{
			mode: 'ajax', //使用什么方式请求，默认是ajax(ajax方式默认返回的是json格式的数据。也可通过在和method参数同级的位置设置dataType参数来改变默认的json设置)。可用的参数有ajax|jsonp|script
		    deallogin: true, //是否统一处理未登陆错误
		    dealfail: true, //是否统一处理业务错误
		    dealdata: true, //当业务处理成功时，是否统一处理返回的数据。注意：只有当dealerror为true时，dealdata为true才有效。否则不会调用dealdata方法
		    queue: false, //接口请求是否进行队列控制，即当前请求完成后才可以进行下一个请求
		    getInter: function(interobj){} //获取接口请求实例对象。如interobj为$.ajax()返回的对象
		}
	};
	that.iocall = { //io请求回调
		complete: function(){}, //参数为 data|jqXHR, textStatus, jqXHR|errorThrown
		success: function(data, textStatus, jqXHR){},
		error: function(jqXHR, textStatus, errorThrown){alert( textStatus || '网络错误'); },
		fail: function(data, textStatus, jqXHR){} //当业务处理错误时，返回统一处理业务错误
	};
	/**
	 * 每个请求发送之前，统一格式化参数配置（格式同ioargs）。
	 * 应用场景： 每个业务项目需要配置统一的参数处理。
	 */
	that.format = function(opt){};
	/**
	 * 设置 接口配置
	 * @param {Array} optarr
	 * [{
	 * 	 name: 'message',
	 *   args: {method: 'POST',url:'http://...'}格式同ioargs
	 * }]
	 */
	// that.setTrans = function(optarr){
	// 	if(optarr.constructor == Array){
	// 		for(var i = 0, len = optarr.length; i < len; i++){
	// 			var item = optarr[i];
	// 			iocache[item.name] = item.args || {};
	// 		}
	// 	}
	// };
	/**
	 * 获取接口配置
	 * @param {String} name 接口名称
	 */
	// that.getTrans = function(name){
	// 	return iocache[name];
	// };
	/**
	 * 设置全局的接口请求配置
     * @param {Object} setting
	 */
	that.globalSetup = function(setting){
		if(typeof setting == 'object'){
			$.ajaxSetup(setting);
		}
	};
	return that;
});
