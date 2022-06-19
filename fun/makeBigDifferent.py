import json
dat = {"sizeX": "6", "Elements": [[["Start", ["0"]]]], "pictures": [], "ElementPositions": [
    [0, 0]], "FreeElements": [], "animations": [], "projectName": "unset"}

for x in range(10000):
    dat["Elements"][0] += [["Text", ["T: "+str(x)]]]
f = open("./fun/out.moproj", "w")
f.write(json.dumps(dat))
f.close()
