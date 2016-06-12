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

    function getSocketById(id)
    {
      return allClients.filter(x => x.id === id).pop()
    }

    console.log('a user connected with id ' + socket.id);
    allClients.push(socket);
    updateUsersCount();

    socket.on('match.request', function(msg) {
        var newPlayer = {name: msg.name, id : socket.id};
        console.log('match.request from player: ' + JSON.stringify(newPlayer));

        if(player.length > 0)
        {
          var oppenent = player.shift(); // fifo from the waiting line
          var newGame = {playerA: newPlayer, playerB : oppenent};
          games.push(newGame);
          getSocketById(newPlayer.id).emit("match.found", newGame );
          getSocketById(oppenent.id).emit("match.found", newGame );
          console.log("new game startet", JSON.stringify(newGame));
        }
        else {
          player.push(newPlayer);
        }
    });

    socket.on('match.cancelrequest', function(msg) {
      var i = player.findIndex(function(x){ return x.id === socket.id; });
      player.splice(i, 1);
      console.log("canceled request for id"+socket.id);
    });

    socket.on('game.turn', function(msg) {
      var game  = games.find(x => x.playerA.id === socket.id || x.playerB.id === socket.id);
      if(game === undefined)
        console.warn("no game for player "+socket.id+" found", JSON.stringify(msg));

      var oppenent = game.playerA.id === socket.id ? game.playerB : game.playerA;

      getSocketById(oppenent.id).emit("game.turn", msg);

      console.log("game turn from "+socket.id + " to "+oppenent.id, JSON.stringify(msg));
    });


    socket.on('game.exit', function(msg) {
      var i = games.findIndex(x => x.playerA.id === socket.id || x.playerB.id === socket.id);

      var game = games.splice(i, 1)[0];

      getSocketById(game.playerA.id).emit("game.exit", "kthxbye");
      getSocketById(game.playerB.id).emit("game.exit", "kthxbye");

      console.log("game exit for id"+socket.id);
    });

    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // send the message to everyone, including the sender
    });


    socket.on('disconnect', function() {
        console.log('user with id ' + socket.id + ' disconnected');
        var i = allClients.indexOf(socket);
        allClients.splice(i, 1);

        i = player.findIndex(function(x){ return x.id === socket.id; });
        if(i !== -1){
           player.splice(i, 1);
        }

        i = games.findIndex(x => x.playerA.id === socket.id || x.playerB.id === socket.id);
        if(i !== -1){
          var game = games.splice(i, 1)[0];
          var oppenent = game.playerA.id === socket.id ? game.playerB : game.playerA;
          getSocketById(oppenent.id).emit("game.exit", "oppenent disconnected");
          console.warn("player " + socket.id +"got disconnected from a running game");
        }

        updateUsersCount();
    });
});

http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:' + (process.env.PORT || 3000));
});
