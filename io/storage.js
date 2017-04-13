/**
 * @fileoverview 使用localStorage进行数据存储
 * @version 1.0 | 2017-04-13 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return
 * */
define(function(){
    /**
     * 数据存储类
     * @param {[type]} opt [description]
     */
    function Storage(opt){
        opt = $.extend({
            /**
             * 存储周期，默认为1天。后缀说明
             * M: 月
             * D: 日
             * H: 小时
             * @type {String}
             * @example 1.5D 0.5H 3M 15D0.2H
             * 特别说明：只支持1位小数
             */
            maxage: '1D',
            key: '' //* 键值
        },opt);

        if(opt.key == '' || opt.maxage == ''){
            throw new Error('libio/storage 参数传入错误');
        }else if(!/^((\d+)(\.([1-9]{1}))?([MDH]))+$/.test(opt.maxage)){
            throw new Error('libio/storage maxage配置格式不正确');
        }

        opt.key = Storage.groupname + '_' + opt.key;

        this.opt = opt;
    }

    /**
     * 计算过期时间点
     * @return {String} DateTime过期时间点字符串
     */
    Storage.prototype._getOutDateTime = function(){
        var maxage = this.opt.maxage,
            nowtime = new Date().getTime(),
            diffhour = 0,
            reg = /(\d+)(\.([1-9]{1}))?([MDH])/g,
            rearr = null;

        while((rearr = reg.exec(maxage)) != null){
            var num = rearr[1], //整数部分
                suffix = rearr[4];
            if(rearr[2]){ //说明存在小数
                num += rearr[2];
            }
            num = Number(num);
            console.log(num);
            switch (suffix) {
                case 'M':
                    diffhour += num*30*24;
                    break;
                case 'D':
                    diffhour += num*24;
                    break;
                case 'H':
                    diffhour += num;
                    break;
                default:
                    break;
            }
        }

        nowtime += diffhour*60*60*1000;

        console.log(nowtime);
        return nowtime;
    };

    /**
     * 数据设置
     * @param {JSON} data 待存储的数据
     * 实际存储的数据格式如下：
     *
     *  {
     *      endTime: {String}
     *      data: data
     *  }
     */
    Storage.prototype.set = function(data){
        if(!data || Object.keys(data).length == 0){
            return;
        }

        localStorage.setItem(this.opt.key, JSON.stringify({
            endTime: this._getOutDateTime(),
            data: data
        }));
    }

    /**
     * 获取数据
     * @return {JSON|Null} 返回set时候的data。如果过期则返回null
     */
    Storage.prototype.get = function(){
        //判断是否过期
        var value = localStorage.getItem(this.opt.key);
        if(value == null){
            return null;
        }else{
            value = JSON.parse(value);
            if(Number(value.endTime) <= new Date().getTime()){ //过期
                this.remove();
                return null;
            }else{
                return value.data;
            }
        }
    }

    /**
     * 删除此项数据
     * @return {[type]} [description]
     */
    Storage.prototype.remove = function(){
        localStorage.removeItem(this.opt.key);
    }

    /**
     * 数据储存所属组名称
     * @type {String}
     */
    Storage.groupname = 'ZMRDLB';

    /**
     * 删除全部在组Storage.groupname下的缓存数据
     * @return {[type]} [description]
     */
    Storage.clear = function(){
        var reg = new RegExp('^'+Storage.groupname);
        while(localStorage.length > 0) {
            var key = localStorage.key(0);
            if(reg.test(key)){
                localStorage.removeItem(key);
            }
        }
    }

    /**
     * 创建一个Storage对象
     * @param  {JSON} opt 详见Storage定义处
     * @return {Storage}     [description]
     */
    Storage.create = function(opt){
        return new Storage(opt);
    }

    return Storage;
});
