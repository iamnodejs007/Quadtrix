
app.controller('GameController', function ($scope, $state, $timeout, socket, SessionService) {
  var map = new Map(6, 6, new player('Bob', 0, 'red'), new player('Alice', 0, 'blue'));
  $scope.map = map;
  $scope.map.players.you.name = SessionService.name;
  $scope.map.coinsToSolve = SessionService.coinsToSolve;
  if (SessionService.opponent != undefined) {
    $scope.map.players.opponent.name = SessionService.opponent; // oponent name
  }
  var lockField = false;
  if (SessionService.beginner != undefined) {
    if (SessionService.beginner != $scope.map.players.you.name) {
      lockField = true;
    }
  }
	var coinCount = 0;
  var turnCount = 0;

    $scope.back = function () {
        console.log('hallo game');
        //$location.path('/start');
        $state.go('start');
    };

    socket.on('game.turn', function(message) {
      $scope.map.applyCoin(
        new Coin(message.target.x,
                message.target.y,
                $scope.map.players.opponent.name,
                message.turnNumber,
                $scope.map.players.opponent.color)
      );
      turnCount = message.turnNumber;
      coinCount = message.turnNumber;
      changePlayer($scope.map.players.opponent.name, $scope.map.players.you.name);
      lockField = false;
    });

    $scope.insertCoinOnClick = function(x, y) {
        // only insert if allowed.
        if(lockField === false) {
          lockField = true;
          coinCount++;
          turnCount++;
          // switch player

          let inserted = $scope.map.applyCoin(
            new Coin(x, y, $scope.map.players.you.name, coinCount, $scope.map.players.you.color)
          );

          if (inserted) {
            var turn = {
              target: {
                x: x,
                y: y
              },
              direction: null,
              turnNumber:turnCount,
            };
            socket.emit("game.turn", turn);
            changePlayer($scope.map.players.opponent.name,map.players.you.name);
          }
          else {
            lockField = false;
            turnCount--;
            coinCount--;
            console.log('faild to insert');
          }
        }
      };



	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    /* black magic
       after the animation is over, a timeout is called.
       The end of the timer forces AngularJS to redraw the game map.
       If you like to see what this does, just remove the $timeout call
       from the line below.
    */
		$scope.map.animate(
      // unlock Field and Redraw
      // lock the Field for 1 sek. till the animation is over
      // maybe not needed if we have player interaction where the game field is locked through
      // the enemy Turn anyways.
      function(){$timeout(function(){
        $scope.map.checkForTermination("rows");
        $scope.map.checkForTermination("colls");
      }, 1000);},
      // animation Timeout and Redraw.
      function(){$timeout(function(){},0);}
    );
	});
});
