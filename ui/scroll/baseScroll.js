/**
 * @fileoverview Sina 基本滚动类，主要用于根据滚动区域和容器的尺寸永远计算各种滚动类型该滚动的距离
 * @version 1.0 | 2014-02-28 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 * @param {
 *   *len: 0, //每次滚动的长度
     *alllen: 0 //总共滚动的长度
 * }
 * 
 * @return 基本滚动类返回的接口，更多详细说明请见定义具体接口位置的说明
 * len {Number} 每次滚动的长度
 * alllen {Number} 总共滚动的长度
 * canscroll {Boolean} 是否可以滚动
 * left {Number} 当前滚动定位到的距离，是负数 <=0，相对于left和top的位置概念设定
 * count {Number} 计算出一次性总共滚动多少屏
 * resetParam {Function} 重新设置参数的方法
 * getIndex {Function} 获取当前滚动到了第几屏,从1开始计
 * canprev {Function} 是否还有上一页,包括滚动区存在截断不能填满的情况
 * cannext {Function} 是否还有下一页,包括滚动区存在截断不能填满的情况
 * prev {Function} 上一页
 * next {Function} 下一页
 * focus {Function} 定位到第几屏滚动
 * circle {Function} 循环滚动
 */
define(['$'], function($){
  /**
   * 计算滚动数据项的基类
   * @param {Object} opt
   */
  function baseScroll(opt){
    var that = this;
    var checkargs = function(){
      //数据校验,检测是否可以滚动
      if(that.len >= that.alllen || that.len <= 0 || that.alllen <= 0){
        that.canscroll = false;
        that.count = 0; //根据len和alllen计算出全部滚动有多少屏
      }
      else{
        that.canscroll = true; //是否可以滚动
        that.count = Math.ceil(that.alllen/that.len);
      }
    };
    var conf = $.extend({
      len: 0, //每次滚动的长度
      alllen: 0 //总共滚动的长度
    }, opt || {});
    this.len = conf.len;
    this.alllen = conf.alllen;
    this.left = 0; //记录待滚动的区域当前的left或top,带有数字符号的距离
    checkargs();
    /**
     * 重新设置参数的方法 
     * this.left会根据之前滚动的位置和新设置的参数来确定新的当前滚动的位置
     */
    this.resetParam = function(spec){
      //大致确定当前滚动了几屏
      var index = this.getIndex() - 1;
      this.len = spec.len || this.len;
      this.alllen = spec.alllen || this.alllen;
      checkargs();
      if(this.canscroll && index <= this.count - 1){
        this.left = 0 - index * this.len;
      }
      else{
        this.left = 0;
      }
    };
  };
  
  /**
   * 获取当前滚动到了第几屏,从1开始计
   */
  baseScroll.prototype.getIndex = function(){
    return Math.abs(this.left) / this.len + 1;
  };
  
  /**
   * 是否还有上一页,包括滚动区存在截断不能填满的情况
   */
  baseScroll.prototype.canprev = function(){
    if(this.left + this.len >= this.len){
      return false;
    }
    else{
      return true;
    }
  };
  
  /**
   * 是否还有下一页,包括滚动区存在截断不能填满的情况
   */
  baseScroll.prototype.cannext = function(){
    if(this.len - this.left >= this.alllen){
      return false;
    }
    else{
      return true;
    }
  };
  
  /**
   * 上一页
   * @return {Number|Null} 上一页后应该滚动到的距离，如果无法再到上一页，则返回null
   */
  baseScroll.prototype.prev = function(){
    if(this.canscroll && this.canprev()){
      this.left += this.len;
      return this.left;
    }
    else{
      return null;
    }
  };
  
  /**
   * 下一页
   * @return {Number|Null} 下一页后应该滚动到的距离，如果无法再到上一页，则返回null
   */
  baseScroll.prototype.next = function(){
    if(this.canscroll && this.cannext()){
      this.left -= this.len;
      return this.left;
    }
    else{
      return null;
    }
  };
  
  /**
   * 定位到第几屏滚动
   * @param {Number} index 当前要滚动到第几屏,从1开始算起
   * @return {Number|Null} 应该滚动到的距离，如果无法滚动，则返回null
   */
  baseScroll.prototype.focus = function(index){
    if(this.canscroll && index >=1 && index <= this.count){
      var newleft = 0 - this.len * (index - 1);
      if(this.left != newleft){
        this.left = newleft;
        return this.left;
      }
      return null;
    }
    else{
      return null;
    }
  };
  
  /**
   * 循环滚动 
   * @param {String} direction 方向   shun:顺时针  ni:逆时针
   * @return {Number} 应该滚动到的距离
   */
  baseScroll.prototype.circle = function(direction){
    var left = null;
    //顺时针循环滚动
    if(direction == 'shun'){
      left = this.next();
      if(left == null){
        //说明已是最后一页，则跳到第一页
        this.left = 0;
      }
    }
    //逆时针循环滚动
    else{
      left = this.prev();
      if(left == null){
        //说明已是第一页，则跳到最后一页
        this.left = this.len - this.alllen;
      }
    }
    return this.left;
  };
  
  return baseScroll;
});
