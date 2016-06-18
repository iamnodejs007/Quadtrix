app.controller('GameController', function ($scope, $state, $ionicPopup, $timeout, socket, SessionService) {
  var map = new Map(6, 6, new player('Bob', 0, 'red'), new player('Alice', 0, 'blue'));
  $scope.map = map;
  var session = SessionService.getUser();
  $scope.map.coinsToSolve = session.coinsToSolve;
  $scope.map.players.you.name = session.name;
  $scope.map.players.opponent.name = session.opponent;

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
    $scope.back = function () {
        console.log('hallo game');
        //$location.path('/start');
        $state.go('start');
    };

    socket.on('game.turn', function(message) {
      if (message.turnNumber != undefined) {
        $scope.map.applyCoin(
          new Coin(message.target.x,
                  message.target.y,
                  $scope.map.players.opponent.name,
                  message.turnNumber,
                  $scope.map.players.opponent.color)
        );
        turnCount = message.turnNumber;
        coinCount = message.turnNumber;
      } else {
        turnCount++;
        coinCount++;
      }
      changePlayer($scope.map.players.you.name, $scope.map.players.you.name);
      lockField = false;
    });

    socket.on('game.exit' , function(message) {
      if (message == "opponent disconnected") {
        //
      }
    });

    // timeout event / Not used yet.
    timeoutPlayer = function() {
      if (session.isSingelplayer == true) {
        // single player
        coinCount++;
        turnCount++;
        if(turnCount % 2 == 1) {
          changePlayer($scope.map.players.opponent.name, $scope.map.players.you.name);
        } else {
          changePlayer($scope.map.players.you.name, $scope.map.players.you.name);
        }
      } else { // multiplayer
        fieldLock = true;
        socket.emit("game.turn", {});
        changePlayer($scope.map.players.opponent.name,map.players.you.name);
      }
    }

    $scope.insertCoinOnClick = function(x, y) {
        // only insert if allowed.
        if(lockField === false) {
          lockField = true;
          coinCount++;
          turnCount++;
          // switch player

          var inserted;
          if (session.isSingelplayer == true) {
            if(turnCount % 2 == 1) {
              inserted = $scope.map.applyCoin(
               new Coin(x, y, $scope.map.players.you.color, coinCount, $scope.map.players.you.color)
              );
              changePlayer($scope.map.players.opponent.name,map.players.you.name);
           } else {
             inserted = $scope.map.applyCoin(
              new Coin(x, y, $scope.map.players.opponent.color, coinCount, $scope.map.players.opponent.color)
              );
              changePlayer($scope.map.players.you.name,map.players.you.name);
           }
         } else {
           inserted = $scope.map.applyCoin(
            new Coin(x, y, $scope.map.players.you.color, coinCount, $scope.map.players.you.color)
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

  function endgame(msg) {
       var alertPopup = $ionicPopup.alert({
         title: 'Spielende',
         template: msg
       });
       alertPopup.then(function(res) {
         $scope.back();
       });
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
        var win = $scope.map.checkWinConditionForPlayer();
            if (win != undefined) {
              endgame(win + " hat Gewonnen!");
          }
      }, 1000);},
      // animation Timeout and Redraw.
      function(){$timeout(function(){},0);}
    );
	});
});
