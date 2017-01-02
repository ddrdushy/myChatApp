$(document).ready(function() {
    var socket = io('http://localhost:3000');
    var user = {};
    var username = '';
    var name = '';

    var online="";
    //alert(name);
    $.ajax({
        type: "GET",
        url: "/api/onlineusers",
        async: true,
        success:function (users) {
          console.log(users);
          online=users;
        }
    });

    $('#myModal').modal({backdrop: 'static', keyboard: false});

    $('#bt').click(function() {
      name = $('#user').val();
     console.log(online.hasOwnProperty('dushy'));
      if(!online.hasOwnProperty(name)){
        user.name = name;
        socket.emit('adduser', user);
        $('#myModal').modal('toggle');
        $('#username').append("Welcome " + name);
      }else{
        alert('User already logged in');
      }
    });

    $('body').on('click', 'a.user', function(event) {
        username = $(event.target).attr("username");
        //alert(username);
    });

    $('#post').click(function() {
        var mess = $('#message').val();
        if (username !== '') {
            socket.emit('pm', username, name, mess, function(res) {
                console.log('Callback called with data:', res);
            });
            $('#messages').append(name + ': ' + mess + "\r");
            $('#message').val('');
        } else
            alert('Select User to send message');
        }
    );

    socket.on('updatechat', function(username, from, data) {
        //console.log(username+ ': ' + data + "\r");
        $('#messages').append(from + ': ' + data + "\r");
        //console.log(username);
        //console.log(data);;
    });

    socket.on('updateusers', function(data) {
        $('#users').empty();
        console.log(data);
        $.each(data, function(key, room) {
            if (key !== name) {
                var a = '<a href="#" username="' + key + '" class="user list-group-item">' + key + '</a>';
                $("#users").append(a);
            }
        });
    });

});
