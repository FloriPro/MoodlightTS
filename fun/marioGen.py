
notes = "EE E CE G g C g e a h bagEG AFG E CDh C g e a h bagEG AFG E CDh  GJFS E taC aCD GJFS E V VV  GJFS E taC aCD U D C  GJFS E taC aCD GJFS E V VV  GJFS E taC aCD U D C"
beats = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1,
         1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 6, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 6]

names = ['c', 'd', 'e', 'f', 'g', 't', 'a', 'b', 'h',
         'C', 'D', 'S', 'E', 'F', 'J', 'G', 'A', 'V', 'U']
frequencies = [262, 294, 330, 349, 392, 415, 440, 466,
               494, 523, 587, 622, 659, 698, 740, 784, 880, 1047, 622]
ns = notes.replace(" ", "")  # .split("")


def addZero(i, leng):
    ii = str(i)
    while (len(ii) < leng):
        ii = "0" + ii
    return ii


b = 0
out = "*;"
for i in range(len(ns)):
    print(ns[i])
    if (ns[i] == ""):
        break
    freq = frequencies[names.index(ns[i][0])]
    out += "N"+str(addZero(freq, 5))+"," + \
        addZero(beats[b]*12, 4)+";W"+addZero(beats[b]*18, 4)+";"
    b += len(ns[i])
print(out)
