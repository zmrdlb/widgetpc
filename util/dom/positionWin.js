/**
 * @fileoverview 获取元素node距离当前可视窗口window的位置信息。如果元素的display:none，则所有位置信息都为0
 * @version 1.0 | 2015-10-22 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 调用方法
 * @example
 * 	requirejs(['libdom/positionWin'],function($positionWin){
 * 		var pos = $positionWin(jquery node节点对象);
 *  });
 * */
define(['$'],function($){
	return function(node){
		if(!node || node.length == 0){
			throw new Error('positionWin组件传入的参数node无效');
		}
		//待返回的位置信息
		var pos = {
			tt: 0, //元素顶部距离window顶部的距离。>0表示元素顶部在window顶部下面；<0表示元素顶部在window顶部上面
			bt: 0, //元素底部距离window顶部的距离。>0表示元素底部在window顶部下面；<0表示元素底部在window顶部上面
			ll: 0, //元素左部距离window左部的距离。>0表示元素左部在window左部右面；<0表示元素左部在window左部左面
			rl: 0, //元素右部距离window左部的距离。>0表示元素右部在window左部右面；<0表示元素右部在window左部左面
			bb: 0, //元素底部距离window底部的距离。>0表示元素底部在window底部上面；<0表示元素底部在window底部下面
			tb: 0 //node's top to window's bottom。> 0 indicate node's top is above window's bottom; < 0 indicate under
		};
		if(node.css('display') == 'none'){
			return pos;
		}
		var winNode = $(window);
		var nheight = node.outerHeight? node.outerHeight(): node.height(); //元素高度
		var nwidth = node.outerWidth? node.outerWidth(): node.width(); //元素宽度
		var noffset = node.offset(); //元素相对于文档的位置信息
		var wscrollTop = winNode.scrollTop(); //页面的scrollTop
		var wscrollLeft = winNode.scrollLeft(); //页面的scrollLeft
		var wheight = winNode.height(); //window高度
		pos.tt = noffset.top - wscrollTop;
		pos.bt = noffset.top + nheight - wscrollTop;
		pos.ll = noffset.left - wscrollLeft;
		pos.rl = noffset.left + nwidth - wscrollLeft;
		pos.bb = wscrollTop + wheight - noffset.top - nheight;
		pos.tb = wscrollTop + wheight - noffset.top;
		return pos;
	};
});
