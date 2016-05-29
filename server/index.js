var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendfile('index.html');
});


var allClients = [];
io.on('connection', function(socket){
  var updateUsersCount = function(){
      io.emit('user count', {users:allClients.length});
      console.log(allClients.length +" clients connected.");
  };

  console.log('a user connected with id '+socket.id);
  allClients.push(socket);
  updateUsersCount();

  //todo: join player
  //todo: transmit move

  socket.on('chat message', function( msg){
      console.log('message: ' + msg);
      io.emit('chat message', msg); // send the message to everyone, including the sender
    });

  socket.on('disconnect', function(){
    console.log('user with id '+socket.id+' disconnected');
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
    updateUsersCount();
  });
});


http.listen(process.env.PORT || 3000, function() {
    console.log('listening on *:' + (process.env.PORT || 3000));
});
