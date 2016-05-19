/**
 * Copyright (c) 2013 - 2014, Sina Inc. All rights reseved.
 * @fileoverview json转换成query格式
 * @version 1.0 | 2015-06-17 版本信息
 * @author Zhang Mingrui
 * @example
 * requirejs(['libjson/jsonToQuery'],function($jsonToQuery){
 * 	 $jsonToQuery({name:'aaa',sex:'man'});
 * });
 */
define(function(){
 /**
  * @param {JSON} *argsobj json数据
  * @param {Boolean} encode 是否编码，默认编码
  */
  return function(argsobj,encode){
	if(typeof encode != 'boolean'){
		encode = true;
	}
	var result = [];
	for(var name in argsobj){
		if(encode){
			result.push(name + '=' + encodeURIComponent(argsobj[name]));
		}
		else{
			result.push(name + '=' + argsobj[name]);
		}
	}
	return result.join('&');
  };
});
