app.controller('GameController', function($scope, $state, $ionicPopup, $timeout, socket, SessionService, $rootScope, $interval) {

  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams){
      console.log(event, toState, toParams, fromState, fromParams);
      if(toState.name === "game")
        $scope.init();
    });


      $scope.isMyTurn = function(){
         return $scope.currentPlayer === $scope.map.players.you.name;
       };

      $scope.changePlayer = function(currentPlayer) {
        $scope.currentPlayer = currentPlayer;
        changePlayer(currentPlayer,$scope.map.players.you.name);
      };

  $scope.init = function(){
    $scope.user = SessionService.getUser();

    var map = new Map(6, 6, new player($scope.user.name, 0, 'red'), new player($scope.user.opponent, 0, 'blue'));
    $scope.map = map;
    $scope.map.coinsToSolve = $scope.user.coinsToSolve;

    $scope.lockField = false;
    $scope.map.startColor = "red";

    if ($scope.user.beginner != $scope.map.players.you.name) {
      $scope.lockField = true;
      $scope.map.startColor = "blue";
      $scope.changePlayer($scope.map.players.opponent.name);
    } else {
      $scope.map.startColor = "red";
      $scope.changePlayer($scope.map.players.you.name);
    }

    $scope.coinCount = 0;
    $scope.turnCount = 0;
  };
  $scope.init();

  $scope.turnTime = 9;
  $scope.countdownIntervall = undefined;
  $scope.countdown = function(time){
    time -= 1;
    if($scope.countdownIntervall !== undefined){
      $interval.cancel($scope.countdownIntervall);
    }

    $scope.turnTime = time;

    var updateTime = function(){
      $scope.turnTime -= 1;
      if($scope.turnTime < 0)
      {
        $scope.turnTime =0;
        $interval.cancel($scope.countdownIntervall);
        $scope.timeoutPlayer();
      }
    };
    $scope.countdownIntervall = $interval(updateTime, 1000);
  };

  $scope.back = function() {
    console.log('hallo game');
    //$location.path('/start');
    $state.go('start');
  };

  socket.on('game.turn', function(message) {
    if (message.turnNumber !== undefined) {
      console.log("oppenent sent turn", message);
      $scope.map.applyCoin(
        new Coin(message.target.x,
          message.target.y,
          $scope.map.players.opponent.name,
          message.turnNumber,
          $scope.map.players.opponent.color)
      );
      $scope.turnCount = message.turnNumber;
      $scope.coinCount = message.turnNumber;
    } else {
      console.log("oppenent sent empty");
      $scope.turnCount++;
      $scope.coinCount++;
    }
    $scope.changePlayer($scope.map.players.you.name);
    $scope.lockField = false;

    $scope.countdown(10);
  });

  socket.on('game.exit', function(message) {
    if (message === "opponent disconnected") {
      //todo popup
    }
  });

  // timeout event
  $scope.timeoutPlayer = function() {
    if ($scope.user.isSingelplayer) {
      // single player
      $scope.coinCount++;
      $scope.turnCount++;
      if ($scope.turnCount % 2 == 1) {
        $scope.changePlayer($scope.map.players.opponent.name);
      } else {
        $scope.changePlayer($scope.map.players.you.name);
      }
      $scope.countdown(10);
    }
    else { // multiplayer
      fieldLock = true;
      if ($scope.isMyTurn()) { //its me
        console.log($scope.map.players.you.name + " ist drann.");
        $scope.countdown(10);
        socket.emit("game.turn", {});
        $scope.changePlayer($scope.map.players.opponent.name);
      }
      else {
        console.log("gegner ist drann, warte");
      }
    }
  };

  $scope.insertCoinOnClick = function(x, y) {
    // only insert if allowed.
    if ($scope.isMyTurn() === false) {
      return;
    }

    $scope.lockField = true;
    $scope.coinCount++;
    $scope.turnCount++;
    // switch player

    var inserted;
    if ($scope.user.isSingelplayer === true) {
      if ($scope.turnCount % 2 == 1) {
        inserted = $scope.map.applyCoin(new Coin(x, y, $scope.map.players.you.color, $scope.coinCount, $scope.map.players.you.color));
        $scope.changePlayer($scope.map.players.opponent.name);
      } else {
        inserted = $scope.map.applyCoin(new Coin(x, y, $scope.map.players.opponent.color, $scope.coinCount, $scope.map.players.opponent.color));
        $scope.changePlayer($scope.map.players.you.name);
      }
    } else {
      inserted = $scope.map.applyCoin(new Coin(x, y, $scope.map.players.you.color, $scope.coinCount, $scope.map.players.you.color));
      $scope.changePlayer($scope.map.players.opponent.name);
    }
    $scope.countdown(10);

    if (inserted) {
      var turn = {
        target: {
          x: x,
          y: y
        },
        direction: null,
        turnNumber: $scope.turnCount,
      };

      if ($scope.user.isSingelplayer === true) {
        $scope.lockField = false;
      } else {
        socket.emit("game.turn", turn);
      }
    } else {
      $scope.lockField = false;
      $scope.turnCount--;
      $scope.coinCount--;
      console.log('faild to insert');
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
  }

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
      function() {
        $timeout(function() {
          $scope.map.checkForTermination("rows", $timeout);
          $scope.map.checkForTermination("colls", $timeout);
          var win = $scope.map.checkWinConditionForPlayer();
          if (win !== undefined) {
            endgame(win + " hat Gewonnen!");
          }
        }, 1000);
      },
      // animation Timeout and Redraw.
      function() {
        $timeout(function() {}, 0);
      }
    );
  });
});
