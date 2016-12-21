var express = require('express');
var http = require('http');
var sio = require('socket.io');
var jsonfile = require('jsonfile');
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var app = express();
var server = http.Server(app);
var io = sio(server);
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

var file = './data/user.json';
var file2 = './data/pending.json';

var users = require(file);
var pendingMessages = require(file2);
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 3000));
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));
/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

app.get('/', (req, res) => {
    res.render('index');
});

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
//global object for users
var usernames = {};
var onlineClients = {};
var pendingMessages = [];

io.on('connection', function(socket) {
    console.log('a user connected');
    //add new user
    socket.on('adduser', function(user) {
        socket.username = user.name;
        usernames[user.name] = socket.id;
        onlineClients[user.name] = socket.id;
        socket.emit('updatechat', 'SERVER', 'SERVER', 'you have connected\r');
        io.sockets.emit('updateusers', usernames);

        jsonfile.writeFile(file, usernames, function(err) {
            if (err) {
                return console.log("error");
            }
            console.log("saved");
        });

        var pendingm = pendingMessages.filter((e) => {
            return e.to === user.name;
        });

        if (pendingm.length > 0) {
            pendingm.map((e) => {
                io.sockets.connected[socket.id].emit("updatechat", e.to, e.from, e.message);
            });
            pendingm = [];
        }

        pendingMessages = pendingMessages.filter((e) => {
            return e.to !== user.name;
        });


        jsonfile.writeFile(file2, pendingMessages, function(err) {
            if (err) {
                return console.log("error");
            }
            console.log("saved");
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
                pendingMessages.push({to: to, from: from, message: message});

                jsonfile.writeFile(file2, pendingMessages, function(err) {
                    if (err) {
                        return console.log("error");
                    }
                    console.log("saved");
                });

                console.log('User left the chat');
                console.log(pendingMessages);
            }
        }
        //io.sockets.socket[id].emit('updatechat', socket.username, message);
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

        jsonfile.writeFile(file, usernames, function(err) {
            if (err) {
                return console.log("error");
            }
            console.log("saved");
        });
        //socket.broadcast.emit('updatechat', 'SERVER', 'SERVER', socket.username + ' has disconnected\r');
        console.log('user disconnected');
    });
});

app.get('/api/:from/:to/:message', (req, res) => {
    console.log(req.params);
    var id = onlineClients[req.params.to];
    if (id !== undefined) {
        try {
            io.sockets.connected[id].emit("updatechat", req.params.to, req.params.from, req.params.message);
            var responseData = "hello";
            callback(responseData);
            res.end('done');
        } catch (e) {
            pendingMessages.push({to: req.params.to, from: req.params.from, message: req.params.message});
            fs.writeFile( "pending.json", JSON.stringify( pendingMessages ), "utf8", function(err){
              console.log(err);
            });
            console.log('User left the chat');
            console.log(pendingMessages);
            res.end('Pending');
        }
    }
    //io.sockets.connected[id].emit("updatechat", to, from, message);
});

app.get('/api/onlineusers', (req, res) => {
    console.log(JSON.stringify(usernames));
    res.json(usernames);
});

server.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
