var express=require('express');
var http=require('http');
var sio=require('socket.io');

var app=express();

var server=http.Server(app);
var io=sio(server);

app.set('view engine','jade');
app.set('port', (process.env.PORT || 3000));

app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));


app.get('/',(req,res)=>{
  res.render('index');
});

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//global object for users
var usernames={};
var onlineClients = {};

io.on('connection', function(socket){
  console.log('a user connected');
  //console.log(socket);
  //add new user

  socket.on('adduser',function(user){
    socket.username=user.name;
    usernames[user.name]=socket.id;
    onlineClients[user.name] = socket.id;
    socket.emit('updatechat', 'SERVER', 'you have connected\r');
    io.sockets.emit('updateusers', usernames);
    console.log(usernames);
  });

  socket.on('pm', function(to, message) {
      var id = onlineClients[to];
      io.sockets.connected[id].emit("updatechat",to,message);
      //io.sockets.socket[id].emit('updatechat', socket.username, message);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});



server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
