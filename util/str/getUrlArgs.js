/**
 * 获取url中的参数，并以json的形式返回
 * @version 1.0.0 | 2015-12-09 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @returns {Object}
 * {
 *    has: true|false 当前url是否有参数
 *    data: {name:'aa'} has为true时，url中query格式的参数转换成json格式
 * }
 */
define(['libjson/queryToJson'],function($queryToJson){
    return function() {
       var url = location.search.replace(/#.*$/,''); //获取url中的search.并去掉hash
       var result = {
          has: false, //url中是否有传参数
          data: {} //如果has是true,则data里有值
       };
       if (url != '') {
          result.has = true;
          url = url.substr(1);
          result.data = $queryToJson(url);
       }
       return result;
    };
});
