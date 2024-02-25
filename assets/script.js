let isPopUpShown = [false, false, false, false, false];
let isShownAlert = false;

// init browser requirement
const navigator = window.navigator;
const queryString = window.location.search;

// get params
const urlParams = new URLSearchParams(queryString);
const avgTiggered = Number(urlParams.get('n')) || 30;
const message = String(urlParams.get('m')) || "Default";
const showLog = Boolean(urlParams.get('l')) || false;
const title = urlParams.get('t') || "This is title";

// init element
const cake = document.getElementById("cake");
const fire0 = document.getElementById("fire0");
const fire1 = document.getElementById("fire1");
const fire2 = document.getElementById("fire2");
const fire3 = document.getElementById("fire3");
const fire4 = document.getElementById("fire4");
const popText = document.getElementById("pop-text");
const logger = document.getElementById("logger");

const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["heart"],
    colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
};


function main() {
    document.title = title;

    popText.innerText = message;

    if (showLog) {
        cake.style.display = "none";
    }

    captureMic();
}

function popConfetti(particle, scalar) {
    confetti({
        ...defaults,
        particleCount: 50,
        scalar: 2,
    });
}

function alertOnce() {
    if (!isShownAlert) {
        isShownAlert = true;

        setTimeout(function(){
            popConfetti(50, 2);
        }, 500); 
    
        setTimeout(function(){
            popConfetti(25, 3);
        }, 1500); 
    
        setTimeout(function(){
            popConfetti(10, 4);
        }, 2500); 

        popText.style.display = "block";      
    }  
}
  
function showPopUp(target, index) {
    target.style.display = "none";
    isPopUpShown[index] = true;
  
    if (isPopUpShown[0] && isPopUpShown[1] && isPopUpShown[2] && isPopUpShown[3] && isPopUpShown[4]) {
      alertOnce();
    }
}

function captureMic() {
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
        analyser.getByteFrequencyData(frequencyData);
        const average = frequencyData.reduce((acc, val) => acc + val, 0) / frequencyData.length;

        if(showLog) {
            logger.innerText = frequencyData.length + " | " + average + " >= " + avgTiggered
        }

        if (average >= avgTiggered) {
            showPopUp(fire0, 0);
            showPopUp(fire1, 1);
            showPopUp(fire2, 2);
            showPopUp(fire3, 3);
            showPopUp(fire4, 4);

            clearInterval(intervalId);
            microphone.stop();
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
}


main();