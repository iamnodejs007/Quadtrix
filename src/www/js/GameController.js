
app.controller('GameController', function ($scope, $state, $timeout, socket, SessionService) {
  var map = new Map(6, 6, new player('Bob', 0, 'red'), new player('Alice', 0, 'blue'));
  $scope.map = map;
  var session = SessionService.getUser();
  if(session.isSingelplayer == undefined) {
    session.isSingelplayer = true;
  }
  if (session.beginner == undefined || session.beginner == "") {
    session.beginner = $scope.map.players.you.name;
  }
  if (session.coinsToSolve == undefined || session.coinsToSolve == "") {
    session.coinsToSolve = 3;
  } else {
    $scope.map.coinsToSolve = session.coinsToSolve;
  }
  if (session.name == undefined || session.name == "") {
    session.name = $scope.map.players.you.name;
  } else {
    $scope.map.players.you.name = session.name;
  }

  if (session.opponent == undefined  || session.opponent == "") {
    session.opponent = $scope.map.players.opponent.name; // oponent name
  } else {
    $scope.map.players.opponent.name = session.opponent;
  }

  var lockField = false;
  $scope.map.startColor = "red";

  if (session.beginner != $scope.map.players.you.name) {
    lockField = true;
    $scope.map.startColor = "blue";
  } else {
    $scope.map.startColor = "red";
  }

	var coinCount = 0;
  var turnCount = 0;
  var currentPlayer = { playername: session.beginner , color: "blue" };

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
      changePlayer($scope.map.players.you.name, $scope.map.players.you.name);
      lockField = false;
    });

    $scope.timeoutPlayer = function() {
      if (session.isSingelplayer == true) {
        // single player
        if(turnCount % 2 == 1) {
          changePlayer($scope.map.players.you.name, $scope.map.players.you.name);
        } else {
          changePlayer($scope.map.players.you.name,map.players.you.name);
        }
        coinCoint++;
        turnCount++;
        // multiplayer
      } else {
        fieldLock = false;
        socket.emit("game.turn", {});
      }

    }

    $scope.insertCoinOnClick = function(x, y) {
        // only insert if allowed.
        if(lockField === false) {
          lockField = true;
          coinCount++;
          turnCount++;
          // switch player

          let inserted;
          if (session.isSingelplayer == true) {
            if(turnCount % 2 == 1) {
              inserted = $scope.map.applyCoin(
               new Coin(x, y, $scope.map.players.you.name, coinCount, $scope.map.players.you.color)
              );
              changePlayer($scope.map.players.opponent.name,map.players.you.name);
           } else {
             inserted = $scope.map.applyCoin(
              new Coin(x, y, $scope.map.players.opponent.name, coinCount, $scope.map.players.opponent.color)
              );
              changePlayer($scope.map.players.you.name,map.players.you.name);
           }
         } else {
           inserted = $scope.map.applyCoin(
            new Coin(x, y, $scope.map.players.you.name, coinCount, $scope.map.players.you.color)
           );
           changePlayer($scope.map.players.opponent.name,map.players.you.name);
         }

          if (inserted) {
            var turn = {
              target: {
                x: x,
                y: y
              },
              direction: null,
              turnNumber:turnCount,
            };

            if(session.isSingelplayer == true) {
              lockField = false;
            } else {
              socket.emit("game.turn", turn);
            }
            // changePlayer($scope.map.players.opponent.name,map.players.you.name);
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
        $scope.map.checkForTermination("rows", $timeout);
        $scope.map.checkForTermination("colls", $timeout);
      }, 1000);},
      // animation Timeout and Redraw.
      function(){$timeout(function(){},0);}
    );
	});
});
