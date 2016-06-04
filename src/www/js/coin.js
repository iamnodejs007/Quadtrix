class Coin {
    constructor(x, y, owner,id) {
  	this.id = id;
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.owner = owner;
    this.color = 'red';
    this.direction;
    this.isMoveable = true;
    }
}
