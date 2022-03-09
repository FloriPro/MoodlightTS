/**
 * @param animationData pictures
 * @param wait xxxx seconds*100
 * @param morph xx
 */

function compileAnimation(animationData: string[][], wait: number, morph: number) {
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
        send("S" + addZero(i, 2) + dat[i]);
    }
    send("*;L0;");
}

let split = false;
let maxCommandsPerSave = 500;

function compileProject() {
    var pics: string[] = [...pictures];

    //make commands
    var rawCommands: string[][] = []

    //for every "Start *"
    var savePos = 0;
    for (var loadPos = 0; loadPos < Elements.length; loadPos++) {
        var T_time = -1;
        rawCommands[savePos] = ["*"];//commmand initializer

        //for every Element under(because 0="Start *") Start
        for (var command = 1; command < Elements[loadPos].length; command++) {

            var params: string[] = Elements[loadPos][command][1];
            switch (Elements[loadPos][command][0]) {
                case "Wait":
                    rawCommands[savePos].push("W" + addZero(Math.round(parseFloat(params[0]) * 100), 4))
                    break;

                case "Uhrzeit":
                    if (T_time != parseInt(params[0])) {
                        T_time = parseInt(params[0]);
                        rawCommands[savePos].push("T" + addZero(T_time, 2));
                    }
                    rawCommands[savePos].push("Iffffff000000");
                    rawCommands[savePos].push("\"\"")
                    rawCommands[savePos].push("W");
                    break;

                case "Text":
                    if (T_time != parseInt(params[1])) {
                        T_time = parseInt(params[1]);
                        rawCommands[savePos].push("T" + addZero(T_time, 2));
                    }
                    rawCommands[savePos].push("Iffffff000000");
                    rawCommands[savePos].push("\"" + params[0] + "\"");
                    rawCommands[savePos].push("W");
                    break;

                case "Unendlich":
                case "Loop":
                    if (params[0] == undefined || parseInt(params[0]) > 1) {
                        rawCommands[savePos].push("D");
                    }
                    break;

                case "Füllen":
                    rawCommands[savePos].push("I" + rgb2hex(parseInt(params[0]), parseInt(params[1]), parseInt(params[2])));
                    rawCommands[savePos].push("O00," + ((moodLightSizeX * moodLightSizeY) - 1).toString())
                    break;

                case "Bild anzeigen":
                    if (parseInt(params[1]) != 0) {
                        if (T_time != parseInt(params[1])) {
                            T_time = parseInt(params[1]);
                            rawCommands[savePos].push("T" + addZero(T_time, 2));
                        }
                        rawCommands[savePos].push("__MPic" + params[0]);
                        rawCommands[savePos].push("W");
                    } else {
                        rawCommands[savePos].push("__Pic" + params[0]);
                    }
                    break;

                case "Custom":
                    rawCommands[savePos].push(params[0]);
                    break;

                case "Laden":
                    rawCommands[savePos].push("L" + addZero(params[0], 2)); //replace with "__Load" if idk
                    break;

                case "Animationen":
                    var anim = animations[parseInt(params[0])];
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

                case "End":
                    //get Coresponding Loop for loop Count
                    var indents = 0;
                    var pos = command;
                    do {
                        if (Elements[loadPos][pos][0] == "End") { indents += 1; }
                        if (Elements[loadPos][pos][0] == "Loop" || Elements[loadPos][pos][0] == "Unendlich") { indents -= 1; }
                        pos--;
                    } while (indents != 0);
                    if (Elements[loadPos][pos + 1][0] == "Unendlich") {
                        rawCommands[savePos].push("R0000");
                    } else {
                        if (parseInt(Elements[loadPos][pos + 1][1][0]) > 1) {
                            rawCommands[savePos].push("R" + addZero(parseInt(Elements[loadPos][pos + 1][1][0]) - 1, 4));
                        }
                    }
                    break;

                default:
                    alert("Konnte Nicht Compilen! Element nicht gefunden! (" + Elements[loadPos][command][0] + ")")
                    break;
            }
        }

        savePos++;
    }

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
        }else{
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

    console.log(output)
    console.log("SENDING...")

    for (var i = 0; i < output.length; i++) {
        send("S" + addZero(i, 2) + output[i]);
    }
    if (setSettings["Projekt namen anzeigen bei senden"] == "true") {
        send('*;T07;I000000000000;O0,35;Iffffff000000;"' + projectName + ' ";W;L00;');
    } else {
        send("L00");
    }
}