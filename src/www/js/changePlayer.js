function changePlayer(currentPlayer,player1) {


  if (currentPlayer==player1) {

    $(document.getElementById("red")).velocity({
      transformOrigin: "50% 50%"
    });
    $(document.getElementById("blue")).velocity({
      scale: 1.0
    },500);
    $(document.getElementById("red")).velocity({
      scale: 1.3
    },500);

    (document.getElementById("arrowpath")).style="fill:red";
    (document.getElementById("optcircle")).style="stroke:red";
    (document.getElementById("optnumber")).style="fill:red";
  } else {
    (document.getElementById("arrowpath")).style="fill:blue";
    (document.getElementById("optcircle")).style="stroke:blue";
    (document.getElementById("optnumber")).style="fill:blue";
    $(document.getElementById("blue")).velocity({
      transformOrigin: "50% 50%"
    });
    $(document.getElementById("red")).velocity({
      scale: 1.0
    },500);
    $(document.getElementById("blue")).velocity({
      scale: 1.3
    },500);

  }
}
