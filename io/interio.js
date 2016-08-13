/**
 * @fileoverview io接口请求控制器
 * @version 1.0 | 2015-06-28 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 更多详细信息参考代码里对应定义方法或属性位置的注释说明
 * 	transRequest {Function} 执行接口接口请求
 *  transQueueRequest {Function} 对一组请求进行单独的队列控制依次请求。全部请求完毕后进行通知。
 * @example
 * requirejs(['libio/interio'],function($interio){
 * 	 $interio.transRequest('inter1name',{
		success: function(data){},
		complete: function(){}
	 });
 * });
 * */
define(['$','libio/ioconfig'],function($,$ioconfig){
	//请求队列控制类
	function queueHandle(){
		this.queue = []; //当前队列数据
		this.inprocess = false; //当前队列接口是否正在处理
		this.complete = function(){}; //队列请求完成后的回调
	};
	//执行队列数据请求
	queueHandle.prototype.advance = function(){
		if(this.queue.length == 0){
			this.inprocess = false;
			if(typeof this.complete == 'function'){
				this.complete();
			}
			return;
		}
		var req = this.queue.shift();
		this.request(req,true);
	};
	/**
	* 添加接口请求处理 
    * @param {JSON} *opt format后的接口参数
    * @param {Boolean} advance 是否是queueHander.advance调用
	*/
	queueHandle.prototype.request = function(opt,advance){
		if(this.inprocess && !advance){
			this.queue.push(opt);
			return;
		}
		this.inprocess = true;
		request(opt);
	};
	/**
	 * queueHandle对象控制器
	 */
	var queueControl = {
		_queueobjs: [], //queueHandle对象列表
		get: function(){ //返回当前空闲的queueHandle对象 
			var curqueue = null;
			var queueobjs = this._queueobjs;
			for(var i = 0, len = queueobjs.length; i < len; i++){
				if(queueobjs[i].inprocess == false && queueobjs[i].lock == false){ //既无请求又没有被锁定
					queueobjs[i].lock = true;
					curqueue = queueobjs[i];
					break;
				}
			}
			if(curqueue == null){
				curqueue = new queueHandle();
				curqueue.lock = true;
				this._queueobjs.push(curqueue);
			}
			return curqueue;
		},
		end: function(queue){ //通知当前queueHandle对象已经使用完毕
			var queueobjs = this._queueobjs;
			for(var i = 0, len = queueobjs.length; i < len; i++){
				if(queueobjs[i] == queue){ //既无请求又没有被锁定
					queueobjs[i].lock = false;
					break;
				}
			}
		}
	};
	/**
	 * 格式化io接口请求参数
	 * @param {JSON} *ioopt 数据接口参数
	 * @param {queueHandle} *queueobj 队列控制器对象
	 */
	function format(ioopt,queueobj){
		var conf = {};
		$.extend(true,conf,$ioconfig.ioargs,ioopt);
		$ioconfig.format(conf);
		var oldsuccess = conf.success;
		var oldcomplete = conf.complete;
		var deallogin = conf.customconfig.deallogin;
		var dealerror = conf.customconfig.dealerror;
		var dealdata = conf.customconfig.dealdata;
		conf.success = function(data, textStatus, jqXHR){ //重写success方法，用来处理未登陆问题
			if(deallogin && $ioconfig.login.url != '' && typeof $ioconfig.login.filter == 'function'){ //监测是否有未登陆错误处理
				if($ioconfig.login.filter(data)){
					var loginurl = $ioconfig.login.url;
					var search = $ioconfig.login.key+'='+encodeURIComponent(location.href);
					if(loginurl.lastIndexOf('?') != -1){
						loginurl = loginurl.replace(/\?/,'?'+search+'&');
					}
					else{
						loginurl = loginurl+'?'+search;
					}
					location.href = loginurl;
					return;
				}
			}
			if(dealerror && typeof $ioconfig.error.filter == 'function'){ //检测是否有业务错误处理
			    if($ioconfig.error.filter(data)){ //业务错误
			        if(typeof conf[$ioconfig.error.funname] == 'function'){
			            conf[$ioconfig.error.funname](data, textStatus, jqXHR);
			        }
			    }else{ //业务成功
			        if(dealdata){ //统一处理业务成功数据
			            typeof oldsuccess == 'function' && oldsuccess(conf.dealdata(data, textStatus, jqXHR), textStatus, jqXHR);
			        }else{
			            typeof oldsuccess == 'function' && oldsuccess(data, textStatus, jqXHR);
			        }
			    }
			}else{
			    typeof oldsuccess == 'function' && oldsuccess(data, textStatus, jqXHR);
			}
		};
		if(conf.customconfig.queue){ //说明接口同意进行队列控制
			conf.complete = function(jqXHR, textStatus){ //重写接口请求完成事件
				queueobj.advance();
				typeof oldcomplete == 'function' && oldcomplete(jqXHR, textStatus);
			};
		}
		return conf;
	}
	/**
	 * 处理接口请求 
     * @param {JSON} ioopt format后的接口参数
	 */
	function request(ioopt){
		var mode = ioopt.customconfig.mode;
		var interobj = null, getInter = ioopt.customconfig.getInter;
		delete ioopt.customconfig;
		if(mode == 'ajax'){
			if(ioopt.dataType == undefined || ioopt.dataType == ''){
				ioopt.dataType = 'json';
			}
			interobj = $.ajax(ioopt);
		}else if(mode == 'jsonp'){
			ioopt.dataType = 'jsonp';
			ioopt.crossDomain = true;
			interobj = $.ajax(ioopt);
		}else if(mode == 'script'){
			ioopt.dataType = 'script';
			ioopt.crossDomain = true;
			interobj = $.ajax(ioopt);
		}
		if(interobj && typeof getInter == 'function'){
			getInter(interobj);
		}
	}
	var mainqueue = new queueHandle(); //主线程队列控制对象
	return {
		/**
		 * 执行接口请求 
         * @param {String} *name 接口名称。对应ioconfig.js里的settrans方法配置项的name
         * @param {JSON} args 接口扩展参数。对应ioconfig.js里的ioargs配置格式
		 */
		transRequest: function(name,args){
			if(typeof name == 'string' && name != ''){
				var curopt = $ioconfig.getTrans(name);
				if(curopt && curopt.url != ''){
					curopt = $.extend(true,{},curopt,args||{});
					curopt = format(curopt,mainqueue);
					if(curopt.customconfig.queue){ //说明遵循队列控制
						mainqueue.request(curopt);
					}
					else{
						request(curopt);
					}
				}
			}
		},
		/**
		 * 对一组请求进行单独的队列控制依次请求。全部请求完毕后进行通知。
		 * 此情况下，通过ioconfig.js中setTrans方法设置的参数配置customconfig:{queue:true|false}无效。强制都走队列
 		 * @param {Array} *argsarr 接口请求数组
 		 * [{
 		 * 	  {String} *name 接口名称。对应ioconfig.js里的settrans方法配置项的name
 		 *    {JSON} args 接口扩展参数。对应ioconfig.js里的ioargs配置格式
 		 * }]
 		 * @param {JSON} customobj 用户自定义扩展参数
 		 * {
 		 * 	  {Function} complete 接口全部请求完毕后的通知回调
 		 * }
		 */
		transQueueRequest: function(argsarr,customobj){
			if($.isArray(argsarr) && argsarr.length > 0){
				var queueobj = queueControl.get(); //获取一个空闲的queueHandle
				queueobj.complete = function(){
					queueControl.end(queueobj); //通知当前queue对象使用完毕
					if(customobj && typeof customobj.complete == 'function'){
						customobj.complete();
					}
				};
				for(var i = 0, len = argsarr.length; i < len; i++){
					var name = argsarr[i].name;
					var args = argsarr[i].args || {};
					if(typeof name == 'string' && name != ''){
						var curopt = $ioconfig.getTrans(name);
						if(curopt && curopt.url != ''){
							curopt = $.extend(true,{},curopt,args||{},{customconfig:{queue:true}});
							curopt = format(curopt,queueobj);
							queueobj.request(curopt);
						}
					}
				}
			}
		}
	};
});
