/**
 * @fileoverview 
 *   绑定input type="text|password"或textarea的默认文案显示，类似于placeholder属性支持的功能.
 *   兼容不支持placeholder属性的浏览器
 * box容器内需要使用此功能的dom节点具备以下属性：
 * placeholder="默认文案，必填项" placeclass="不支持placehoder的浏览器下，dom需要添加的class样式。选填"
 * @author mingrui| 592044573@qq.com
 * @version 1.0 | 2015-11-03
 * @example
 */
define(['$','libbase/checkDataType'],function($,$checkDataType){
  var isPlaceholderSupport = (function(){  
     return 'placeholder' in document.createElement('input');  
  })();
  
  var bindevt = function(node){
    var defaultText = node.attr("placeholder") || '';
    var placeclass = node.attr("placeclass") || '';
    if(defaultText == '') return;
    //处理密码输入框默认文案显示出来是密码的问题
    if(node.attr('type') == 'password'){
      var newnode = $('<input type="text" class="'+node.attr('class') || ''+'" style="'+node.attr('style')+'" />');
      newnode.insertAfter(node);
      newnode.val(defaultText);
      newnode.addClass(placeclass);
      node.hide();
      newnode.focus(function(){
        node.show();
        node.focus();
        newnode.hide();
      });
      node.blur(function(){
        if(!$.trim(node.val())){
          newnode.show();
          node.hide();
        }
      });
    }
    else{
      node.val(defaultText);
      node.addClass(placeclass);
      node.focus(function(){
        if($.trim(node.val()) == defaultText){
          node.val("");
          node.removeClass(placeclass);
        }
      });
      node.blur(function(){
        if(!$.trim(node.val())){
          node.val(defaultText);
          node.addClass(placeclass);
        }
      });
    }
  };
  /**
   * box 容器节点
   * 该容器里面使用默认文案显示功能的节点必须有placeholder属性
   */
  return function(box){
  	if(isPlaceholderSupport){
  		return;
  	}
    if(!$checkDataType.isValidJqueryDom(box)){
      throw new Error('绑定默认文案组件textDefault传入参数错误');
    }
    box.find('[placeholder]').each(function(){
      bindevt($(this));
    });
  };
});
