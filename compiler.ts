/// <reference path="main.ts" />
/// <reference path="utilitys.ts" />

/**
 * @param animationData pictures
 * @param wait xxxx seconds*100
 * @param morph xx
 */

async function compileAnimation(animationData: string[][], wait: number, morph: number) {
    if (!client.isConnected()) {
        goTo("Question", 1)
        Question = ["Nicht verbunden!", {
            "Abbrechen": function (seId) {
                goTo("PictureEdit", 1);
            },
            "Einstellungen öffnen": function (seId) {
                goTo("Settings", 1)
                settingsSelLeft = 1;
            }
        }]
        return "";
    }

    /**Data getting sended */
    var dat: string[] = []
    dat[0] = "*;D;T" + addZero(morph, 2);

    for (var i = 0; i < animationData.length; i++) {
        if (morph != 0) {
            dat[0] += ";M" + addZero(i + 1, 2)
        } else {
            dat[0] += ";L" + addZero(i + 1, 2)
        }
        if (wait != 0) {
            dat[0] += ";W" + addZero(wait, 4);
        }
    }
    dat[0] += ";R0;";

    //add images
    for (var i = 0; i < animationData.length; i++) {
        dat.push(pictureValue2String(animationData[i]))
    }
    for (var i = 0; i < dat.length; i++) {
        await delay(parseInt(setSettings["$settings.mqtt.delay"]))
        send("S" + addZero(i, 2) + dat[i]);

        setInformation(dat.length, i);
    }
    send("*;L0;");
    finishedUpload();
}

let currentlyUploading = false;

let split = false;
let maxCommandsPerSave = 500;

