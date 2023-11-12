from flask import Flask, render_template, jsonify,json
from datetime import datetime
from pymongo import MongoClient

cluster = MongoClient("mongodb+srv://madhacks:hello123@madhacks.vmpkiui.mongodb.net/?retryWrites=true&w=majority")
db = cluster["OpenInvite"]
collection = db["Markers"]

def findValidEvents(starttime, endtime):
    starttime = datetime.strptime("2023-11-10 20:00:00", "%Y-%m-%d %H:%M:%S")
    endtime = datetime.strptime("2023-11-10 23:59:59", "%Y-%m-%d %H:%M:%S")
    current_datetime = datetime.now()

    query = {
    "start": {"$lte": current_datetime},
    "end": {"$gte": current_datetime}
    }
    results = collection.find(query)
    
    event_list = []

    for result in results:
        result_without_id_user = {key: value for key, value in result.items() if key not in ('_id', 'user')}
        result_without_id_user['start'] = result_without_id_user['start'].strftime("%Y-%m-%d %H:%M:%S")
        result_without_id_user['end'] = result_without_id_user['end'].strftime("%Y-%m-%d %H:%M:%S")
        event_list.append(result_without_id_user)
        with open('events.json', 'w+') as json_file:
            json.dump(event_list, json_file, indent=2)


    
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