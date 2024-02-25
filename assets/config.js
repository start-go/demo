function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission
  
    const encodedConfig = formValueToBase64();

    // Redirect to index.html with encoded config
    window.location.href = "index.html?config=" + encodeURIComponent(encodedConfig);
}

function changeIframeUrl() {
    const encodedConfig = formValueToBase64();
    
    document.getElementById("preview-iframe").src = "index.html?config=" + encodeURIComponent(encodedConfig);
}

function formValueToBase64() {
    // Get form values
    const title = document.getElementById("title").value;
    const message = document.getElementById("message").value;
    const averageAudioFrequency = parseFloat(document.getElementById("averageAudioFrequency").value);
    const showLog = document.getElementById("showLog").checked;
    const confettiDuration = parseFloat(document.getElementById("confettiDuration").value);
    const confettiInterval = parseFloat(document.getElementById("confettiInterval").value);
  
    // Create JSON object
    const config = {
      title,
      message,
      averageAudioFrequency,
      showLog,
      confettiDuration,
      confettiInterval
    };
  
    // Encode JSON object to base64
    return btoa(JSON.stringify(config));
}