"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//create field
let emulatorTable = document.getElementById('emulatorTable');
var moodLightSizY = 6;
var moodLightSizX = 6;
emulatorTable.innerHTML = "";
for (var x = 0; x < moodLightSizY; x++) {
    var i = '<tr>';
    for (var y = 0; y < moodLightSizX; y++) {
        i += '<th style="background:white" class="ColorSelContainer"><div class="ColorSelButton" style="background:black" id="y' + y + "x" + x + '"></div></th>';
    }
    emulatorTable.innerHTML += i + "</tr>";
}
function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
function pictureString2Val(input) {
    try {
        var out = [];
        for (var i = 0; i < moodLightSizeY; i++) {
            if (i % 2 == 0) {
                for (var ii = 0; ii < moodLightSizeX; ii++) {
                    var s = i * moodLightSizeY + ii;
                    out.push(input.substring(s * 6, s * 6 + 6));
                }
            }
            else {
                for (var ii = moodLightSizeX - 1; ii >= 0; ii--) {
                    var s = i * moodLightSizeY + ii;
                    out.push(input.substring(s * 6, s * 6 + 6));
                }
            }
        }
    }
    catch (_a) {
        out = pictureString2Value(getErrorIMG());
    }
    return out;
}
function pictureVal2String(input) {
    var out = "";
    for (var i = 0; i < moodLightSizeY; i++) {
        if (i % 2 == 0) {
            for (var ii = 0; ii < moodLightSizeX; ii++) {
                if (input[i * moodLightSizeY + ii] == "") {
                    input[i * moodLightSizeY + ii] = "000000";
                }
                out = out + input[i * moodLightSizeY + ii];
            }
        }
        else {
            for (var ii = moodLightSizeX - 1; ii >= 0; ii--) {
                if (input[i * moodLightSizeY + ii] == "") {
                    input[i * moodLightSizeY + ii] = "000000";
                }
                out = out + input[i * moodLightSizeY + ii];
            }
        }
    }
    return out;
}
let data;
let pos = 0;
let posX = 0;
let running = true;
function emulationTick() {
    return __awaiter(this, void 0, void 0, function* () {
        var d = data[pos];
        if (d.startsWith("*")) {
            if (posX >= d.split(";").length) {
                running = false;
                return;
            }
            var el = d.split(";")[posX];
            if (el == "*") {
                console.log("new Script");
            }
            else if (el.startsWith("@")) { }
            else if (el.startsWith("L")) {
                var p = parseInt(el.substring(1));
                if (data[p].startsWith("*")) {
                    posX = 0;
                    pos = p;
                }
                else {
                    console.log("show picture: " + p);
                }
            }
            else if (el.startsWith("W")) {
                yield delay(parseInt(el.substring(1)));
            }
            else if (el.startsWith("@")) { }
            else if (el.startsWith("@")) { }
            else if (el.startsWith("@")) { }
            else if (el.startsWith("@")) { }
            else if (el.startsWith("@")) { }
            else if (el.startsWith("@")) { }
            else if (el.startsWith("@")) { }
            posX++;
        }
    });
}
function emulate() {
    return __awaiter(this, void 0, void 0, function* () {
        data = document.querySelector("textarea").value.split("\n");
        while (running) {
            yield emulationTick();
            yield delay(0);
        }
    });
}
//# sourceMappingURL=emulator.js.map