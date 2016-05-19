/**
 * @fileoverview 基本分页模板实例
 * @version 1.0 | 2015-11-16 版本信息
 * @author Zhang Mingrui | mingrui@staff.sina.com.cn
 * 模板传入的数据说明如下：
 * {
         *   max: 页面总数
             cur: 当前页码索引
             nums: [{
               index: 页码数
               text: 页码显示文案
             }] //当前页码列表
   } 
   可点击的页码dom一定要加以下两个属性：node="pagenum" num="页码"
 * */
define(function(){
  return [
      '{{if cur == 1}}',
      '<a href="javascript:;">当前为第1页</a>',
      '{{else}}',
      '<a href="#" node="pagenum" num="{{cur-1}}">上一页</a>',
      '{{/if}}',
      '{{each nums as list i}}',
        '{{if list.index == cur}}', //说明是当前页
        '<a href="javascript:;">{{list.text}}</a>',
        '{{else if list.index == -1}}', //说明是省略号
        '<a href="javascript:;">{{list.text}}</a>',
        '{{else}}', //正常可点击
        '<a href="#" node="pagenum" num="{{list.index}}">{{list.text}}</a>',
        '{{/if}}',
      '{{/each}}',
      '{{if cur == max}}',
      '<a href="javascript:;">当前为最后一页</a>',
      '{{else}}',
      '<a href="#" node="pagenum" num="{{cur+1}}">下一页</a>',
      '{{/if}}'
  ].join('');
});
