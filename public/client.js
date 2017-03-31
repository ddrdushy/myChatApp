$(document).ready(function() {
    var socket = io('http://mychaty.herokuapp.com');
    var user = {};
    var username = '';
    var name = '';
    var online = "";
    //alert(name);
    $.ajax({
        type: "GET",
        url: "/api/onlineusers",
        async: true,
        success: function(users) {
            console.log(users);
            online = users;
        }
    });
    $('#alert').hide();
    $('.alert .close').on('click', function(e) {
        $(this).parent().hide();
    });
    //[DIV].style.visibility='hidden'

    $('#myModal').modal({backdrop: 'static', keyboard: false});

    $('#bt').click(function() {
        name = $('#user').val();
        console.log(online.hasOwnProperty(name));
        if (online.hasOwnProperty(name)) {
            $('#alert').show();
            return;
        }
        user.name = name;
        socket.emit('adduser', user);
        $('#myModal').modal('toggle');
        $('#username').append("Welcome " + name);

    });

    $('body').on('click', 'a.user', function(event) {
        username = $(event.target).attr("username");
        //alert(username);
    });

    $('#post').click(function() {
        var mess = $('#message').val();
        if(mess===''){
          alert('Message Required');
          return;
        }
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
