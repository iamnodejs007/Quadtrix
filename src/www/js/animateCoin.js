function AnimateCircle(coin, steps, doneFn) {
  var fieldsize = 40;
  var movement = fieldsize*steps;

	var circle = $('#'+coin.id);

	if (coin.direction == "north" || coin.direction == "south") {
    console.log("movment  :" + movement);
    console.log("coinY old: " + coin.y);
    if (coin.direction == "north") movement=-movement;
    $.Velocity.animate(circle, {
			translateY: movement+"px"
		},500).then(function() {
      // set new position
      if (coin.direction == "north") {
        coin.y = coin.y - steps;
      } else {
        coin.y = coin.y + steps;
      }
      console.log("coinY new: " + coin.y);
      $.Velocity.animate(circle, {
  			translateY: 0+"px"
  		}, 0);
      doneFn();
    });
	}
	else {
		if (coin.direction == "west") movement=-movement;
    $.Velocity.animate(circle, {
			translateX: movement+"px"
		},500).then(function() {
      if (coin.direction == "west") {
        coin.x = coin.x - steps;
      } else {
        coin.x = coin.x + steps;
      }
      $.Velocity.animate(circle, {
        translateX: 0+"px"
      }, 0);
      doneFn();
    });
	}
}
