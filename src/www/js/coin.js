class Coin {
    constructor(x, y, owner, id, color) {
  	this.id = id;
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.owner = owner;
    this.color = color;
    this.direction;
    this.isMoveable = true;
    }
}
