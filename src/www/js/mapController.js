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

    moveLine(coinsInLine, direction, toX, toY) {
      while (isMapPositionEmpty(coinsInLine, toX, toY)) {
        for (var i = 0; i < array.length; i++) {
          array[i]
        }
      }
    }

    isMapPositionEmpty(coinsInLine, x, y) {
      var isEmpty = true;
      for (var i = 0; i < coinsInLine.length; i++) {
        if (coinsInLine[i].x == x && coinsInLine[i].y == y) {
          isEmpty = false;
        }
      }
      return isEmpty;
    }

    checkAllRowsForTermination() {

    }

    getCoins() {
      return this.coins;
    }
    getPlayers() {
      return this.players;
    }

    getCoin(id)
    {
      var coin;
      for (var i = 0; i < this.coins.length; i++) {
        if(this.coins[i].id == id)
        {
           coin = this.coins[i];
           break;
        }
      }
      return coin;
    }

	animate(doneFn){
    // get last inserted coin
    var lastCoin = this.coins[this.coins.length - 1];
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


    // animate
    var way = this.width - line.length - 1;
    AnimateCircle(lastCoin, way,doneFn);
	}
}
