from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.utils import img_to_array, load_img
from keras.models import load_model
import numpy as np
from io import BytesIO
from PIL import Image
import cv2
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("model.keras", compile=False)

def preprocess_frame(frame, target_size=(256, 256)):
    img = cv2.resize(frame, target_size)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = img_to_array(img)
    img = np.expand_dims(img, axis=0)
    return img

def extract_frames(video_path, max_frames=30, frame_skip=5):
    cap = cv2.VideoCapture(video_path)
    frames = []
    frame_count = 0

    while cap.isOpened() and len(frames) < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_skip == 0:
            frames.append(frame)
        frame_count += 1
    
    cap.release()
    return frames

def preprocess_image(image_data, target_size=(256, 256)):
    img = Image.open(BytesIO(image_data)).convert("RGB")
    img = img.resize(target_size)
    x = img_to_array(img)
    x = np.expand_dims(x, axis=0)
    return x

@app.post("/predict-video/")
async def predict_video(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
        temp_file.write(await file.read())
        temp_video_path = temp_file.name
    
    frames = extract_frames(temp_video_path)

    predictions = []
    for frame in frames:
        preprocessed = preprocess_frame(frame)
        pred = model.predict(preprocessed)
        predictions.append(pred)
    
    predictions = np.vstack(predictions)
    avg_prediction = np.mean(predictions, axis=0)
    predicted_class = np.argmax(avg_prediction)
    
    label = "real" if predicted_class == 0 else "fake"

    return {"prediction": label, "confidence": float(np.max(avg_prediction))}

@app.post("/predict-image/")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image_data = preprocess_image(image_bytes)

    prediction = model.predict(image_data)
    predicted_class = np.argmax(prediction)

    label = "real" if predicted_class == 0 else "fake"

    return {"prediction": label}