app.service('SessionService', function () {
  this.attachUser = function(userId, name, coinsToSolve, oponent){
    this.userId = userId;
    this.name = name;
    this.coinsToSolve = coinsToSolve;
    this.oponent = oponent;
  }
});
