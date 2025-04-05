chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: "check-face",
    title: "Check if face is real or fake",
    contexts: ["image"],
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "check-face",
      title: "Check if face is real or fake",
      contexts: ["image"],
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "check-face") {
    const imageUrl = info.srcUrl;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const result = await fetch("https://hackbyte-3-0.onrender.com/predict-image/", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();
      const prediction = data.prediction || "unknown";

      chrome.storage.local.set({ lastPrediction: prediction });

      console.log(prediction);

      // ✅ Show a notification with the result
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Face Prediction Result",
        message: `The face is ${prediction.toUpperCase()}.`,
      });
    } catch (error) {
      chrome.storage.local.set({ lastPrediction: "error" });

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Face Prediction Failed",
        message: "Something went wrong while predicting.",
      });
    }
  }
});
