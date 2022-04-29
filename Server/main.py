"""
function r(i){
  $.ajax({
    type: "POST",
    url: "/api/v0/uploadStyle",
    data: JSON.stringify([document.getElementById("out").value, "bot: "+i]),
    success: function (e) {
      if (e != "ok") {
        console.log(e)
      } else {
        console.log("Hochgeladen")
        if (i>0){				
          r(i-1);}
      }
    }
  }).fail(function (e) {
    console.log("UPDATE FAILED: Error code " + e.status);
  });
}
"""
import os
from flask import Flask
from flask import send_from_directory
from flask import render_template

import paho.mqtt.client as mqtt

import requests
import time
import threading
import base64
import hashlib
import shelve
import time

import json
import flask

from itsdangerous import base64_decode
import googleAuth as google_auth

from dotenv import load_dotenv
load_dotenv()

styleData = {"background": "#fcfcfc", "backgroundPoints": "#646464", "blockArgBackground": "#ffffff", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#b0b0b0", "EditMenu": "#d0f7e9", "EditMenuAccent": "#7bc9ac", "NormalText": "#000000", "MenuButtons": "#000000", "MenuBackground": "#000000",
             "MenuText": "#ffffff", "settingsBoolTrue": "#00ff00", "settingsBoolFalse": "#ff0000", "settingsSelMouseOver": "#d2d2d2", "settingsSelStandard": "#dcdcdc", "settingsSelSelected": "#c8c8c8", "backgroundBlur": "#000000", "settingsBackground": "#ffffff", "settingsBackgroundHighlight": "#f0f0f0", "questionRedBackgroundBlur": "#960000", "questionBackground": "#aaaaaa", "objectSidebarBlur": "#c0c0c0", "ProjectName": "#4287f5"}

app = Flask(__name__)
# config("FN_FLASK_SECRET_KEY")
app.secret_key = os.getenv("FN_FLASK_SECRET_KEY")

app.register_blueprint(google_auth.app)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.jinja_env.auto_reload = True


def threaded(fn):
    def wrapper(*args, **kwargs):
        thread = threading.Thread(target=fn, args=args, kwargs=kwargs)
        thread.start()
        return thread
    return wrapper

###############
#     GUI     #
###############


@app.route('/')
def index():
    return send_from_directory('../Web/out/', "index.html")


@app.route('/colorMaker/')
def colorMaker():
    return render_template("colorMaker.html", login=google_auth.is_logged_in())


@app.route('/Designs/')
def Designs():
    pos = flask.request.args.get('pos')
    if pos == None:
        pos = 0
    else:
        pos = int(round(int(pos)/10, 0)*10)
    colorsShemes = []
    with shelve.open("data") as s:
        if s.get("styles") != None:
            for x in list(s["styles"].keys())[pos:pos+10]:
                colorsShemes += [x]
        else:
            colorsShemes = []
    return render_template("Designs.html", login=google_auth.is_logged_in(), colorsShemes=colorsShemes, pos=pos)


@app.route('/ownDesigns/')
def ownDesigns():
    if google_auth.is_logged_in():
        pos = flask.request.args.get('pos')
        if pos == None:
            pos = 0
        pos = int(pos)
        colorsShemes = []
        with shelve.open("data") as s:
            if s.get("styles") != None:
                d = s["styles"]
            else:
                return "null"
        p = 0
        i = 0
        idd = google_auth.get_user_info()["id"]
        for x in list(d.keys()):
            if i >= pos and p < 10:
                p += 1
                if x.split("_")[1] == idd:
                    colorsShemes += [x]
            i += 1
        return render_template("ownDesigns.html", login=google_auth.is_logged_in(), colorsShemes=colorsShemes, pos=pos)
    return "please login"


@app.route('/<path:path>')
def send_report(path):
    if path.endswith(".ts"):
        return send_from_directory('../Web/', path)
    return send_from_directory('../Web/out/', path)


@app.route('/action/<path:path>')
def actionPath(path):
    print(path)
    return send_from_directory('action/', path)


@app.route('/action/')
def action():
    nDat = True
    if google_auth.is_logged_in():
        with shelve.open("secureData") as s:
            if google_auth.get_user_info()["id"] in list(s.keys()):
                if s[google_auth.get_user_info()["id"]] != "unset" and s[google_auth.get_user_info()["id"]] != None:
                    nDat = False
    return render_template("action.html", login=google_auth.is_logged_in(), nDat=nDat)

###############
# Google Auth #
###############


@app.route("/auth")
def auth():
    if not google_auth.is_logged_in():
        return """<p>redirecting</p><script>
        var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
        var URL = "/google/login";
        var win = window.open(URL, "_blank", strWindowFeatures);
        window.close();
        </script>"""
        # return flask.redirect("/google/login")
    return "<p>Du bist bereits angemeldet</p><a href='/google/logout'>abmelden</a><script>window.close()</script>"


