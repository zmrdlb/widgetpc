﻿/**
 * @fileoverview 基本的弹层工厂控制器，不可直接使用，只可子类继承后使用。
 * 应用场景：针对频繁更改弹层里某些节点的内容，以及更改点击按钮后的回调事件。
 * @version 1.0.0 | 2016-01-26 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 *
 * */
define(['$','libbase/checkDataType'],function($,$checkDataType){
    /**
     * 工厂模型控制器
     * @param {Boolean} hidedestroy 弹层关闭时，是否走系统默认的销毁操作。默认为true
     */
	function BaseControl(hidedestroy){
		this._layerobj = null; //弹层对象
		this._defaultopt = {}; //默认config配置参数
		this._funarr = []; //会替换的回调方法的关键词。如['ok','cancel']
        this.createcal = $.Callbacks(); //弹层对象创建后的回调
        if(typeof hidedestroy != 'boolean'){
            hidedestroy = true;
        }
        this.hidedestroy = hidedestroy;
		//this._okcal = function(){};this._cancelcal = function(){}; 由各个子类实现
	};
	/**
	 *  参数说明请参见子类使用的弹层类里面的config说明
	 *  如alert.js。confirm.js
	 */
	BaseControl.prototype.setconfig = function(config){
		this._defaultopt = config;
	};

	BaseControl.prototype.getContentHtml = function(txt){
		return '';
	}
	/**
	 * 获取弹层对象，具体由子类实现
	 */
	BaseControl.prototype.getlayerobj = function(){

	};
    /**
	 * 添加系统回调，由子类创建了弹层对象后调用
	 */
	BaseControl.prototype._addcall = function(){
        if(this.hidedestroy){
            this._layerobj.hideaftercal.add(function(){
                this.destroy();
            }.bind(this));
        }
        this.createcal.fire(this._layerobj);
	};

	BaseControl.prototype.frameNodesKey = [];
	/**
	 * 显示弹层
	 * @param {Object} *txt 文案配置,选填。如果setconfig调用设置的模板中还有其他node="其他值"，
	 *      如node="other" 则可自行扩展
	 * {
	 * 	 content {String} node="content"节点里面的html
	 *   title {String} node="title"节点里面的html
	 *   ok {String} node="ok"节点里面的html
	 * }
	 * @param {Object} cal 回调配置
	 * {
	 * 	 键值为_funarr中距离的关键词 {Function} 点击确定按钮后的回调
	 * }
	 */
	BaseControl.prototype.show = function(txt,cal){
		if(!$checkDataType.isObject(txt)){
			throw new Error('baseControl-show方法txt参数必须是json对象');
		}else{
			if($checkDataType.isObject(cal)){
				var funname = this._funarr;
				$.each(funname,function(index,name){
					if($checkDataType.isFunction(cal[name])){
						this['_'+name+'cal'] = cal[name];
					}
					else{
						this['_'+name+'cal'] = function(){};
					}
				}.bind(this))
			}else{
				$.each(funname,function(index,name){
					this['_'+name+'cal'] = function(){};
				}.bind(this))
			}

			var content = this.getContentHtml(txt);
			if(content){
				txt.content = content;
			}
			//获取txt里面的键值
			var nodenamearr = [];
			for(var name in txt){
				if($.inArray(name,this.frameNodesKey) > -1){
					nodenamearr.push(name);
				}
			}
			this.getlayerobj(true);
			var nodearr = this._layerobj.getNodes(nodenamearr);
			for(var name in nodearr){
				$checkDataType.isString(txt[name]) && nodearr[name].html(txt[name]);
			}
			this._layerobj.show();
		}
	};
	/**
	 * 销毁弹层
	 */
	BaseControl.prototype.destroy = function(){
        if(this._layerobj != null){
			this._layerobj.destroy();
			this._layerobj = null;
		}
	};
	return BaseControl;
});
