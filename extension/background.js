importScripts("config.js")

// Set up the context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "check-face",
      title: "Check if face is real or fake",
      contexts: ["image", "video"], // Includes video support
    });
  });
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "check-face") {
    const mediaUrl = info.srcUrl;

    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();

      const fileType = blob.type;
      const formData = new FormData();
      formData.append("image", blob, "media_input"); // "image" field matches backend

      let endpoint = `${API_BASE_URL}/predict-image/`; // default

      if (fileType.startsWith("video/")) {
        endpoint = `${API_BASE_URL}/predict-video/`;
      }

      const result = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await result.json();
      const prediction = data.prediction || "unknown";
      const confidence = data.confidence
        ? ` (${Math.round(data.confidence * 100)}%)`
        : "";

      chrome.storage.local.set({ lastPrediction: prediction });

      // Show result notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Prediction Result",
        message: `The content is ${prediction.toUpperCase()}${confidence}.`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      chrome.storage.local.set({ lastPrediction: "error" });

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Prediction Failed",
        message: "Something went wrong during prediction.",
      });
    }
  }
});
