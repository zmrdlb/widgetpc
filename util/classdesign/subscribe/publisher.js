/**
 * @fileoverview 订阅者模式——发布者类
 * @version 1.0 | 2015-08-31 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 发布者类
 * @example
 * */
define(['$','libclassdesign/subscribe/subscriber','libclassdesign/rwcontroller'],function($,$subscriber,$rwcontroller){
	function Publisher(){
		this.subscribers = []; //记录订阅者对象
		this.rwcontrollder = new $rwcontroller();
	}
	/**
	 * 参数有效性验证 
	 */
	Publisher.prototype.argsValidate = function(data){
		return data instanceof $subscriber;
	};
	/**
	 * 信息分发，通知所有订阅者 
	 */
	Publisher.prototype.deliver = function(){
		this.rwcontrollder.read($.proxy(function(data){
			$.each(this.subscribers,function(index,item){
				item.receive.apply(item,data.args);
			});
		},this,{args: arguments}));
	};
	/**
	 * 订阅 
 	 * @param {Subscriber} subscriber 订阅者对象
	 */
	Publisher.prototype.subscribe = function(subscriber){
		if(this.argsValidate(subscriber)){
			if($.inArray(subscriber,this.subscribers) < 0){
				this.rwcontrollder.write($.proxy(function(cursub){
					this.subscribers.push(cursub);
				},this,subscriber));
			}
		}
	};
	/**
	 * 取消订阅 
 	 * @param {Subscriber} subscriber 订阅者对象
	 */
	Publisher.prototype.unsubscribe = function(subscriber){
		var that = this;
		if(this.argsValidate(subscriber)){
			this.rwcontrollder.write($.proxy(function(cursub){
				$.each(this.subscribers,function(index,item){
					if(item == cursub){
						that.subscribers.splice(index,1);
						return false;
					}
				});
			},this,subscriber));
		}
	};
	return Publisher;
});
