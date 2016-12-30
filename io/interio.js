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
	 * param {JSON} *iocall io请求回调
	 * @param {queueHandle} *queueobj 队列控制器对象
	 */
	function format(ioargs,iocall,queueobj){
		var _ioargs = {}, _iocall = {};
		$.extend(true,_ioargs,$ioconfig.ioargs,ioargs);
		$.extend(true,_iocall,$ioconfig.iocall,iocall);
		$ioconfig.format(_ioargs);
		var oldsuccess = _iocall.success;
		var oldcomplete = _iocall.complete;
		var deallogin = _ioargs.customconfig.deallogin;
		var dealfail = _ioargs.customconfig.dealfail;
		var dealdata = _ioargs.customconfig.dealdata;
		_iocall.success = function(data, textStatus, jqXHR){ //重写success方法，用来处理未登陆问题
			if(deallogin && typeof $ioconfig.login.filter == 'function'){ //监测是否有未登陆错误处理
				if($ioconfig.login.filter(data)){ //未登录
				    if($ioconfig.login.url != ''){ //跳转url
				        var loginurl = $ioconfig.login.url;
                        var search = $ioconfig.login.key+'='+encodeURIComponent(location.href);
                        if(loginurl.lastIndexOf('?') != -1){
                            loginurl = loginurl.replace(/\?/,'?'+search);
                        }
                        else{
                            loginurl = loginurl+'?'+search;
                        }
                        location.href = loginurl;
                        return;
				    }else if(typeof $ioconfig.login.deal == 'function'){
				        $ioconfig.login.deal(data);
				        return;
				    }
				}
			}
			if(dealfail && typeof $ioconfig.fail.filter == 'function'){ //检测是否有业务错误处理
			    if($ioconfig.fail.filter(data)){ //业务错误
			        if(typeof _iocall[$ioconfig.fail.funname] == 'function'){
			            _iocall[$ioconfig.fail.funname](data, textStatus, jqXHR);
			        }
			    }else{ //业务成功
			        if(dealdata){ //统一处理业务成功数据
			            typeof oldsuccess == 'function' && oldsuccess(_ioargs.dealdata(data, textStatus, jqXHR), textStatus, jqXHR);
			        }else{
			            typeof oldsuccess == 'function' && oldsuccess(data, textStatus, jqXHR);
			        }
			    }
			}else{
			    typeof oldsuccess == 'function' && oldsuccess(data, textStatus, jqXHR);
			}
		};
		if(_ioargs.customconfig.queue){ //说明接口同意进行队列控制
			_iocall.complete = function(){ //重写接口请求完成事件
				queueobj.advance();
				typeof oldcomplete == 'function' && oldcomplete.apply(this,Array.prototype.slice.call(arguments));
			};
		}
		return {
			ioargs: _ioargs,
			iocall: _iocall
		};
	}
	function doajax(ioargs,iocall){
		var interobj = null, getInter = ioargs.customconfig.getInter;
		delete ioargs.customconfig;

		interobj = $.ajax(ioargs).done(iocall.success).fail(iocall.error).always(iocall.complete)
		if(interobj && typeof getInter == 'function'){
			getInter(interobj);
		}
	}
	/**
	 * 处理接口请求
     * @param {JSON} ioopt format后的接口参数
	 */
	function request(ioopt){
		var _ioargs = ioopt.ioargs;
		var _iocall = ioopt.iocall;
		var mode = _ioargs.customconfig.mode;
		if(mode == 'ajax'){
			if(_ioargs.dataType == undefined || _ioargs.dataType == ''){
				_ioargs.dataType = 'json';
			}
			doajax(_ioargs,_iocall);
		}else if(mode == 'jsonp'){
			_ioargs.dataType = 'jsonp';
			_ioargs.crossDomain = true;
			doajax(_ioargs,_iocall);
		}else if(mode == 'script'){
			_ioargs.dataType = 'script';
			_ioargs.crossDomain = true;
			doajax(_ioargs,_iocall);
		}
	}
	var mainqueue = new queueHandle(); //主线程队列控制对象
	return {
		/**
		 * 执行接口请求
         * @param {JSON} *ioargs 接口扩展参数。对应ioconfig.js里的ioargs配置格式
         * @param {JSON} *iocall 接口扩展参数。对应ioconfig.js里的iocall配置格式
		 */
		transRequest: function(ioargs,iocall){
			if(ioargs && iocall && ioargs.url != ''){
				var curopt = format(ioargs,iocall,mainqueue);
				if(curopt.ioargs.customconfig.queue){ //说明遵循队列控制
					mainqueue.request(curopt);
				}
				else{
					request(curopt);
				}
			}
		},
		/**
		 * 对一组请求进行单独的队列控制依次请求。全部请求完毕后进行通知。
		 * 此情况下，通过ioargs设置的参数配置customconfig:{queue:true|false}无效。强制都走队列
 		 * @param {Array} *argsarr 接口请求数组
 		 * [{
 		 *    {JSON} *ioargs 接口扩展参数。对应ioconfig.js里的ioargs配置格式
 		 *    {JSON} *iocall 接口扩展参数。对应ioconfig.js里的iocall配置格式
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
					var ioargs = argsarr[i].ioargs || {};
					var iocall = argsarr[i].iocall || {};
					if(ioargs && iocall && ioargs.url != ''){
						ioargs = $.extend(true,ioargs,{customconfig:{queue:true}});
						var curopt = format(ioargs,iocall,queueobj);
						queueobj.request(curopt);
					}
				}
			}
		}
	};
});
