/**
 * @fileoverview 弹层类，继承自layer/layer。默认居中定位，显示遮罩。（如果需其他特殊配置则参见参数说明）
 * 如果弹层中有以下属性的节点node="close"。则点击该节点会关闭弹层，并触发hidecal通知。
 * @version 1.0.0 | 2015-09-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['liblayers/bombLayer'],function($bombLayer){
 * 	 var layer = new $bombLayer();
 *    layer.showbeforecal.add(function(){console.log('层显示前');});
 *   layer.hidebeforecal.add(function(){console.log('层隐藏前');});
 *   layer.showaftercal.add(function(){console.log('层显示后');});
 *   layer.hideaftercal.add(function(){console.log('层隐藏后');});
 *   layer.pos.poscal.add(function(){console.log('layer定位后回调')});
 *   layer.setContent('<div class="js-content"></div>'); //设置layer层里面的内容
 *   layer.getNodes(['content']); // 获取class="js-content"的节点
 *   layer.show(); //显示层
 *   layer.hide(); //隐藏层
 *   layer.layer; //层dom节点对象
 *   layer.container; //浮层容器
 *   layer.destroy(); //销毁层
 * });
 * */
define(['$','liblayers/layer','liblayers/mask','libinherit/extendClass','liblayers/positionBomb','libcompatible/deviceevtname','libbase/checkDataType'],function($,$layer,$mask,$extendClass,$positionBomb,$deviceevtname,$checkDataType){
	/**
	 * 弹层类——创建并添加到指定容器中
     * @param {JSON} config 弹层配置参数 ，不是必填项
     * 		{
     * 	       container {Element} 存放弹层的容器。可不指定，默认弹层存放于body中的一个动态生成的div里
     * 	       pos:{}, //定位参数，具体说明可见方法layer/positionBomb中的config说明
     *         layer: {}, //弹层信息参数，具体说明可见方法layer/layer中的config说明
     * 		   mask: { //遮罩信息参数，具体说明可见方法layer/mask中的config说明。在此基础上进行以下扩展
     * 			  mask: true, //是否创建遮罩
     *            cmlhide: false //点击遮罩是否关闭弹层
     *            //其他查看mask.js中的配置
     * 		   }
     *      }
	 */
	function bombLayer(config){
		if(!config.container || config.container.length == 0){
			config.container = $('<div></div>').appendTo('body');
			this._newcontainer = true; //说明是新创建的容器
		}
		var that = this;
		config = config || {};
		//初始化基类
		bombLayer.superclass.constructor.call(this,config.container,config.layer);
		//创建定位类对象
		this.pos = new $positionBomb({
			layer: this.layer
		},config.pos);
		//创建遮罩
		var maskopt = $.extend(true,{
			mask: true,
			cmlhide: false
		},config.mask);
		if(maskopt.mask){ //如果创建遮罩
			this.mask = new $mask(config.container,maskopt);
			if(maskopt.cmlhide){ //点击遮罩关闭
				this.mask.clickcal.add(function(e){
					that.hide();
				});
			}
		}
		//事件绑定
		this.layer.on($deviceevtname.click, '.js-close', function(e){
	    	e.preventDefault();
	    	that.hide();
	    });
	}
	$extendClass(bombLayer,$layer);
	/**
	 * 获取alert中具有node='指定名称'的节点列表。如果nodenamearr中指定的节点不存在，则不在结果中返回。举例
     * @param {Array} nodenamearr 如['content','ok']
     * @return {
     * 	   content: 获取的节点
     *     ok: 获取的节点
     * }
     * 如果content不存在，则只返回{ok}
	 */
	bombLayer.prototype.getNodes = function(nodenamearr){
		var result = {}, that = this;
		if($checkDataType.isArray(nodenamearr)){
			$.each(nodenamearr,function(index,name){
				var node = that.layer.find('.js-'+name);
				if(node.length > 0){
					result[name] = node;
				}
			});
		}
		return result;
	};
	/**
	 * 显示弹层
	 */
	bombLayer.prototype.show = function(){
		if(!this.isshow()){
			this.showbeforecal.fire(); //层显示前回调
			this.mask && this.mask.show();
			this._show();
			this.pos.setpos();
			this.showaftercal.fire(); //层显示后回调
		}
	};
	/**
	 * 隐藏弹层
	 */
	bombLayer.prototype.hide = function(){
		if(this.isshow()){
			this.hidebeforecal.fire(); //层隐藏前回调
			this.mask && this.mask.hide();
			this._hide();
			this.hideaftercal.fire(); //层隐藏后回调
		}
	};
	/**
	 * 弹层销毁
	 */
	bombLayer.prototype.destroy = function(){
		this.layer.off($deviceevtname.click, '.js-close');
		if(this._newcontainer){
			this.container.remove();
		}
		bombLayer.superclass.destroy.call(this);
		this.pos.destroy();
		if(this.mask){
            this.mask.destroy();
        }
		this._newcontainer = null;
	};
	return bombLayer;
});
