/**
 * @fileoverview 对于高频触发的事件进行延迟处理类。应用场景：scroll和resize 
 * @version 1.0.0 | 2015-08-27 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 处理类
 * @example
 * requirejs(['$','layer/layer'],function($,$layer){
 * 		
 * });
 * */
define(['$','libinherit/extendClass','libclassdesign/subscribe/publisherS'],function($,$extendClass,$publisherS){
	/**
	 * 对于高频触发的事件进行延迟处理。应用场景：scroll和resize 
	 * @param {JSON} config 配置
	 */
	function Delayevt(config){
		Delayevt.superclass.constructor.call(this);
		this.timer = null; 
		$.extend(this,{
			delaytime: 200 //事件检测延迟时间，毫秒
		},config || {});
	}
	$extendClass(Delayevt,$publisherS);
	/**
	 * 开始检测 
	 */
	Delayevt.prototype.start = function(){
		if(this.timer){
            clearTimeout(this.timer);
        }
        var that = this;
        this.timer = setTimeout(function(){
        	that.deliver();
        },this.delaytime);
	};
	return Delayevt;
});
