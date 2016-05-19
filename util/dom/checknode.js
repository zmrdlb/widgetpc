/**
 * @fileoverview Sina 检测dom的有效性
 * @version 1.0.0 | 2015-10-29 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 */
define(['$','libbase/checkDataType'],function($,$checkDataType){
  /**
   * @param *nodes {Object|Element} dom节点的json集合，有效值是Jquery|Zepto的框架的dom对象
   * @param msg dom节点无效的错误信息，填此项则throw error,不填此项则return false
   */
  return function(nodes,msg){
    var result = true;
  	if($checkDataType.isObject(nodes)){
  		for(var name in nodes){
	      if(!$checkDataType.isValidJqueryDom(nodes[name])){
	        result = false;
	        if(msg){
	          throw new Error(msg);
	        }
	        break;
	      }
	    }
  	}else{
  		if(!$checkDataType.isValidJqueryDom(nodes)){
  		    result = false;
  			if(msg){
	          throw new Error(msg);
	        }
  		}
  	}
  	return result;
  };
});
