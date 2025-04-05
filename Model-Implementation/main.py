from fastapi import FastAPI, File, UploadFile
from tensorflow.keras.utils import img_to_array, load_img
from keras.models import load_model
import numpy as np
from io import BytesIO
from PIL import Image

app = FastAPI()

model = load_model("model.keras", compile=False)

def preprocess_image(image_data, target_size=(256, 256)):
    img = Image.open(BytesIO(image_data)).convert("RGB")
    img = img.resize(target_size)
    x = img_to_array(img)
    x = np.expand_dims(x, axis=0)
    return x

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image_data = preprocess_image(image_bytes)

    prediction = model.predict(image_data)
    predicted_class = np.argmax(prediction)

    label = "real" if predicted_class == 0 else "fake"

    return {"prediction": label}