/**
 * @fileoverview 浮层基类
 * @version 1.0.0 | 2015-08-19 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 浮层基类
 * @example
 * requirejs(['$','layer/layer'],function($,$layer){
 * 	 var layer = new $layer($('body'));
 *   layer.showcal.add(function(type){switch(type){case 'before':console.log('层显示前');break; case 'after':console.log('层显示后');break;}});
 *   layer.hidecal.add(function(type){switch(type){case 'before':console.log('层隐藏前');break; case 'after':console.log('层隐藏后');break;}});
 *   layer.show(); //显示层
 *   layer.hide(); //隐藏层
 *   layer.layer; //层dom节点对象
 *   layer.container; //浮层容器
 *   layer.destroy(); //销毁层
 * });
 * */
define(['$'],function($){
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
				hide: null //用户自定义隐藏层的方法。如果此方法存在，则不用默认的隐藏层方法
			}
		},config || {});
		var cssstr = 'position:'+opt.position+';'+(opt.show?'':'display:none;')+'z-index:'+opt.zIndex+';';
		this.container = container; //浮层容器
		this.layer = $('<div'+(opt.classname == ''?'':' class="'+opt.classname+'"')+' style="'+cssstr+'"></div>');
		this.layer.appendTo(container);
		this.showcal = $.Callbacks(); //层显示后的回调
		this.hidecal = $.Callbacks(); //层隐藏后的回调
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
	 * 显示层。会触发showcal回调 
	 */
	layer.prototype.show = function(){
		if(!this.isshow()){
			this.showcal.fire('before'); //层显示前回调
			if(typeof this.custom.show == 'function'){
				this.custom.show(this.layer);
			}
			else{
				this.layer.show();
			}
			this.showcal.fire('after'); //层显示后回调
		}
	};
	/**
	 * 隐藏层。会触发hidecal回调
	 */
	layer.prototype.hide = function(){
		if(this.isshow()){
			this.hidecal.fire('before'); //层隐藏前回调
			if(typeof this.custom.hide == 'function'){
				this.custom.hide(this.layer);
			}
			else{
				this.layer.hide();
			}
			this.hidecal.fire('after'); //层隐藏后回调
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
	return layer;
});
