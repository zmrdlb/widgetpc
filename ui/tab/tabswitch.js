/**
 * @fileoverview tab切换组件。更详细的参数说明请见代码中conf处
 * @version 1.0 | 2015-12-08 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['$','libtab/tabswitch'],function($,$tabswitch){
     *   var tabobj = tabswitch(容器节点,{
             tabSelector: '[node="tab"]', //tab选择器
             conSelector: '[node="tabcon"]', //tab内容区选择器
             tabchange: function(index,type,tabnode,connode){
                 console.log(index);
                 console.log(type);
             }
         }); 
         //tabobj.showTab(2); 手动切换tab显示
 * });
 * */
define(['$','libdom/checknode','libbase/checkDataType','libcompatible/deviceevtname'], function($,$checknode,$checkDataType,$deviceevtname){
    /**
     * 入口，绑定tab切换 
     * @param {Object} root 根节点
     * @param {Object} opt 扩展参数
     */
    function TabSwitch(root,opt){
        $checknode(root,'组件tabSwitch传入参数无效');
        var conf = $.extend({
            tabSelector: '[node="tab"]', //tab选择器
            conSelector: '[node="tabcon"]', //tab内容区选择器
            curclass: 'cur', //选中的tab的class
            showindex: 1, //初始化显示第几个tab
            tabfixed: true, //tab或tabcon是否固定（即不会动态增删），如果不固定，请设置为false
            /**
             * tab切换的回调，会防止重复点击。
             * @param index 当前index的索引，从1开始
             * @param type 触发tabchange的类型。 
             *      'click':点击tab触发|组件创建时可能触发
             *      'trigger': 代码调用showTab方法触发;
             * @param tabnode 当前选中的tab节点
             * @param connode 当前选中的con节点
             */
            tabchange: function(index,type,tabnode,connode){}, 
            /**
             * 组件创建时，是否调用tabchange。默认是false
             * 如果为true,就算是重复点击了，也会调用。如showindex是1，而页面本来默认显示的tab也是1
             */
            initFireChange: false
        },opt);
        
        function getNodes(selector,funobj){
            if(conf.tabfixed){ //说明固定，不会更改
                if(funobj.node == undefined){
                    funobj.node = root.find(selector);
                }
            }else{
                funobj.node = root.find(selector);
            }
            return funobj.node;
        }
        function getTabsNode(){
            return getNodes(conf.tabSelector,getTabsNode);
        }
        function getConsNode(){
            return getNodes(conf.conSelector,getConsNode);
        }
        
        /**
         * 显示指定的tab 
         * @param {Number} *index 索引,从1开始
         * @param {Boolean} *type 触发tabchange的类型。 'click':点击tab触发|组件创建时可能触发   'trigger': 代码调用showTab方法触发
         * @param {Boolean} first 是否是组件初始化时调用
         */
        function showTab(index,type,first){
            var tabs = getTabsNode();
            var cons = getConsNode();
            if(tabs.length < index || cons.length < index){
                return;
            }
            if(tabs.eq(index-1).hasClass(conf.curclass) && cons.eq(index-1).css('display') != 'none'){ //说明当前index已经是cur状态
                if(first && conf.initFireChange){ //说明首次要触发change
                    if($checkDataType.isFunction(conf.tabchange)){
                        conf.tabchange(index,type,tabs.eq(index-1),cons.eq(index-1));
                    }
                }
                return;
            }
            tabs.eq(index-1).addClass(conf.curclass).siblings().removeClass(conf.curclass);
            cons.eq(index-1).show().siblings().hide();
            if($checkDataType.isFunction(conf.tabchange)){
                conf.tabchange(index,type,tabs.eq(index-1),cons.eq(index-1));
            }
        };
        
        /**
         * 绑定事件 
         */
        function bindEvt(){
            root.on($deviceevtname.click,conf.tabSelector,function(e){
                e.preventDefault();
                var tabs = getTabsNode();
                var index = tabs.index($(this)) + 1;
                showTab(index,'click');
            });
        }
        
        /**
         * 初始化 
         */
        function init(){
            showTab(conf.showindex,'click',true);
            bindEvt();
        }
        init();
        
        return {
            /**
             * 显示当前指定索引的tab 
             * @param {Object} index
             */
            showTab: function(index){
                showTab(index,'trigger');
            }
        };
    };
    return TabSwitch;
});