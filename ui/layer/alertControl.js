/**
 * @fileoverview alert的工厂控制器，继承baseControl
 * 应用场景：针对简单alert弹层，频繁更改弹层里某些节点的内容，以及更改点击"确定"按钮后的回调事件
 * 如果是更复杂的交互建议使用layers.alert或layers.bombLayer
 * @version 1.0.0 | 2016-01-26 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['liblayers/alertControl'],function($alertControl){
		var curlayer = new $alertControl();
		curlayer.setconfig({
			alert: {
				frametpl: [
				    '<div class="js-title"></div>',
					'<div class="js-content"></div>',
					'<div><a href="javascript:;" class="js-ok">好的</a></div>'
				].join('')
			}
		});
		curlayer.show({
            content: '您还未登陆'
        },{
            ok: function(){
                console.log('点击好的');
            }
        });
        curlayer.getlayerobj()； //layer/alert类对象
   });
 * */
define(['liblayers/alert','liblayers/baseControl','libinherit/extendClass'],function($alert,$baseControl,$extendClass){
    /**
     * alert工厂控制器
     */
	function AlertControl(hidedestroy){
		AlertControl.superclass.constructor.call(this,hidedestroy);
		this._okcal = function(){}; //点击ok的回调私有存储器
		this._funarr = ['ok']; //可控制的回调方法名
	}
	$extendClass(AlertControl,$baseControl);
	/**
	 * 获取alert弹层
	 * @param {Boolean} reset 是否重新渲染模板。默认为false
	 */
	AlertControl.prototype.getlayerobj = function(reset){
		var that = this;
		if(this._layerobj == null){
			this._layerobj = new $alert(this._defaultopt);
			this._layerobj.okcal.add(function(e){
				that._okcal();
			});
            this._addcall();
		}else{
            if(reset){
                this._layerobj.setContent(this._defaultopt.alert.frametpl);
            }
        }
		return this._layerobj;
	};

	AlertControl.prototype.frameNodesKey = ['title','content','ok'];


	/**
	 * 销毁alert弹层
	 */
	AlertControl.prototype.destroy = function(){
		AlertControl.superclass.destroy.call(this);
		this._okcal = function(){};
	};
	return AlertControl;
});
