/**
 * @fileoverview 浮层基类
 * @version 1.0.0 | 2015-08-19 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 浮层基类
 * @example
 * requirejs(['$','layer/layer'],function($,$layer){
 * 	 var layer = new $layer($('body'));
 *   layer.showbeforecal.add(function(){console.log('层显示前');});
 *   layer.hidebeforecal.add(function(){console.log('层隐藏前');});
 *   layer.showaftercal.add(function(){console.log('层显示后');});
 *   layer.hideaftercal.add(function(){console.log('层隐藏后');});
 *   layer.hide(); //隐藏层
 *   layer.layer; //层dom节点对象
 *   layer.container; //浮层容器
 *   layer.destroy(); //销毁层
 * });
 * */
define(['$','libbase/checkDataType'],function($,CheckDataType){
	/**
	 * 浮层基类——创建并添加到指定容器中
     * @param {Element} container 浮层存放容器，默认为$('body')
     * @param {JSON} config 层配置参数，默认信息及说明如下opt代码处
	 */
	function layer(container,config){
		container = container || $('body');
		var opt = $.extend(true,{
			classname: '', //layer的class
			zIndex: 2, //layer的z-index
			position: 'absolute', //layer的position。默认是absolute
			show: false, //创建层后默认是否显示
			custom: {
				show: null, //用户自定义显示层的方法。如果此方法存在，则不用默认的显示层方法
				hide: null, //用户自定义隐藏层的方法。如果此方法存在，则不用默认的隐藏层方法
				fireHideAfter: true
			}
		},config || {});
		var cssstr = 'position:'+opt.position+';'+(opt.show?'':'display:none;')+'z-index:'+opt.zIndex+';';
		this.container = container; //浮层容器
		this.layer = $('<div'+(opt.classname == ''?'':' class="'+opt.classname+'"')+' style="'+cssstr+'"></div>');
		this.layer.appendTo(container);
		this.showbeforecal = $.Callbacks(); //层显示前的回调
		this.showaftercal = $.Callbacks(); //层显示后的回调
		this.hidebeforecal = $.Callbacks(); //层隐藏前的回调
		this.hideaftercal = $.Callbacks(); //层隐藏后的回调
		this.custom  = opt.custom; //自定义方法
	}
	/**
	 * 设置层内容
 	 * @param {Element|String} *content html字符串或者节点对象
	 */
	layer.prototype.setContent = function(content){
		if(arguments.length == 0){
			return;
		}
		if(typeof content == 'string'){
			this.layer.html(content);
		}
		else{
			this.layer.html('').append(content);
		}
	};
	/**
	 * 显示层。
	 */
	layer.prototype._show = function(){
		if(typeof this.custom.show == 'function'){
			this.custom.show(this.layer);
		}
		else{
			this.layer.show();
		}
	};
	/**
	 * 显示层。会触发showcal回调
	 */
	layer.prototype.show = function(){
		if(!this.isshow()){
			this.showbeforecal.fire(); //层显示前回调
			this._show();
			this._subShow();
			this.showaftercal.fire(); //层显示后回调
		}
	};
	/**
	 * 隐藏层。
	 */
	layer.prototype._hide = function(){
		if(CheckDataType.isFunction(this.custom.hide)){
			this.custom.hide(this.layer);
		}
		else{
			this.layer.hide();
		}
	};
	/**
	 * 隐藏层。会触发hidecal回调
	 */
	layer.prototype.hide = function(){
		if(this.isshow()){
			this.hidebeforecal.fire(); //层隐藏前回调
			this._hide();
			this._subHide();
			if(!CheckDataType.isFunction(this.custom.hide) || this.custom.fireHideAfter){
				this.hideaftercal.fire(); //层隐藏后回调
			}
		}
	};
	/**
	 * 销毁层
	 */
	layer.prototype.destroy = function(){
		if(this.layer != null){
			this.layer.remove();
			this.layer = null;
			this.showcal = null;
			this.hidecal = null;
			this.custom = null;
			this.container = null;
		}
	};
	/**
	 * 判断层是否显示
	 * @return {Boolean} true|false
	 */
	layer.prototype.isshow = function(){
		return this.layer.css('display') != 'none';
	};

	/**
	 * this is implemented by subclass
	 * @type {[type]}
	 */
	layer.prototype._subHide = layer.prototype._subShow = $.noop;

	return layer;
});
