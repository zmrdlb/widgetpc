/**
 * @fileoverview 弹层定位方法
 * 		注意：调用此方法前，必须是待定位层的display不为null的情况下
 * @version 1.0 | 2015-08-15 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 弹层定位方法
 * @example
 * requirejs(['layer/positionBomb'],function($positionBomb){
 * 	 var pos = new $positionBomb({layer:层dom节点});
 * 	 pos.poscal.add(function(){console.log('layer定位后回调')});
 * });
 * */
define(['$','libcompatible/csssuport','libevt/winscroll','libevt/scroll','libevt/winresize','libevt/resize'],function($,$csssuport,$winscroll,$scroll,$winresize,$resize){
	//判断是否可以使用position:fixed方式定位
    var canFix = $csssuport.fixed;
	/**
	 * 定位算法
	 */
	function setpos(domopt,posopt){
		var cssopt = {},layer = domopt.layer,offcon = domopt.offcon;
		layer.css('position',domopt.position);
		var marginLeft = 0, marginTop = 0;
		if(domopt.position == 'absolute' && posopt.fixed){
			marginLeft = offcon.scrollLeft();
			marginTop = offcon.scrollTop();
		}
		switch (posopt.mode){
			case 'c': //居中定位
				marginLeft -= (Math.max(layer.width(),posopt.minwidth)/2+posopt.offset[0]);
                marginTop -= (Math.max(layer.height(),posopt.minheight)/2+posopt.offset[1]);
				cssopt.top = '50%';
				cssopt.left = '50%';
				break;
			case 'full': //满屏定位，占满整个定位容器。本来不设置width和height，设置了right和bottom。但是偶发margin不起作用，此时读取的元素尺寸为0.
			    cssopt.width = '100%';
                cssopt.height = '100%';
				cssopt.top = '0';
				cssopt.left = '0';
				break;
		}
		cssopt.marginLeft = marginLeft+'px';
		cssopt.marginTop = marginTop+'px';
		if(typeof posopt.custompos == 'function'){
		    posopt.custompos(cssopt);
		}else{
		    layer.css(cssopt);
		}
	}
	/**
	 * 定位类
     * @param {JSON} doms 定位dom相关信息
     * 		{
     * 			layer: null //{JQueryElement|String节点选择器} 待定位层节点
     *      }
     * @param {JSON} config 层定位配置参数，默认信息及说明如下posopt代码处
	 */
	function position(doms,config){
		//参数检测与设置
		if(arguments.length == 0){
			throw new Error('必须传入相关定位的dom参数');
		}
		var domopt = $.extend({
			layer: null, //待定位层节点
			offpage: false //说明相对于当前页面定位
		},doms || {});
		if(domopt.layer && typeof domopt.layer == 'string'){
			domopt.layer = $(domopt.layer);
		}
		if(!domopt.layer || domopt.layer.length == 0){
			throw new Error('传入的定位层节点无效');
		}
		var posopt = $.extend({
			fixed: true, //是否将弹层始终定位在可视窗口区域，默认为true
			mode: 'c', //定位模式，枚举。c:中间
			offset: [0,0], //定义后偏移尺寸 [x轴,y轴]。对于mode是full的模式无效
			sizechange: false, //当mode是c时，offsetParent resize时，待定位层的大小是否会改变
			minwidth: 0, //定位计算时，待定位层layer的最小宽度
            minheight: 0, //定位计算时，待定位层layer的最小高度
            custompos: null //用户自定义定位方法。如果声明此方法，则不会使用系统默认的方法设置pos的定位参数，而是把定位参数pos传递给此方法
		},config || {});
        this.poscal = $.Callbacks(); //setpos后的回调

		var that = this;
		//初步检测定位参考容器
		domopt.offcon = domopt.layer.offsetParent();
		var tagname = domopt.offcon.get(0).tagName.toLowerCase();
		var listencall = {
            call: function(){
                that.setpos();
            }
        };
        var islisscroll = false; //是否监听scroll事件
        var islisresize = false; //是否监听resize事件
		if(tagname == 'body' || tagname == 'html'){ //说明相对于页面定位
		    domopt.offcon = $('body');
			domopt.offpage = true;
		}
		if(domopt.offpage && posopt.fixed && canFix){ //如果定位容器是当前页面、固定定位、可使用fixed定位。则用fixed定位
			domopt.position = 'fixed';
		}
		else{
			domopt.position = 'absolute';
			if(posopt.fixed) { //如果固定定位，则监听scroll事件
			    islisscroll = true;
                if(domopt.offpage){
                    $winscroll.listen(listencall);
                }
                else{
                    var scroll = new $scroll(domopt.offcon);
                    scroll.listen(listencall);
                }
			}
		}
		//说明mode是c时，offsetParent resize时，待定位层的大小会改变，则监听resize事件
        if(posopt.mode == 'c' && posopt.sizechange){
            islisresize = true;
            if(domopt.offpage){
                $winresize.listen(listencall);
            }else{
                var resize = new $resize(domopt.offcon);
                resize.listen(listencall);
            }
        }
		this.domopt = domopt; //dom参数
		this.posopt = posopt; //定位参数
		this.destroy = function(){ //组件销毁方法
			this.domopt = null;
			this.posopt = null;
			if(islisscroll){
				if(domopt.offpage){
					$winscroll.unlisten(listencall);
				}else{
					scroll.unlisten(listencall);
				}
			}
			if(islisresize){
			    if(domopt.offpage){
                    $winresize.unlisten(listencall);
                }else{
                    resize.unlisten(listencall);
                }
			}
		};
	};
	/**
	 * 进行定位
	 * @return {Boolean} 是否定位成功
	 */
	position.prototype.setpos = function(){
		if(this.domopt.layer.css('display') == 'none' || this.domopt.offcon.css('display') == 'none'){
			return false;
		}
		else{
			setpos(this.domopt,this.posopt);
            this.poscal.fire();
			return true;
		}
	};
	return position;
});
