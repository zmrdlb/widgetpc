/**
 * @fileoverview alert类单体控制器，一般用于简单的confirm信息提示。
 * 注意：该alert控制的对象及dom在全局中唯一存在，如果想要创建多个，请使用liblayers/alert或liblayers/alertControl
 * @version 1.0.0 | 2015-09-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['liblayers/alertSingle'],function($alertSingle){
		$alertSingle.setconfig({
			alert: {
				frametpl: [
				    '<div node="title"></div>',
					'<div node="content"></div>',
					'<div><a href="javascript:;" node="ok">好的</a></div>'
				].join('')
			}
		});
		$alertSingle.getlayerobj()； //layer/alert类对象
		$alertSingle.show({
            content: '您还未登陆'
        },{
            ok: function(){
                console.log('点击好的');
            }
        });
   });
 * */
define(['liblayers/alertControl'],function($alertControl){
   return new $alertControl();
});
