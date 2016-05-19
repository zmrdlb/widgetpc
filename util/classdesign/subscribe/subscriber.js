/**
 * @fileoverview 订阅者模式——订阅者类
 * @version 1.0 | 2015-08-31 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 订阅者类
 * @example
 * */
define(function(){
	function Subscriber(){}
	/**
	 * 订阅 
 	 * @param {Publisher} publisher 发布者对象
 	 * @return 订阅是否成功
	 */
	Subscriber.prototype.subscribe = function(publisher){
		return publisher.subscribe(this);
	};
	/**
	 * 取消订阅 
 	 * @param {Publisher} publisher 发布者对象
 	 * @return 取消订阅是否成功
	 */
	Subscriber.prototype.unsubscribe = function(publisher){
		return publisher.unsubscribe(this);
	};
	/**
	 * 接收发布者的消息通知
	 */
	Subscriber.prototype.receive = function(){};
	return Subscriber;
});
