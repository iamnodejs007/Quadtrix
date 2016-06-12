function changePlayer(currentPlayer,player1,timer) {


  if (currentPlayer==player1) {

    $(document.getElementById("red")).velocity({
      transformOrigin: "50% 50%"
    });
    $(document.getElementById("red")).velocity({
      scale: 1.3
    },500);
    $(document.getElementById("red")).velocity({
      scale: 1.0
    },500);
    //(document.getElementById(map.players.you.name)).setAttribute("class","");
    //(document.getElementById(map.players.opponent.name)).setAttribute("class","setActive");
    (document.getElementById("arrowpath")).style="fill:red";
    (document.getElementById("optcircle")).style="stroke:red";
    (document.getElementById("optnumber")).style="fill:red";
    console.log("opponent");
  } else {
    console.log("me");
    (document.getElementById("arrowpath")).style="fill:blue";
    (document.getElementById("optcircle")).style="stroke:blue";
    (document.getElementById("optnumber")).style="fill:blue";
    //(document.getElementById(map.players.opponent.name)).setAttribute("class","");
    //(document.getElementById(map.players.you.name)).setAttribute("class","setActive");
    $(document.getElementById("blue")).velocity({
      transformOrigin: "50% 50%"
    });
    $(document.getElementById("blue")).velocity({
      scale: 1.3
    },500);
    $(document.getElementById("blue")).velocity({
      scale: 1.0
    },500);
  }
  if (!timer.timerRdy) {
    timer.stopTimer=true;
    timer.startNewTimer=true;
  } else {
    timer.timerRdy=false;
    timer.countdown(10);
  }

}

class Timer{
  constructor(){
    this.stopTimer=false;
    this.startNewTimer=false;
    this.timerRdy=true;
  }

  countdown(time) {
   time -= 1;
   document.getElementById('optnumber').firstChild.nodeValue = time;
   if (time > 0 && !this.stopTimer) {
      setTimeout( this.countdown, 1000, time);
   }
   else {
      this.stopTimer=false;
      this.timerRdy = true;
      if (this.startNewTimer) {
        this.startNewTimer=false;
        this.timerRdy = false;
        this.countdown(10);
      }
    }
  }
}
