/**
 * * @fileoverview 获取当前页面唯一的键值数。应用场景：生成页面唯一键值
 * @version 1.0.0 | 2015-11-10 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 *   requirejs(['libbase/uniqueNum'],function($uniqueNum){
 *       var id = 'vote'+$uniqueNum();
 *   });
 */
define(function(){
   var unique = 0;
   return function(){
       return ++unique;
   };
});
