let isPopUpShown = [false, false, false, false, false];
let isShownAlert = false;

// init browser requirement
const navigator = window.navigator;

// get params
const base64Config = new URLSearchParams(window.location.search).get("config");
const parsedConfig = parseBase64Json(decodeURIComponent(base64Config));

const avgTiggered = Number(parsedConfig.averageAudioFrequency) || 30;
const message = String(parsedConfig.message) || "Default";
const showLog = Boolean(parsedConfig.showLog) || false;
const title = parsedConfig.title || "This is title";
const confettiSec = parsedConfig.confettiDuration || 10;
const confettiInterval = parsedConfig.confettiInterval || 250;
const hideCake = Boolean(parsedConfig.hideCake) || false;

// init element
const popText = document.getElementById("pop-text");
const cake = document.getElementById("cake");
const fire0 = document.getElementById("fire0");
const fire1 = document.getElementById("fire1");
const fire2 = document.getElementById("fire2");
const fire3 = document.getElementById("fire3");
const fire4 = document.getElementById("fire4");
const messageField = document.getElementById("message");
const logger = document.getElementById("logger");
const canvas = document.getElementById("waveform");
const ctx = waveform.getContext('2d');
const envelope = document.querySelector('.envelope-wrapper');
const letter = document.getElementById('letter');

envelope.addEventListener('click', () => {
    if (envelope.classList.contains("flap")) {
        envelope.classList.remove("flap");
        envelope.classList.add("flop");
    } else {
        envelope.classList.add("flap");
        envelope.classList.remove("flop");
    }
});

const envelopeContainer = document.getElementById("envelope");

// confetti config
const confettiDefaults = {
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
    
    popText.innerText = title;
    messageField.innerText = message;

    if (hideCake && cake !== null) {
        cake.style.display = "none";
    } else {
        cake.classList.add('slide-in-bottom');
    }

    captureMic();
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function popConfetti() {
    const confettiDuration = confettiSec * 1000;
    const confettiAnimationEnd = Date.now() + confettiDuration;

    const interval = setInterval(function() {
        const timeLeft = confettiAnimationEnd - Date.now();
      
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
      
        const particleCount = 50 * (timeLeft / confettiDuration);
      
        // since particles fall down, start a bit higher than random
        confetti(
          Object.assign({}, confettiDefaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );
        confetti(
          Object.assign({}, confettiDefaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
    }, confettiInterval);
}

function alertOnce() {
    if (!isShownAlert) {
        isShownAlert = true;
        
        cake.classList.remove('slide-in-bottom');
        cake.classList.add('slide-out-bottom');

        cake.addEventListener('animationend', function() {
            cake.parentNode.removeChild(cake);

            envelopeContainer.style.display = "block";
            envelopeContainer.classList.add('scale-up');
        });
        
        popConfetti();
    }  
}
  
function showPopUp(target, index) {
    if (target !== null) {
        target.style.display = "none";
    }
    
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
        const intervalId = setInterval(() => {
            analyser.getByteFrequencyData(frequencyData);
            const average = frequencyData.reduce((acc, val) => acc + val, 0) / frequencyData.length;

            if(showLog) {
                logger.innerText = frequencyData.length + " | " + average + " >= " + avgTiggered

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw bars based on frequency data
                const barWidth = canvas.width / frequencyData.length;
                let x = 0;
                for (let i = 0; i < frequencyData.length; i++) {
                    const barHeight = frequencyData[i];
                    ctx.fillStyle = `hsl(${i * 360 / frequencyData.length}, 100%, 50%)`;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x += barWidth;
                }
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

function parseBase64Json(base64Json) {
    try {
      // Decode base64 string
      const decodedString = atob(base64Json);
  
      // Parse decoded string as JSON
      const parsedJson = JSON.parse(decodedString);
  
      return parsedJson;
    } catch (error) {
      console.error("Error parsing base64 JSON:", error);
      return null; // Or handle the error differently as needed
    }
}

main();