function compileRaw(): string[] | undefined {

    var error = false;
    var pics: string[] = []//[...pictures];

    //make commands
    var rawCommands: string[][] = []

    //for every "Start *"
    var savePos = 0;
    for (var loadPos = 0; loadPos < Elements.length; loadPos++) {
        var T_time = -1;
        rawCommands[savePos] = ["*"];//commmand initializer

        //schedules in start 0
        if (savePos == 0 && setSettings["$settings.sheduler.send"] == "true") {
            rawCommands[savePos].push("@C");
            var shedulerSave = genCompiledScheduler();
            if (shedulerSave != "") {
                rawCommands[savePos].push(shedulerSave);
            }
        }
        if (savePos == 0 && setSettings["$settings.moodlight.autoBrightness"].length == 2) {

            rawCommands[savePos].push("ZX" + setSettings["$settings.moodlight.autoBrightness"]);
        }

        //for every Element under(because 0="Start *") Start
        for (var command = 1; command < Elements[loadPos].length; command++) {

            var params: string[] = Elements[loadPos][command][1];
            switch (Elements[loadPos][command][0]) {
                case "$element.wait":
                    rawCommands[savePos].push("W" + addZero(Math.round(parseFloat(params[0]) * 100), 4))
                    break;

                case "$element.move":
                    if (params[1] == "R") {
                        rawCommands[savePos].push("I" + params[1]);
                    } else if (params[1] == "V") {
                        //Don't change (V == Vorher)
                    } else {
                        rawCommands[savePos].push("I000000" + params[1]);
                    }
                    if (joggAvailLookup["" + params[0]] == undefined) {
                        addMessageT("Start " + loadPos + " Element " + command + ": Bewegungs Art nicht vorhanden!", 5000)
                        error = true;
                    }
                    rawCommands[savePos].push("J" + joggAvailLookup["" + params[0]]);
                    break;

                case "$element.time":
                    if (T_time != parseInt(params[0])) {
                        T_time = parseInt(params[0]);
                        rawCommands[savePos].push("T" + addZero(T_time, 2));
                    }

                    if (params[1] == "R" || params[2] == "R") {
                        rawCommands[savePos].push("IR");
                    } else if (params[1] == "V" || params[2] == "V") {
                        //Don't change (V == Vorher)
                    } else {
                        rawCommands[savePos].push("I" + params[1] + params[2]);
                    }

                    rawCommands[savePos].push("\"\"")
                    rawCommands[savePos].push("W");
                    break;

                case "$element.text":
                    if (T_time != parseInt(params[1])) {
                        T_time = parseInt(params[1]);
                        rawCommands[savePos].push("T" + addZero(T_time, 2));
                    }
                    if (params[2] == "R" || params[3] == "R") {
                        rawCommands[savePos].push("IR");
                    } else if (params[2] == "V" || params[3] == "V") {
                        //Don't change (V == Vorher)
                    } else {
                        rawCommands[savePos].push("I" + params[2] + params[3]);
                    }
                    rawCommands[savePos].push("\"" + params[0] + "\"");
                    rawCommands[savePos].push("W");
                    break;

                case "$element.infiniteLoop":
                case "$element.loop":
                    if (params[0] == undefined || parseInt(params[0]) > 1) {
                        rawCommands[savePos].push("D");
                    }
                    break;

                case "$element.fill":
                    //rawCommands[savePos].push("I" + rgb2hex(parseInt(params[0]), parseInt(params[1]), parseInt(params[2])));
                    if (params[0] != "V") {
                        rawCommands[savePos].push("I" + params[0]);
                    }
                    rawCommands[savePos].push("O00," + ((moodLightSizeX * moodLightSizeY) - 1).toString())
                    break;

                case "$element.picture":
                    var picIdd = pics.length.toString();
                    if (pictures[parseInt(params[0])] == undefined) { addMessageT("Start " + loadPos + " Element " + command + ": Bild nicht vorhanden", 5000); return; }
                    pics.push(pictures[parseInt(params[0])]);
                    if (parseInt(params[1]) != 0) {
                        if (T_time != parseInt(params[1])) {
                            T_time = parseInt(params[1]);
                            rawCommands[savePos].push("T" + addZero(T_time, 2));
                        }
                        rawCommands[savePos].push("__MPic" + picIdd);
                        rawCommands[savePos].push("W");
                    } else {
                        rawCommands[savePos].push("__Pic" + picIdd);
                    }
                    break;

                case "$element.custom":
                    rawCommands[savePos].push(params[0]);
                    break;

                case "$element.load":
                    rawCommands[savePos].push("L" + addZero(params[0], 2)); //replace with "__Load" if idk
                    break;

                case "$element.animation":
                    var anim = animations[parseInt(params[0])];
                    if (anim == undefined) { addMessageT("Start " + loadPos + " Element " + command + ": Animation nicht vorhanden", 5000); return; }
                    if (parseInt(params[1]) != 0 && T_time != parseInt(params[1])) {
                        T_time = parseInt(params[1]);
                        rawCommands[savePos].push("T" + addZero(T_time, 2));
                    }

                    for (var i = 0; i < anim.length; i++) {
                        if (parseInt(params[1]) != 0) {//Falls Übergang
                            rawCommands[savePos].push("__MPic" + pics.length.toString());
                            rawCommands[savePos].push("W");
                        } else {
                            rawCommands[savePos].push("__Pic" + pics.length.toString());
                        }
                        pics.push(anim[i]);

                        if (parseInt(params[2]) != 0) {//Wartezeit
                            rawCommands[savePos].push("W" + addZero(params[2], 4));
                        }
                    }
                    break;

                case "$element.end":
                    //get Coresponding Loop for loop Count
                    var indents = 0;
                    var pos = command;
                    do {
                        if (Elements[loadPos][pos][0] == "$element.end") { indents += 1; }
                        if (Elements[loadPos][pos][0] == "$element.loop" ||
                            Elements[loadPos][pos][0] == "$element.infiniteLoop") { indents -= 1; }
                        pos--;
                    } while (indents != 0);
                    if (Elements[loadPos][pos + 1][0] == "$element.infiniteLoop") {
                        rawCommands[savePos].push("R");
                    } else {
                        if (parseInt(Elements[loadPos][pos + 1][1][0]) > 1) {
                            rawCommands[savePos].push("R" + addZero(parseInt(Elements[loadPos][pos + 1][1][0]) - 1, 4));
                        }
                    }
                    break;
                case "$element.colors":
                    if (params[0] == "R" || params[1] == "R") {
                        rawCommands[savePos].push("IR");
                    } else if (params[0] == "V" || params[1] == "V") {
                        //Don't change (V == Vorher)
                    } else {
                        rawCommands[savePos].push("I" + params[0] + params[1]);
                    }
                    break;

                case "$element.pixel":
                    if (params[1] != "V") {
                        rawCommands[savePos].push("I" + params[1]);
                    }
                    rawCommands[savePos].push("O" + params[0]);
                    break;

                case "$element.sound":
                    rawCommands[savePos].push("N" + addZero(params[0], 5) + "," + addZero(params[1], 4));
                    break;
                //case "$element.loopSound":
                //    rawCommands[savePos].push("N0," + addZero(params[0], 4));
                //    break;
                case "$element.addPortTrigger":
                    rawCommands[savePos].push("N" + addZero(params[0], 2) + "," + addZero(params[1], 2) + "," + addZero(params[2], 2) + "," + params[3]);
                    break;


                case "$element.comment":
                    break;
                default:
                    addMessageT("Konnte Nicht Compilen! Element nicht gefunden! (" + Elements[loadPos][command][0] + ")", 5000)
                    error = true;
                    break;
            }
        }

        savePos++;
    }

    if (error) { return; }

    /*
    * TODO:
    * -compress Pictures
    * -parse Pictures
    * -Send/to Strings
    */

    //split "rawCommands" if "split" is true:
    //  /!\ split doesn't work with loops /!\
    var halfParsedCommands: string[][] = [];
    halfParsedCommands = rawCommands//remove if idk
    /*var lloadPos = 0;

    for (var loadPos = 0; loadPos < rawCommands.length; loadPos++) {
        halfParsedCommands.push(rawCommands[loadPos]);
        if (split) {
            while (halfParsedCommands[lloadPos].length > maxCommandsPerSave) {
                halfParsedCommands.push(halfParsedCommands[lloadPos].slice(maxCommandsPerSave));
                halfParsedCommands[lloadPos] = halfParsedCommands[lloadPos].slice(0, maxCommandsPerSave - 1)
                halfParsedCommands[lloadPos].push("L" + addZero(halfParsedCommands.length - 1, 2))

                lloadPos++;
            }
        }
    }*/

    //compress Pictures
    var picId: { [picId: number]: number[] } = {};
    var pics2: string[] = [];
    for (var x = 0; x < pics.length; x++) {
        if (!pics2.includes(pics[x])) {
            if (picId[pics2.length] == undefined) {
                picId[pics2.length] = [];
            }
            picId[pics2.length].push(x);
            pics2.push(pics[x])
        } else {
            picId[pics2.indexOf(pics[x])].push(x);
        }
    }
    console.log("compressed")

    var parsedCommands: string[][] = halfParsedCommands

    var output: string[] = []
    for (var x = 0; x < parsedCommands.length; x++) {
        output.push("");
    }

    //parse+add Pictures
    for (var x = 0; x < pics2.length; x++) {
        //replace every call of picture Id
        for (var loadPos = 0; loadPos < parsedCommands.length; loadPos++) {
            for (var command = 0; command < parsedCommands[loadPos].length; command++) {

                //replace
                for (var y = 0; y < picId[x].length; y++) {
                    if (parsedCommands[loadPos][command] == "__MPic" + picId[x][y]) {
                        parsedCommands[loadPos][command] = "M" + addZero(x + parsedCommands.length, 2);
                    }
                    if (parsedCommands[loadPos][command] == "__Pic" + picId[x][y]) {
                        parsedCommands[loadPos][command] = "L" + addZero(x + parsedCommands.length, 2);
                    }
                }
            }
        }
        output.push(pics2[x]);
    }


    //add commands
    for (var loadPos = 0; loadPos < parsedCommands.length; loadPos++) {
        output[loadPos] = parsedCommands[loadPos].join(";") + ";";
    }
    return output;
}

