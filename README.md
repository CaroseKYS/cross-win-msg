# cross-win-msg

该插件（模块）用于实现多个（跨域）窗口之间的 **有状态** 的消息通信功能。

## 浏览器兼容

该插件（模块）兼容 `chrome`、`Firefox`、`IE8+`、`Safari` 等众多主流浏览器。

## 引入

### 作为jQuery插件
    <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
    <script src="../cross-win-msg.js"></script>
    <script>
        var cwmsg = $.cwmsg;
    </script>

### 作为CMD模块
    var cwmsg = require('../cross-win-msg.js');

### 作为AMD模块
    define('test', ['../cross-win-msg.js'], function(cwmsg){
      //....
    });

### 作为普通页面插件
    <script src="../cross-win-msg.js"></script>
    <script>
        var cwmsg = window.cwmsg;
    </script>


## 使用

    cwmsg.setDefaultTimeout(10 * 6 * 1000);

    cwmsg.onMsg(function(data, reply){
      setTimeout(function(){
        reply('****'); //回复的内容也可以是 json
      }, 3000);
    });

    cwmsg.sendMsg(window.top, {'msg': 'hello'}, function(data){
      console.log(data);
    }, 5000);

### setDefaultTimeout
+ 方法说明: 设置消息的默认等待回复时间，如果收到的消息在默认的时间内没有被回复，则当前消息将从消息队列中删除，如果发送的消息在默认时间内没有得到回复，会得到一个 `{status:'ETIMEOUT'} ` 的回复。

+ 参数列表:
    * time: `Function` 类型，**必选参数**，默认的等待时间，单位：ms。

+ 返回值
    * 类型: `Object`
    * 说明: 返回 **api** 自身，方便链式调用。

### onMsg
+ 方法说明: 增加当前页面的消息监听器。

+ 参数列表: 
    * listener: `Function` 类型，**必选参数**，收到消息时的回调函数。`listener` 被调用时会传入两个参数，第一个参数为收到的消息，第二个参数为回复消息的方法`reply`，当 `reply` 方法被调用时，消息的发送方就能得到回复。

+ 返回值
    * 类型: `Object`
    * 说明: 返回 **api** 自身，方便链式调用。

### sendMsg
+ 方法说明: 向指定对象(窗口)发送消息

+ 参数列表:
    * target:   `Window` 对象，**必选参数**，指定接收消息的目标窗口。
    * data:     `String/Object` 类型，**必选参数**，需要发送的消息。
    * callback: `Function` 类型，可选参数，当消息得到回复时的回调函数。
    * timeout:  `Number` 类型，可选参数，当前消息收到回复之前等待的毫秒数，若不指定则使用默认值(5分钟)。

+ 返回值
    * 类型: `Object`
    * 说明: 返回 **api** 自身，方便链式调用。
