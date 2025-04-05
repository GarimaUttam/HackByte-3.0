const fileInput = document.getElementById("fileElem");
const dropArea = document.getElementById("drop-area");
const resultDiv = document.getElementById("result");
const videoElement = document.getElementById("video-element");
const canvas = document.getElementById("video-canvas");

// Trigger file upload when user clicks drop area
dropArea.addEventListener("click", () => fileInput.click());

// Drag and drop styling
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "green";
});

dropArea.addEventListener("dragleave", () => {
  resetDropAreaBorder();
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  resetDropAreaBorder();
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

// Handle file upload from input
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  handleFile(file);
});

// Reset border style
function resetDropAreaBorder() {
  dropArea.style.borderColor = "#888";
}

// Show loading spinner
function showLoading() {
  resultDiv.innerHTML = `<div class="loader"></div><p>Analyzing...</p>`;
  resultDiv.className = "result-box";
  resultDiv.style.display = "block";
}

// Display result
function showResult(label, confidence, mediaType = "image") {
  resultDiv.style.display = "block";

  const isReal = label === "real";
  const emoji = isReal ? (mediaType === "video" ? "" : "") : "";

  const textLabel = isReal
    ? "Real Content"
    : "AI-Generated Content";

  const confidenceText = confidence ? ` (${confidence}%)` : "";

  resultDiv.innerHTML = `${emoji} ${textLabel}${confidenceText}`;
  resultDiv.className = "result-box " + (isReal ? "success" : "warning");
}

// Handle uploaded file
function handleFile(file) {
  if (!file) return;

  const maxSizeMB = 20;
  if (file.size / (1024 * 1024) > maxSizeMB) {
    resultDiv.innerText = "File too large (max 20MB)";
    resultDiv.className = "result-box warning";
    resultDiv.style.display = "block";
    return;
  }

  const fileType = file.type;

  // Reset previous result
  resultDiv.innerText = "";
  resultDiv.className = "result-box";

  if (fileType.startsWith("image/")) {
    sendImageToImageModel(file);
  } else if (fileType.startsWith("video/")) {
    extractFrameFromVideo(file);
  } else {
    resultDiv.innerText = "Unsupported file type.";
    resultDiv.className = "result-box warning";
    resultDiv.style.display = "block";
  }

  fileInput.value = "";
  resetDropAreaBorder();
}

// Extract 1-second frame from video
function extractFrameFromVideo(file) {
  const url = URL.createObjectURL(file);
  videoElement.src = url;
  videoElement.load();

  videoElement.addEventListener("loadeddata", () => {
    videoElement.currentTime = 1;
  });

  videoElement.addEventListener(
    "seeked",
    () => {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          sendImageToVideoModel(blob);
          URL.revokeObjectURL(videoElement.src);
        },
        "image/jpeg",
        0.95
      );
    },
    { once: true }
  );
}

// For image model
async function sendImageToImageModel(imageBlob) {
  const formData = new FormData();
  formData.append("image", imageBlob, "input.jpg");

  showLoading();

  try {
    const response = await fetch(
      `${API_BASE_URL}/predict-image/`,
      {
        method: "POST",
        body: formData,
      }
    );

    const resText = await response.text();
    console.log("Image model response:", resText);

    const data = JSON.parse(resText);
    const label = data.prediction?.toLowerCase();
    const confidence = data.confidence || "";

    showResult(label, confidence);
  } catch (error) {
    console.error("Error contacting image model:", error);
    resultDiv.innerText = "Error contacting image model.";
    resultDiv.className = "result-box warning";
  }
}

// For video model
async function sendImageToVideoModel(imageBlob) {
  const formData = new FormData();
  formData.append("image", imageBlob, "frame.jpg");

  showLoading();

  try {
    const response = await fetch(
      `${API_BASE_URL}/predict-video/`,
      {
        method: "POST",
        body: formData,
      }
    );

    const resText = await response.text();
    console.log("Video model response:", resText);

    const data = JSON.parse(resText);
    const label = data.prediction?.toLowerCase();
    const confidence = data.confidence || "";

    showResult(label, confidence);
  } catch (error) {
    console.error("Error contacting video model:", error);
    resultDiv.innerText = "Error contacting video model.";
    resultDiv.className = "result-box warning";
  }
}
