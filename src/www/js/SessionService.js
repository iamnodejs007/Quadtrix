app.service('SessionService', function ($localStorage) {

  var user = $localStorage.$default({
    name: 'Bob',
    coinsToSolve : 3,
    opponent: 'Alice',
    isSingelplayer: true,
    beginner: 'Bob'
  });

  return {
    attachUser: function(userId, name, coinsToSolve, opponent, beginner, isSinglePlayer){
      user.userId = userId;
      user.name = name;
      user.coinsToSolve = coinsToSolve;
      user.opponent = opponent;
      user.beginner = beginner;
      user.isSingelplayer = isSinglePlayer;
    },
    getUser: function(){
      return user;
    }
  }
});
