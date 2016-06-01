var map = new Map(6, 6);
app.controller('GameController', function ($scope, $state,$timeout) {

  $scope.map = map;
	var coinCount=0;

    $scope.back = function () {
        console.log('hallo game');
        //$location.path('/start');
        $state.go('start');
    }

    $scope.insertCoin = function(x, y) {
        console.log('insertCoin');
		    coinCount++;
        $scope.map.applyCoin(new Coin(x, y, 'me', coinCount));

    }

	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    /* black magic
       after the animation is over, a timeout is called.
       The end of the timer forces AngularJS to redraw the game map.
       If you like to see what this does, just remove the $timeout call
       from the line below.
    */
		$scope.map.animate(function(){$timeout(function(){},0)});
	});

});
