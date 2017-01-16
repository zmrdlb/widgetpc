/**
 * @fileoverview 整体表单验证
 * @version 1.0 | 2017-01-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 *      <div id="con-form">
 *          <ul>
 *              <li>
                    <div class="title">
                        您的姓名：
                    </div>
                    <div class="control">
                        <input class="g-input" placeholder="请填写您的姓名称呼" type="text" verify="string" required name="name" errornodeselector="#msg-error-name" />
                    </div>
                    <div class="msg-error" id="msg-error-name">

                    </div>
                </li>
                <li>
                    <div class="title">
                        您的邮箱：
                    </div>
                    <div class="control">
                        <input class="g-input" placeholder="请填写您的邮件地址" type="text" verify="string" required verifytype="email" name="email" errornodeselector="#msg-error-email" />
                    </div>
                    <div class="msg-error" id="msg-error-email">

                    </div>
                </li>
 *          </ul>
 *      </div>
 *      requirejs(['$','libform/formverify'],function($,FormVerify){
 *          //表单验证
            var formverify = FormVerify.register($('#con-form'),{
                email: {
                    errmsg: {
                        verifytype: '邮箱格式错误'
                    }
                }
            });

            //点击提交
            $('#btn-submit').on('click',function(){
                var result = formverify.verify();
                if(result.err){
                    _APP.Toast.show('输入框有错');
                }else{
                    console.log(result.data);
                }
            });
 *      })
 * */
define(['$','libform/verifystring'],function($,VerifyString){
    var verifyClass = {
        'string': VerifyString
    };
    /**
     * 表单验证类
     * @param {Node} *root 包含待验证输入框的容器节点
     * @param {JSON} inputconfig 每个待验证输入框的opts配置。
     * {
     *      name属性：根据配置的verify属性查看对应的类opts
     *          verify属性值和相应的类对应如下:
     *              string: VerifyString
     * }
     */
    function FormVerify(root,inputconfig){
        if(root == null){
            throw new Error('FormVerify必须传入有效root');
        }

        this.root = root;
        this.inputconfig = inputconfig || {};
        /**
         * {
         *    表单控件的name属性：表单验证实例化对象
         * }
         * @type {Object}
         */
        this._verifyobj = {};

        this.bind();
    }

    /**
     * 绑定验证
     * @return {[type]} [description]
     */
    FormVerify.prototype.bind = function(){
        var _this = this;
        this.root.find('[verify]').each(function(){
            var node = $(this);
            var name = node.attr('name');
            var verifyobj = new verifyClass[node.attr('verify')](node,_this.inputconfig[name] || {});
            _this._verifyobj[name] = verifyobj;
        });
    }

    /**
     * 获取某个表单控件的验证实例对象
     * @param  {String} name 表单控件的name属性
     * @return {instance of Verify的各种子类}
     */
    FormVerify.prototype.getVerifyObj = function(name){
        return this._verifyobj[name];
    }
    /**
     * 验证
     * @return {
     *     err: {String|Null} 验证结果，如果发生了错误则返回错误信息，否则返回null
     *     data: {JSON} 表单数据。键值对：name->value
     * }
     */
    FormVerify.prototype.verify = function(){
        var err = null, data = {};
        for(var name in this._verifyobj){
            var verifyobj = this._verifyobj[name];
            err = verifyobj.verify();
            data[name] = verifyobj.val();
            if(err != null){
                break;
            }
        }
        return {
            err: err,
            data: data
        };
    }

    /**
     * 获取当前验证状态。注意：
     *  如果里面有一个验证组件，配置的autoverify为false,则不要调用此方法，改为调用verify
     * @return {Boolean} 获取当前组件的验证状态
     */
    FormVerify.prototype.verifystatus = function(){
        var success = true;
        $.each(this._verifyobj,function(index,verifyobj){
            if(!verifyobj.verifyyes){
                success = false;
                return false;
            }
        });
        return success;
    }

    /**
     * 静态方法，注册一个表单验证
     * @param  {[type]} root        [description]
     * @param  {[type]} inputconfig [description]
     * @return {[type]}             [description]
     */
    FormVerify.register = function(root,inputconfig){
        return new FormVerify(root,inputconfig);
    };

    return FormVerify;

});
