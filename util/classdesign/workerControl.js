/**
 * @fileoverview 线程池控制器
 *      负责返回当前空闲的线程对象
 * @version 1.0 | 2017-01-19 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return
 * */
 define(function(){
     /**
      * 一个线程
      */
     function Worker(){
         this.lock = true;
     }
     /**
      * 线程池控制器类
      * @return {[type]} [description]
      */
     function workerControl(){
         this._workerobjs = []; //workerControl对象
     }
     /**
      * 返回当前空闲的workerControl对象
      * @return {instance of Worker} 当前可用的线程对象.
      */
     workerControl.prototype.get = function(){
         var curworker = null;
         for(var i = 0, len = this._workerobjs.length; i < len; i++){
             if(this._workerobjs[i].lock == false){ //既无请求又没有被锁定
                 this._workerobjs[i].lock = true;
                 curworker = this._workerobjs[i];
                 break;
             }
         }
         if(curworker == null){
             curworker = new Worker();
             this._workerobjs.push(curworker);
         }
         return curworker;
     }

     /**
      * 通知当前workerControl对象已经使用完毕
      * @param {instance of Worker} worker 如果提供了worker，则结束此线程；如果没提供，则结束第一个正在使用的线程
      * @return {instance of Worker | null} 当前结束的线程对象.没有则为null
      */
     workerControl.prototype.end = function(worker){
         var curworker = null;
         for(var i = 0, len = this._workerobjs.length; i < len; i++){
             if(worker){
                 if(this._workerobjs[i] == worker){ //既无请求又没有被锁定
                     this._workerobjs[i].lock = false;
                     curworker = this._workerobjs[i];
                     break;
                 }
             }else{
                 if(this._workerobjs[i].lock == true){
                     this._workerobjs[i].lock = false;
                     curworker = this._workerobjs[i];
                     break;
                 }
             }
         }
         return curworker;
     }

     /**
      * 是否所有的线程都被使用完毕
      * @return {Boolean} true：所有线程都空闲
      */
     workerControl.prototype.isend = function(){
         var result = true;
         for(var i = 0, len = this._workerobjs.length; i < len; i++){
             if(this._workerobjs[i].lock == true){ //既无请求又没有被锁定
                 result = false;
                 break;
             }
         }
         return result;
     }

     return workerControl;
 });
