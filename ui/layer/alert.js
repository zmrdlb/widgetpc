/**
 * @fileoverview alert类，继承自layer/bombLayer。添加“确定按钮”事件回调
 * 如果弹层中有以下属性的节点
 * node="close"，点击则会关闭弹层,并触发hidecal通知。
 * node="ok"，点击则触发“确定按钮”事件、关闭弹层，并触发okcal和hidecal通知。
 * @version 1.0.0 | 2015-09-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['liblayers/alert'],function($alert){
 * 	 var layer = new $alert({
 * 	 	alert: {
 * 			frametpl: [ //弹层基本模板
				'<div node="title"></div>',
				'<div node="content"></div>',
				'<div><a href="javascript:;" node="ok">好的</a></div>'
			].join('')
 *      }
 *   });
 *   layer.showcal.add(function(type){switch(type){case 'before':console.log('层显示前');break; case 'after':console.log('层显示后');break;}});
 *   layer.hidecal.add(function(type){switch(type){case 'before':console.log('层隐藏前');break; case 'after':console.log('层隐藏后');break;}});
 *   layer.okcal.add(function(e){console.log('点击了确定')});
 *   layer.setMyContent('设置node="content"节点的innerHTML');
 *   var nodeArr = layer.getNodes(['title']); // 获取node="指定属性"的节点
 *   nodeArr.title.html('内容区html');
 *   layer.contentnode; //内容区node="content"节点
 *   layer.show(); //显示层
 *   layer.hide(); //隐藏层
 *   layer.layer; //层dom节点对象
 *   layer.container; //浮层容器
 *   layer.destroy(); //销毁层
 * });
 * */
define(['$','liblayers/bombLayer','liblayers/tpl','libcompatible/deviceevtname','libinherit/extendClass'],function($,$bombLayer,$tpl,$deviceevtname,$extendClass){
	/**
	 * alert类
     * @param {Object} config 参数同layer/bombLayer里面的config,在此基础上增加如下默认配置
     * {
     * 	  *alert: {
     * 		 *frametpl {String} alert基本模板。要求请详见layer/tpl里面alert项的要求
     *    }
     * }
	 */
	function alert(config){
		var opt = $.extend(true,{
			alert: {
				frametpl: $tpl.alert //alert弹层基本模板。要求请详见layer/tpl里面alert项的要求
			}
		},config);
		var that = this;
		alert.superclass.constructor.call(this,opt);
		this.setContent(opt.alert.frametpl);
		this.contentnode = this.layer.find('[node="content"]'); //内容区节点
		this.okcal = $.Callbacks();
		//事件绑定
	    this.layer.on($deviceevtname.click, '[node="ok"]', function(e){
	    	e.preventDefault();
	    	that.hide();
	    	that.okcal.fire(e);
	    });
	}
	$extendClass(alert,$bombLayer);
	/**
     * 设置alert内容区具有[node="content"]属性的节点的html 
     * @param {String} html
     */
    alert.prototype.setMyContent = function(html){
        if(typeof html == 'string' && this.contentnode.size() > 0){
            this.contentnode.html(html);
        }
    };
	/**
	 * 组件销毁 
	 */
	alert.prototype.destroy = function(){
		this.layer.off($deviceevtname.click, '[node="ok"]');
		alert.superclass.destroy.call(this);
		this.contentnode = null;
		this.okcal = null;
	};
	return alert;
});
