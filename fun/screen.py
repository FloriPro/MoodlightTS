from PIL import ImageGrab
import time
from defaultAssets import *

mqtt = MQTT("fablab114", "fab!FG1Dw9", "fablab114/ML")
mqtt.awaitConnect()

while True:
    image = ImageGrab.grab(bbox=None)
    image = image.resize([6, 6])

    out = []
    for y in range(0, 6, 1):
        out.append([])
        for x in range(0, 6, 1):
            color = image.getpixel((x, y))
            out[y].append([color])
    v = genOutput(out,True,False)
    print(v)
    mqtt.Send(v)
    time.sleep(0.5)
