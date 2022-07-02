import json
import math
import random
dat = {"sizeX": "6", "Elements": [], "pictures": [], "ElementPositions": [
], "FreeElements": [], "animations": [], "projectName": "bigPictureDifferent"}

sy = 10
sx = 500

for y in range(sy):
    dat["Elements"] += [[["Start", [str(y)]]]]
    dat["ElementPositions"] += [[y*400, 0]]
    for x in range(sx):
        # dat["Elements"][y] += [["Text",
        #                        ["T: "+str(0),#x*sy+y
        #                         "10",
        #                         "ffffff",
        #                         "000000"
        #                         ]]]
        dat["Elements"][y] += [["Bild anzeigen",
                                [str(x*sy+y),  # "0"
                                 "0"]]]
        p = hex(random.randint(0, int(math.pow(16, 6*6*6))-1)).replace("0x", "")
        for x in range((36*6)-len(p)):
            p = p+"0"
        dat["pictures"].append(p)
f = open("./fun/bigPicture.moproj", "w")
f.write(json.dumps(dat))
f.close()
