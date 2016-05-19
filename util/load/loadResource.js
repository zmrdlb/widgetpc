define(['$'],function($){
	var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement; //资源插入的区域
	/**
	 * 具体处理资源加载的方法 
	 */
	function load(config){
		var ref = null, timer = null;
		function complete(){ //资源加载完成执行的方法
			// Handle memory leak in IE
			ref.onload = ref.onerror = ref.onreadystatechange = null;
			// 移除资源
			if (ref.parentNode) {
				ref.parentNode.removeChild(ref);
			}
			ref = null;
			if(typeof config.oncomplete == 'function'){
				config.oncomplete();
			}
		}
		if (config.type == 'css') {
			ref = document.createElement('link');
			ref.setAttribute('rel', 'stylesheet');
			ref.setAttribute('type', 'text/css');
			ref.href = config.file;
		}
		if (config.type == 'js') {
			ref = document.createElement('script');
			ref.setAttribute('type', 'text/javascript');
			ref.async = true;
			ref.src = config.file;
		}
		if(ref){
			if(config.charset){
				ref.charset = config.charset;
			}
			ref.onload = ref.onerror = ref.onreadystatechange = function() { //检测资源加载状况
				if (!ref.readyState || /loaded|complete/.test( ref.readyState ) ) { //不支持onreadystatechange的浏览器没有script.readyState属性
					if(timer){clearTimeout(timer);}
					complete();
				}
			};
			head.insertBefore(ref,head.firstChild);
			if(config.timeout && typeof config.timeout == 'number' && config.timeout > 0){
				timer = setTimeout(function(){
					console.log('超时');
					complete();
				},config.timeout);
			}
		}
	};
	return function(resource){
		if(!resource){return;}
		var config = $.extend({
			type: '', //*{String} 文件类型
			file: '', //*{String} 文件地址
			charset: null, //{String} 文件charset属性
			timeout: null, //{Number毫秒} 文件加载超时时间，默认为null，不检测超时。
			oncomplete: function(){} //文件加载完成的回调。不管成功或失败
		},resource);
		if(config.type && config.file){
			load(config);
		}
	};
});
