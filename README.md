# 🎭 FaceGuard – Deepfake Image & Video Detector Extension

## 🔍 About the Project

**FaceGuard** is a powerful browser extension backed by a deep learning model that detects whether an image or video contains a real human face or one generated using AI (deepfakes). It allows users to:
- 🖼️ Right-click on any image/video and instantly get authenticity results.
- 📁 Manually drop/upload files via the popup interface.
- 📊 Receive confidence scores along with predictions.

This solution combines cutting-edge AI with user-friendly UX to fight against misinformation, fake news, and manipulated content.

---

## 💡 Why We Built This

With the rise of generative AI tools, it's becoming increasingly difficult to distinguish between real and AI-generated media. Deepfakes pose serious threats to:
- 🔐 Personal identity
- 📰 Media authenticity
- 🗳️ Election misinformation
- 🧠 Public perception

FaceGuard helps users identify such content instantly and stay informed. We envision it as a **personal media watchdog** in your browser.

---

## 🧠 The AI Model

Our backend uses a **MobileNetV2**-based convolutional neural network, fine-tuned on a curated deepfake detection dataset.

### ⚙️ Key Features:
- ✅ Lightweight & fast inference
- ✅ Trained for binary classification: `real` vs `fake`
- ✅ Used both image-based and frame-based analysis for videos

The model returns:
- **Prediction**: `real` or `fake`
- **Confidence score**: Probability of authenticity

---

## 🧩 Extension Features

| Feature             | Description                                        |
|---------------------|----------------------------------------------------|
| 🖱️ Right-click Check | Check any image/video on the web via context menu |
| 📁 File Upload       | Drop/upload your own files in popup                |
| 🔥 Real-time Result  | Get prediction and confidence instantly            |
| 🔐 Secure Communication | API requests made to a backend deepfake model     |

---

## 🚀 How It Works

1. **Frontend**: Chrome Extension (Popup UI + Context Menu)
2. **Backend**: FastAPI + MobileNetV2 deepfake detection model
3. **Communication**: REST API with endpoints for:
   - `/predict-image/`
   - `/predict-video/`

When a user uploads or right-clicks on media:
- The media is sent to the API
- It returns prediction + confidence
- Results are shown in the extension (with emoji cues!)

---

## 🛠️ Tech Stack

- 🧠 **Model**: MobileNetV2 (TensorFlow / Keras)
- ⚙️ **Backend**: FastAPI
- 🧩 **Frontend**: Chrome Extension (HTML, CSS, JS)
- ☁️ **Deployment**: Render for backend APIs

---

## 🤝 Future Scope

- 🧬 Fine-tune model on more complex datasets (DFDC, CelebDF)
- 🧠 Integrate multi-frame analysis for video detection
- 🌐 Support Firefox & Edge extensions
- 📦 Chrome Web Store publishing

---

## 📄 License

MIT License. Feel free to fork and enhance this tool! 🙌

