app.controller('GameController', function ($scope, $location) {

    $scope.back = function () {
        console.log('hallo game');
        $location.path('/start');
    }
});