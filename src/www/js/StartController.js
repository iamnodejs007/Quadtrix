app.controller('StartController', function($scope, $state, socket, SessionService) {
  $scope.usercount;
  $scope.yourName = "";
  $scope.coinsToSolve = 3;
  $scope.waitingForMatch = false;
  var userId = "_" + Math.random();
  socket.on('user.count', function(message) {
    $scope.usercount = message.users;
    console.log(message.users + " Users");
  });

  $scope.matchRequest = function() {
      var message = { name: $scope.yourName };
      socket.emit("match.request", message);
      $scope.waitingForMatch = true;

  }

  $scope.cancelrequest = function() {
      var message = {};
      socket.emit("match.cancelrequest", message);
  }

  socket.on('match.found', function(message) {
    if (message.playerA.name === $scope.yourName) {
      SessionService.attachUser(message.playerA.id, $scope.yourName, $scope.coinsToSolve, message.playerB.name, message.playerA.name);
    } else {
      SessionService.attachUser(message.playerB.id, $scope.yourName, $scope.coinsToSolve, message.playerA.name, message.playerA.name);
    }
      $state.go('game');
  })


  // on settingschange push it to the SessionService
  $scope.change = function() {
       SessionService.attachUser(userId, $scope.yourName, $scope.coinsToSolve, "Bob", $scope.yourName);
  };
});
