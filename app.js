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
    socket.emit('updatechat', 'SERVER','SERVER', 'you have connected\r');
    io.sockets.emit('updateusers', usernames);
    console.log(usernames);
  });

  socket.on('pm', function(to,from, message,callback) {
      var id = onlineClients[to];
      if(id!==undefined){
        try{
          io.sockets.connected[id].emit("updatechat",to,from,message);
          var responseData = { string1:'I like ', string2: 'bananas ', string3:' dude!' };
          //console.log('connection data:', evData);
          callback(responseData);
        }catch(e){
          socket.broadcast.emit('updatechat', 'SERVER','SERVER', 'User left the chat');
          console.log('User left the chat');
        }
      }
      //io.sockets.socket[id].emit('updatechat', socket.username, message);
  });

  socket.on('disconnect', function(){
    // remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
    socket.broadcast.emit('updatechat', 'SERVER','SERVER', socket.username+' disconnected\r');
		//socket.broadcast.emit('updatechat', 'SERVER', 'SERVER', socket.username + ' has disconnected\r');
    console.log('user disconnected');
  });

});

server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
