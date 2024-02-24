var navigator = window.navigator;
var isPopUpShown = [false, false, false, false, false];
var isShownAlert = false;

navigator.getUserMedia_ = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

if (navigator.getUserMedia_) {
  navigator.getUserMedia({
      audio: true
    },
    function(stream) {
      processStream(stream)
    },
    function(err) {
      console.log("The following error occured: " + err.name)
    });
} else {
  console.log("getUserMedia not supported");
}

function alertOnce() {
  if (!isShownAlert) {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ["heart"],
      colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
    };
    
    confetti({
      ...defaults,
      particleCount: 50,
      scalar: 2,
    });
    
    confetti({
      ...defaults,
      particleCount: 25,
      scalar: 3,
    });
    
    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 4,
    });

    isShownAlert = true;
  }

}

function showPopUp(target, index) {
  target.style.display = "none";
  isPopUpShown[index] = true;

  if (isPopUpShown[0] && isPopUpShown[1] && isPopUpShown[2] && isPopUpShown[3] && isPopUpShown[4]) {
    alertOnce();
  }
}

function processStream(stream) {
  var audioContext = new AudioContext();
  var analyser = audioContext.createAnalyser();
  
  microphone = audioContext.createMediaStreamSource(stream);
  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);

  var flameTimer = 0;
  var fire0 = document.getElementById("fire0");
  var fire1 = document.getElementById("fire1");
  var fire2 = document.getElementById("fire2");
  var fire3 = document.getElementById("fire3");
  var fire4 = document.getElementById("fire4");

  javascriptNode.onaudioprocess = function() {
      var array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      var values = 0;

      var length = array.length;
      for (var i = 0; i < length; i++) {
        values += (array[i]);
      }

      var average = values / length;
    
      if (flameTimer <= 50) flameTimer++;
      if ((average < 5) && (flameTimer > 50) && (fire4.style.display != "none")) {
        flameTimer = 0;
        fire0.style.display = "block";
        fire1.style.display = "block";
        fire2.style.display = "block";
        fire3.style.display = "block";
        fire4.style.display = "block";
        isPopUpShown = [false, false, false, false, false];
      }
    
      if (average > 5) showPopUp(fire0,0);
      if (average > 10) showPopUp(fire1,1);
      if (average > 15) showPopUp(fire2,2);
      if (average > 20) showPopUp(fire3,3);
      if (average > 30) showPopUp(fire4,4);
    }
}