import sys
from defaultAssets import *
from math import *
import parser

mqtt = MQTT("fablab114", "fab!FG1Dw9", "fablab114/ML")
mqtt.awaitConnect()

a = 0
doRepeat = -1


def reset():
    global a
    a = 0
    return 0


def repeat(inp, l):
    global doRepeat
    if doRepeat == -1:
        doRepeat = l
    return inp


while True:
    func = input("function: ")

    sub = 999

    try:
        while doRepeat > 0 or doRepeat == -1:
            out = createEmpty()
            code = parser.expr(func).compile()
            for x in range(-2*sub, 5*sub, 1):
                x /= sub
                y = eval(code)
                rx = ceil(x+3)
                ry = ceil(y+3)
                #print(str(rx)+" | "+str(ry))
                if (ry > 0 and ry <= 6 and rx <= 6 and rx > 0):
                    out[-ry][rx-1] = [(255, 255, 255)]

            v = genOutput(out, True, True)
            print(v)
            mqtt.Send(v)
            a += 1
            doRepeat -= 1
            if doRepeat > 0:
                time.sleep(0.2)
    except Exception as e:
        print(e)
    doRepeat = -1
