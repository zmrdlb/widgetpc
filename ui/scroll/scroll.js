/**
 * @fileoverview Sina 滚动类，继承基本滚动类scroll/baseScroll，根据设置执行相应的滚动动画
 * 特别说明：待滚动区的容器大小必须可以计算出所有的滚动对象的大小。比如type为x,则通过scrollNode的
 * width来获取所有滚动对象的大小
 * 支持jquery和zepto
 * @version 1.0 | 2014-02-28 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 * @extend widget.scroll.baseScroll
 * @param {
 *    *nodes: {
 *     *scrollNode: null, //待滚动区域容器
       *conNode: null, //展示区域容器
 *    }
 *    scrolllen: null, //待滚动区域的长度|宽(x轴)或者高(y轴)，，如果设立此值就覆盖掉了根据scrollNode算的长度
      type: 'x', //滚动类型 x轴滚动或者y轴滚动
      change: false, //滚动区域是否会根据窗口大小改变
      direction: 'shun', //循环滚动的滚动方向   shun:顺时针  ni:逆时针  默认为shun
      animateOption: { //滚动动画相关配置参数，参考jquery.animate方法的第二个参数options
        duration: 400
      }
 * }
 * 
 * @return 滚动类返回的接口，更多详细说明请见定义具体接口位置的说明，下面列出新添加的接口和重写的接口，
 * 继承自父类的接口请到父类组件中看详细说明。
 * conNode {Jquery节点对象} 展示区容器
 * scrollNode {Jquery节点对象} 待滚动区容器
 * direction {String} 循环滚动的滚动方向   shun:顺时针  ni:逆时针  默认为shun
 * resizeBeginCal {Jquery.Callbacks对象} 响应式设计待滚动区容器和展示容器大小改变前回调方法
 * resizeEndCal {Jquery.Callbacks对象} 响应式设计待滚动区容器和展示容器大小改变后回调方法
 * animateCal {Jquery.Callbacks对象} 执行动画前的回调
 * setAnimate {Function} 
 *   设置动画参数，参数同jquery.animate( properties, options )
 *   应用场景：如果需要加入自定义的动画，则可在调用animate,prev,next,focus,circle方法前，调用此方法修改动画参数
 * animate {Function} 执行动画
 * prev {Function} 上一页
 * next {Function} 下一页
 * focus {Function} 定位到第几屏滚动
 * circle {Function} 循环滚动
 */
