/**
 * @fileoverview 遮罩类——创建遮罩并进行相关控制
 * @version 1.0 | 2015-08-15 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 遮罩对象
 * @example
 * requirejs(['$','layer/mask'],function($,$mask){
 * 	 var mask = new $mask($('body'));
 *   mask.show(); //显示遮罩
 *   mask.hide(); //隐藏遮罩
 *   mask.mask; //遮罩dom节点对象
 *   mask.container; //遮罩容器
 *   mask.destroy(); //销毁遮罩
 *   mask.clickcal.add(function(e){
 * 	    console.log('遮罩被点击');
 *   });
 * });
 * */
define(['$','liblayers/positionBomb','libcompatible/deviceevtname'],function($,$positionBomb,$deviceevtname){
	/**
	 * 遮罩类——创建遮罩dom并添加到指定容器中
     * @param {Element} container 遮罩存放容器，默认为$('body')
     * @param {JSON} config 遮罩配置参数，默认信息及说明如下opt代码处
	 */
	function mask(container,config){
		container = container || $('body');
		var that = this;
		var opt = $.extend({
			bgcolor: '#000', //背景色
			zIndex: 1, //遮罩z-index
			opacity: 0.6, //遮罩透明度
			show: false, //创建遮罩后默认是否显示
			custom: {
				show: null, //用户自定义显示层的方法。如果此方法存在，则不用默认的显示层方法
				hide: null //用户自定义隐藏层的方法。如果此方法存在，则不用默认的隐藏层方法
			}
		},config || {});
		var cssstr = 'position:absolute;background:'+opt.bgcolor+';'+(opt.show?'':'display:none;')+'z-index:'+opt.zIndex+';';
		this.container = container; //遮罩容器
		this.mask = $('<div style="'+cssstr+'"></div>');
		this.mask.appendTo(container);
		this.mask.css('opacity',opt.opacity);
		this.custom  = opt.custom; //自定义方法
		this.pos = new $positionBomb({layer:this.mask},{mode:'full'});
		//绑定事件
		this.clickcal = $.Callbacks(); //遮罩点击后的回调
		this.mask.on($deviceevtname.click,function(e){
			that.clickcal.fire(e);
		});
	}
	/**
	 * 显示遮罩
	 */
	mask.prototype.show = function(){
		if(typeof this.custom.show == 'function'){
			this.custom.show(this.mask);
		}
		else{
			this.mask.show();
		}
		this.pos.setpos();
	};
	/**
	 * 隐藏遮罩
	 */
	mask.prototype.hide = function(){
		if(typeof this.custom.hide == 'function'){
			this.custom.hide(this.mask);
		}
		else{
			this.mask.hide();
		}
	};
	/**
	 * 销毁遮罩
	 */
	mask.prototype.destroy = function(){
		if(this.mask != null){
			this.mask.off($deviceevtname.click);
			this.mask.remove();
			this.mask = null;
			this.pos.destroy();
			this.pos = null;
			this.clickcal = null;
		}
	};
	return mask;
});
