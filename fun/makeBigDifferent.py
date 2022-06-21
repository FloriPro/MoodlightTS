import json
dat = {"sizeX": "6", "Elements": [], "pictures": [], "ElementPositions": [
], "FreeElements": [], "animations": [], "projectName": "big"}

sy = 20
sx = 500

for y in range(sy):
    dat["Elements"] += [[["Start", [str(y)]]]]
    dat["ElementPositions"] += [[y*400, 0]]
    for x in range(sx):
        dat["Elements"][y] += [["Text",
                                ["T: "+str(x*sy+y),
                                 "10",
                                 "ffffff",
                                 "000000"
                                 ]]]
f = open("./fun/out.moproj", "w")
f.write(json.dumps(dat))
f.close()
