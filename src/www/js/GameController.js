app.controller('GameController', function ($scope, $state) {

    $scope.back = function () {
        console.log('hallo game');
        //$location.path('/start');
        $state.go('start');
    }
});
