/**
 * @fileoverview 阿拉伯数字0-9转换成中文大写
 * @version 1.0.0 | 2015-11-12 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @return 方法
 * @example
 *   requirejs(['libbase/numToCC'],function($numToCC){
        $numToCC(1); //返回'一'
        $numToCC('选项1'); //返回'选项一'
     });
 */
define(['libbase/checkDataType'],function($checkDataType){
    var ccarr = ['零','一','二','三','四','五','六','七','八','九'];
    /**
     * 将字符串str中的数字0-9转换成中文大写
     * @param {String|Number} str 待转换的字符串
     * @return {String} 转换后的字符串
     */
    return function(str){
        if($checkDataType.isString(str) || $checkDataType.isNumber(str)){
            str = str.toString();
            return str.replace(/[0-9]/g,function(num){
                return ccarr[Number(num)] || '';
            });
        }
        return '';
    };
});
