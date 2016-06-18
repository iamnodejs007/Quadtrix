function changePlayer(currentPlayer,player1) {


  if (currentPlayer==player1) {

    document.getElementById("redback").setAttribute('opacity','1');
    document.getElementById("blueback").setAttribute('opacity','0');
    /*$(document.getElementById("red")).velocity({
      scale: 1.3
    },500);
*/
    (document.getElementById("arrowpath")).style="fill:red";
    (document.getElementById("optcircle")).style="stroke:red";
    (document.getElementById("optnumber")).style="fill:red";
  } else {
    (document.getElementById("arrowpath")).style="fill:blue";
    (document.getElementById("optcircle")).style="stroke:blue";
    (document.getElementById("optnumber")).style="fill:blue";

    document.getElementById("redback").setAttribute('opacity','0');
    document.getElementById("blueback").setAttribute('opacity','1');

  }
}
