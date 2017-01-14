/**
 * @fileoverview 表单验证 - 基类
 *
 * @version 1.0 | 2017-01-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * */
define(['$'],function($){
    /**
   * @param *root: 数据验证的input节点
   * @param opts: 一些额外配置
   */
    function Verify(root,opts){
         if(root == null){
             throw new Error('Verify必须传入有效root');
         }else{
             this.root = root;
         }

         //默认参数
         var _opt = {
             //以下配置首先取dom中的属性配置。也可以在opts传入覆盖
             required: root.attr('required') != undefined? true: false,
             placeholder: root.attr('placeholder') || null,
             errornodeselector: root.attr('errornodeselector') || null, //错误提示信息dom选择器

             //以下需要在opts中传入覆盖
             autoverify: true, //是否自动绑定验证。如果为true, 则监听root对应的事件进行验证
             errorclass: 'error', //节点验证失败，添加的classname
             trim: true, //是否将value去掉首位空格。如果_verifytype是password, 则force此项是false
             pattern: null, //正则
             errmsg: {
                 required: '此项必填',
                 placeholder: '输入值不能是默认提示文案',
                 pattern: '正则表达式匹配不正确'
             },
             success: function(){}, //验证成功
             fail: function(){} //验证失败
         };

         $.extend(true,_opt,opts);
         if(_opt.errornodeselector != null){
             _opt.errnode = $(_opt.errornodeselector);
         }

         this.config = _opt;
         this.successCal = $.Callbacks();
         this.failCal = $.Callbacks();
         this.verifyyes = false; //验证是否成功

         this._verifytype = 'base'; //验证类型，字符串

         if(this.config.autoverify){
             this._bindAutoverify();
         }
    }

    /**
     * 绑定自动表单验证
     * 后续子类，可以根据dom类型来重写。基类以input,textarea为准
     * @return {[type]} [description]
     */
    Verify.prototype._bindAutoverify = function(){
        var config = this.config, root = this.root, _this = this;

        root.on('blur',function(e){
            var err = _this.verify();
            if(err == null){
                root.removeClass(config.errorclass);
                config.errnode.html('');
            }else{
                root.addClass(config.errorclass).focus();
                if(config.errnode && config.errnode.length > 0){
                    config.errnode.html(err);
                }
            }
        }).on('focus',function(e){
            root.removeClass(config.errorclass);
        });
    }

    /**
     * 获取输入框值
     * @return {[type]} [description]
     */
    Verify.prototype.val = function(){
        var val = this.root.val();
        if(this.config.trim){
            val = $.trim(val);
        }
        return val;
    }
    /**
   * 数据验证
   * @param {String} value 值，可不填。
   * @return {String|Null} 如果发生了err,则返回对应的错误提示信息. 否则，返回null
   */
    Verify.prototype._verify = function(value){
        var config = this.config, val = value != undefined? value: this.val();

       //开始验证
       if(config.required){ //必填
           if(val == ''){
               return config.errmsg.required;
           }
       }
       if(config.placeholder != null && val == config.placeholder){ //验证是否等于placeholder
           return config.errmsg.placeholder;
       }

       if(config.pattern != null && !config.pattern.test(val)){
           return config.errmsg.pattern;
       }

       return null;
    }

    /**
   * 数据验证
   * @param {String} value 值，可不填。
   * @return {String|Null} 如果发生了err,则返回对应的错误提示信息. 否则，返回null
   */
    Verify.prototype.verify = function(value){
       var err = this._verify(value);

       if(err == null){
           this.verifyyes = true;
           this.config.success();
           this.successCal.fire();
       }else{
           this.verifyyes = false;
           this.config.fail();
           this.failCal.fire();
       }

       return err;
    }

    return Verify;
});
