/**
 * @fileoverview 基本的弹层工厂控制器，不可直接使用，只可子类继承后使用。
 * 应用场景：针对频繁更改弹层里某些节点的内容，以及更改点击按钮后的回调事件。
 * @version 1.0.0 | 2016-01-26 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * 
 * */
define(['libbase/checkDataType'],function($checkDataType){
    /**
     * 工厂模型控制器
     */
	function BaseControl(){
		this._layerobj = null; //弹层对象
		this._defaultopt = {}; //默认config配置参数
		this._funarr = []; //会替换的回调方法的关键词。如['ok','cancel']
		//this._okcal = function(){};this._cancelcal = function(){}; 由各个子类实现
	};
	/**
	 *  参数说明请参见子类使用的弹层类里面的config说明
	 *  如alert.js。confirm.js
	 */
	BaseControl.prototype.setconfig = function(config){
		this.destroy();
		this._defaultopt = config;
	};
	/**
	 * 获取弹层对象，具体由子类实现
	 */
	BaseControl.prototype.getlayerobj = function(){
		
	};
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
				for(var i = 0, len = funname.length; i < len; i++){
					if($checkDataType.isFunction(cal[funname[i]])){
						this['_'+funname[i]+'cal'] = cal[funname[i]];
					}
					else{
						this['_'+funname[i]+'cal'] = function(){};
					}
				}
			}else{
				this._okcal = function(){};
			}
			//获取txt里面的键值
			var nodenamearr = [];
			for(var name in txt){
				nodenamearr.push(name);
			}
			this.getlayerobj();
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
		this._defaultopt = {};
	};
	return BaseControl;
});