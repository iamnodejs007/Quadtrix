app.service('SessionService', function () {
  this.attachUser = function(userId, name, coinsToSolve){
    this.userId = userId;
    this.name = name;
    this.coinsToSolve = coinsToSolve;
  }
});
