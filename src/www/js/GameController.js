
app.controller('GameController', function ($scope, $state, $timeout, socket, SessionService) {
  var m = new Map(6, 6, new player('Bob', 0, 'red'), new player('Alice', 0, 'blue'));
  $scope.map = m;
  $scope.map.players.you.name = SessionService.name;
  $scope.map.coinsToSolve = SessionService.coinsToSolve;
  $scope.map.players.oponent.name = "Alice" // oponent name
  var currentPlayer;
	var coinCount = 0;
  var lockField = false;
  var turnCount = 0;


    $scope.back = function () {
        console.log('hallo game');
        //$location.path('/start');
        $state.go('start');
    };

    $scope.insertCoin = function(x, y) {
        console.log('insertCoin');

        // only insert if allowed.
        if(lockField === false) {
          lockField = true;
          coinCount++;
          turnCount++;
          // switch player
          if (turnCount % 2 == 0) {
            currentPlayer = $scope.map.players.oponent;
            console.log("oponent");
          } else {
            console.log("me");
            currentPlayer = $scope.map.players.you;
          }

          $scope.map.applyCoin(
            new Coin(x, y, currentPlayer.name, coinCount, currentPlayer.color),
            function(){ lockField = false; }
          );

        }

        /*
          sample code, send turn to server
          var turn = {
            target: {
              x: 1,
              y: 1
            },
            turnNumber:123,
          };
          socket.emit("player.turn", turn);
        */
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
        lockField = false;
        $scope.map.checkForTermination("rows");
        $scope.map.checkForTermination("colls");
      }, 1000);},
      // animation Timeout and Redraw.
      function(){$timeout(function(){},0);}
    );
	});

});
