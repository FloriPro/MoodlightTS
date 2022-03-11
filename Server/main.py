from flask import Flask
from flask import send_from_directory

app = Flask(__name__)

#serve main
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
    return send_from_directory('action/', path)
@app.route('/action/')
def action():
    return send_from_directory('action/', "index.html")

#api
@app.route("/api/v0/")
def apiHelloWorld():
    return "API V0"




app.run("",80)