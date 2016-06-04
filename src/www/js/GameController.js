let map = new Map(6, 6, [new player('name1', 0, 'red'), new player('name2', 0, 'blue')]);
app.controller('GameController', function ($scope, $state, $timeout) {

  $scope.map = map;
  var currentPlayer = map.players[0];
	var coinCount=0;
  var lockField = false;

    $scope.back = function () {
        console.log('hallo game');
        //$location.path('/start');
        $state.go('start');
    }

    $scope.insertCoin = function(x, y) {
        console.log('insertCoin');
        coinCount++;

        // only insert if allowed.
        if(lockField == false) {
          lockField = true;
          $scope.map.applyCoin(new Coin(x, y, 'me', coinCount), function(){ lockField = false; });
        }

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
      function(){$timeout(function(){ lockField = false; },0)},
      // animation Timeout and Redraw.
      function(){$timeout(function(){},0)}
    );
	});

});
