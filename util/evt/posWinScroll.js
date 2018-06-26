/**
 * @fileoverview
 * 当窗口scroll时，返回当前监听的元素相对于window的位置。
 * 特别说明：
 * 		1.如果元素的display:none，则所有位置信息都为0。
 * 		2.首次调用组件时会自动计算元素相对于window的位置并触发监听。
 * @version 1.0 | 2015-10-22 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 调用方法
 * @example
 * 	requirejs(['libdom/posWinSR'],function($posWinSR){
 * 		$posWinSR.listenPos({
 * 			node: jquery Node节点对象
 * 			call: function(pos,node){console.log(pos);console.log(node);},
 * 			filter: function(){return true;} //过滤条件，可不写
 * 		});
 *  });
 */
define(['$','libbase/checkDataType','libdom/positionWin'],function($,$checkDataType,$positionWin){
	var cache = []; //数据缓存
	/**
	 * 获取位置
	 */
	function getPos(opt){
		var pos = $positionWin(opt.node);
		opt.call(pos,opt.node);
	};

	/**
	 * 通知计算各个节点的位置 并返回
	 */
	function notify(){
		cache.forEach(function(opt,index){
			if(opt.filter() == true){
				getPos(opt);
			}
		});
	};

	//绑定窗口scroll的监听
	$(window).on('scroll',function(e){
	    notify();
	});

	return {
		/**
		 * 监听元素位置
		 * @param
		 * @param {Object} opt 配置
		 * {
		 * 		*node {Element} 元素dom对象
	 	 * 		*call: function(pos,node){} //当计算了元素相对于window的位置后回调的函数
	 	 * 			call回调参数说明：
	 	 * 			pos: {
						 tt: 0, //元素顶部距离window顶部的距离。>0表示元素顶部在window顶部下面；<0表示元素顶部在window顶部上面
						 bt: 0, //元素底部距离window顶部的距离。>0表示元素底部在window顶部下面；<0表示元素底部在window顶部上面
						 ll: 0, //元素左部距离window左部的距离。>0表示元素左部在window左部右面；<0表示元素左部在window左部左面
						 rl: 0, //元素右部距离window左部的距离。>0表示元素右部在window左部右面；<0表示元素右部在window左部左面
						 bb: 0,  //元素底部距离window底部的距离。>0表示元素底部在window底部上面；<0表示元素底部在window底部下面
						 tb: 0 //元素顶部距离window底部的距离。>0表示元素顶部在window底部上面；<0表示元素顶部在window底部下面
					}
					node: 当前dom对象
	 	 *
	 	 *      filter: function(){return true;} //过滤条件，是否计算并分发通知call。返回true则计算位置并通知call，否则不计算通知。
	 	 * }
		 */
		listenPos: function(opt){
			if(!$checkDataType.isObject(opt) || !opt.node || opt.node.length == 0 || !$checkDataType.isFunction(opt.call)){
				throw new Error('posWinSR组件传入的参数node或call无效');
			}
			if(!$checkDataType.isFunction(opt.filter)){
				opt.filter = function(){return true;};
			}
			//加入缓存
			cache.push(opt);
			//首次计算位置
			if(opt.filter() == true){
                getPos(opt);
            }
		},

		unListenPos: function(node){
			$.each(cache,function(index,opt){
				if(opt.node === node){
					cache.splice(index,1);
					return false;
				}
			})
		}
	};
});
