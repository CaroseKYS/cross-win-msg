(function(){
  var addEvent         = getEventerListenAdder(); /*事件添加器*/

  var onMsgCallbacks   = [];

  var receivedMsgs     = {};
  var sendedMsgs       = {};

  var msgIdProp        = '__cross-win-msg-id__';
  var msgRelatedIdProp = '__cross-win-reply-msg-id__';
  var msgTimeout       = 1000 * 60 * 5;

  var api = {
    sendMsg          : sendMsg,
    onMsg            : onMsg,
    setDefaultTimeout: setDefaultTimeout
  };

  if (jQuery) {
    $.extend({
      cwmsg: api
    });
  }else if(typeof define === 'function' && define.cmd) {
    define('cwmsg', [], function(require, exports, module) {
      module.exports = api;
    });
  }else if(typeof define === "function" && define.amd){
    define( "cwmsg", [], function() {
      return api;
    });
  }else{
    window.cwmsg = api;
  }

  /*初始化*/
  (function () {
      addEvent(window, 'message', function (event) {
        var msg, msgId, relatedMsgId, replyCallback;
        event = event || window.event;
  
        msg = event.data;
  
        try{
          msg = JSON.parse(msg);
        }catch(e){}
  
        if (!msg.__iscwmsg__) {
          return;
        }
  
        relatedMsgId = msg[msgRelatedIdProp];
  
        if (relatedMsgId) {
          sendedMsgs[relatedMsgId] && sendedMsgs[relatedMsgId].callback && sendedMsgs[relatedMsgId].callback(msg.data);
          delete sendedMsgs[relatedMsgId];
          return;
        }
  
        msg = new Message(msg[msgIdProp], 'r', msg.data);
  
        msg.source = event.source;
        msg.target = window;
  
        receivedMsgs[msg.id] = msg;

        msg.timer = setTimeout(function () {
          delete receivedMsgs[msg.id];
        }, msgTimeout);
  
        for (var i = 0, len = onMsgCallbacks.length; i < len; i++) {
          onMsgCallbacks[i](msg.data, function(data){
            msg.reply(data);
          });
        }

      });
    })();

  /**
   * 发送消息
   * @author 康永胜
   * @date   2017-09-12T18:05:18+0800
   * @param  {Window}                 target   [description]
   * @param  {Object}                 data     [description]
   * @param  {Function}               callback [description]
   * @param  {Number}                 timeout  [description]
   * @return {[type]}                          [description]
   */
  function sendMsg (target, data, callback, timeout){
    var id = getRandomId();
    var msg = new Message(id, 's', data, callback);
    msg.target = target;

    sendedMsgs[id] = msg;

    if (callback) {
      msg.timer = setTimeout(function () {
        msg.callback({
          status: 'ETIMEOUT'
        });
        clearTimeout(msg.timer);
      }, timeout || msgTimeout);
    }

    msg.send();
  };

  /**
   * 添加事件间听
   * @author 康永胜
   * @date   2017-09-12T18:08:19+0800
   * @param  {Function}               callback [消息监听器]
   * @return {Object}                          [返回接口本身，方便链式调用]
   */
  function onMsg (callback) {
    callback && onMsgCallbacks.push(callback);
    return api;
  };

  /**
   * 设定消息的默认过期时间
   * @author 康永胜
   * @date   2017-09-14T16:34:04+0800
   * @param  {Number}                 time [需要设置的超时时间]
   * @return {Object}                      [返回接口本身，方便链式调用]
   */
  function setDefaultTimeout(time){
    msgTimeout = time;
    return api;
  }

  /**
   * Message 对象的构造方法
   * @author 康永胜
   * @date   2017-09-12T18:06:46+0800
   * @param  {String}                 id               [description]
   * @param  {String}                 type             [description]
   * @param  {Object}                 data             [description]
   * @param  {Function}               businessCallback [description]
   */
  function Message(id, type, data, businessCallback) {
    this.id        = id;
    this.relatedId = null;
    this.reply     = null;
    this.type      = type; /*s: sended, r: received*/
    this.callback  = null;
    this.source    = null
    this.target    = null;
    this.data      = data;
    this.timer     = null;
    this.send = function () {
      var message = {};
      message.data = this.data;
      message.__iscwmsg__ = true;

      if (type == 's') {
        message[msgIdProp] = this.id;
      }else{
        message[msgRelatedIdProp] = this.id;
      }

      this.target.postMessage(JSON.stringify(message), '*');
    }

    if (type == 's') {
      this.source = window;
      this.callback = function (data) {
        businessCallback && businessCallback(data);
        clearTimeout(this.timer);
        delete sendedMsgs[this.id];
      };
    }else{
      this.reply = function (data) {
        this.data = data;
        this.target =  this.source;
        this.relatedId = this.id;
        this.send();
        clearTimeout(this.timer);
        delete receivedMsgs[this.id];
      };
    }
  }

  function getRandomId() {
    var time = (new Date).getTime().toString();
    var r = Math.random().toString();
    return time + '-' + r;
  }


  /**
   * 根据代码的运行环境，获取添加事件监听的兼容方法
   * @author 康永胜
   * @date   2016-11-06T12:36:09+0800
   * @return {function}                 [添加事件监听器的对象方法]
   */
  function getEventerListenAdder(){
    var adder;

    if (window.addEventListener) {
      adder = function(oElement, sEvent, fnListener){
        oElement.addEventListener(sEvent, function(e){
          e = e || window.event;
          addPropsForEvent(e);
          fnListener && fnListener(e);
        }, false);
      };
    }else{
      adder = function(oElement, sEvent, fnListener){
        oElement.attachEvent('on' + sEvent, function(e){
          e = e || window.event;
          addPropsForEvent(e);
          fnListener && fnListener(e);
        });
      };
    }

    return adder;
  }

  /**
   * 为 事件 对象添加兼容的 stopPropagation 与 preventDefault 方法
   * 
   * @author 康永胜
   * @date 2016-11-06T12:37:46+0800
   * @param {Object}
   *            event [事件对象]
   */
  function addPropsForEvent(event){
    event.stopPropagation = event.stopPropagation || fnStopPropagation;

    event.preventDefault = event.preventDefault || fnPreventDefault;
  }

  /**
   * 停止事件传播
   * 
   * @author 康永胜
   * @date 2016-11-06T13:42:29+0800
   * @return {undefined}
   */
  function fnStopPropagation(){
    this.cancelBubble = true;
  }

  /**
   * 停止事件的默认行为
   * 
   * @author 康永胜
   * @date 2016-11-06T13:43:13+0800
   * @return {undefined}
   */
  function fnPreventDefault (){
    this.returnValue = false;
  }
})();