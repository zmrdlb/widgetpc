/**
 * 把query格式的数据转换成json格式
 * @version 1.0.0 | 2015-12-09 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @param querystr {String} query格式参数 name=aa&sex=man
 * @param decode {Boolean} 参数值是否解码，默认为true
 * @returns {Object} {name:'aa',sex:'man'}
 */
define(function(){
    return function(querystr,decode){
        if(typeof decode != 'boolean'){
            decode = true;
        }
        var result = {};
        var arr = querystr.split("&");
        for(var i = 0; i < arr.length; i ++) {
           var itemarr = arr[i].split('=');
           if(decode){
              result[itemarr[0]] = decodeURIComponent(itemarr[1]);
           }
           else{
              result[itemarr[0]] = itemarr[1];
           }
        }
        return result;
    };
});
