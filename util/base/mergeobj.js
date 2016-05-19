/**
 * @fileoverview 对象merge。可指定只merge特定属性
 * @version 1.0.0 | 2015-09-14 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 * requirejs(['libbase/mergeobj'],function($mergeobj){
 * 	 $mergeobj({name: 'aa'},{name: 'bb', sex: 'woman'})
 * });
 * */
define(['libbase/checkDataType'],function($checkDataType){
	/**
	 * 将supers的特定属性（可由argsname指定）或对象merge到sub。如果不制定argsname，则全部merge.
	 * @param {Object} *sub 需要merge对象
	 * @param {Object} *supers 待merge对象
	 * @param {Boolean} override 如果supers和sub存在相同的属性，是否supers覆盖sub。默认为true
	 * @param {Array} argsname 枚举指定merge的supers中的属性或方法
	 */
	return function(sub,supers,override,argsname){
		if(arguments.length < 2){
			throw new Error('mergeobj参数个数至少2个');
		}else if(!$checkDataType.isObjectType(sub) || !$checkDataType.isObjectType(supers)){
			throw new Error('mergeobj参数sub和supers必须都是object类型');
		}
		if(!$checkDataType.isBoolean(override)){
			override = true;
		}
		if(!$checkDataType.isArray(argsname)){ //说明相关属性全部复制
			for(var name in supers){
				if(!sub.hasOwnProperty(name) || override){
					sub[name] = supers[name];
				}
			}
		}else{
			for(var i = 0, len = argsname.length; i < len; i++){
				var name = argsname[i];
				if(supers.hasOwnProperty(name)){
					if(!sub.hasOwnProperty(name) || override){
						sub[name] = supers[name];
					}
				}
			}
		}
	};
});
