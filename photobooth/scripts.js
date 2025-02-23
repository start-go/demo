document.addEventListener('DOMContentLoaded', async () => {
    const cameraSelect = document.getElementById('camera-select');
    const cameraContainer = document.getElementById('camera-container');
    let currentStream = null;
  
    // Function to request camera access and enumerate devices
    async function getCameras() {

        try {
            // Requesting permission to access the camera (needed to get device labels)
            await navigator.mediaDevices.getUserMedia({ video: true });
            stopCurrentStream(); // Stop the initial stream after getting permission
        } catch (err) {
        console.error('Error accessing media devices.', err);
        return;
        }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'videoinput');
      } catch (error) {
        console.error('Error accessing devices:', error);
        alert('Camera access was denied or no cameras are available.');
      }
    }
  
    // Function to stop the current video stream
    function stopCurrentStream() {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    }
  
    // Function to start a video stream for a specific camera
    async function startCamera(deviceId) {
      try {
        stopCurrentStream(); // Stop any existing stream
  
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: deviceId} // Flexible resolution
        });
  
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
  
        // Clear previous video and append the new one
        cameraContainer.innerHTML = '';
        cameraContainer.appendChild(videoElement);
  
        currentStream = stream;
      } catch (error) {
        console.error('Error starting camera:', error);
      }
    }
  
    // Populate the dropdown with available cameras
    async function populateCameraDropdown() {
      const cameras = await getCameras();
  
      if (!cameras || cameras.length === 0) {
        alert('No cameras found!');
        return;
      }
  
      cameras.forEach((camera, index) => {
        const option = document.createElement('option');
        option.value = camera.deviceId;
        option.textContent = camera.label || `Camera ${index + 1}`;
        cameraSelect.appendChild(option);
      });
  
      // Start the first camera by default
      if (cameras.length > 0) {
        startCamera(cameras[0].deviceId);
      }
    }
  
    // Event listener for dropdown changes
    cameraSelect.addEventListener('change', (event) => {
      const selectedDeviceId = event.target.value;
      startCamera(selectedDeviceId);
    });
  
    // Initialize the dropdown and start the first camera
    populateCameraDropdown();
  });