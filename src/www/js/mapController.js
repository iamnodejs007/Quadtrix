class Map {
    constructor(w, h) {
    this.height = h;
    this.width = w;
    this.coins = [];
    }
    applyCoin(coin) { // 6 und 2
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

    getCoins() {
      return this.coins;
    }

	animate(id){
		AnimateCircle(this.coins[this.coins.length - 1],4);
	}

	
}
