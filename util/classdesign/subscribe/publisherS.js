/**
 * @fileoverview 订阅者模式——发布者类——精简版
 * 精简版：订阅者不限定必须是订阅者类Subscriber的对象
 * @version 1.0 | 2015-08-31 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 发布者类
 * @example
 * */
define(['$','libbase/checkDataType'],function($,$checkDataType){
	function Publisher(){
		this.subscribers = []; //记录订阅者对象
		//this.rwcontrollder = new $rwcontroller();
	}
	/**
	 * 参数有效性验证 
	 */
	Publisher.prototype.argsValidate = function(data){
		if($checkDataType.isObject(data) && $checkDataType.isFunction(data.call)){
			return true;
		}
		return false;
	};
	/**
	 * 信息分发，通知所有订阅者 
	 * filter执行返回true，则执行call
	 */
	Publisher.prototype.deliver = function(){
		// this.rwcontrollder.read($.proxy(function(data){
		// 	$.each(this.subscribers,function(index,item){
		// 		if(item.filter() == true){
		//         	item.call.apply(window,data.args);
		//       	}
		// 	});
		// },this,{args: arguments}));

		var args = arguments;
		this.subscribers.forEach(function(item,index){
			if(item.filter() == true){
				item.call.apply(window,args);
			}
		});
	};
	/**
	 * 订阅 
 	 * @param {JSON} *subscriber 订阅者。格式同subscribers里的单独一项
 	 * {
 	 * 		*call: function(){} //信息分发的回调函数
 	 *      filter: function(){return true;} //过滤条件
 	 * }
	 */
	Publisher.prototype.subscribe = function(subscriber){
		if(this.argsValidate(subscriber)){
			if(!$checkDataType.isFunction(subscriber.filter)){
		        subscriber.filter = function(){
		            return true;
		        };
		    }
			if($.inArray(subscriber,this.subscribers) < 0){
				//this.rwcontrollder.write($.proxy(function(cursub){
					this.subscribers.push(subscriber);
				//},this,subscriber));
			}
		}
	};
	/**
	 * 取消订阅 
 	 * @param {JSON} subscriber 订阅者
	 */
	Publisher.prototype.unsubscribe = function(subscriber){
		var that = this;
		if(this.argsValidate(subscriber)){
			//this.rwcontrollder.write($.proxy(function(cursub){
				$.each(this.subscribers,function(index,item){
					if(item == subscriber){
					    that.subscribers.splice(index,1);
						return false;
					}
				});
			//},this,subscriber));
		}
	};
	return Publisher;
});
