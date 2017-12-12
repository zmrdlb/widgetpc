/**
  * @fileoverview 复制数据
  * @author Linda Zhang
 */
define(['libbase/checkDataType'],function(CheckDataType){
  return {
    /**
     * 深度复制json.
     * JSON.parse(JSON.stringify(json));
     * 这种方式，只针对于json里面的值都是原始数据类型
     * @param  {JSON} json [description]
     * @return {[type]}      [description]
     */
    deepCloneJSON: function(json){
      var data, copyjson = {};
      for(var key in json){
        data = json[key];
        if(CheckDataType.isObject(data)){ //说明是json
          copyjson[key] = this.deepCloneJSON(data);
        }else if(CheckDataType.isArray(data)){ //说明是array
          copyjson[key] = this.deepCloneArray(data);
        }else{
          copyjson[key] = data;
        }
      }
      return copyjson;
    },

    /**
     * 深度复制数组
     * slice(),concat(...)
     * 这种方式，只针对于arr里面的值都是原始数据类型
     * @param  {Array} arr [description]
     * @return {[type]}      [description]
     */
    deepCloneArray: function(arr){
      var data, copyarr = [];
      for(var i = 0, len = arr.length; i < len; i++){
        data = arr[i];
        if(CheckDataType.isObject(data)){ //说明是json
          copyarr.push(this.deepCloneJSON(data));
        }else if(CheckDataType.isArray(data)){ //说明是array
          copyarr.push(this.deepCloneArray(data));
        }else{
          copyarr.push(data);
        }
      }
      return copyarr;
    }
  }
});
