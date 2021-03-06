﻿/**
 * @fileoverview confirm的工厂控制器，集成baseControl
 * 应用场景：针对简单confirm弹层，针对频繁更改弹层里某些节点的内容，以及更改点击"确定"、"取消"按钮后的回调事件
 * 如果是更复杂的交互建议使用layers.confirm或layers.bombLayer
 * @version 1.0.0 | 2016-01-26 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['liblayers/confirmControl'],function($confirmControl){
		var curconfirm = new $confirmControl();
		curconfirm.setconfig({
			confirm: {
				frametpl: [
					'<div class="js-content"></div>',
					'<div><a href="javascript:;" class="js-ok">好的</a><a href="javascript:;" class="js-cancel">等下说</a></div>'
				].join('')
			}
		});
		curconfirm.show({
		    content: '您还未登陆'
		},{
		    ok: function(){
                console.log('点击好的');
            },
			cancel: function(){
				console.log('点击等下说');
			}
		});
		curconfirm.getlayerobj()； //layer/confirm类对象
   });
 * */
define(['liblayers/confirm','liblayers/baseControl','libinherit/extendClass'],function($confirm,$baseControl,$extendClass){
	/**
     * confirm工厂控制器
     */
	function ConfirmControl(hidedestroy){
		ConfirmControl.superclass.constructor.call(this,hidedestroy);
		this._okcal = function(){}; //点击ok的回调私有存储器
		this._cancelcal = function(){}; //点击cancel的回调私有存储器
		this._funarr = ['ok','cancel']; //可控制的回调方法名
	}
	$extendClass(ConfirmControl,$baseControl);
	/**
	 * 获取confirm弹层
	 * @param {Boolean} reset 是否重新渲染模板。默认为false
	 */
	ConfirmControl.prototype.getlayerobj = function(reset){
		var that = this;
		if(this._layerobj == null){
			this._layerobj = new $confirm(this._defaultopt);
			this._layerobj.okcal.add(function(e){
				that._okcal();
			});
			this._layerobj.cancelcal.add(function(e){
				that._cancelcal();
			});
			this._addcall();
		}else{
            if(reset){
                this._layerobj.setContent(this._defaultopt.confirm.frametpl);
            }
        }
		return this._layerobj;
	};

	ConfirmControl.prototype.frameNodesKey = ['title','content','ok','cancel'];

	/**
	 * 销毁alert弹层
	 */
	ConfirmControl.prototype.destroy = function(){
		ConfirmControl.superclass.destroy.call(this);
		this._okcal = function(){};
		this._cancelcal = function(){};
	};
	return ConfirmControl;
});
