import pathlib
import textwrap
import json
import pymongo


import google.generativeai as genai

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

myclient = pymongo.MongoClient("mongodb+srv://pixopolisinfo:pixopolis3535@pixopolis.ioxcyjn.mongodb.net/")
mydb = myclient["pixopolis"]
mycol = mydb["nfts"]


@app.route('/process_data', methods=['POST'])
def process_data():
    data = request.json
    request_data = data['imagepath']

    GOOGLE_API_KEY="AIzaSyDqR8p8BPCxnR6RVEV6npZBgvzQnRI-Ob4"

    genai.configure(api_key=GOOGLE_API_KEY)

    from PIL import Image
    import os

    current_directory = os.getcwd()

    image_path = os.path.join(current_directory,request_data)

    img = Image.open(image_path)

    model = genai.GenerativeModel('gemini-pro-vision')
    response = model.generate_content(["extract features from the image give some top 10 features as tags and i want only tags no explaination and put the data in commas", img], stream=True)
    response.resolve()
    myquery = { "_id": data["_id"] }
    newvalues = { "$set": { "image_features": response.text } }
    mycol.update_one(myquery, newvalues)

    return jsonify(data)
if __name__ == '__main__':
    app.run(debug=True)