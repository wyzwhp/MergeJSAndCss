MergeJSAndCss
=============
网站前端优化，主要功能是动态的合并js和css
基本原理是把多个js文件(或者css文件)合并成一个文件，网页访问的时侯减少js和css文件的请求，同时把文件内容进行必要的压缩。

测试地址：
js合并
http://localhost:3000/js?file=http://x.libdd.com/farm1/a05baa/fde6509f/jquery.mousewheel-3.0.6.pack.js,http://x.libdd.com/farm1/08871e/95134743/jquery.fancybox-buttons.js&type=&host=
css合并
http://localhost:3000/css?file=http://common.cnblogs.com/Skins/LessIsMore/style.css?id=20121228,http://news.sina.com.cn/css/stencil_v2/public_101122.css|gbk&type=&host=



参数说明：
file 是需要合并的文件路径地址，多个文件之间用“,”分割，另外有可能出现文件乱码的问题，对于非utf-8编码的页面可以增加编码字符串，例子：http://news.sina.com.cn/css/stencil_v2/public_101122.css|gbk
type type有两个值debug和release，debug只是单纯的文件合并，release是是否压缩另存到服务器上
host host对于没有指定域名的文件起作用，多数情况可以不用，除非在QueryString字符串超长的时候可以用它来减少一下长度

另外该程序在cache方面还有优化的余地，现在是读取的硬盘文件不是读取cache，以后再优化。
