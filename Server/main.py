from flask import Flask
from flask import send_from_directory
from flask import render_template

import base64
import shelve

import json
from authlib.client import OAuth2Session
import flask

import google.oauth2.credentials
import googleapiclient.discovery
import googleAuth as google_auth

from decouple import config


app = Flask(__name__)
app.secret_key = config("FN_FLASK_SECRET_KEY")

app.register_blueprint(google_auth.app)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.jinja_env.auto_reload = True

@app.route('/')
def index():
    return send_from_directory('../Web/out/', "index.html")


@app.route('/colorMaker/')
def colorMaker():
    return send_from_directory('../Web/out/', "colorMaker/index.html")


@app.route('/<path:path>')
def send_report(path):
    return send_from_directory('../Web/out/', path)


@app.route('/action/<path:path>')
def actionPath(path):
    print(path)
    return send_from_directory('action/', path)


@app.route('/action/')
def action():
    return render_template("index.html", login=google_auth.is_logged_in())


@app.route("/auth")
def auth():
    if not google_auth.is_logged_in():
        return flask.redirect("/google/login")
    return "<p>Du bist bereits angemeldet</p><a href='/google/logout'>abmelden</a><script>setTimeout(window.close,1000)</script>"


@app.route("/finished")
def finishedLogin():
    if google_auth.is_logged_in():
        return "Angemeldet. Bitte Warten<script>setTimeout(window.close,500)</script>"
    return "Abgemeldet. Bitte Warten<script>setTimeout(window.close,500)</script>"

@app.route("/testLogin")
def testLogin():
    if google_auth.is_logged_in():
        user_info = google_auth.get_user_info()
        return '<div>You are currently logged in as ' + user_info['given_name'] + '<div><pre>' + json.dumps(user_info, indent=4) + "</pre>"
    return 'You are not currently logged in.'


# api
@app.route("/api/v0/")
def apiHelloWorld():
    return "API. Please only POST!"


@app.route("/api/v0/getActionData", methods=["POST"])
def apiGetActionData():
    if not google_auth.is_logged_in():
        return "ERROR Bitte melde dich mit einem Google Konto an!"

    with shelve.open("data") as s:
        if google_auth.get_user_info()["id"] in s:
            return base64.b64decode(s[google_auth.get_user_info()["id"]]).decode('UTF-8')
        else:
            return "ERROR"

@app.route("/api/v0/updateActionData", methods=["POST"])
def apiUpdataActionData():
    if not google_auth.is_logged_in():
        return "ERROR Bitte melde dich mit einem Google Konto an!"
    print(google_auth.get_user_info()["id"])

    dat = base64.b64encode(flask.request.get_data().decode("UTF-8").encode('UTF-8'))

    with shelve.open("data") as s:
        s[google_auth.get_user_info()["id"]] = dat

    return "ok"
@app.route("/api/v0/checkLogin", methods=["POST"])
def apiIsLogin():
    if google_auth.is_logged_in():
        return "t"+google_auth.get_user_info()['given_name']
    return "f"


app.run("", 80)
