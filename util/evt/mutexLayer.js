/**
 * @fileoverview 
 *      1. 给浮层添加点击body其他区域（不包括参考节点node区域），触发其隐藏事件；
 *      2. 针对属于同一组的浮层，实现互斥显示效果。如果未给其设置组名称，则默认浮层属于整个页面组。
 * @version 1.0.0 | 2015-12-21 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 
 * @example
 * requirejs(['$','libevt/mutexLayer'],function($,$mutexLayer){
 *      var mutex = new $mutexLayer({
 *          //必填
 *          node: 我的浮层节点
 *          onhide: function(){//隐藏浮层} 
 *          //选填
 *          group: 'mygroupname'
 *      });
 *      //当浮层显示时，调用
 *      mutex.show();
 * });
 * */
define(['$','libbase/uniqueNum','libdom/checknode','libbase/mergeobj','libcompatible/deviceevtname','libbase/checkDataType'],
function($,$uniqueNum,$checknode,$mergeobj,$deviceevtname,$checkDataType){
    var bodyCall = $.Callbacks(); //点击body的回调
    $('body').on($deviceevtname.click,function(e){
         bodyCall.fire();
    });
    /**
     * 当浮层显示时触发此方法
     */
    var otherCall = $.Callbacks();
    /**
     * 实现浮层互斥效果类 
     */
    function MutexLayer(opt){
        opt = $.extend({
            //必填
            node: null, //参考节点。点击node内部，则不会触发body的点击事件。
            onhide: null, //浮层的隐藏回调事件
            //选填
            group: 'page', //浮层所属组，默认属于整个页面page
            bodyhide: true, //是否当点击浮层以外的空白区域时，触发浮层的隐藏回调事件
            otherhide: true //是否当属于同一个group的其他浮层显示时，触发浮层的隐藏回调事件
        },opt);
        $checknode(opt.node,'组件libevt/mutexLayer传入参数node无效');
        if(!$checkDataType.isFunction(opt.onhide)){
            throw new Error('组件libevt/mutexLayer传入参数onhide无效');
        }
        //赋值
        this.unique = $uniqueNum(); //浮层唯一键值
        $mergeobj(this,opt,true,['node','group','bodyhide','otherhide','onhide']);
        //事件绑定
        var that = this;
        if(opt.bodyhide){ //绑定点击body其他区域浮层隐藏事件
            opt.node.on($deviceevtname.click,function(e){
                e.stopPropagation();
            });
            bodyCall.add(function(){
                that._hide();
            });
        }
        if(opt.otherhide){ //与同组的其他浮层实现互斥
            otherCall.add(function(group,unique){
                if(that.group == group && that.unique != unique){
                    that._hide();
                }
            });
        }
    }
    
    /**
     * 当浮层显示，调用此方法 
     */
    MutexLayer.prototype.show = function(){
        otherCall.fire(this.group,this.unique);
    };
    
    /**
     * 隐藏浮层 
     */
    MutexLayer.prototype._hide = function(){
        this.onhide();
    };
    
    return MutexLayer;
});
