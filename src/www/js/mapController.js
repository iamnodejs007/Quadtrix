class Map {
    constructor(w, h) {
    this.height = h;
    this.width = w;
    this.coins = [];
    this.coinCount = 0;
    }

    applyCoin(coin) { // 6 und 2
      // coin id to find coin in array
      coin.id = this.coinCount;
      this.coinCount++;

      if (!((coin.x == 0 && coin.y == 0) ||
          (coin.x == 0 && coin.y == this.height) ||
          (coin.x == this.width && coin.y == 0) ||
          (coin.x == this.width && coin.y == this.height))
      ) {
        if (coin.x == 0) {
            coin.direction = 'east';
            // move whole row if its space before and stay at last free spot
            var coinsInLine = this.getLineCoins(coin.y, coin.direction);
            // moveAndAdd(coinsInLine, direction, this.width - 1, coin.y);

            coin.x = this.width - coinsInLine.length - 1;
            this.coins.push(coin);
        }
        if (coin.y == 0) {
            coin.direction = 'south';
            var coinsInLine = this.getLineCoins(coin.x, coin.direction);
            coin.y = this.height - coinsInLine.length - 1;
            this.coins.push(coin);
        }
        if (coin.x == this.width) {
           coin.direction = 'west';
           var coinsInLine = this.getLineCoins(coin.y, coin.direction);
           coin.x = 1 + coinsInLine.length;
           this.coins.push(coin);
        }
        if (coin.y == this.height) {
          coin.direction = 'north';
          var coinsInLine = this.getLineCoins(coin.x, coin.direction);
          coin.y = 1 + coinsInLine.length;
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
}
