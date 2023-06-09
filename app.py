from flask import Flask, request
import requests as rq
from tensorflow import keras
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
import os

# Menggunakan flask
app = Flask(__name__)


@app.route('/', methods=['GET'])
def hello():
    return "hello guys"


@app.route("/predictModelRoast", methods=['POST'])
def predict():
    request_data = request.get_json()

    model_path = 'ml-model/model_roasted.h5'
    loaded_model = load_model(model_path)

    image_path = request_data['image']

    file_name = 'gambar.jpg'

    response = rq.get(image_path)
    image_bytes = response.content

    with open(file_name, 'wb') as file:
        file.write(image_bytes)

    gambar = Image.open(file_name)
    resized_image = gambar.resize((224, 224))
    x = image.img_to_array(resized_image)
    x = np.expand_dims(x, axis=0)
    x = x / 255.0  # Melakukan normalisasi gambar

# Melakukan prediksi menggunakan model
    prediction = loaded_model.predict(x)
    if prediction[0][0] > 0.8:
        return('Prediction : Dark')
    elif prediction[0][1] > 0.8:
        return('Prediction : Green')
    elif prediction[0][2] > 0.8:
        return('Prediction : Light')
    elif prediction[0][3] > 0.8:
        return('Prediction : Medium')
    else:
        return('Unknown')


@app.route("/predictQuality", methods =['POST'])
def predict_quality():
    request_data = request.get_json()

    model_path = 'ml-model/model_quality.h5'
    loaded_model = load_model(model_path)

    image_path = request_data['image']

    file_name = 'gambar.jpg'

    response = rq.get(image_path)
    image_bytes = response.content

    with open(file_name, 'wb') as file:
        file.write(image_bytes)

    gambar = Image.open(file_name)
    resized_image = gambar.resize((224, 224))
    x = image.img_to_array(resized_image)
    x = np.expand_dims(x, axis=0)
    x = x / 255.0  # Melakukan normalisasi gambar

    # Melakukan prediksi menggunakan model
    prediction = loaded_model.predict(x)
    if prediction[0][0] > 0.8:
        return('Prediction : Defect')
    elif prediction[0][1] > 0.8:
        return('Prediction : Good')
    else:
        return ('Unknown')


if __name__ == '__main__':
    app.run(port=3000, debug=True)
