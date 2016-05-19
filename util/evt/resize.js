/**
 * @fileoverview 
 *   给指定元素创建resize事件监听类
 * @author mingrui| mingrui@staff.sina.com.cn
 * @version 1.0 | 2015-08-27
 * @return resize类
 * @example
 *  requirejs(['$','libevt/resize'],function($,$resize){
 * 		var resize = new $resize($(window));
 * 		resize.listen({call:function(){console.log('窗口resize');}});
 *  });
 */
define(['$','libevt/delayevt'],function($,$delayevt){
	/**
	 * @param {Element} *node 元素节点
	 * @param {JSON} config 延迟配置。同evt/delayevt类的初始化参数 
	 */
	function resize(node,config){
		if(node.size() == 0){
			return;
		}
		var opt = $.extend({
		    evtname: 'resize'
		},config);
		this.delay = new $delayevt(opt);
		var that = this;
		node.on(opt.evtname,function(){
			that.delay.start();
		});
	}
	/** 
	 * 添加scroll事件监听
     * @param {JSON} opt 
     * {
     *   call: function//事件发生时触发的回调
	 *   filter: function //过滤条件。filter返回为true则才触发call。不填此项则默认不过滤
	 * }
     */
	resize.prototype.listen = function(opt){
		this.delay.subscribe(opt);
	};
	/**
	 * 移除监听 
     * @param {Object} opt 和调用listen时一样的参数引用
	 */
	resize.prototype.unlisten = function(opt){
		this.delay.unsubscribe(opt);
	};
	return resize;
});