@app.route("/finished")
def finishedLogin():
    if google_auth.is_logged_in():
        return "Angemeldet. Das Fenster schließt sich nun.<script>window.close();</script>"
    return "Abgemeldet. Das Fenster schließt sich nun.<script>window.close();</script>"


@app.route("/testLogin")
def testLogin():
    if google_auth.is_logged_in():
        user_info = google_auth.get_user_info()
        return '<div>You are currently logged in as ' + user_info['given_name'] + '<div><pre>' + json.dumps(user_info, indent=4) + "</pre>"
    return 'You are not currently logged in.'


###############
#     api     #
###############
@app.route("/api/v0/")
def apiHelloWorld():
    return "API. Please only POST!"


@app.route("/api/v0/getActionData", methods=["POST"])
def apiGetActionData():
    if not google_auth.is_logged_in():
        return "ERROR Bitte melde dich mit einem Google Konto an!"

    with shelve.open("userData") as s:
        if google_auth.get_user_info()["id"] in s:
            return base64.b64decode(s[google_auth.get_user_info()["id"]]).decode('UTF-8')
        else:
            return "ERROR"


@app.route("/api/v0/updateActionData", methods=["POST"])
def apiUpdataActionData():
    if not google_auth.is_logged_in():
        return "ERROR Bitte melde dich mit einem Google Konto an!"
    print(google_auth.get_user_info()["id"])

    dat = base64.b64encode(
        flask.request.get_data().decode("UTF-8").encode('UTF-8'))

    with shelve.open("userData") as s:
        s[google_auth.get_user_info()["id"]] = dat
    UpdateServerEntrance()
    return "ok"


@app.route("/api/v0/checkLogin", methods=["POST"])
def apiIsLogin():
    if google_auth.is_logged_in():
        return "t"+google_auth.get_user_info()['given_name']
    return "f"


@app.route("/api/v0/uploadStyle", methods=["POST"])
def uploadStyle():
    if google_auth.is_logged_in():
        dat = flask.request.get_data().decode("UTF-8")

        # test if data OK
        try:
            jdat = json.loads(json.loads(dat)[0])
            for x in jdat.keys():
                if x not in styleData.keys():
                    return "ERROR: Json Data fehlerhaft!"
        except Exception as e:
            return "ERROR: Json Data fehlerhaft: "+str(e)
        with shelve.open("data") as shelv:
            if (shelv.get("styles") == None):
                shelv["styles"] = {}
            d = shelv["styles"]
            d[json.loads(dat)[1]+"_"+google_auth.get_user_info()["id"]+"_" +
              google_auth.get_user_info()["given_name"]] = base64.b64encode(dat.encode('UTF-8'))
            shelv["styles"] = d
        return "ok"
    return "ERROR: Bitte anmelden!"


@app.route("/api/v0/getStyle", methods=["POST"])
def getStyle():
    style = flask.request.get_data().decode("UTF-8")
    with shelve.open("data") as s:
        if style in s["styles"]:
            return json.loads(base64.b64decode(s["styles"][style]).decode("UTF-8"))[0]
        else:
            return "ERROR Design nicht vorhanden"


@app.route("/api/v0/removeStyle", methods=["POST"])
def apiRemoveStyle():
    if google_auth.is_logged_in():
        style = flask.request.get_data().decode("UTF-8")
        with shelve.open("data") as s:
            if style in s["styles"]:
                sty = s["styles"]
                sty.pop(style)
                s["styles"] = sty
                return "OK"
            else:
                return "ERROR: Design nicht vorhanden"
    return "ERROR: not loggedin"


@app.route("/api/v0/setDat", methods=["POST"])
def setDat():
    if google_auth.is_logged_in():
        dd = flask.request.get_data().decode("UTF-8")
        d = json.loads(dd)
        if type(d) == list and len(d) == 3:
            with shelve.open("secureData") as s:
                s[google_auth.get_user_info()["id"]] = d
        else:
            return "check failed"
    else:
        return "nicht angemeldet"
    return "ok"


@app.route("/api/v0/remDat", methods=["POST"])
def remDat():
    if google_auth.is_logged_in():
        with shelve.open("secureData") as s:
            s[google_auth.get_user_info()["id"]] = "unset"
    return "ok"


@app.route("/api/v0/checkDat", methods=["POST"])
def checkDat():
    nDat = True
    if google_auth.is_logged_in():
        with shelve.open("secureData") as s:
            if google_auth.get_user_info()["id"] in list(s.keys()):
                if s[google_auth.get_user_info()["id"]] != "unset" and s[google_auth.get_user_info()["id"]] != None:
                    nDat = False
    if nDat:
        return "f"
    else:
        return "t"


