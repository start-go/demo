var navigator = window.navigator;
var isPopUpShown = [false, false, false, false, false];
var isShownAlert = false;


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

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = stream.getAudioTracks()[0];
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);

    const fire0 = document.getElementById("fire0");
    const fire1 = document.getElementById("fire1");
    const fire2 = document.getElementById("fire2");
    const fire3 = document.getElementById("fire3");
    const fire4 = document.getElementById("fire4");

    const defaults = {
        spread: 360,
        ticks: 100,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["heart"],
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
    };

    var flameTimer = 0;

    const intervalId = setInterval(() => {
      analyser.getByteTimeDomainData(frequencyData);
      const average = frequencyData.reduce((acc, val) => acc + val, 0) / bufferLength;

      if (average > 50) {
        onBlow(fire0);
        onBlow(fire1);
        onBlow(fire2);
        onBlow(fire3);
        onBlow(fire4);
          
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
      }
    }, 100);

    // Stop the analysis when the user closes the browser window/tab
    window.addEventListener("beforeunload", () => {
      clearInterval(intervalId);
      microphone.stop();
    });
  })
  .catch(error => {
    console.error("Error accessing microphone:", error);
  });