define(['$','libscroll/baseScroll','libinherit/extendClass','libdom/checknode'], function($,$baseScroll,$extendClass,$checknode){
  /**
   *  滚动类
   */
  function scroll(opt){
    var that = this;
    var conf = $.extend(true,{
      nodes: {
        scrollNode: null, //待滚动区域容器
        conNode: null //展示区域容器
      },
      type: 'x', //滚动类型 x轴滚动或者y轴滚动
      change: false, //滚动区域是否会根据窗口大小改变
      direction: 'shun', //循环滚动的滚动方向   shun:顺时针  ni:逆时针  默认为shun
      animateName: {
      	  x: 'margin-left', //或left
      	  y: 'margin-top' //或top
      },
      animateOption: { //滚动动画相关配置参数，参考jjquery.animate( properties, options )方法的第二个参数options
        duration: 400
      },
      /**
       * 有时的css布局无法通过scrollNode或conNode获取正确的alllen或len，则需要用户自行给出正确的尺寸，此时需返回
       * {
       * 	len: 每一屛滚动的尺寸
       *    alllen: 待滚动区域的尺寸
       * } 
       * 如果没有给出此方法，则默认使用conNode和scrollNode来计算
       */
      customGetSize: null
    }, opt || {});
    $checknode(conf.nodes,'参数nodes中的节点无效');
    var isabsolute = conf.nodes.scrollNode.css('position')=='absolute'? true: false;
    var animateName = conf.animateName[conf.type];
    /**
     * 获取滚动区域容器大小 
     * zepto api省去了outerWidth和innerWidth。所以在这里和jquery api做了兼容
     */
    var getConSize = function(){
    	if(typeof conf.customGetSize == 'function'){
    		return conf.customGetSize();
    	}else{
    		  var len = 0;
		      var alllen = 0;
		      if(conf.type == 'x'){
		      	  alllen = conf.nodes.scrollNode.outerWidth? conf.nodes.scrollNode.outerWidth(): conf.nodes.scrollNode.width();
		    	  if(isabsolute){
		              len = conf.nodes.conNode.innerWidth? conf.nodes.conNode.innerWidth(): conf.nodes.conNode.width();
		          }
		          else{
		              len = conf.nodes.conNode.width();
		          }
		      }
		      else{
		          alllen = conf.nodes.scrollNode.outerHeight? conf.nodes.scrollNode.outerHeight(): conf.nodes.scrollNode.height();
		          if(isabsolute){
			          len = conf.nodes.conNode.innerHeight? conf.nodes.conNode.innerHeight(): conf.nodes.conNode.height();
			      }
			      else{
			          len = conf.nodes.conNode.height();
			      }
		      }
		      return {
		        len: len,
		        alllen: alllen
		      };
    	}
    };
    this._animateProp = {}; //滚动动画css配置，参考jquery.animate( properties, options )方法的第一个参数properties
    this._animateOption = conf.animateOption;
    this.conNode = conf.nodes.conNode;
    this.scrollNode = conf.nodes.scrollNode;
    this.direction = conf.direction;
    this.resizeBeginCal = $.Callbacks(); //响应式设计待滚动区容器和展示容器大小改变前回调方法
    this.resizeEndCal = $.Callbacks(); //响应式设计待滚动区容器和展示容器大小改变后回调方法
    this.animateCal = $.Callbacks(); //执行动画前的回调
    
    var size = getConSize();
    scroll.superclass.constructor.call(this,{
      len: size.len,
      alllen: size.alllen
    });
    //如果是响应式，则监听window大小改变事件
    if(conf.change){
      var evtname = 'resize';
      if('onorientationchange' in window){
        evtname = 'onorientationchange';
      }
      $(window).bind(evtname, function(){
        var size = getConSize();
        if(size.len != this.len || size.alllen != this.alllen){
          that.resizeBeginCal.fire();
          that.resetParam(size);
          that.scrollNode.css(animateName, that.left + 'px');
          that.resizeEndCal.fire();
        }
      });
    }
  }
  
  //继承父类
  $extendClass(scroll, $baseScroll);
  
  /**
   * 设置动画参数，参数同jquery.animate( properties, options )
   * 如果需要加入自定义的动画，则可在调用animate,prev,next,focus,circle方法前，调用此方法修改动画参数
   * @params prop properties
   * @param options options
   */
  scroll.prototype.setAnimate = function(prop,options){
  	this._animateProp = prop || {};
  	$.extend(this._animateOption,options || {});
  };
  /**
   * 动画滚动 
   * @param {Number} 将要滚动到的距离
   */
  scroll.prototype.animate = function(left){
	 this.animateCal.fire(this.getIndex());
	 var animateObj = this._animateProp;
	 animateObj[animateName] = left + 'px';
	 this.scrollNode.animate(animateObj,this._animateOption);
  };
  /**
   * 上一页,做出相应动画
   * @return {Number|Null} 上一页后应该滚动到的距离，如果无法再到上一页，则返回null
   */
  scroll.prototype.prev = function(){
    var left = scroll.superclass.prev.call(this);
    if(left != null){
      this.animate(left);
    }
    return left;
  };
  
  /**
   * 下一页,做出相应动画
   * @return {Number|Null} 下一页后应该滚动到的距离，如果无法再到上一页，则返回null
   */
  scroll.prototype.next = function(){
    var left = scroll.superclass.next.call(this);
    if(left != null){
      this.animate(left);
    }
    return left;
  };
  
  /**
   * 定位到第几屏滚动
   * @param {Number} index 当前要滚动到第几屏
   * @return {Number|Null} 应该滚动到的距离，如果无法滚动，则返回null
   */
  scroll.prototype.focus = function(index){
    var left = scroll.superclass.focus.call(this,index);
    if(left != null){
      this.animate(left);
    }
    return left;
  };
  
  /**
   * 循环滚动 
   * @return {Number} 应该滚动到的距离
   */
  scroll.prototype.circle = function(){
    var left = scroll.superclass.circle.call(this,this.direction);
    if(left != null){
      this.animate(left);
    }
    return left;
  };
  
  return scroll;
});
