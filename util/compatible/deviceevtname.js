/**
 * @fileoverview 根据设备给出相关业务事件的事件名称
 * @version 1.0.0 | 2015-09-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * */
define({
	//点击事件的事件名称
	click: 'click',
	//浏览器窗口resize事件
	winresize: (function(){
	    return 'onorientationchange' in window? 'orientationchange': 'resize';
	})(),
	//input或textarea输入框值改变的监听事件
	input: (function(){
	    if(/MSIE 9.0/.test(navigator.userAgent)){ //Ie9那个坑爹的，本来input和propertychange都支持，但是删除键无法触发这两个事件，所以得添加keyup
	        return 'input keyup';
	    }
	    var node = document.createElement('input');
	    if('oninput' in node){
	        return 'input';
	    }else if('onpropertychange' in node){
	        return 'propertychange';
	    }else {
	        return 'keyup';
	    }
	})()
});
