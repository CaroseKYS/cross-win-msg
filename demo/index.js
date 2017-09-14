
$(function () {
  var childPage1 = $('#child-1-page')[0].contentWindow;
  var childPage2 = $('#child-2-page')[0].contentWindow;
  var msgContainer = $('#msg-container');

  $.cwmsg.onMsg(function(msg, reply){

    msgContainer.prepend($('<div class="alert alert-danger">' + 
                          (new Date()).toLocaleString() + ' 收到消息: ' + JSON.stringify(msg) + '</div>'));

    setTimeout(function () {
      var r = 'Hello my child, I am right there. Your messsage is: ' + msg.msg;
      msgContainer.prepend($('<div class="alert alert-info">' + 
                          (new Date()).toLocaleString() + ' 回复消息: ' + r + '</div>'));
      reply(r);
    }, 1000);
  });

  $('button[data-msg-target]').on('click', function () {
    var msgTarget = $(this).data('msg-target');
    var target = msgTarget === 'child-1' ? childPage1 : childPage2;
    var msg = {
      msg: 'hello ' + msgTarget
    };

    msgContainer.prepend($('<div class="alert alert-success">' + 
                          (new Date()).toLocaleString() + ' 发出消息: ' + JSON.stringify(msg) + '</div>'));

    $.cwmsg.sendMsg(target, msg, function(data){
      msgContainer.prepend($('<div class="alert alert-warning">' + 
                          (new Date()).toLocaleString() + ' 收到回复: ' + JSON.stringify(data) + '</div>'));
    },
    5000)
  });

})