/**
 * @fileoverview 
 *   监听window resize。只支持PC
 * @author mingrui| mingrui@staff.sina.com.cn
 * @version 1.0 | 2015-08-27
 * @example
 * requirejs(['$','libevt/winresize'],function($,$winresize){
 * 		$winresize.listen({call:function(){console.log('窗口resize');}});
 * });
 */
define(['$','libevt/resize','libcompatible/deviceevtname'],function($,$resize,$deviceevtname){
	var resize = new $resize($(window),{
	    evtname: $deviceevtname.winresize
	});
	return resize;
});
