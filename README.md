# widgetpc

pc版的js组件库。注意，里面的任何代码没有掺杂css样式。

具体使用方式请查见：https://github.com/zmrdlb/coreui

# 浏览器兼容性

此代码库基于jquery和requirejs，并且保存了jquery的各种版本。

- 支持ie8及以上，则使用jquery.1.* 或 jquery.2.*

- 支持ie9及以上，则使用jquery.3.*

# 目录及组件说明

## lib - 通过http方式引用的js第三方库

- jquery的各种版本

- requirejs的相关文件

## ui - 构建ui或与ui交互的js组件

- layer - 存放各种层

  - layer.js: 基本层类
  
  - bombLayer.js: 弹层类
  
  - alert.js: 内容区+单个按钮的alert模拟层类
  
  - confirm.js: 内容区+两个按钮的confirm模拟层类
  
  - baseControl.js: 基本的弹层工厂控制器，不可直接使用，只可子类继承后使用。应用场景：针对频繁更改弹层里某些节点的内容，以及更改点击按钮后的回调事件。
  
  - alertControl.js: alert的工厂控制器，继承baseControl。应用场景：针对简单alert弹层，频繁更改弹层里某些节点的内容，以及更改点击"确定"按钮后的回调事件。
    如果是更复杂的交互建议使用layers.alert或layers.bombLayer
    
  - confirmControl.js: confirm的工厂控制器，集成baseControl。应用场景：针对简单confirm弹层，针对频繁更改弹层里某些节点的内容，以及更改点击"确定"、"取消"按钮后的回调事件。
    如果是更复杂的交互建议使用layers.confirm或layers.bombLayer
    
  - mask.js: 遮罩
  
  - positionBomb.js: 弹层定位方法，现只支持居中定位和满屏定位

- form - form表单验证

  - verify.js: 表单验证 - 基类
  
  - verifystring.js: 表单验证 - 字符串验证类
  
  - verifynumber.js: 表单验证 - 数字验证类
  
  - formverify.js: 整体表单验证
  
  - pattern.js: 常用正则表达式
  
- page - 分页类

  - basepage.js: 分页基类，提供算法，不涉及到dom
  
  - page.js: 分页类，渲染页码容器，绑定事件。继承basepage
  
- scroll - 控制图片或列表等滚动

  - baseScroll.js: 基本滚动类，主要用于根据滚动区域和容器的尺寸永远计算各种滚动类型该滚动的距离
  
  - scroll.js: 滚动类，继承基本滚动类scroll/baseScroll，根据设置执行相应的滚动动画。特别说明：
  
    1. 待滚动区的容器大小必须可以计算出所有的滚动对象的大小。比如type为x,则通过scrollNode的width来获取所有滚动对象的大小；
    
    2. 支持jquery和zepto
    
  - arrowScroll.js: 一般滚动。适用场景：有2个箭头，点击上下箭头，横向或纵向滚动
  
- tab: tab切换

  - tabswitch.js: tab切换组件
  
## io - io请求

- storage.js: 使用localStorage进行数据存储

- ioconfig.js: io接口请求相关数据配置

- interio.js: io接口请求控制器，在$.ajax上进行进一步封装

     1. 支持接口队列请求；
     
     2. 支持接口数据缓存；
     
     3. 支持接口统一业务错误及其他情况处理；
  
## util - 各种小工具

- base - 基本小工具

  - checkDataType.js: 检测数据类型
  
  - evalScript.js: 手动执行js代码
  
  - interactive.js: 对于点击按钮交互处理是异步（请求数据）的应用场景，为了防止用户防爆点击，添加交互状态检测。
  
  - mergeobj.js: 对象merge。可指定只merge特定属性
  
  - uniqueNum.js: 获取当前页面唯一的键值数。应用场景：生成页面唯一键值
  
  - util.js: 一些公共的实用小工具
  
- channel - 频道通讯

  - listener.js: 频道广播控制器，用于模块通信
  
- classdesign - 类设计模式相关设计

  - workerControl.js: 线程池控制器，负责返回当前空闲的线程对象
  
  - rwcontroller.js: 读写控制器——对于读写异步操作进行控制
  
  - subscribe - 订阅者模式
  
    - publisher.js: 订阅者模式——发布者类

    - publisherS.js: 订阅者模式——发布者类——精简版

    - subscriber.js: 订阅者模式——订阅者类
    
- compatible - 设备差异性检测
 
  - csssuport.js: 检测是否支持指定的css特性

  - deviceevtname.js: 根据设备给出相关业务事件的事件名称
  
- dom - dom相关小工具

  - checknode.js: 检测dom的有效性
  
  - positionWin.js: 获取元素node距离当前可视窗口window的位置信息。如果元素的display:none，则所有位置信息都为0
  
- evt - 事件相关小工具

  - delayevt.js: 对于高频触发的事件进行延迟处理类。应用场景：scroll和resize

  - resize.js: 给指定元素创建resize事件监听类。引用了delayevt.js

  - scroll.js: 给指定元素创建scroll事件监听类。引用了delayevt.js
  
  - winresize.js: 监听window resize
  
  - winscroll.js: 监听window scroll
  
  - inputchange.js: 输入框input或textarea，监听其输入值改变时，触发相关回调
  
  - lazyLoad.js: 瀑布流加载监听lazyload类
  
  - mutexLayer.js: 浮层互斥通讯
  
    1 . 给浮层添加点击body其他区域（不包括参考节点node区域），触发其隐藏事件；
    
    2 . 针对属于同一组的浮层，实现互斥显示效果。如果未给其设置组名称，则默认浮层属于整个页面组；
    
  - posWinScroll.js: 当窗口scroll时，返回当前监听的元素相对于window的位置。特别说明：
  
    1 . 如果元素的display:none，则所有位置信息都为0；
    
 		2 . 首次调用组件时会自动计算元素相对于window的位置并触发监听；
    
  - posWinScrollDelay.js: 当窗口scroll时，返回当前监听的元素相对于window的位置。特别说明：
  
   	1 . 如果元素的display:none，则所有位置信息都为0;
    
    2 . 首次调用组件时会自动计算元素相对于window的位置并触发监听;
    
    3 . 窗口scroll的监听触发有延迟，为了提高性能;

  - textDefault.js: 绑定input type="text|password"或textarea的默认文案显示，类似于placeholder属性支持的功能。兼容不支持placeholder属性的浏览器
 
- inherit - 继承

  - extendClass.js: 类式继承方法
  
- json: json处理

  - jsonToQuery.js: json转换成query格式
  
  - queryToJson.js: 把query格式的数据转换成json格式
  
- load - 资源加载

  - loadResource.js: 加载css或js
  
- str - 字符串处理

  - bLength.js: 返回一个字符串的字符个数，一个中文2个字符
  
  - dateFormat.js: 日期格式化
  
  - getSubStr.js: 通用字符串截取组件，适用于含双字节字符的字符串截取并添加自定义后缀。
  
  - getUrlArgs.js: 获取url中的参数，并以json的形式返回
  
  - leftB.js: 字符串截取，一个中文2个字节
  
  - numToCC.js: 阿拉伯数字0-9转换成中文大写
 
- tpl - 模板

  - template.js: art-template模板引擎

## democonfig.html

给js组件起别名
 
