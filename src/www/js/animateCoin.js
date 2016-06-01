function AnimateCircle(coin,steps) {
	var x = 40*steps;	
	var circle = $('#'+coin.id);
	
	if (coin.direction == "north" || coin.direction == "south") {
		if (coin.direction == "north") x=-x;
		$(circle).velocity({
			translateY: x+"px"
		},2000);
	}
	else {
		if (coin.direction == "west") x=-x;
		$(circle).velocity({
			translateX: x+"px"
		},2000);
	}
}

