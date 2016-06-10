class Map {
    constructor(w, h, you, oponent) {
    this.height = h;
    this.width = w;
    this.coins = [];
    this.coinCount = 0;
    this.players = { you: you, oponent: oponent }
    this.coinsToSolve = 3;
    }

    getCoins() { return this.coins; }
    getPlayers() { return this.players; }

    // not needed yet.
    getCoinByID(id)
    {
      //var coin = [];
      return coin = this.coins.filter(function(coin) {
        return coin.id === id;
      })
      // return coin;
    }

    // required for neighbor detection.
    getCoinByXY(x, y)
    {
      return this.coins.filter(function(coinsXY) {
        return coinsXY.targetX === x && coinsXY.targetY === y;
      })
    }

    applyCoin(coin, unlockField) { // 6 und 2
      // coin id to find coin in array
     // TODO: [x]  Line is FUll Block
     // TODO: [x] Block Interaction during Animation // fieldLock gets called to early :/
     // TODO: [ ] Block Interaction during enemy player Turn


      if (!((coin.x == 0 && coin.y == 0) ||
          (coin.x == 0 && coin.y == this.height) ||
          (coin.x == this.width && coin.y == 0) ||
          (coin.x == this.width && coin.y == this.height))
      ) {
        if (coin.x == 0) {
            coin.direction = 'east';
            coin.x = 1; coin.targetX = 1;
            // only push if there is space forit
            if(this.getLineCoins(coin.y, coin.direction).length != this.width - 1) {
              this.coins.push(coin);
            } else {
              unlockField();
            }
        }
        if (coin.y == 0) {
            coin.direction = 'south';
            coin.y = 1; coin.targetY = 1;
            if(this.getLineCoins(coin.x, coin.direction).length != this.height - 1) {
              this.coins.push(coin);
            } else {
              unlockField();
            }
        }
        if (coin.x == this.width) {
           coin.direction = 'west';
           coin.x = this.width - 1; coin.targetX = this.width - 1;
           if(this.getLineCoins(coin.y, coin.direction).length != this.width - 1) {
             this.coins.push(coin);
           } else {
             unlockField();
           }
        }
        if (coin.y == this.height) {
          coin.direction = 'north';
          coin.y = this.height - 1; coin.targetY =  this.height - 1;
          if(this.getLineCoins(coin.x, coin.direction).length != this.height - 1) {
            this.coins.push(coin);
          } else {
            unlockField();
          }
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
      this.isMoveable(coinsInLine, direction);

      for (var i = 0; i < this.coins.length; i++) {
        // calc destination
        var dist = 0;
        if(this.coins[i].x != this.coins[i].targetX) {
          dist = this.coins[i].targetX - this.coins[i].x;
        } else if (this.coins[i].y != this.coins[i].targetY) {
          dist = this.coins[i].targetY - this.coins[i].y
        }

        AnimateCircle(this.coins[i], Math.abs(dist), doneFn);
      }
    }


    isMoveable(coinsInLine, direction) {
      while(this.hasMoveableCoins(coinsInLine)) {
        for (var i = 0; i < coinsInLine.length; i++) {
          // set coin direction, not sure if we need to set it
          // or if we need the original direction later on...
          // both is posible.
          coinsInLine[i].direction = direction;

          // detect movement and set new targetXY if possible
          switch(coinsInLine[i].direction) {
            case "east":
                // for 2 or more elements check if the element blocked by another coin or hit the wall
                if (this.getCoinByXY(coinsInLine[i].targetX + 1, coinsInLine[i].targetY).length > 0
                    || coinsInLine[i].targetX == this.width - 1) {
                   coinsInLine[i].isMoveable = false;
                } else {
                   coinsInLine[i].targetX = coinsInLine[i].targetX + 1;
                   coinsInLine[i].isMoveable = true;
                }
                break;
            case "west":
                if (this.getCoinByXY(coinsInLine[i].targetX - 1, coinsInLine[i].targetY).length > 0
                    || coinsInLine[i].targetX == 1) {
                   coinsInLine[i].isMoveable = false;
                } else {
                   coinsInLine[i].targetX = coinsInLine[i].targetX - 1;
                   coinsInLine[i].isMoveable = true;
                }
                break;
            case "north":
                if (this.getCoinByXY(coinsInLine[i].targetX, coinsInLine[i].targetY - 1).length > 0
                    || coinsInLine[i].targetY == 1) {
                   coinsInLine[i].isMoveable = false;
                } else {
                   coinsInLine[i].targetY = coinsInLine[i].targetY - 1;
                   coinsInLine[i].isMoveable = true;
                }
                break;
            case "south":
                if (this.getCoinByXY(coinsInLine[i].targetX, coinsInLine[i].targetY + 1).length > 0
                    || coinsInLine[i].targetY == this.height - 1) {
                   coinsInLine[i].isMoveable = false;
                } else {
                   coinsInLine[i].targetY = coinsInLine[i].targetY + 1;
                   coinsInLine[i].isMoveable = true;
                }
                break;
            default:
               console.log('No Valid Coin.');
          }
        }
      }
    }

    // surely redundant but needed at the moment.
    hasMoveableCoins(coinsInLine){
      var hasMoveables = false;
      for (var i = 0; i < coinsInLine.length; i++) {
        if(coinsInLine[i].isMoveable == true) {
          hasMoveables = true;
          break;
        };
      }
      return hasMoveables;
    }

  // Input "row" to check row lines otherwise it will check column lines
  checkForTermination(checkRowOrColumn) {
    for (var i = 1; i < this.width; i++) {
      let lastOwner = "";
      let currentOwner = "";
      let count = 0;
      var coinsToRemove = [];
      let coin;
      for (var j = 1; j < this.height; j++) {
        // get coin on Position
        if (checkRowOrColumn == "rows") {
          coin = this.getCoinByXY(i, j)[0];
        } else { // check Columns.
          coin = this.getCoinByXY(j, i)[0];
        }

        // if no coin exists
        if (coin == undefined) {
          if (count >= this.coinsToSolve) {
            count++;
            this.removeCoins(coinsToRemove);
            this.addScroreToPlayer(lastOwner, count);
          }
          coinsToRemove = []; count = 0;
        } else if (coin.owner != lastOwner && count >= this.coinsToSolve) {
          count++;
            this.removeCoins(coinsToRemove);
            this.addScroreToPlayer(lastOwner, count);
            coinsToRemove = []; count = 0;
        } else if (coin.owner == lastOwner || count == 0) {
            count++;
            lastOwner = coin.owner;
            coinsToRemove.push(coin);
            if ((j == this.height - 1 && coinsToRemove.length >= this.coinsToSolve)) {
              count++;
              this.removeCoins(coinsToRemove);
              this.addScroreToPlayer(lastOwner, count);
              coinsToRemove = []; count = 0;
            }
        } else if (coin.owner != lastOwner) {
          coinsToRemove = []; count = 1;
          coinsToRemove.push(coin);
          lastOwner = coin.owner;
       }

      }
    }
  }

  addScroreToPlayer(playerName, score) {
    if (playerName == this.players.you) {
      this.players.you.score += score;
    } else {
      this.players.oponent.score += score;
    }
  }

  // remove coins from map object.
  removeCoins(coinsToRemove) {
    for (var i = 0; i < coinsToRemove.length; i++) {
      // get index from coin array
      var index = this.coins.findIndex(function(element) {
        return element.id === coinsToRemove[i].id ;
      });
      // remove the coin
      this.coins.splice(index, 1)
    }
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

    //check for termination
    // this.checkAllRowsForTermination();
    // undlock gamefield and force Readraw // Triggers to early
    unlockField();
	}
}
