var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendfile('index.html');
});


var allClients = [];

var player = []; // Waiting List of Users {name:xx, id:socketId}
var games = []; // List of pair of Users {playerA: {name:xx},playerB: {name:xx}}

io.on('connection', function(socket) {
    var updateUsersCount = function() {
        io.emit('user.count', {
            users: allClients.length
        });
        console.log(allClients.length + " clients connected.");
    };

    console.log('a user connected with id ' + socket.id);
    allClients.push(socket);
    updateUsersCount();

    //todo: join player
    //todo: transmit move

    //io.emit('chat message', msg); // send the message to every one, including the sender
    // io.sockets.socket(savedSocketId).emit(...) // send message to single user

    socket.on('match.request', function(msg) {
        var newPlayer = {name: msg.name, id : socket.id};
        console.log('match.request from player: ' + JSON.stringify(newPlayer));

        if(player.length > 0)
        {
          var oppenent = player.shift(); // fifo from the waiting line
          var newGame = {playerA: newPlayer, playerB : oppenent};
          games.push(newGame);
          io.sockets.socket(newPlayer.id).emit("match.found", newGame );
          io.sockets.socket(oppenent.id).emit("match.found", newGame );
        }
        else {
          player.push(newPlayer);
        }

    });


    socket.on('game.turn', function(msg) {
        console.log('message: ' + JSON.stringify(msg));
        //io.emit('chat message', msg); // send the message to everyone, including the sender
    });


    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // send the message to everyone, including the sender
    });


    socket.on('disconnect', function() {
        console.log('user with id ' + socket.id + ' disconnected');
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);

        //remove from player and games
        updateUsersCount();
    });
});


http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:' + (process.env.PORT || 3000));
});
