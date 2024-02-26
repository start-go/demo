function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission
  
    const encodedConfig = formValueToBase64();

    // Redirect to index.html with encoded config
    window.location.href = "index.html?config=" + encodeURIComponent(encodedConfig);
}

function changeIframeUrl() {
    const encodedConfig = formValueToBase64();

    document.getElementById("copy-btn").style.display = "block"

    document.getElementById("preview-iframe").src = "index.html?config=" + encodeURIComponent(encodedConfig);
}

function formValueToBase64() {
    // Get form values
    const title = document.getElementById("title").value;
    const message = document.getElementById("message").value;
    const averageAudioFrequency = parseFloat(document.getElementById("average-audio-frequency").value);
    const confettiDuration = parseFloat(document.getElementById("confetti-duration").value);
    const confettiInterval = parseFloat(document.getElementById("confetti-interval").value);
    const showLog = document.getElementById("show-log").checked;
    const hideCake = document.getElementById("hide-cake").checked;
  
    // Create JSON object
    const config = {
      title,
      message,
      averageAudioFrequency,
      showLog,
      hideCake,
      confettiDuration,
      confettiInterval
    };
  
    // Encode JSON object to base64
    return btoa(JSON.stringify(config));
}

function copyURL() {
    const encodedConfig = formValueToBase64();
    const fullUrl = removeLastPath(window.location.href) + "/index.html?config=" + encodeURIComponent(encodedConfig);

    console.log(fullUrl);

    copyToClipboard(fullUrl);
}

function removeLastPath(url) {
    const parts = url.split("/");
    parts.pop();
    return parts.join("/");
  }


function copyToClipboard(text) {
    if (!navigator.clipboard) {
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log("Text copied to clipboard successfully!");
      })
      .catch((err) => {
        console.error("Failed to copy text to clipboard:", err);
      });
}