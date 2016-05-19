/**
 * @fileoverview 分页类，渲染页码容器，绑定事件。继承basepage
 * @version 1.0 | 2015-11-16 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 * @param {
 *    pageargs: {}, //页码相关参数，传给基类，请查看基类参数说明
      con: null, //页码容器
      tpl: '', //页码模板
      cutevt: 'click', //页码切换事件，默认为系统检测的click或touchend
      initFireChange: false, //当page对象首次创建时，或者调用对象的resetpage方法时，是否调用pagechangecal。默认不调用（false）
      /**
         * 页码改变后的回调事件,传递的参数如下：
         *{
         *   max: 页面总数
             cur: 当前页码索引
             nums: [{
               index: 页码数.如果是-1则表示是参数splittext设置的值
               text: 页码显示文案
             }] //当前页码列表
         * } 
      pagechangeCal: $.noop
 * }
 * @return 只说明新添加的或重写的，继承基类的返回请参见基类说明
 *  opt {Object} page类传入的参数
 *  gopage {Function} 跳转到指定的页码,渲染分页html，并触发pagechangeCal
 *  resetpage {Function} 重新设置分页参数
 * */

define(['$','libcompatible/deviceevtname','libinherit/extendClass','libpage/basepage','libbase/checkDataType','libtpl/template','libpage/tpl/pagetpl'], 
function($,$deviceevtname,$extendClass,$basepage,$checkDataType,$template,$pagetpl){
  function page(opt){
    var that = this;
    opt = $.extend(true,{
      pageargs: {}, //页码相关参数，传给基类
      con: null, //页码容器
      tpl: $pagetpl, //页码模板
      cutevt: $deviceevtname.click, //页码切换事件，默认为系统检测的click或touchend
      initFireChange: false, //当page对象首次创建时，或者调用对象的resetpage方法时，是否调用pagechangecal。默认不调用（false）
      /**
         * 页码改变后的回调事件,传递的参数如下：
         *{
         *   max: 页面总数
             cur: 当前页码索引
             nums: [{
               index: 页码数。如果是-1则表示是参数splittext设置的值
               text: 页码显示文案
             }] //当前页码列表
         * } 
         */
      pagechangeCal: $.noop
    },opt);
    //参数检测
    if(!$checkDataType.isValidJqueryDom(opt.con) || !$checkDataType.isString(opt.tpl) || opt.tpl == ''){
      throw new Error('组件page传入参数无效');
    }
    //基类初始化
    page.superclass.constructor.call(this, opt.pageargs);
    //赋值
    this.opt = opt;
    
    //事件绑定
    var bindEvt = function(){
      opt.con.on(opt.cutevt, '[node="pagenum"]', function(e){
        e.preventDefault();
        var cur = parseInt($(this).attr('num'));
        that.gopage(cur);
      });
    };
    bindEvt();
    this._initRenderFire();
  }
  
  //继承父类
  $extendClass(page, $basepage);
  /**
   * 当page对象首次创建时，或者调用对象的resetpage方法时，判断是否触发pagechangeCal方法
   * @param {Object} *data getPageObj方法返回的数据
   */
  page.prototype._initFireChange = function(data){
      if(this.opt.initFireChange){ //对象创建时调用回调
          if($checkDataType.isFunction(this.opt.pagechangeCal)){
              this.opt.pagechangeCal(data);
          }
      }
  };
  /**
   * 私有页码渲染方法 
   */
  page.prototype._render = function(data){
      var render = $template.compile(this.opt.tpl);
      var html = render(data);
      this.opt.con.html(html);
      return data;
  };
  /**
   * 当page对象首次创建时，或者调用对象的resetpage方法时，渲染当前页面的分页html，并根据传入的initFireChange判断是否触发pagechangeCal
   */
  page.prototype._initRenderFire = function(){
      var data = this.getPageObj(this.pageargs.cur);
      this._render(data);
      this._initFireChange(data);
      return data;
  };
  /**
   * 跳转到指定的页码,渲染分页html，并触发pagechangeCal
   * @param {Number} *pagenum 页码。如果pagenum<1或大于页码总数则报错
   * @param {Boolean} force 强制重新跳转页码。默认为false；如果为true，则pagenum==当前页面，也会执行
   */
  page.prototype.gopage = function(pagenum,force){
      //防止同一页码重复点击
      if(pagenum != this.pageargs.cur || force){
        var data = this.getPageObj(pagenum);
        this._render(data);
        if($checkDataType.isFunction(this.opt.pagechangeCal)){
            this.opt.pagechangeCal(data);
        }
      }
  };
  /**
   * 重新设置分页参数并渲染页码dom
   * @param {Object} opt 可只填其中一项
   * {
   *  cur: 1, //当前默认显示的页码索引
      pageCount: 0, //页面总数
      pageNum: 5, //显示几个页码标签，不包括splittext。小于5则输出全部页码，不进行截取。如果<=0则有多少页则输出多少页码
      splittext: '...' //页码之间的分隔符
   * }
   */
  page.prototype.resetpage = function(opt){
    this.setpageargs(opt);
    this._initRenderFire();
  };
  return page;
});
