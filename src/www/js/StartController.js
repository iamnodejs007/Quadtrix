app.controller('StartController', function($scope, socket, SessionService) {
  $scope.usercount;
  $scope.yourName = "";
  $scope.coinsToSolve = 3;
  var userId = "_" + Math.random();
  socket.on('user.count', function(message) {
    $scope.usercount = message.users;
    console.log(message.users + " Users");
  });

  // on settingschange push it to the SessionService
  $scope.change = function() {
       SessionService.attachUser(userId, $scope.yourName, $scope.coinsToSolve);
  };
});
