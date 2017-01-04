var express = require('express');
var http = require('http');
var sio = require('socket.io');
var jsonfile = require('jsonfile');
var mysql = require('mysql');
var sendPendingMessage=require('./pendingMessage');
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var app = express();
var server = http.Server(app);
var io = sio(server);
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var file = './data/user.json';
//var file2 = './data/pending.json';

var users = require(file);
//var pendingMessages = require(file2);
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 3000));
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var connection = mysql.createConnection({
    host     : 'sql6.freemysqlhosting.net',
    user     : 'sql6152186',
    password : 'j6urWmviv2',
    database : 'sql6152186'
});

app.get('/', (req, res) => {
    res.render('index',users);
});

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//global object for users
var usernames = {};
var usersfromDB;
var onlineClients = {};
var pendingMessages = [];


connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

io.on('connection', function(socket) {
    console.log('a user connected');
    //add new user
    socket.on('adduser', function(user) {
        socket.username = user.name;
        usernames[user.name] = socket.id;
        onlineClients[user.name] = socket.id;
        socket.emit('updatechat', 'SERVER', 'SERVER', 'you have connected\r');
        io.sockets.emit('updateusers', usernames);
        //user will be added here

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
        var qry="UPDATE chat SET id='"+socket.id+"',status='Y' where user='"+user.name+"'";
        connection.query(qry,function(err,rows){
            if(rows.affectedRows===0){
              connection.query('INSERT INTO chat SET ?',{user:user.name,id:socket.id,status:'Y'},function(err,result){
                if(!err){
                  console.log(result);
                  console.log('inserted');
                }
              });
            }
        });
/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
        qry="SELECT * FROM pen_message WHERE `to`='"+user.name+"' AND `status` = 'N' ";
        //console.log(qry);
        connection.query(qry,function(err,rows){
            if(!err){
              console.log(rows);
              sendPendingMessage(rows,io,connection,socket);
            }
            console.log(err);
        });
        console.log(usernames);
    });

    //Private message
    socket.on('pm', function(to, from, message, callback) {
        var id = onlineClients[to];
        if (id !== undefined) {
            try {
                io.sockets.connected[id].emit("updatechat", to, from, message);
                var responseData = "hello";
                callback(responseData);
            } catch (e) {
                //pendingMessages.push({to: to, from: from, message: message});

                qry="INSERT INTO pen_message SET ?";
                connection.query(qry,{to: to, from: from, message: message,status:'N'},function(err,rows){
                    if(!err){console.log("added "+e.id);}
                });

                console.log('User left the chat');
            }
        }
    });

    //user disconnect
    socket.on('disconnect', function() {
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        if (socket.username !== undefined)
            socket.broadcast.emit('updatechat', 'SERVER', 'SERVER', socket.username + ' disconnected\r');

/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
        var qry="UPDATE chat SET status='N' where user='"+socket.username+"'";
        connection.query(qry,function(err,rows){
            if(!err){
              console.log('User Disconnected');
            }
            console.log(err);
        });
/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
        console.log('user disconnected');
    });
});

app.get('/api/:from/:to/:message', (req, res) => {
    //console.log(req.params);
    var id;
    id=connection.query("SELECT id FROM chat WHERE status='Y' AND user='"+req.params.to+"'",function(err,rows){
        if(!err) {
          console.log(rows);
          //console.log(rows[0].hasOwnProperty('id'));
          if (rows[0]!== undefined && rows[0].hasOwnProperty('id')) {
              var id=rows[0].id;
              io.sockets.connected[id].emit("updatechat", req.params.to, req.params.from, req.params.message);

              res.end('done');
              //pendingMessages.push({to: req.params.to, from: req.params.from, message: req.params.message});
              //console.log(e);

              }else{
                var qry="INSERT INTO pen_message SET ?";
                connection.query(qry,{to: req.params.to, from: req.params.from, message: req.params.message,status:'N'},function(err,rows){
                    if(!err){console.log("added ");}
                });
                console.log('User left the chat');
                //console.log(pendingMessages);
                res.end('Pending');
              }
          }
        console.log('from sql');
    });
    console.log('after sql');
    //var id = onlineClients[req.params.to];

  //  res.end('ok');
});

app.get('/api/onlineusers', (req, res) => {
    connection.query("select * from chat where status='Y'",function(err,rows){
        if(!err) {
          res.json(rows);
        }
    });
});

server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
