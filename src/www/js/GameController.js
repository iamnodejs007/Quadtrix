app.controller('GameController', function ($scope, $state) {
    $scope.map = new Map(6, 6);

    $scope.back = function () {
        console.log('hallo game');
        //$location.path('/start');
        $state.go('start');
    }

    $scope.insertCoin = function(x, y) {
        console.log('insertCoin');
        $scope.map.applyCoin(new Coin(x, y, 'me'));
    }
});
