function AnimateCircle(coin, steps, doneFn) {
  var fieldsize = 40;
  var movement = fieldsize*steps;

	var circle = $('#'+coin.id);
  // set new position
  coin.x = coin.targetX;
  coin.y = coin.targetY;

	if (coin.direction == "north" || coin.direction == "south") {
    if (coin.direction == "south") {
      movement=-movement;
    }
    $.Velocity.animate(circle, {
      opacity: 1,
			translateY: movement+"px"
		},0).then(function() {
      $.Velocity.animate(circle, {
  			translateY: 0+"px"
  		}, 500);
      doneFn();
    });
	}
	else {
		if (coin.direction == "east") movement=-movement;
    $.Velocity.animate(circle, {
      opacity: 1,
      translateX: movement+"px"
		},0).then(function() {
      $.Velocity.animate(circle, {
        translateX: 0+"px"
      }, 500);
      doneFn();
    });
	}
}

function terminateCoin(coin){
  $.Velocity.animate(coin, {
    opacity: 0,
    scale: 1.5
  },500);
}
