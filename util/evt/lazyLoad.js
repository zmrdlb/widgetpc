define(['libevt/posWinScrollDelay'],function($posWinScroll){
    return {
        /**
         * 监听lazyload
         * @param {Object} opt
         * {
         *   *node {dom} 表示滚动到该节点的底部
         *   *call: function(pos,node){} //当计算了元素相对于window的位置后回调的函数
         *      call回调参数说明：
         *          pos: {
                        tt: 0, //元素顶部距离window顶部的距离。>0表示元素顶部在window顶部下面；<0表示元素顶部在window顶部上面
                        bt: 0, //元素底部距离window顶部的距离。>0表示元素底部在window顶部下面；<0表示元素底部在window顶部上面
                        ll: 0, //元素左部距离window左部的距离。>0表示元素左部在window左部右面；<0表示元素左部在window左部左面
                        rl: 0, //元素右部距离window左部的距离。>0表示元素右部在window左部右面；<0表示元素右部在window左部左面
                        bb: 0  //元素底部距离window底部的距离。>0表示元素底部在window底部上面；<0表示元素底部在window底部下面
                    }
                    node: 当前dom对象
             offset {Number} 偏移量，选填项，默认30。
         *      offset > 0 当node底部距离window底部<=|offset|，且node底部在window底部下方，则开始出发call
         *      offset == 0 当node底部完全处于window底部，就触发call
         *      offset < 0 当node底部距离window底部>=|offest|，且node底部在window底部上方，则开始出发call
         *   filter {Function} 过滤条件
         *     如果filter返回true,则滚动到底部时会触发call回调，否则不触发。默认一直返回true。
         *     如果filter不是function类型，则使用默认方式返回true
         * }
         */
        listen: function(opt){
            opt = $.extend({
                node: null,
                offset: 30,
                filter: function(){return true;},
                call: function(pos,node){}
            },opt || {});
            $posWinScroll.listenPos({
                node: node,
                filter: opt.filter,
                call: function(pos,node){
                    if(pos.bb+opt.offset >= 0){
                        opt.call(pos,node);
                    }
                },
            });
        }
   };
});
