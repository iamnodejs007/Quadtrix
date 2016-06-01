function AnimateCircle(coin,steps,doneFn) {
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
		}).then(function() { coin.x =+ movement / fieldsize });
	}
}

// here needs to be build the coin animation -->
/*app.animation('.gameField', ['$animateCss', function($animateCss) {
    return {
      enter: function(element, doneFn) {
        var id = element[0].childNodes[1].id;
        return $animateCss(element, {
          addClass: '',
          easing: 'ease-out',
          from: { transform: '' },
          to: { transform: ' { translateX(0px); }' },
          duration: 2 // one second
        });
      }
    }
  }]);
*/

/*
  app.animation('.coinField', [function() {
    return {
      // make note that other events (like addClass/removeClass)
      // have different function input parameters
      enter: function(element, doneFn) {
        debugger;
        var item = element.children(1);
        var coin = map.getCoin(item[0].id);
        AnimateCircle(coin, 4,function(){doneFn();});
        // jQuery(element.children(1)).fadeIn('transition', doneFn);
        // remember to call doneFn so that angular
        // knows that the animation has concluded
      },

      move: function(element, doneFn) {
        //jQuery(element.children(1)).fadeIn(10000, doneFn);
      },

      leave: function(element, doneFn) {
        //jQuery(element.children(1)).fadeOut(10000, doneFn);
      }
    }
  }]);*/
