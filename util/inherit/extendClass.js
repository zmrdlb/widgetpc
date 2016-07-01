/**
 * @fileoverview 类式继承方法
 * @version 1.0 | 2015-08-19 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 类式继承方法
 * @example
 *      function Layer(){} //父类
 *      Layer.staticfun1 = function(){}; //静态方法
 *      Layer.staticfun2 = function(){}; //静态方法
 *      function BombLayer(){ //子类
 *          BombLayer.superclass.constructor.call(this); //继承父类this属性
 *      } 
 * 
 *      ExtendClass(BombLayer,Layer); //继承父类原型对象
 * 
 *      BombLayer.prototype.myFunName = function(){}; //定义自己的原型方法
 * 
 *      ExtendClass.extendStatic(BombLayer,Layer); //继承Layer的所有静态方法
 *      ExtendClass.extendStatic(BombLayer,Layer,['staticfun2']); //继承Layer的staticfun2静态方法
 *      
 *      BombLayer.mystaticfun = function(){} //定义自己的静态方法
 * */
define(['libbase/mergeobj'],function($mergeobj){
	/**
   	 * 类式继承方法
     * subClass 子类
     * superClass 父类
     * 在子类的构造函数中，初始化父类的构造函数可使用如下操作：
     * subClass.superclass.constructor.call(this, 一系列参数); 
     * subClass的实例假设为sub  sub instanceof subClass和superClass都为true
     */
    function ExtendClass(subClass, superClass) {
        //第一种方法
    	var F = function() {};
	    F.prototype = superClass.prototype;
	    subClass.prototype = new F();
	    //第二种方法
	    //subClass.prototype = Object.create(superClass.prototype);
	    subClass.prototype.constructor = subClass;
	    subClass.superclass = superClass.prototype;
	    if(superClass.prototype.constructor == Object.prototype.constructor) {
	       superClass.prototype.constructor = superClass;
	    }
    };
    /**
     * 继承父类静态属性 
     * *subClass 子类
     * *superClass 父类
     * @param {Array} argsarr 枚举指定继承的superClass中的静态属性或方法。没有指定则全部继承
     */
    ExtendClass.extendStatic = function(subClass,superClass,argsarr){
        $mergeobj(subClass,superClass,true,argsarr);
    };
    return ExtendClass;
});
