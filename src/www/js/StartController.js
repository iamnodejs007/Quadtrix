app.controller('StartController', function($scope, $state, socket, SessionService, $ionicModal) {
  $scope.usercount;
  $scope.yourName = "";
  $scope.coinsToSolve = 3;
  $scope.waitingForMatch = false;
  $scope.editSettings = false;
  var userId = "_" + Math.random();

  socket.on('user.count', function(message) {
    $scope.usercount = message.users;
    console.log(message.users + " Users");
  });

  $scope.matchRequest = function() {
      var message = { name: $scope.yourName, coinsToSolve: $scope.coinsToSolve };
      socket.emit("match.request", message);
      $scope.waitingForMatch = true;
      //SessionService.attachUser("1", $scope.yourName, $scope.coinsToSolve, $scope.yourName, $scope.yourName, false);
  }

  $scope.cancelRequest = function() {
      socket.emit("match.cancelrequest", {});
      $scope.waitingForMatch = false;
  }

  socket.on('match.found', function(message) {
    if (message.playerA.name === $scope.yourName) {
      SessionService.attachUser(message.playerA.id, $scope.yourName, $scope.coinsToSolve, message.playerB.name, message.playerA.name, false);
    } else {
      SessionService.attachUser(message.playerB.id, $scope.yourName, $scope.coinsToSolve, message.playerA.name, message.playerA.name, false);
    }
    $scope.coinsToSolve = message.coinsToSolve;
    $state.go('game');
  })

  // on settingschange push it to the SessionService
  $scope.save = function() {
    $scope.editSettings = false;
    SessionService.attachUser(userId, $scope.yourName, $scope.coinsToSolve, "Bob", $scope.yourName, true);

  };
});
