# cross-win-msg
多窗口之间的消息通信组件，可以实现跨域窗口之间的通信。

兼容 chrome Firefox IE8+ Safari等主流浏览器

## 引入

### 作为jQuery插件
    <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
    <script src="../cross-win-msg.js"></script>

### 作为CMD模块
    var cwmsg = require('../cross-win-msg.js');

### 作为AMD模块
    define('test', ['../cross-win-msg.js'], function(cwmsg){
      //....
    });

### 作为普通页面插件
    <script src="../cross-win-msg.js"></script>


## 使用

### setDefaultTimeout
### onMsg
### sendMsg
