$(document).ready(function(){
  var socket = io('http://mychaty.herokuapp.com');
  var user={};
  var username='';
  var name='';
  $('#myModal').modal({backdrop: 'static', keyboard: false});

  $('#bt').click(function(){
      name=$('#user').val();
      //alert(name);
      user.name=name;
      socket.emit('adduser', user);
      $('#myModal').modal('toggle');
  });

  $('body').on('click', 'a.user', function (event) {
          username = $(event.target).attr("username");
          $(event.target).attr("username").val=username+" @";
          //alert(username);
      });



  $('#post').click(function(){
    var mess=$('#message').val();
    socket.emit('pm', username, mess);
    alert(user.name);
  });

  socket.on('updatechat', function (username, data) {
    $('#messages').append('<b>'+username + ':</b> ' + data + '<br>');
    console.log(username);
    console.log(data);;
	});

  socket.on('updateusers', function(data) {
    $('#users').empty();
    console.log(data);
    $.each(data, function (key, room) {
      if(key!==name){
        var a = '<a href="#" username="' + key + '" class="user list-group-item">' + key+ '</a>';
        $("#users").append(a);
      }
    });
	});

});
