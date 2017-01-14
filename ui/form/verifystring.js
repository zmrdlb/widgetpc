/**
 * @fileoverview 表单验证 - 字符串验证类
 * @version 1.0 | 2017-01-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * */
 define(['$','libform/pattern','libform/verify','libinherit/extendClass','libbase/util'],
function($,Pattern,Verify,ExtendClass,Util){
     /**
      * 字符串验证类。参数同Verify参数
      * @param *root: 数据验证的input节点
      * @param opts: 一些额外配置
      */
     function VerifyString(root,opts){
         if(root == null){
             throw new Error('VerifyString必须传入有效root');
         }

         VerifyString.superclass.constructor.call(this,root,opts);

         this._verifytype = 'string';

         //扩展参数
         //新增参数
         Util.merge(this.config,{
             //以下配置首先取dom中的属性配置。也可以在opts传入覆盖
             minlength: this.root.attr('minlength') || null, //如果填写了数据，最小长度
             maxlength: this.root.attr('maxlength') || null, //如果填写了数据，最大长度
    //          数据验证类型，默认为null不验证。可枚举的类别如下：
    //          email 邮箱
    //   *         mobile 手机号码
    //   *         chinese 中文
    //   *         english 英文
    //   *         idcard 合法身份证
    //   *         url 合法url
    //   *         cardno 有效银行卡号
             verifytype: this.root.attr('verifytype') || null
         },false,false);

         Util.merge(this.config.errmsg,{
             minlength: '最少输入'+this.config.minlength+'个字符',
             maxlength: '最多输入'+this.config.maxlength+'个字符',
             verifytype: '数据类型错误'
         },false,false);
     }

     ExtendClass(VerifyString,Verify);

     /**
    * 数据验证
    * @param {String} value 值，可不填。
    * @return {String|Null} 如果发生了err,则返回对应的错误提示信息. 否则，返回null
    */
     VerifyString.prototype._verify = function(value){
         var _supererrmsg = VerifyString.superclass._verify.call(this,value);

         if(_supererrmsg != null){
             return _supererrmsg;
         }

         var config = this.config, val = this.val();

         if(val != ''){
             if(config.minlength != null && val.length < config.minlength){
                 return config.errmsg.minlength;
             }
             if(config.maxlength != null && val.length > config.maxlength){
                 return config.errmsg.maxlength;
             }
             if(config.verifytype != null && config.verifytype != ''){
                 var funname = config.verifytype.replace(/[a-z]/,function(first){
                     return first.toUpperCase();
                 });
                 funname = 'is'+funname;
                 if(Pattern[funname] && !Pattern[funname](val)){
                     return config.errmsg.verifytype;
                 }
             }
         }

         return null;
     }

     return VerifyString;
});
