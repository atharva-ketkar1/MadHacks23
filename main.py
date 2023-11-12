from flask import Flask, render_template, jsonify,json
import pymongo
from pymongo import MongoClient

cluster = MongoClient("mongodb+srv://madhacks:hello123@madhacks.vmpkiui.mongodb.net/?retryWrites=true&w=majority")
db = cluster["OpenInvite"]
collection = db["Markers"]

app = Flask(__name__)

@app.route("/events.json")
def events():
    with open("events.json") as json_file:
        data = json.load(json_file)
    return jsonify(data)
    


@app.route("/")
def home():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)