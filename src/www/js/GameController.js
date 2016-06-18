app.controller('GameController', function($scope, $state, $ionicPopup, $timeout, socket, SessionService, $rootScope) {

  $rootScope.$on('$stateChangeSuccess',
    function(event, toState, toParams, fromState, fromParams){
      console.log(event, toState, toParams, fromState, fromParams);
      if(toState.name === "game")
        $scope.init();
    });

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
    } else {
      $scope.map.startColor = "red";
    }

    new Timer();
    $scope.coinCount = 0;
    $scope.turnCount = 0;
  };
  $scope.init();

  $scope.back = function() {
    console.log('hallo game');
    //$location.path('/start');
    $state.go('start');
  };

  socket.on('game.turn', function(message) {
    if (message.turnNumber !== undefined) {
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
      $scope.turnCount++;
      $scope.coinCount++;
    }
    changePlayer($scope.map.players.you.name, $scope.map.players.you.name);
    $scope.lockField = false;
  });

  socket.on('game.exit', function(message) {
    if (message === "opponent disconnected") {
      //todo popup
    }
  });

  // timeout event
  timeoutPlayer = function() {
    if ($scope.user.isSingelplayer) {
      // single player
      $scope.coinCount++;
      $scope.turnCount++;
      if ($scope.turnCount % 2 == 1) {
        changePlayer($scope.map.players.opponent.name, $scope.map.players.you.name);
      } else {
        changePlayer($scope.map.players.you.name, $scope.map.players.you.name);
      }
    } else { // multiplayer
      fieldLock = true;
      socket.emit("game.turn", {});
      changePlayer($scope.map.players.opponent.name, $scope.map.players.you.name);
    }
  };

  $scope.insertCoinOnClick = function(x, y) {
    // only insert if allowed.
    if ($scope.lockField === true) {
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
        changePlayer($scope.map.players.opponent.name, $scope.map.players.you.name);
      } else {
        inserted = $scope.map.applyCoin(new Coin(x, y, $scope.map.players.opponent.color, $scope.coinCount, $scope.map.players.opponent.color));
        changePlayer($scope.map.players.you.name, $scope.map.players.you.name);
      }
    } else {
      inserted = $scope.map.applyCoin(new Coin(x, y, $scope.map.players.you.color, $scope.coinCount, $scope.map.players.you.color));
      changePlayer($scope.map.players.opponent.name, $scope.map.players.you.name);
    }

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
