from flask import Flask, render_template, jsonify,json, session, url_for, redirect, request, flash
from os import environ as env
from pymongo import MongoClient
from dotenv import find_dotenv, load_dotenv
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
from datetime import datetime

ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

cluster = MongoClient(env.get("MONGO_URI"))
db = cluster["OpenInvite"]
collection = db["Markers"]

# def findValidEvents(starttime, endtime):
#     starttime = datetime.strptime("2023-11-10 20:00:00", "%Y-%m-%d %H:%M:%S")
#     endtime = datetime.strptime("2023-11-10 23:59:59", "%Y-%m-%d %H:%M:%S")
#     current_datetime = datetime.now()

#     query = {
#     "start": {"$lte": current_datetime},
#     "end": {"$gte": current_datetime}
#     }
#     results = collection.find(query)
    
#     event_list = []

#     for result in results:
#         result_without_id_user = {key: value for key, value in result.items() if key not in ('_id', 'user')}
#         result_without_id_user['start'] = result_without_id_user['start'].strftime("%Y-%m-%d %H:%M:%S")
#         result_without_id_user['end'] = result_without_id_user['end'].strftime("%Y-%m-%d %H:%M:%S")
#         event_list.append(result_without_id_user)
#         with open('events.json', 'w+') as json_file:
#             json.dump(event_list, json_file, indent=2)


    
app = Flask(__name__)
app.secret_key = env.get("APP_SECRET_KEY")


oauth = OAuth(app)

oauth.register(
    "auth0",
    client_id=env.get("AUTH0_CLIENT_ID"),
    client_secret=env.get("AUTH0_CLIENT_SECRET"),
    client_kwargs={
        "scope": "openid profile email",
    },
    server_metadata_url=f'https://{env.get("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)

def updateEvents():
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
        print(result_without_id_user)

        with open('events.json', 'w+') as json_file:
            json.dump(event_list, json_file, indent=2)

@app.route("/login")
def login():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True)
    )

@app.route("/signup")
def signup():
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("/callback", _external=True)
    )

@app.route("/events.json")
def events():
    with open("events.json") as json_file:
        data = json.load(json_file)
    return jsonify(data)
    
@app.route("/callback", methods=["GET", "POST"])
def callback():
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    return redirect("/addEvent")

@app.route("/logout")
def logout():
    session.clear()
    params = {
        "returnTo": url_for("home", _external=True),
        "client_id": env.get("AUTH0_CLIENT_ID"),
    }
    return redirect(oauth.auth0.api_base_url + "/v2/logout?" + urlencode(params))

@app.route("/submit", methods=["POST"])
def submit():
    if not session.get("user"):
        return redirect("/login")
    if request.method == 'POST':
        name = request.form.get('name')
        address = request.form.get('address')
        desc = request.form.get('desc')
        event_type = request.form.get('type')
        start = request.form.get('start')
        startTime = datetime.strptime(start, "%Y-%m-%dT%H:%M")
        end = request.form.get('end')
        endTime = datetime.strptime(end, "%Y-%m-%dT%H:%M")
        user = session.get("user")

    post = {
        "name": name,
        "Address": address,
        "user": user,
        "desc": desc,
        "type": event_type,
        "start": startTime,
        "end": endTime,
    }

    returnVal = collection.insert_one(post)
    print(returnVal.acknowledged)

    return redirect("/map")

@app.route("/")
def home():
    updateEvents()
    return render_template("index.html")
    

@app.route("/addEvent")
def addEvent():
    if session.get("user"):
        return render_template("addEvent.html")
    else:
        return redirect("/login")

@app.route("/map")
def map():
    if session.get("user"):
        updateEvents()
        return render_template("map.html")
    else:
        return redirect("/login")

if __name__ == '__main__':
    app.run(debug=True)