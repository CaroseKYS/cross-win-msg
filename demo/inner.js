$(function(){
  var msgContainer = $('#msg-container');

  $.cwmsg.onMsg(function(msg, reply){

    msgContainer.prepend($('<div class="alert alert-danger">' + 
                          (new Date()).toLocaleString() + ' 收到消息: ' + JSON.stringify(msg) + '</div>'));

    setTimeout(function () {
      var r = 'Hello father, I get your message';
      msgContainer.prepend($('<div class="alert alert-info">' + 
                          (new Date()).toLocaleString() + ' 回复消息: ' + r + '</div>'));
      reply(r);
    }, 1000);
  });

  $('#msg-sender').on('click', function () {
    var msg = {
      msg: 'hello father, you there?'
    };

    msgContainer.prepend($('<div class="alert alert-success">' + 
                          (new Date()).toLocaleString() + ' 发出消息: ' + JSON.stringify(msg) + '</div>'));

    $.cwmsg.sendMsg(parent, msg, function(data){
      msgContainer.prepend($('<div class="alert alert-warning">' + 
                          (new Date()).toLocaleString() + ' 收到回复: ' + JSON.stringify(data) + '</div>'));
    },
    5000)
  });

});