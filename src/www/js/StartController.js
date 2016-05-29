app.controller('StartController', function ($scope, socket) {
    $scope.usercount;

    socket.on('user count', function (message) {
      $scope.usercount = message.users;
          console.log(message.users+ " Users");
    });
});
