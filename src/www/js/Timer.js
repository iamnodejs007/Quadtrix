class Timer{
  constructor(){
    Timer.stopTimer=false;
    Timer.startNewTimer=false;
    Timer.timerRdy=true;
  }

  static get stopTimer() {
      return Timer.stopTimer1;
    }

    static set stopTimer(timer){
      Timer.stopTimer1=timer;
    }
    static get startNewTimer() {
        return Timer.startNewTimer1;
    }

    static set startNewTimer(timer){
      Timer.startNewTimer1=timer;
    }

    static get timerRdy() {
        return Timer.timerRdy1;
    }

    static set timerRdy(timer){
      Timer.timerRdy1=timer;
    }

  static countdown(time) {
   time -= 1;
   document.getElementById('optnumber').firstChild.nodeValue = time;
   if (time > 0 && !Timer.stopTimer) {
      setTimeout( Timer.countdown, 1000, time);
   }
   else {
      Timer.stopTimer=false;
      Timer.timerRdy = true;
      if (Timer.startNewTimer) {
        Timer.startNewTimer=false;
        Timer.timerRdy = false;
        Timer.countdown(10);
      }
    }
  }
}
//make sure the ctor is called at least once
new Timer();
