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

| Feature                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| 🖱️ Right-click Check    | Check any image/video on the web via context menu |
| 📁 File Upload          | Drop/upload your own files in popup               |
| 🔥 Real-time Result     | Get prediction and confidence instantly           |
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

### 🌐 Detailed Project Flow Diagram

```markdown
flowchart TD
A[User Interaction] -->|Right-click on media or upload file| B[Chrome Extension]
B -->|Send media to backend| C[FastAPI Backend]
C -->|Determine media type| D{Media Type?}
D -->|Image| E[Image Prediction Endpoint (/predict-image/)]
D -->|Video| F[Video Prediction Endpoint (/predict-video/)]
E -->|Process image| G[MobileNetV2 Model]
F -->|Extract frame and process| G[MobileNetV2 Model]
G -->|Generate prediction + confidence| H[FastAPI Backend]
H -->|Return results| B
B -->|Display results| I[User Interface]
```

🛠️ Explanation of the Flow
User Interaction:

# Users can interact with the extension in two ways:
1. Right-click on media (image or video) on a webpage.
2. Upload media (image or video) via the popup interface.

# Frontend (Chrome Extension):
1. The extension captures the media URL or file and sends it to the backend API.
2. For videos, a frame is extracted using the <canvas> element before sending it to the backend.

# Backend (FastAPI):
The backend determines the media type (image or video) and routes the request to the appropriate endpoint:
1. /predict-image/ for images.
2. /predict-video/ for videos.
The backend processes the media using the MobileNetV2 deepfake detection model.

# Deepfake Detection Model (MobileNetV2):
The model analyzes the media and generates:
1. A prediction: real or fake.
2. A confidence score: Probability of authenticity.

# Results Handling:
1. The backend returns the prediction and confidence score to the frontend.
2. The extension displays the results in the popup or as a notification, with visual cues (e.g., emojis, colors).

---

1. Frontend Workflow
flowchart TD
    A[User Action] -->|Right-click or Upload| B[Chrome Extension]
    B -->|Send media| C[Handle File]
    C -->|Determine type| D{Media Type?}
    D -->|Image| E[Send to /predict-image/]
    D -->|Video| F[Extract Frame]
    F -->|Send frame| G[Send to /predict-video/]
    E & G -->|Receive results| H[Display Results]

---

2. Backend Workflow
flowchart TD
    A[Receive Media] -->|Route to endpoint| B{Endpoint?}
    B -->|/predict-image/| C[Process Image]
    B -->|/predict-video/| D[Process Video]
    C & D -->|Analyze with MobileNetV2| E[Generate Prediction + Confidence]
    E -->|Return results| F[Frontend]

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
