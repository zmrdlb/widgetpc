/**
 * @fileoverview 访问history.state, 操作history.pushState, history.replaceState
 * @author Linda Zhang
 * */

define([
  '$'
],function($){

  $(window).on('popstate',function(e){
    that.stateCall.fire(e.state,'popstate');
  });

  var that = {

    /**
     * history.state,
     * 'popstate'
     * @type {[type]}
     */
    stateCall: $.Callbacks(),

    pushState: function(state,title,url){
      history.pushState(state,title,url);
    },

    replaceState: function(state,title,url){
      history.replaceState(state,title,url);
    },

    /**
     * DOMContentLoaded时获取相关数据
     * @param  {Function} callback 接收回调，参数分别是
     *     history.state,
     *     'domready'
     * @return {[type]}            [description]
     */
    domready: function(callback){
      $(document).ready(function(){
        callback(history.state,'domready');
      });
    }
  }

  return that;

});
