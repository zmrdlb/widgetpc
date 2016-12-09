/**
 * @fileoverview Sina 一般滚动。适用场景：
 *      有2个箭头，点击上下箭头，横向或纵向滚动
 * 注意：
 *      scrollNode： 待滚动区域需只包含待滚动项
 * @version 1.0 | 2016-08-02 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 */
define(['$','libscroll/scroll','libinherit/extendClass','libdom/checknode','libbase/mergeobj'],function($,$scroll,$extendClass,$checknode,$mergeobj){
    /**
     * 一般横向滚动类
     * @param {Object} opt 同scroll，并在此基础上新增几项。说明如下
     */
    function ArrowScroll(opt){
        //数据格式化
        opt = $.extend({
            //scroll中的一些参数
            nodes: {
                scrollNode: null, //待滚动区域容器
                conNode: null //展示区域容器
            },
            //新增的项
            root: null, //* {jquery element} 绑定此滚动组件的根节点
            num: 0, //每屏滚动多少个scrollNode里面的子元素。默认是0。如果是0，则每屏滚动的长度是conNode的宽度
            prevSelector: '.js-prev', //上一页节点选择器
            nextSelector: '.js-next', //下一页节点选择器
            disabledClass: '' //上一页或下一页按钮不可点击时添加的class，如果为空，则默认不可点击时隐藏
        },opt);
        //数据监测
        $checknode(opt.root,'ArrowScroll类参数root节点无效');
        var _typeSizeName = {
            'x': ['outerWidth','innerWidth','width'],
            'y': ['outerHeight','innerHeight','height']
        };

        function getMyLen(node,type){
            var funArr = _typeSizeName[type];
            var len = 0;
            $.each(funArr,function(index,funname){
                if(node[funname]){
                    len = node[funname]();
                    return false;
                }
            });
            return len;
        }
        opt.customGetSize = $.proxy(function(){
            var childs = this.scrollNode.children();
            var itemNode = childs.eq(0);
            var itemlen = getMyLen(itemNode,this.type);
            var alllen = itemlen*childs.length;
            if(opt.num <= 0){
                if(this.type == 'x'){
                    var len = this.conNode.width();
                }
                else{
                    var len = this.conNode.height();
                }
            }else{
                var len = itemlen * opt.num;
            }
            return {
                len: len,
                alllen: alllen
            };
        },this);
        //调用父类
        ArrowScroll.superclass.constructor.call(this,opt);
        //设置属性
        $mergeobj(this,opt,true,['root','prevSelector','nextSelector','disabledClass']);
        this.prevNode = $(this.prevSelector,this.root);
        this.nextNode = $(this.nextSelector,this.root);
        //判断是否可以滚动
        if(this.canscroll){
            this.bindEvt();
            this.renderArrow();
        }else{
            this.prevNode.hide();
            this.nextNode.hide();
        }
    }

    //继承
    $extendClass(ArrowScroll, $scroll);

    /**
     * 改变节点的状态
     */
    ArrowScroll.prototype.changeArrowState = function(node,yes){
        if(this.disabledClass != ''){
            if(yes){
                node.removeClass(this.disabledClass);
            }else{
                node.addClass(this.disabledClass);
            }
        }else{
            if(yes){
                node.show();
            }else{
                node.hide();
            }
        }
    };
    /**
     * 渲染上下节点状态
     */
    ArrowScroll.prototype.renderArrow = function(){
        if(this.canprev()){
            this.changeArrowState(this.prevNode,true);
        }else{
            this.changeArrowState(this.prevNode,false);
        }
        if(this.cannext()){
            this.changeArrowState(this.nextNode,true);
        }else{
            this.changeArrowState(this.nextNode,false);
        }
    };

    ArrowScroll.prototype.bindEvt = function(){
        //上一页
        this.root.on('click',this.prevSelector,$.proxy(function(e){
            this.prev();
            this.renderArrow();
        },this));
        //下一页
        this.root.on('click',this.nextSelector,$.proxy(function(e){
            this.next();
            this.renderArrow();
        },this));
    };

    return ArrowScroll;
});
