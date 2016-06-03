class Map {
    constructor(w, h, players) {
    this.height = h;
    this.width = w;
    this.coins = [];
    this.coinCount = 0;
    this.players = players;
    }

    applyCoin(coin) { // 6 und 2
      // coin id to find coin in array
     // TODO: Line is FUll Block
     // TODO: Block Interaction during Animation
     // TODO: Block Interaction during enemy player Turn
     if (this.coins.length % 2 == 0) { coin.color = 'blue' }


      if (!((coin.x == 0 && coin.y == 0) ||
          (coin.x == 0 && coin.y == this.height) ||
          (coin.x == this.width && coin.y == 0) ||
          (coin.x == this.width && coin.y == this.height))
      ) {
        if (coin.x == 0) {
            coin.direction = 'east';
            coin.x = 1;
            this.coins.push(coin);
        }
        if (coin.y == 0) {
            coin.direction = 'south';
            coin.y = 1;
            this.coins.push(coin);
        }
        if (coin.x == this.width) {
           coin.direction = 'west';
           coin.x = this.width - 1;
           this.coins.push(coin);
        }
        if (coin.y == this.height) {
          coin.direction = 'north';
          coin.y = this.height - 1;
          this.coins.push(coin);
        }
      }
    }

    // returns all coins in line
    getLineCoins(line, direction) {
        var coinsInLine = [];
        for (var i = 0; i < this.coins.length; i++) {
          if (direction == 'west' || direction == 'east') {
            if (this.coins[i].y == line) {
              coinsInLine.push(this.coins[i]);
            }
          } else {
            if (this.coins[i].x == line) {
              coinsInLine.push(this.coins[i]);
            }
          }
        }
        return coinsInLine;
    }

    moveLine(coinsInLine, direction, doneFn) {
      // if there are moveable coins within that line move them towards
      // target direction until no moveable element is left.
      while(this.isMoveable(coinsInLine)) {
        for (var i = 0; i < coinsInLine.length; i++) {
          // set coin direction
          coinsInLine[i].direction = direction;
          // move coin by one.
          AnimateCircle(coinsInLine[i], 1, doneFn);
        }
      }
    }


    isMoveable(coinsInLine) {
      // Black Magic To run the for iteration at least once.
      let runFor = 2;
      if(coinsInLine.length > 2) { runFor = coinsInLine.length; }

      for (var i = 0; i < runFor - 1; i++) {
        switch(coinsInLine[i].direction) {
          case "east":
              // if there is only one element check if that has already hit the wall.
              if (coinsInLine.length == 1) {
                if (coinsInLine[i].x == this.width - 1) {
                    coinsInLine[i].isMoveable = false;
                }
                break;
              }
              // for 2 or more elements check if the element blocked by another coin or hit the wall
              if (coinsInLine[i].x == coinsInLine[i + 1].x + 1 ||
                 coinsInLine[i].x == this.width - 1) {
                 coinsInLine[i].isMoveable = false;
              }
              break;
          case "west":
              if (coinsInLine.length == 1) {
                if (coinsInLine[i].x == 1) {
                  coinsInLine[i].isMoveable = false;
                }
                break;
              }
              if (coinsInLine[i].x == coinsInLine[i + 1].x + 1 ||
                coinsInLine[i].x == 1) {
                coinsInLine[i].isMoveable = false;
              }
              break;
          case "north":
               if (coinsInLine.length == 1) {
                 if (coinsInLine[i].y == 1) {
                   coinsInLine[i].isMoveable = false;
                 }
                 break;
               }
               if (coinsInLine[i].y == coinsInLine[i + 1].y + 1 ||
                 coinsInLine[i].y == this.height - 1) {
                coinsInLine[i].isMoveable = false;
               }
               break;
          case "south":
              if (coinsInLine.length == 1) {
                if (coinsInLine[i].y == this.height - 1) {
                  coinsInLine[i].isMoveable = false;
                }
                break;
              }
              if (coinsInLine[i].y == coinsInLine[i + 1].y + 1 ||
                coinsInLine[i].y == 1) {
                coinsInLine[i].isMoveable = false;
              }
             break;
          default:
             console.log('No Valid Coin.');
        }
      }
       return this.hasMoveableCoins(coinsInLine);
    }

    // surely redundant but needed at the moment.
    hasMoveableCoins(coinsInLine){
      var hasMoveables = false;
      for (var i = 0; i < coinsInLine.length; i++) {
        if(coinsInLine[i].isMoveable == true) { hasMoveables = true };
        break;
      }
      return hasMoveables;
    }

    checkAllRowsForTermination() {
        // TODO: Prove Lines
        // TODO: Prove Diagonal
    }



    getCoins() {
      return this.coins;
    }
    getPlayers() {
      return this.players;
    }

    // not needed yet.
    getCoinByID(id)
    {
      var coin = this.coins.filter(function(coin) {
        return coinsXY.id === id;
      })
    }

    // not needed yet.
    getCoinByXY(x, y)
    {
      var coinsXY = this.coins.filter(function(coinsXY) {
        return coinsXY.x == x && coinsXY.y == y;
      })
    }

  // start the coin animation --- called from GameController on ngRepeatFinishedEvent
	animate(unlockField, doneFn){
    // get last inserted coin
    var lastCoin = this.coins[this.coins.length -1];
    var line;

    // get movement
    switch(lastCoin.direction) {
      case "east":
         line = lastCoin.y;
         break;
      case "west":
         line = lastCoin.y;
         break;
      case "north":
         line = lastCoin.x;
         break;
      case "south":
         line = lastCoin.x;
         break;
      default:
         console.log('No Valid Coin.');
    }

    // Move Coins in Line
    var line = this.getLineCoins(line, lastCoin.direction);
    this.moveLine(line, lastCoin.direction, doneFn);

    // undlock gamefield and force Readraw
    unlockField();
	}
}