async function compileProject() {
    if (!client.isConnected()) {
        goTo("Question", 1)
        Question = ["Nicht verbunden!", {
            "Abbrechen": function (seId) {
                goTo("standartEdit", 1);
            },
            "Einstellungen öffnen": function (seId) {
                goTo("Settings", 1)
                settingsSelLeft = 1;
            }
        }]
        return "";
    }

    currentlyUploading = true;
    cursorUpdate();

    var output = compileRaw();

    if (output == undefined) {
        currentlyUploading = false;
        return;
    }

    if (output.length > 100) {
        aalert("Projekt zu Groß! Da dieses Projekt zurzeit keine Banken benutzt, kannst du maximal 100 Bilder + Starts haben.");
        return;
    }

    console.log(output)
    console.log("SENDING...")
    var d = parseInt(setSettings["$settings.mqtt.delay"]);

    //send data
    for (var i = 0; i < output.length; i++) {
        setInformation(output.length, i);
        send("S" + addZero(i, 2) + output[i]);

        await delay(d)
    }

    if (setSettings["$settings.mqtt.showNameOnSend"] == "true") {
        send('*;T07;I000000000000;O0,35;Iffffff000000;"' + projectName + ' ";W;L00;');
    } else {
        send("*;Iffffff000000");
        send("L00");
    }
    finishedUpload();
}

async function setInformation(maxFrames: number, currentFrame: number) {
    var up: HTMLDivElement = document.querySelector("#Uploading") as HTMLDivElement;
    up.style.display = "";
    var p: HTMLElement = up.querySelector("p") as HTMLElement;
    p.innerText = "Uploading (Frame " + currentFrame + "/" + maxFrames + ")";
}
function finishedUpload() {
    currentlyUploading = false;
    var up: HTMLDivElement = document.querySelector("#Uploading") as HTMLDivElement;
    up.style.display = "none";
    addMessage("$message.compileSend")
}

function uploadShedules() {
    for (var t of genCompiledScheduler().split(";")) {
        send(t);
    }
}