@app.route("/api/v0/getDat", methods=["POST"])
def getDat():
    if google_auth.is_logged_in():
        with shelve.open("secureData") as s:
            if google_auth.get_user_info()["id"] in list(s.keys()):
                if s[google_auth.get_user_info()["id"]] != "unset" and s[google_auth.get_user_info()["id"]] != None:
                    return " | ".join(s[google_auth.get_user_info()["id"]])
        return "keine Daten gespeichert"
    return "Nicht Angemeldet"


###############
# Actions Run #
###############
def UpdateServerEntrance():
    global serverEntrance
    serverEntrance = []
    # generate data
    dat = {}
    with shelve.open("userData") as us:
        for k in us.keys():
            dat[k] = us[k]
        for x in dat.keys():
            try:
                da = json.loads(base64.b64decode(dat[x]))
                for d in da:
                    if d[0] == "Server eingang":
                        serverEntrance += [[d, x]]
            except Exception as e:
                print(f"ERROR in Parsing Action {x}: {str(e)}")


@app.route("/moodlightRequests/")
def moodlightRequestsHelloWorld():
    return "Anfrage punkt für spezielle Aktionen"


@app.route("/moodlightRequests/<path:path>", methods=["POST", "GET"])
def moodlightRequest(path):
    for x in serverEntrance:
        if x[0][3] == path:
            if x[0][1] == flask.request.method:
                print(f"[{time.ctime(time.time())}] EXEC {x}")
                actionSend(x[0], x[1])
    return ""


serverEntrance = []
UpdateServerEntrance()
longUpdate = 0
madeMin = False
madeMinMin = 0


def AddZero(numb, maxZero):
    o = str(numb)
    for x in range(maxZero-len(str(numb))):
        o = "0"+o
    return str(o)


def actionSend(dat, id):
    with shelve.open("secureData") as s:
        if id in list(s.keys()):
            if s[id] != "unset" and s[id] != None:
                print(f"send data {dat} to {id}")
                # init mqtt
                client = mqtt.Client()
                client.on_publish = gotDat
                client.username_pw_set(s[id][1], s[id][2])
                client.connect("dyn.hotti.info", 1883, 10)
                client.publish(s[id][0], "*;L"+AddZero(dat[-1], 2)+";")


def gotDat(client, userdata, result):
    client.disconnect()


@threaded
def actions():
    global longUpdate
    global madeMin
    global madeMinMin
    while True:
        time.sleep(1)
        # generate data
        dat = {}
        with shelve.open("userData") as us:
            for k in us.keys():
                dat[k] = us[k]

        longUpdate += 1
        # read data
        #[['Bestimmte Uhrzeit', '', '', '6:50', '', '', 'Laden', 'nice2', '5'], ['Server eingang', 'GET', '', 'FloriansGeheimerPfadZumKontrollieren', '', '', 'Laden', 'nice2', '5'], ['Website veränderung', '', '', 'https://www.tagesschau.de/', '', '', 'Laden', 'nice2', '5']]
        for x in dat.keys():
            try:
                da = json.loads(base64.b64decode(dat[x]))
                for d in da:
                    exec = False
                    if d[0] == "Bestimmte Uhrzeit":
                        if not madeMin:
                            # str(time.localtime(time.time()).tm_hour)+":"+str(time.localtime(time.time()).tm_min)==d[3]:
                            if int(d[3].split(":")[0]) == time.localtime(time.time()).tm_hour and int(d[3].split(":")[1]) == time.localtime(time.time()).tm_min:
                                exec = True
                    elif d[0] == "Wiederholung":

                        pass  # TODO: IDK how to Do :(
                    elif d[0] == "Server eingang":
                        # handled at other pos
                        pass
                    elif d[0] == "Website veränderung":
                        if not madeMin:
                            t = requests.get(d[3]).text
                            with shelve.open("otherData") as s:
                                if d[3] not in list(s.keys()):
                                    s[d[3]] = hashlib.sha512(
                                        t.encode("UTF-8")).hexdigest()
                                    exec = True
                                else:
                                    if s[d[3]] != hashlib.sha512(t.encode("UTF-8")).hexdigest():
                                        s[d[3]] = hashlib.sha512(
                                            t.encode("UTF-8")).hexdigest()
                                        exec = True
                if exec:
                    print(f"[{time.ctime(time.time())}] EXEC {d}")
                    actionSend(d, x)
            except Exception as e:
                print(f"ERROR in Action {x}: {str(e)}")
        madeMin = True
        if madeMinMin != time.localtime(time.time()).tm_min:
            madeMinMin = time.localtime(time.time()).tm_min
            madeMin = False


threading.Thread(target=actions, daemon=True).start()
app.run("0.0.0.0", 80)
