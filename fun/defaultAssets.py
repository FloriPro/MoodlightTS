from PIL import Image, ImageEnhance
import paho.mqtt.client as mqtt
import threading
import math
import time


def threaded(fn):
    def wrapper(*args, **kwargs):
        thread = threading.Thread(target=fn, args=args, kwargs=kwargs)
        thread.start()
        return thread
    return wrapper


class MQTT():
    @threaded
    def Send(self, data):
        if self.connectable and self.Subscribed and self.hasCredentials:
            # print(data)
            # console.log(data)
            self.client.publish(self.topic, data)
        if not self.connectable:
            print("keine Verbindung zum Server")
        if not self.Subscribed:
            print("keine topic vorhanden")
        if not self.hasCredentials:
            print("keine Anmeldedaten vorhanden")

    def on_connect(self, client, userdata, flags, rc):
        if rc != 0:
            self.connectable = False
        else:
            self.connectable = True
        if not self.connectable:
            print("keine Verbindung zum Server: "+str(rc))
        if not self.Subscribed:
            print("keine topic vorhanden: "+str(rc))
        if not self.hasCredentials:
            print("keine Anmeldedaten vorhanden: "+str(rc))
        if self.connectable and self.Subscribed and self.hasCredentials:
            print("Connected with result code "+str(rc))
        else:
            print("not connected!")

    def on_message(self, client, userdata, msg):
        pass  # print(msg.topic+": '"+str(msg.payload)+"'")

    @threaded
    def on_disconnect(self, client, userdata, rc=0):
        if self.hasCredentials:
            try:
                self.client.connect("dyn.hotti.info", 1883, 10)
            except:
                self.connectable = False
            else:
                self.connectable = True

    @threaded
    def reMakeConnect(self):
        if self.hasCredentials:
            try:
                self.client.connect("dyn.hotti.info", 1883, 10)
            except:
                self.connectable = False
            else:
                self.connectable = True

    @threaded
    def SetData(self, username, passw, topic):
        if username != "" and passw != "":
            self.hasCredentials = True
        else:
            self.hasCredentials = False

        self.topic = topic
        self.connectable = True

        if self.hasCredentials:
            if type(username) == str and type(passw) == str and type(topic) == str:
                try:
                    self.client.connect("dyn.hotti.info", 1883, 10)
                except:
                    self.connectable = False
                else:
                    self.connectable = True
                try:
                    self.client.subscribe(topic)
                except:
                    self.Subscribed = False
                else:
                    self.Subscribed = True
                self.client.loop_start()
            else:
                print("Du benötigst Anmeldedaten!")
        else:
            print(
                "Bitte gebe deine Anmeldedaten in den Einstellungen ein!")
            self.Subscribed = False

    def __init__(self, username, passw, topic):
        self.Subscribed = False
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        self.client.username_pw_set(username, passw)
        print("connecting")
        self.SetData(username, passw, topic)

    def Update(self, username, passw, topic):
        self.SetData(username, passw, topic)

    def connected(self):
        return self.client.is_connected

    def awaitConnect(self):
        while not self.connected():
            time.sleep(0.1)
        time.sleep(0.1)


def mapColorValue(value, canNull):
    value = float(value)/256
    value = math.pow(value, 2)
    value = int(value*256)
    if(value == 0 and not canNull):
        value = 1
    return value


def mapColor(color, canNull):
    color = color[0]

    # enhance colors
    img = Image.new(mode="RGB", size=(1, 1), color=color)
    converter = ImageEnhance.Color(img)
    img = converter.enhance(1.25)
    color = img.getpixel((0, 0))

    # make blacks more black
    color = (mapColorValue(color[0], canNull), mapColorValue(
        color[1], canNull), mapColorValue(color[2], canNull))
    return color


def genOutput(data, reverse, canNull):
    if reverse:
        d = []
        for y in range(0, 6, 1):
            d.append([])
        for y in range(0, 6, 1):
            for x in range(0, 6, 1):
                d[x].append(data[y][x])
    else:
        d = data
    out = ""
    i = 0
    for x in range(len(d)):
        i += 1
        for y in range(6):
            if not i % 2:
                out += '%02x%02x%02x' % mapColor(d[5-y][x], canNull)
            else:
                out += '%02x%02x%02x' % mapColor(d[y][x], canNull)
    return out


def createEmpty():
    out = []
    for x in range(6):
        out.append([])
        for y in range(6):
            out[x].append((0, 0, 0))
    return out
