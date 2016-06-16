app.service('SessionService', function () {
  this.attachUser = function(userId, name, coinsToSolve, opponent, beginner, isSinglePlayer){
    this.userId = userId;
    this.name = name;
    this.coinsToSolve = coinsToSolve;
    this.opponent = opponent;
    this.beginner = beginner;
    this.isSingelplayer = isSinglePlayer;
  }
});
