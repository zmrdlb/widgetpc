/**
 * @fileoverview 表单验证 - 数字验证类
 * @version 1.0 | 2017-01-19 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * */
 define(['$','libform/pattern','libform/verify','libinherit/extendClass','libbase/util'],
function($,Pattern,Verify,ExtendClass,Util){
    /**
     * 数字验证类。参数同Verify参数
     * @param *root: 数据验证的input节点
     * @param opts: 一些额外配置
     */
    function VerifyNumber(root,opts){
        if(root == null){
            throw new Error('VerifyNumber必须传入有效root');
        }

        VerifyNumber.superclass.constructor.call(this,root,opts);

        this._verifytype = 'number';

        //扩展参数
        /**
       *  新增的opts配置说明如下：
       * ｛
       *      isinteger: false, //是否必须是整数，默认为false，允许小数
       *      decimaldigits: 2|null, //如果integer为false, 则验证传入的小数位数。默认为null, 不验证
       *      min: 0, //最小值，默认为null
       *      max: 0, //最大值, 默认为null
       *      errmsg: {
       *          typeerror: '必须是数字' //类型错误
       *          isinteger: '输入值必须是整数',
       *          decimaldigits: '最多允许${decimaldigits}位小数',
       *          min: '最小值为${min}',
       *          max: '最大值为${max}'
       *      }
       *  ｝
       *  这些配置全部都放在了this.config中
       */
        //新增参数
        Util.merge(this.config,{
            isinteger: false,
            decimaldigits: null,
            min: null,
            max: null
        },false,false);

        Util.merge(this.config.errmsg,{
            typeerror: '必须是数字',
            isinteger: '输入值必须是整数',
            decimaldigits: '最多允许'+this.config.decimaldigits+'位小数',
            min: '最小值为'+this.config.min,
            max: '最大值为'+this.config.max
        },false,false);
    }

    ExtendClass(VerifyNumber,Verify);

    /**
   * 数据验证
   * @param {String} value 值，可不填。
   * @return {String|Null} 如果发生了err,则返回对应的错误提示信息. 否则，返回null
   */
    VerifyNumber.prototype._verify = function(value){
        var _supererrmsg = VerifyNumber.superclass._verify.call(this,value);

        if(_supererrmsg != null){
            return _supererrmsg;
        }

        var config = this.config, val = this.val(), numreg = /^\-?\d+(\.\d+)?$/; //运行整数和小数同时存在的正则

        if(val != ''){
              //验证数据有效性
              if(config.isinteger){ //必须是整数
                  numreg = /^\-?\d+$/;
                  if(!numreg.test(val)){
                      return config.errmsg.isinteger;
                  }
              }else{
                  if(!numreg.test(val)){
                      return config.errmsg.typeerror;
                  }
                  if(config.decimaldigits != null && typeof config.decimaldigits == 'number'){ //允许是小数，且指定了小数位数
                      numreg = new RegExp('^\-?\\d+(\.\\d{1,'+config.decimaldigits+'})?$');
                      if(!numreg.test(val)){
                          return config.errmsg.decimaldigits;
                      }
                  }
              }

              val = Number(val);

              if(config.min != null && val < config.min){
                  return config.errmsg.min;
              }
              if(config.max != null && val > config.max){
                  return config.errmsg.max;
              }
        }

        return null;
    }

    return VerifyNumber;

});
