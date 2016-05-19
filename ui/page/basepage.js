/**
 * @fileoverview 分页基类，提供算法，不涉及到dom
 * @version 1.0 | 2015-11-16 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 * @param {
 *    cur: 1, //当前默认显示的页码索引
      pageCount: 0, //页面总数
      pageNum: 5, //显示几个页码标签，不包括splittext。pageCount<=pageNum则输出全部页码，不进行截取。如果pageNum<=0则有多少页则输出多少页码。默认是5
      splittext: '...' //页码之间的分隔符
 * }
 * @return 
 *  pageargs {Object} 格式如同给构造函数传递的参数
 *  checkpageargs {Function} 检测参数的有效性
 *  setpageargs {Function} 设置参数方法
 *  getPageObj {Function} 根据指定页码返回页码列表，详细说明请见该方法注释
 * */
define(['libbase/checkDataType'],function($checkDataType){
  /**
   * 分页基类，提供算法，不涉及到dom 
   */
  function basepage(opt){
    this.setpageargs(opt);
  }
  
  /**
   * 检测参数的有效性 
   */
  basepage.prototype.checkpageargs = function(){
    var pageargs = this.pageargs;
    var checkname = ['cur','pageCount','pageNum'];
    var result = true;
    for(var i = 0, len = checkname.length; i < len; i++){
        if(!$checkDataType.isNumber(pageargs[checkname[i]])){
            result = false;
            break;
        }
    }
    if(result){
        if(pageargs.pageCount <= 0 || pageargs.cur < 1 || pageargs.cur > pageargs.pageCount){
          return false;
        }
    }
    return true;
  };
  
  /**
   * 设置页码相关的参数，不涉及dom
  */
  basepage.prototype.setpageargs = function(opt){
    this.pageargs = $.extend({
      cur: 1, //当前默认显示的页码索引
      pageCount: 0, //页面总数
      pageNum: 5, //显示几个页码标签，不包括splittext。pageCount<=pageNum则输出全部页码，不进行截取。如果pageNum<=0则有多少页则输出多少页码。默认是5
      splittext: '...' //页码之间的分隔符
    }, opt || {});
    if(!this.checkpageargs()){
      throw new Error('页码相关参数无效');
    }
  };
    
  /**
   * 根据指定当前页码反回整体待渲染的页码列表对象 
   * @param {Number} cur 当前页码
   * @return {
   *   max: 页面总数
       cur: 当前页码索引
       nums: [{
         index: 页码数。如果是-1则表示是参数splittext设置的值
         text: 页码显示文案
       }] //当前页码列表
   * }
   */
  basepage.prototype.getPageObj = function(cur){
    var pageargs = this.pageargs;
    if(!$checkDataType.isNumber(cur) || cur < 1 || cur > pageargs.pageCount){
      throw new Error('当前指定页码区间无效');
    }
    cur = parseInt(cur);
    pageargs.cur = cur; //更新当前页码索引
    //根据当前页反正页码排列渲染对象
    var obj = {
      max: pageargs.pageCount, //页面总数
      cur: cur, //当前页码索引
      nums: [] //当前页码列表
    };
    //算法
    //输出全部页码
    if(pageargs.pageCount <= pageargs.pageNum || pageargs.pageNum <= 0){
      for(var i = 1; i <= pageargs.pageCount; i++){
        obj.nums.push({
          index: i,
          text: i
        });
      }
    }
    else{
      var i = pageargs.pageNum - 1;
      var page = 1; //起始页码
      var offset = Math.floor(i/2);//设定偏移量，计算当前属于哪种显示类型
      if(Math.abs(1-cur) <= offset){
        //说明是1 2 3 4 ... 10
        page = 1;
        while(i > 0){
          i--;
          obj.nums.push({
            index: page,
            text: page
          });
          page++;
        }
        obj.nums.push({
          index: -1,
          text: pageargs.splittext
        });
        obj.nums.push({
          index: pageargs.pageCount,
          text: pageargs.pageCount
        });
      }
      else if(Math.abs(pageargs.pageCount-cur) <= offset){
        //说明是1... 7 8 9 10形式
        page = pageargs.pageCount - pageargs.pageNum + 2;
        obj.nums.push({
          index: 1,
          text: 1
        });
        obj.nums.push({
          index: -1,
          text: pageargs.splittext
        });
        while(i > 0){
          i--;
          obj.nums.push({
            index: page,
            text: page
          });
          page++;
        }
      }else{
        //说明是1...3 4 5...10
        i = pageargs.pageNum - 2;
        page = cur - Math.floor(i/2);
        obj.nums.push({
          index: 1,
          text: 1
        });
        obj.nums.push({
          index: -1,
          text: pageargs.splittext
        });
        while(i > 0){
          i--;
          obj.nums.push({
            index: page,
            text: page
          });
          page++;
        }
        obj.nums.push({
          index: -1,
          text: pageargs.splittext
        });
        obj.nums.push({
          index: pageargs.pageCount,
          text: pageargs.pageCount
        });
      }
    }
    return obj;
  };
  
  return basepage;
});
