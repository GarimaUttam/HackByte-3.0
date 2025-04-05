chrome.storage.local.get("lastPrediction", (data) => {
  const resultEl = document.getElementById("result");
  if (data.lastPrediction === "error") {
    resultEl.textContent = "Prediction failed.";
  } else if (data.lastPrediction) {
    resultEl.textContent = data.lastPrediction.toUpperCase();
  } else {
    resultEl.textContent = "No prediction yet.";
  }
});
