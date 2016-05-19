/**
 * @fileoverview 输入框input或textarea，监听其输入值改变时，触发相关回调。
 * @version 1.0.0 | 2015-12-21 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 
 * @example
 * requirejs(['$','libevt/inputchange'],function($,$inputchange){
 *     var inputchange = new $inputchange(我的输入框节点);
 *     inputchange.changeCal.add(function(val){
 *          console.log('当前输入框值，未经过$.trim处理'+val);
 *     });
 * });
 * */
define(['$','libcompatible/deviceevtname','libdom/checknode','libbase/checkDataType'],function($,$deviceevtname,$checknode,$checkDataType){
    /**
     * 监听输入框值改变类 
     * @param {Element} *node 输入框节点
     * @param {Boolean} trim 输入框中的值是否trim后再进行change判断。默认为false
     */
    function Inputchange(node,trim){
        $checknode(node,'组件libevt/inputchange传入参数无效');
        if(!$checkDataType.isBoolean){
            trim = false;
        }
        this.changeCal = $.Callbacks(); //输入框值改变的回调
        var that = this;
        var oldval = node.val();
        if(trim){
            oldval = $.trim(oldval);
        }
        node.on($deviceevtname.input, function(){
            var newval = node.val();
            if(trim){
                newval = $.trim(newval);
            }
            if(newval != oldval){
                oldval = newval;
                that.changeCal.fire(oldval);
            }
        });
    }
    return Inputchange;
});
