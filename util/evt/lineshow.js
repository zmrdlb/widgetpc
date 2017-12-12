/**
 * @fileoverview 控制指定区域，显示固定行数，判断是否还有更多 。
 * 监听窗口resize。
 * @author Linda Zhang
 * @example
 *
 *  requirejs(['libevt/lineshow'],function(LineShow){
 *
 *     var lineshow = new LineShow(node,2);

       lineshow.checkCall.add(function(canshowall){
         if(canshowall){ //说明可以全部显示完2行
           //更多按钮隐藏
         }else{
           //更多按钮显示
         }
       });

       //特殊情况，需要改写算法。一般不用
       lineshow.algorithm = function(){
         if(可以全部显示完2行){
           return true;
         }else{
           return false;
         }
       }

       //初始化检测
       lineshow.check();
 *  });
 */

define([
  '$',
  'libevt/winresize'
],function(
  $,
  WinResize
){

  /**
   * 显示指定行数控制类
   * @param {JQuery Element} root  待监听的元素
   *    要求初始化的时候，root设置了以下css
   *
   *     max-height: 指定linenum高度
         overflow: hidden;
         &.showall { //显示全部
           overflow: visible;
           max-height: none;
         }

   * @param {Number} linenum 行数
   * @param {Boolean} [resize] default: true
   *        窗口resize时，root的宽度是否会变化。变化，则要监听window resize事件
   *
   * @constructor
   */
  function LineShow(root,linenum,resize){
    this.root = root;
    this.linenum = linenum;

    //单行高度
    this.oneheight = Math.floor(root[0].offsetHeight / linenum);
    //半行高度
    this.halfheight = Math.floor(this.oneheight/2);

    //检测后的回调。参数：指定行数是否可以显示完。true:可以。 false:不可以
    this.checkCall = $.Callbacks();

    //监听
    if(resize == undefined || typeof resize != 'boolean'){
      resize = true;
    }
    this.resize = resize;

    if(resize){
      this._listenResizeParams = {
        call: function(){
          this.check();
        }.bind(this)
      }

      WinResize.listen(this._listenResizeParams);
    }

  }

  /**
   * 默认计算root里面的内容，实际指定行数linenum是否可以放的下的算法
   * 根据实际情况，开发者可自行改写
   * @return {Boolean} true: 放的下 false:放不下
   */
  LineShow.prototype.algorithm = function(){
    var root = this.root[0];
    return root.scrollHeight - this.oneheight*this.linenum < this.halfheight;
  }

  /**
   * 检测root里面的内容，实际指定行数linenum是否可以放的下
   *  规定实际高度 - 指定行高度 >= 半行高度
   * @return {[type]} [description]
   */
  LineShow.prototype.check = function(){
    if(!this.algorithm()){
      this.checkCall.fire(false);
    }else{
      this.checkCall.fire(true);
    }
  }

  LineShow.prototype.destroy = function(){
    if(this.resize){
      WinResize.unlisten(this._listenResizeParams);
    }
  }

  return LineShow;

});
