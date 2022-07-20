"use strict";
/// <reference path="compiler.ts" />
/// <reference path="utilitys.ts" />
/// <reference path="scheduler.ts" />
//// <reference path="emulator.ts" />
/// <reference path="htmlFunctions.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//TODO: update elements, when picture edited
const version = "0.2.0";
let currentTranslation = {};
//translation
let turnBack = {
    "Start": "$element.start",
    "Bild anzeigen": "$element.picture",
    "Animationen": "$element.animation",
    "Wait": "$element.wait",
    "Text": "$element.text",
    "Uhrzeit": "$element.time",
    "Füllen": "$element.fill",
    "Loop": "$element.loop",
    "Unendlich": "$element.infiniteLoop",
    "Custom": "$element.custom",
    "Bewegen": "$element.move",
    "pixel verschieben nach vorne": "$element.move.pixelverschiebennachvorne",
    "pixel verschieben nach hinten": "$element.move.pixelverschiebennachhinten",
    "verschieben links": "$element.move.verschiebenlinks",
    "verschieben rechts": "$element.move.verschiebenrechts",
    "verschieben oben": "$element.move.verschiebenoben",
    "verschieben unten": "$element.move.verschiebenunten",
    "drehen links": "$element.move.drehenlinks",
    "drehen rechts": "$element.move.drehenrechts",
    "drehen oben": "$element.move.drehenoben",
    "drehen unten": "$element.move.drehenunten",
    "Farben": "$element.colors",
    "Laden": "$element.load",
    "Pixel": "$element.pixel",
    "End": "$element.end",
    "//": "$element.comment",
};
function loadTranslation(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (name == "") {
            return;
        }
        if (availTranslations.includes(name)) {
            currentLanguage = name;
            var r = yield fetch("translations/" + availTranslationsR[name] + ".json");
            currentTranslation = JSON.parse(yield r.text());
            setStorage();
            updateCach();
        }
        else {
            aalert("$alert.missingLanguage");
        }
    });
}
//All avail: {"af": "afrikaans","sq": "albanian","am": "amharic","ar": "arabic","hy": "armenian","az": "azerbaijani","eu": "basque","be": "belarusian","bn": "bengali","bs": "bosnian","bg": "bulgarian","ca": "catalan","ceb": "cebuano","ny": "chichewa","zh-CN": "chinese (simplified)","zh-TW": "chinese (traditional)","co": "corsican","hr": "croatian","cs": "czech","da": "danish","nl": "dutch","en": "english","eo": "esperanto","et": "estonian","tl": "filipino","fi": "finnish","fr": "french","fy": "frisian","gl": "galician","ka": "georgian","de": "german","el": "greek","gu": "gujarati","ht": "haitian creole","ha": "hausa","haw": "hawaiian","iw": "hebrew","hi": "hindi","hmn": "hmong","hu": "hungarian","is": "icelandic","ig": "igbo","id": "indonesian","ga": "irish","it": "italian","ja": "japanese","jw": "javanese","kn": "kannada","kk": "kazakh","km": "khmer","rw": "kinyarwanda","ko": "korean","ku": "kurdish","ky": "kyrgyz","lo": "lao","la": "latin","lv": "latvian","lt": "lithuanian","lb": "luxembourgish","mk": "macedonian","mg": "malagasy","ms": "malay","ml": "malayalam","mt": "maltese","mi": "maori","mr": "marathi","mn": "mongolian","my": "myanmar","ne": "nepali","no": "norwegian","or": "odia","ps": "pashto","fa": "persian","pl": "polish","pt": "portuguese","pa": "punjabi","ro": "romanian","ru": "russian","sm": "samoan","gd": "scots gaelic","sr": "serbian","st": "sesotho","sn": "shona","sd": "sindhi","si": "sinhala","sk": "slovak","sl": "slovenian","so": "somali","es": "spanish","su": "sundanese","sw": "swahili","sv": "swedish","tg": "tajik","ta": "tamil","tt": "tatar","te": "telugu","th": "thai","tr": "turkish","tk": "turkmen","uk": "ukrainian","ur": "urdu","ug": "uyghur","uz": "uzbek","vi": "vietnamese","cy": "welsh","xh": "xhosa","yi": "yiddish","yo": "yoruba","zu": "zulu"}
let availTranslationsR = { "Deutsch": "de", "English": "en", "afrikaans": "af", "albanian": "sq", "amharic": "am", "arabic": "ar", "armenian": "hy", "azerbaijani": "az", "basque": "eu", "belarusian": "be", "bengali": "bn", "bosnian": "bs", "bulgarian": "bg", "catalan": "ca", "cebuano": "ceb", "chichewa": "ny", "chinese (simplified)": "zh-CN", "chinese (traditional)": "zh-TW", "corsican": "co", "croatian": "hr", "czech": "cs", "danish": "da", "dutch": "nl", "esperanto": "eo", "estonian": "et", "filipino": "tl", "finnish": "fi", "french": "fr", "frisian": "fy", "galician": "gl", "georgian": "ka", "greek": "el", "gujarati": "gu", "haitian creole": "ht", "hausa": "ha", "hawaiian": "haw", "hebrew": "iw", "hindi": "hi", "hmong": "hmn", "hungarian": "hu", "icelandic": "is", "igbo": "ig", "indonesian": "id", "irish": "ga", "italian": "it", "japanese": "ja", "javanese": "jw", "kannada": "kn", "kazakh": "kk", "khmer": "km", "kinyarwanda": "rw", "korean": "ko", "kurdish": "ku", "kyrgyz": "ky", "lao": "lo", "latin": "la", "latvian": "lv", "lithuanian": "lt", "luxembourgish": "lb", "macedonian": "mk", "malagasy": "mg", "malay": "ms", "malayalam": "ml", "maltese": "mt", "maori": "mi", "marathi": "mr", "mongolian": "mn", "myanmar": "my", "nepali": "ne", "norwegian": "no", "odia": "or", "pashto": "ps", "persian": "fa", "polish": "pl", "portuguese": "pt", "punjabi": "pa", "romanian": "ro", "russian": "ru", "samoan": "sm", "scots gaelic": "gd", "serbian": "sr", "sesotho": "st", "shona": "sn", "sindhi": "sd", "sinhala": "si", "slovak": "sk", "slovenian": "sl", "somali": "so", "spanish": "es", "sundanese": "su", "swahili": "sw", "swedish": "sv", "tajik": "tg", "tamil": "ta", "tatar": "tt", "telugu": "te", "thai": "th", "turkish": "tr", "turkmen": "tk", "ukrainian": "uk", "urdu": "ur", "uyghur": "ug", "uzbek": "uz", "vietnamese": "vi", "welsh": "cy", "xhosa": "xh", "yiddish": "yi", "yoruba": "yo", "zulu": "zu" };
let availTranslations = Object.keys(availTranslationsR);
let currentLanguage = "Deutsch";
//load images
const scrollImage = document.querySelector("#image_scroll");
/*
 * TODO:
 *  -Output
 *  -Einstellungen
 */
const empty = '{"sizeX":"6","Elements":[[["$element.start",["0"]]]],"pictures":[],"ElementPositions":[[0,0]],"FreeElements":[],"animations":[],"projectName":"unset"}';
//utility variables
let isFocused = false;
let font = "47px msyi";
let host = "";
let myTopic = "";
let myUser = "";
let myPass = "";
let mouseX = 500;
let mouseY = 500;
let mouse = {};
let pressedKeys = {};
let canvas = document.getElementById('canvas');
let colorTextOut = document.getElementById("color");
let colorPicker = $("#colorpicker");
let colorPicker2 = $("#colorpicker2");
let hider = document.getElementById("hider");
let ctx = canvas.getContext("2d");
let canvasPreDraw = document.getElementById('PreDraw');
let canvasPreDraw2 = document.getElementById('PreDraw2');
let ctxPreDraw = canvasPreDraw.getContext("2d");
let ctxPreDraw2 = canvasPreDraw2.getContext("2d");
let ProjectLoader = document.querySelector("#projectLoader");
let PictureLoader = document.querySelector("#pictureLoader");
let pageTeller = document.getElementById("pageTeller");
let colorSelTable = document.getElementById('colorSelTable');
let LiveMoodLight = document.getElementById('LiveMoodLight');
let latestCanvasPicStr = canvas.toDataURL("image/png");
var latestCanvasPic = new Image;
latestCanvasPic.src = latestCanvasPicStr;
let c = document.getElementById("canvas");
let sizeChange = true;
createUserEvents();
function updateToNewTranslation(Elements) {
    if (Elements[0][0][0][0] == "$") {
        return Elements;
    }
    aalert("$alert.newTranslation");
    for (var x = 0; x < Elements.length; x++) {
        for (var y = 0; y < Elements[x].length; y++) {
            if (turnBack[Elements[x][y][0]] != undefined) {
                Elements[x][y][0] = turnBack[Elements[x][y][0]];
            }
            if (Elements[x][y][0] == "$element.move") {
                if (Elements[x][y][1][0][0] != "$") {
                    Elements[x][y][1][0] = turnBack[Elements[x][y][1][0]];
                }
            }
        }
    }
    return Elements;
}
function loadProject(jsonLoad, lastUsed) {
    //get save
    var ElementsSave = Elements;
    var picturesSave = pictures;
    var ElementPositionsSave = ElementPositions;
    var FreeElementsSave = FreeElements;
    var animationsSave = animations;
    var projectNameSave = projectName;
    var sizeXSave = moodLightSizeX;
    var scheduleSave = schedulerList;
    var ledSortTypeSave = ledSortType;
    try {
        Elements = updateToNewTranslation(jsonLoad.Elements);
        pictures = jsonLoad.pictures;
        ElementPositions = jsonLoad.ElementPositions;
        FreeElements = jsonLoad.FreeElements;
        animations = jsonLoad.animations;
        if (jsonLoad.sizeX == undefined) {
            jsonLoad.sizeX = 6;
        }
        moodLightSizeX = jsonLoad.sizeX;
        moodLightSizeY = jsonLoad.sizeX;
        if (jsonLoad.ledSortType != undefined) {
            ledSortType = parseInt(jsonLoad.ledSortType);
        }
        if (jsonLoad.projectName != undefined) {
            projectName = jsonLoad.projectName;
        }
        else {
            projectName = sprompt("projekt name: ");
        }
        if (jsonLoad.Scheduler == undefined) {
            schedulerList = [];
        }
        else {
            schedulerList = jsonLoad.Scheduler;
        }
        loadSchedules();
        UpdateSizeMoodlightSize();
        posx = 275;
        posy = 75;
        //alert if size not matching to connnected moodlight
        if (moodLightGotSizeX != -1 && moodLightGotSizeY != -1) {
            sizeCheck(moodLightGotSizeX, moodLightGotSizeY);
        }
        /*if (setSettings["Bei Projekt Laden Schedules zu dem Aktuellen Projekt ändern"] == "true" && !lastUsed) {
            if (client.isConnected()) {
                send('@C');
                addMessage("Schedules geladen")
                uploadShedules();
            } else {
                addMessageT("Schedules nicht geladen! Laden: <button onclick=\"send('@C');addMessage('Schedules geladen');uploadShedules();moveAwayEffect(this.parentNode);\">Load</button>", 10000);
            }
        }
        scheduleChanged = false;*/
    }
    catch (e) {
        Elements = ElementsSave;
        pictures = picturesSave;
        ElementPositions = ElementPositionsSave;
        FreeElements = FreeElementsSave;
        animations = animationsSave;
        projectName = projectNameSave;
        moodLightSizeX = sizeXSave;
        moodLightSizeY = sizeXSave;
        schedulerList = scheduleSave;
        ledSortType = ledSortTypeSave;
        loadSchedules();
        aalert("$alert.loadFailed");
        console.error(e);
    }
    //reset all images Element
    for (var x of Object.keys(imgStore)) {
        if (x.startsWith("$element.picture|!|!")) {
            delete imgStore[x];
        }
    }
    setTimeout(updateRects, 10);
}
let clickStart = -1;
let clickTime = -1;
let waitClickTime = 200;
let waitForFirmware = false;
function createUserEvents() {
    //Phone
    document.addEventListener("touchstart", toutchStart);
    document.addEventListener("touchend", toutchEnd);
    document.addEventListener("touchmove", mousemove);
    //PC
    document.addEventListener("mousedown", mousedown);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("keydown", keyEvent);
    document.addEventListener("keyup", keyEvent);
    window.addEventListener("focus", windowfocus);
    window.addEventListener("wheel", (e) => {
        var mul = 0.1;
        if (pressedKeys["alt"] == true) {
            mul *= 5;
        }
        if (pressedKeys["shift"] == true) {
            mul *= 2;
        }
        questionScroll += e.deltaY * mul;
    });
    ProjectLoader.addEventListener('change', function (e) {
        var fileList = ProjectLoader.files;
        console.log(fileList);
        const reader = new FileReader();
        reader.readAsText(fileList[0]);
        reader.addEventListener('load', (event) => {
            loadProject(JSON.parse(event.target.result));
            ProjectLoader.value = '';
            setCookie("lastUsed", projectName, 0.5);
            localStorage.setItem(projectName, genProjectJson());
        });
    });
    PictureLoader.addEventListener('change', function (e) {
        var fileList = PictureLoader.files;
        console.log(fileList);
        const reader = new FileReader();
        reader.readAsText(fileList[0]);
        reader.addEventListener('load', (event) => {
            var vals = JSON.parse(event.target.result);
            if (vals.length == 1) {
                pictureValues[page] = pictureString2Value(vals[0]);
            }
            else {
                if (pictureEditType == 1) {
                    if (confirm("Animation überschreiben")) {
                        pictureValues = [];
                        for (var i = 0; i < vals.length; i++) {
                            pictureValues[i] = pictureString2Value(vals[i]);
                        }
                        loadPictureVal(pictureValues[0]);
                        page = 0;
                    }
                }
                else {
                    aalert("$alert.animationInPictureError");
                }
            }
            loadPictureVal(pictureValues[0]);
        });
    });
    window.onresize = resize;
    function windowfocus() {
        pressedKeys = {};
    }
    function toutchStart(e) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        mouse[0] = true;
        oldMouseX = mouseX;
        oldMouseY = mouseY;
        clickStart = getMS();
    }
    function toutchEnd(e) {
        mouse[0] = false;
        clickTime = getMS() - clickStart;
    }
    function mousemove(e) {
        mouseX = e.changedTouches ?
            e.changedTouches[0].pageX :
            e.pageX;
        mouseY = e.changedTouches ?
            e.changedTouches[0].pageY :
            e.pageY;
    }
    function mousedown(e) {
        if (e.button == 1 || e.button == 2) {
            e.preventDefault();
        }
        mouse[e.button] = true;
        oldMouseX = mouseX;
        oldMouseY = mouseY;
        clickStart = getMS();
        return true;
    }
    function mouseup(e) {
        mouse[e.button] = false;
        clickTime = getMS() - clickStart;
        return true;
    }
    function keyEvent(e) {
        if (e.key == "Alt" || e.key == "Tab") {
            e.preventDefault();
        }
        if (editType == "standartEdit") {
            if (e.type == "keydown") {
                if (mouseSelectionRight == 1) {
                    if (e.key == "Backspace") {
                        if (isKeyDown("control")) {
                            //get space
                            var index = Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting].lastIndexOf(" ");
                            if (index == -1) {
                                Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = "";
                            }
                            else {
                                Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting].slice(0, index);
                            }
                        }
                        else {
                            Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting].slice(0, -1);
                        }
                    }
                    else if (e.key == "Enter" || e.key == "Escape") {
                        autoSave();
                        EditMenuEdeting = -1;
                        mouseSelectionRight--;
                        mouseSelectionLeft = -2;
                    }
                    else if (e.key.length == 1) {
                        Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] + e.key;
                    }
                    return;
                }
                else if (mouseSelectionRight == 0) {
                    if (e.key == "Escape") {
                        autoSave();
                        EditMenuEdeting = -1;
                        mouseSelectionRight--;
                        mouseSelectionLeft = -2;
                        cursorMessage = "";
                        return;
                    }
                }
            }
        }
        if (e.type == "keyup") {
            pressedKeys[e.key.toLowerCase()] = false;
        }
        if (e.type == "keydown") {
            pressedKeys[e.key.toLowerCase()] = true;
            if (editType == "PictureEdit") {
                if (e.key.toLowerCase() in pictureEditKeyEvents) {
                    pictureEditKeyEvents[e.key.toLowerCase()]();
                }
            }
            if (e.key.toLowerCase() in globalKeyEvents) {
                globalKeyEvents[e.key.toLowerCase()]();
            }
        }
    }
    function resize() {
        //draw new Grid and save as Image
        //set to new size
        var wo = canvas.width;
        var ho = canvas.height;
        canvas.width = window.innerWidth + 100;
        canvas.height = window.innerHeight + 100;
        //draw
        drawReal.fill(currentColor["background"], ctx);
        drawBoard();
        //save
        backgroundGridStr = canvas.toDataURL("image/png");
        backgroundGrid.src = backgroundGridStr;
        //reset size
        canvas.width = wo;
        canvas.height = ho;
        sizeChange = true;
    }
}
function isKeyDown(key) {
    if (!(key in pressedKeys)) {
        return false;
    }
    if (pressedKeys[key] == false) {
        return false;
    }
    return true;
}
/**
 * 0: snake
 * 1: line by line
 */
const moodlightSizeType = { "6x6": 0, "8x8": 1 };
function firmwareToSettingsCheck(firmware) {
    var sizeInfo = "6x6"; //default to
    for (var f of firmware.split(".")) {
        if (f.includes("x")) {
            sizeInfo = f;
            break;
        }
    }
    var sizeX = parseInt(sizeInfo.split("x")[0]);
    var sizeY = parseInt(sizeInfo.split("x")[1]);
    moodLightGotSizeX = sizeX;
    moodLightGotSizeY = sizeY;
    sizeCheck(sizeX, sizeY);
}
function sizeCheck(sizeX, sizeY, force) {
    if (setSettings["$settings.moodlight.askMoodLightSizeProjectSizeDiff"] == "false" && force != true) {
        return;
    }
    var sizeInfo = sizeX + "x" + sizeY;
    if (sizeX != sizeY) {
        aalert("Moodlight ist nicht quadratisch! Dieses Programm funktioniert nur bei quadratischen MoodLights richtig!");
    }
    if (moodLightSizeX != sizeX || moodLightSizeY != sizeY) {
        if (confirm("Projekt größe an MoodLight anpassen")) {
            moodLightSizeX = sizeX;
            moodLightSizeY = sizeY;
            UpdateSizeMoodlightSize();
            autoSave();
        }
    }
    if (moodlightSizeType[sizeInfo] != undefined) {
        if (moodlightSizeType[sizeInfo] != ledSortType) {
            if (confirm("MoodLight led anordnung anpassen?")) {
                ledSortType = moodlightSizeType[sizeInfo];
                autoSave();
            }
        }
    }
}
function asyncStuff(stuff) {
    return __awaiter(this, void 0, void 0, function* () {
        if (stuff == "firmware") {
            send("V");
            var i = 0;
            while (!latesMQTTMessage.startsWith(";V") && i < 20) {
                yield delay(100);
                i++;
            }
            if (i >= 20) {
                aalert("$alert.timeoutError");
            }
            else {
                aalert(latesMQTTMessage);
            }
        }
        else if (stuff == "colorPickerOfElement") {
            //tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting]
            colorPicker2.spectrum('set', "#" + Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting]);
            colorPicker2.spectrum('show');
            tempData = undefined;
            cursorMessage = "";
            console.log(tempData);
            while (tempData == undefined) {
                yield delay(100);
            }
            Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = tempData;
            updateRects();
            yield delay(100);
            updateRects();
        }
    });
}
function updateSettingsBackground() {
    window.onresize(null); //grid
    //update complete background
    setTimeout(() => {
        var editTypeSave = editType;
        var mXS = mouseX;
        mouseX = 500;
        oldMouseX = 500;
        editType = "standartEdit";
        updateRects();
        drawScreen();
        latestCanvasPicStr = canvas.toDataURL("image/png");
        latestCanvasPic.src = latestCanvasPicStr;
        editType = editTypeSave;
        mouseX = mXS;
        oldMouseX = mXS;
    }, 1);
}
function updateColor() {
    //update html
    document.querySelector("#editableStyle").innerHTML = `
        h1{
            color: ` + currentColor["NormalText"] + `;
        }
        button{
            color:` + currentColor["NormalText"] + `;
            background-color:` + currentColor["buttonBackground"] + `;
        }
        button:hover {
            background-color: ` + currentColor["buttonBackgroundHover"] + `;
        }
        p{
            color: ` + currentColor["NormalText"] + `;
        }
        input{
            color: ` + currentColor["NormalText"] + `;
            background-color: ` + currentColor["buttonBackground"] + `;
        }
    `;
    //update other
    updateCach();
}
function updateCach() {
    updateSettingsBackground();
    lengthStore = {};
    imgStore = {};
    pictureSave = {};
}
function setStorage() {
    setCookie("setSettings", JSON.stringify(setSettings), 10);
    setCookie("myTopic", myTopic, 10);
    setCookie("myPass", myPass, 10);
    setCookie("myUser", myUser, 10);
    setCookie("host", host, 10);
    setCookie("language", currentLanguage, 10);
}
function getStorage() {
    try {
        setSettings = JSON.parse(getCookie("setSettings"));
    }
    catch (_a) {
        setCookie("setSettings", JSON.stringify(setSettings), 10);
    }
    try {
        myTopic = getCookie("myTopic");
    }
    catch (_c) {
        setCookie("myTopic", myTopic, 10);
    }
    try {
        myPass = getCookie("myPass");
    }
    catch (_d) {
        setCookie("myPass", myPass, 10);
    }
    try {
        myUser = getCookie("myUser");
    }
    catch (_e) {
        setCookie("myUser", myUser, 10);
    }
    try {
        host = getCookie("host");
    }
    catch (_f) {
        setCookie("host", host, 10);
    }
    try {
        loadTranslation(getCookie("language"));
    }
    catch (_h) {
        setCookie("language", currentLanguage, 10);
    }
}
function unMapElement(dat) {
    dat = dat.split("__")[0];
    var p = dat.split("|!|!").slice(1);
    var out = [dat.split("|!|!")[0], p];
    return out;
}
function mapElement(Element) {
    var out = Element[0] + "|!|!" + Element[1].join("|!|!") + "__" + ctx.globalAlpha;
    return out;
}
function elementLenghtAndDraw(Element, plx, ply) {
    let yOffset = 50;
    let l = elementLenght(Element);
    if (imgStore[mapElement(Element)] == undefined) {
        preloadedInCycle++;
        if (preloadedInCycle > 1 && Element[0] == "$element.picture" && justfinsishedPicture) {
            setTimeout(updateScreen, 1, true);
            return 0;
        }
        let draw = drawReal;
        canvasPreDraw.width = l + 50;
        canvasPreDraw.height = 100;
        ctxPreDraw.clearRect(0, 0, canvasPreDraw.width, canvasPreDraw.height);
        setFont(font, ctxPreDraw);
        let text = Element[0];
        if (setYellow.indexOf(text) != -1) {
            drawcolor = currentColor["YellowBlock"];
            drawcolorAccent = currentColor["YellowBlockAccent"];
        }
        else if (setPurple.indexOf(text) != -1) {
            drawcolor = currentColor["PurpleBlock"];
            drawcolorAccent = currentColor["PurpleBlockAccent"];
        }
        else if (setGray.indexOf(text) != -1) {
            drawcolor = currentColor["GrayBlock"];
            drawcolorAccent = currentColor["GrayBlockAccent"];
        }
        else {
            drawcolor = currentColor["blueBlock"];
            drawcolorAccent = currentColor["blueBlockAccent"];
        }
        l = measureText(Element[0], ctxPreDraw).width + 10;
        //space between options: 5;
        for (let x = 0; x < Element[1].length; x++) {
            l += 5;
            let t = Element[1][x];
            if (t == "") {
                t = " ";
            }
            if (Element[0] in specialRender && x in specialRender[Element[0]]) {
                l += specialRender[Element[0]][x][0];
            }
            else {
                l += measureText(t, ctxPreDraw).width;
            }
            l += 5;
        }
        if ("$element.end" == text) {
            blockheight /= 2;
        }
        draw.roundedRect(20, yOffset, l, -(blockheight - 10), drawcolorAccent, 10, ctxPreDraw); //body outline
        if ("$element.start" == text) {
            draw.circle(20 + 23, yOffset - 22, 30 - 3, drawcolorAccent, ctxPreDraw);
            draw.circle(20 + 23, yOffset - 22, 29 - 3, drawcolor, ctxPreDraw);
        }
        draw.roundedRect(20 + 1, yOffset - 1, l - 2, -blockheight + 12, drawcolor, 10, ctxPreDraw); //body
        if ("$element.end" != text) {
            draw.text(20, yOffset, text, currentColor["NormalText"], "left", font, ctxPreDraw);
        }
        else {
            blockheight *= 2;
        }
        l = measureText(text, ctxPreDraw).width + 7;
        for (let x = 0; x < Element[1].length; x++) {
            let t = Element[1][x];
            if (t == "") {
                t = " ";
            }
            l += 5;
            if (Element[0] in specialRender && x in specialRender[Element[0]]) {
                specialRender[Element[0]][x][1](Element[1][x], 20 + l - 5, yOffset - 22 - 5);
                l += specialRender[Element[0]][x][0];
            }
            else {
                draw.roundedRect(20 + l + 2, yOffset - 5, measureText(t, ctxPreDraw).width - 4, -(blockheight - 10) + 10, currentColor["blockArgBackground"], 10, ctxPreDraw); //body outline
                draw.text(20 + l, yOffset, t, currentColor["NormalText"], "left", font, ctxPreDraw);
                l += measureText(t, ctxPreDraw).width;
            }
            l += 5;
        }
        if (ctx.globalAlpha != 1) {
            pyC = -posy + 54; //(py + 4);
            var pxC = -posx + 20;
            draw.polygon(ctxPreDraw, drawcolor, [[pxC + 0, pyC + 0], [pxC + 5, pyC + 7], [pxC + 15, pyC + 7], [pxC + 20, pyC + 0]]); //connector
            draw.polygonOutline(ctxPreDraw, drawcolorAccent, [[pxC + 0, pyC + 0], [pxC + 5, pyC + 7], [pxC + 15, pyC + 7], [pxC + 20, pyC + 0]], 1); //connector outline
        }
        //save
        var i = new Image;
        i.src = canvasPreDraw.toDataURL("image/png");
        imgStore[mapElement(Element)] = i;
    }
    if (Element[0] in allwaysRedo) {
        if (allwaysRedo[Element[0]].includes(0)) {
            try {
                setFont(font, ctx);
                //specialRender[Element[0]][0][1](Element[1][0], l + plx - 20 * 6 - 10, 22 - 5 + ply - yOffset + 6);
                specialRender[Element[0]][0][1](Element[1][0], plx + measureText(Element[0], ctx).width + 10, 22 - 5 + ply - yOffset + 6);
            }
            catch (_a) { }
        }
    }
    draw.image(imgStore[mapElement(Element)], plx - 20, ply - yOffset);
    return l;
}
function elementLenght(Element) {
    let l = 0;
    if (lengthStore[mapElement(Element)] != undefined) {
        l = lengthStore[mapElement(Element)];
    }
    else {
        setFont(font, ctx);
        l = measureText(Element[0], ctx).width + 10;
        //space between options: 5;
        for (let x = 0; x < Element[1].length; x++) {
            l += 5;
            let t = Element[1][x];
            if (t == "") {
                t = " ";
            }
            if (Element[0] in specialRender && x in specialRender[Element[0]]) {
                l += specialRender[Element[0]][x][0];
            }
            else {
                l += measureText(t, ctx).width;
            }
            l += 5;
        }
        lengthStore[mapElement(Element)] = l;
    }
    return l;
}
function loadClipboardText(clipText) {
    if (clipText.includes("\n")) {
        var d = clipText.split("\n");
        for (var i = 0; i < d.length; i++) {
            if (pictureValues.length == page + i) {
                pictureValues.push();
            }
            pictureValues[page + i] = pictureString2Value(d[i]);
        }
    }
    else {
        pictureValues[page] = pictureString2Value(clipText);
    }
    loadPictureVal(pictureValues[page]);
}
function UpdateStaticSettingsIfInSettings() {
    if (editType == "Settings") {
        var sK = Object.keys(settingsOnLoad);
        for (var i = 0; i < sK.length; i++) {
            settingsOnLoad[sK[i]]();
        }
    }
}
let ToDraw = [];
let lengthStore = {};
let imgStore = {};
let preloadedInCycle = 0;
//Game Variables
let waitingForMQTTPic = false;
var comesFrom = "";
/**standartEdit, PictureEdit, Question, Settings, Action, Sheduler, Console, ColorPicker*/
var editType = "standartEdit";
let projectName = "unset";
///////// DEV /////////
//setTimeout(() => { goTo("Console", 1) }, 10);
/////////_DEV_/////////
let pictureEditKeyEvents = {
    "y": function () {
        navigator.clipboard.writeText(pictureValue2String(pictureValues[page]));
    }, "x": function () {
        if (navigator.clipboard.readText != undefined) {
            navigator.clipboard.readText().then(clipText => {
                if (clipText != undefined) {
                    loadClipboardText(clipText);
                }
            }).catch(() => {
                var clipText = pprompt("$prompt.pasteNormal");
                if (clipText != undefined) {
                    loadClipboardText(clipText);
                }
            });
        }
        else {
            var clipText = pprompt("$prompt.pasteNormal");
            if (clipText != undefined) {
                loadClipboardText(clipText);
            }
        }
    }
};
let globalKeyEvents = {
    "r": function () {
        if ((setSettings["$settings.look.ownDesign"] != undefined || setSettings["$settings.look.ownDesign"] != "") && setSettings["$settings.look.darkmode"] == "undefined") {
            var l = localStorage.getItem("!designs");
            if (l != undefined) {
                var d = JSON.parse(l);
                if (d[setSettings["$settings.look.ownDesign"]] != undefined) {
                    currentColor = d[setSettings["$settings.look.ownDesign"]];
                }
                updateColor();
            }
        }
    }
};
var Question = ["ERROR", { "ERROR": function () { console.warn("Question without defenition"); } }];
var questionScroll = 0;
var Übergang = -1;
var ÜbergangZu = "Question";
let actionElements = [
    ["jede", "minuten", "5"],
    ["server eingang", "GET", "specificPathForMyInput"]
];
let menuOpen = 0;
const menuButtons = {
    "$menu.save": saveProject,
    "$menu.load": () => __awaiter(void 0, void 0, void 0, function* () {
        goTo("Question", 1);
        var a = {};
        var lK = Object.keys(localStorage);
        for (var x = 0; x < lK.length; x++) {
            if (lK[x][0] != "!")
                a[lK[x]] = function (seId) {
                    return __awaiter(this, void 0, void 0, function* () {
                        var i = 0;
                        for (var x = 0; x < Object.keys(localStorage).length; x++) {
                            if (Object.keys(localStorage)[x][0] != "!") {
                                if (i == seId) {
                                    break;
                                }
                                i++;
                            }
                        }
                        //syncLoading = true;
                        //cursorUpdate();
                        yield delay(100);
                        loadProject(JSON.parse(localStorage[Object.keys(localStorage)[i]]));
                        goTo("standartEdit", 0, () => {
                            c.style.cursor = "wait";
                            syncLoading = true;
                            cursorUpdate();
                        });
                        setCookie("lastUsed", Object.keys(localStorage)[seId], 0.5);
                    });
                };
        }
        Question = ["$question.loadProject", a];
    }),
    "$menu.add": () => {
        goTo("Question", 1);
        Question = ["$question.add", {
                "$question.add.answer.start": function (seId) { ElementPositions.push([Elements.length * 400, 0]); Elements.push([["$element.start", [String(Elements.length)]]]); goTo(comesFrom, 1); },
                "$question.add.answer.picture": function (seId) { goTo("PictureEdit", 0); mouse[0] = false; resetPicEdit(); pictureId = pictures.length; pictures.push("000000".repeat(32)); pictureEditType = 0; },
                "$question.add.answer.animation": function (seId) { goTo("PictureEdit", 0); mouse[0] = false; resetPicEdit(); animationId = animations.length; animations.push(["000000".repeat(32)]); pictureEditType = 1; },
            }];
    },
    "$menu.edit": () => {
        goTo("Question", 1);
        Question = ["$question.edit", {
                "$question.edit.answer.picture": function () {
                    mouse[0] = false;
                    goTo("Question", 1);
                    var qAnsw = {};
                    for (var i = 0; i < pictures.length; i++) {
                        qAnsw["_P" + i] = function (selId) { goTo("PictureEdit", 0); mouse[0] = false; pictureId = selId; loadPicture(selId); pictureEditType = 0; };
                    }
                    Question = ["$question.edit.answer.picture.question", qAnsw];
                },
                "$question.edit.answer.animation": function () {
                    mouse[0] = false;
                    goTo("Question", 1);
                    var qAnsw = {};
                    for (var i = 0; i < animations.length; i++) {
                        qAnsw["_A" + i] = function (selId) {
                            goTo("PictureEdit", 0);
                            mouse[0] = false;
                            animationId = selId;
                            pictureEditType = 1;
                            pictureValues = [];
                            for (var i = 0; i < animations[selId].length; i++) {
                                pictureValues[i] = pictureString2Value(animations[selId][i]);
                            }
                            loadPictureVal(pictureValues[0]);
                        };
                    }
                    Question = ["$question.edit.answer.animation.question", qAnsw];
                },
                //"Aktionen": function () {
                //    goTo("Action", 0);
                //}
            }];
    },
    "$menu.settings": () => { goTo("Settings", 1); },
    "$menu.compile": () => { compileProject(); },
    "$menu.newProject": () => {
        var empt = JSON.parse(empty);
        empt.projectName = pprompt("$prompt.newProjectName");
        loadProject(empt);
        setCookie("lastUsed", empt.projectName, 0.5);
    },
    "$menu.fileSave": downloadProject,
    "$menu.loadFile": () => { console.log("clickedLoad"); ProjectLoader.click(); },
    "": () => { },
    "$menu.info.Experimental": () => { },
    "$menu.sheduler": () => {
        goTo("Sheduler", 0);
        //update information
        var allElements = document.querySelectorAll(".schedule");
        for (var elem of allElements) {
            var id = elem.querySelector(".id");
            var time = elem.querySelector(".time");
            sheduleIdChange(id);
            sheduleTimeChange(time);
        }
    },
    "$menu.console": () => {
        goTo("Console", 0);
    },
    "$menu.reloadPictures": () => {
        updateCach();
    },
    "$menu.showOutput": () => {
        var out = compileRaw();
        let myPopup = window.open("popup.html", "popUpWindow", 'height=300,width=500,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no, status=no');
        myPopup.onload = function () {
            if (out == undefined) {
                return;
            }
            var dat = "";
            for (var x of out) {
                dat = dat + "<div>" + highlight(x) + "</div>";
            }
            myPopup.document.querySelector("#popupBody").innerHTML = `<div style="background: black; color: gainsboro; word-break: break-all;">` + dat + "</div>";
        };
    }
    //"actions": function () { openWindow("/action"); },
};
let menuWidth = 350;
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
/**type: bool, staticBool, showingBool, str, num, button, info */
const settings = {
    "$settings.general": {
        "$settings.general.autoSave": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "$settings.general.autoSaveImage": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        " ": function (callType) { return "info"; },
        "$settings.general.deleteProject": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                goTo("Question", 1);
                var a = {};
                var lK = Object.keys(localStorage);
                for (var x = 0; x < lK.length; x++) {
                    if (lK[x][0] != "!") {
                        a[lK[x]] = function (seId) {
                            var i = 0;
                            for (var x = 0; x < Object.keys(localStorage).length; x++) {
                                if (Object.keys(localStorage)[x][0] != "!") {
                                    if (i == seId) {
                                        break;
                                    }
                                    i++;
                                }
                            }
                            console.log("rem: " + Object.keys(localStorage)[i]);
                            goTo("Settings", 1);
                            localStorage.removeItem(Object.keys(localStorage)[i]);
                        };
                    }
                }
                Question = ["$question.projectDelete", a];
                return "";
            }
        },
        "$settings.general.promptInput": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "$settings.general.colorInformation": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                aalert("$alert.colorInformation");
                return "";
            }
        },
        "$settings.general.rightclick": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "": function (callType) { return "info"; },
        "$settings.general.deleteAll": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                Question = ["$question.deleteAll", {
                        "$question.deleteAll.answer.yes": function (seId) {
                            //Cookies
                            setCookie("lastUsed", "", 0);
                            setCookie("setSettings", "", 0);
                            setCookie("AutoSendIMG", "true", 0);
                            setCookie("myUser", "", 0);
                            setCookie("myPass", "", 0);
                            setCookie("myTopic", "", 0);
                            setCookie("host", "", 0);
                            setCookie("FirstTry", "", 0);
                            setCookie("language", "", 0);
                            //localStorage
                            var locKeys = Object.keys(localStorage);
                            for (var key of locKeys) {
                                localStorage.removeItem(key);
                            }
                            goTo("reload", 0);
                        },
                        "$question.deleteAll.answer.cookies": function (seId) {
                            setCookie("lastUsed", "", 0);
                            setCookie("setSettings", "", 0);
                            setCookie("AutoSendIMG", "true", 0);
                            setCookie("myUser", "", 0);
                            setCookie("myPass", "", 0);
                            setCookie("myTopic", "", 0);
                            setCookie("host", "", 0);
                            setCookie("FirstTry", "", 0);
                            setCookie("language", "", 0);
                            goTo("reload", 0);
                        },
                        "$question.deleteAll.answer.project": function (seId) {
                            var locKeys = Object.keys(localStorage);
                            for (var key of locKeys) {
                                localStorage.removeItem(key);
                            }
                            goTo("reload", 0);
                        },
                        "$question.deleteAll.answer.no": function (seId) {
                            goTo("Settings", 1);
                        }
                    }];
                goTo("Question", 1);
                return "";
            }
        }
    },
    "$settings.mqtt": {
        "$settings.mqtt.connection": function (callType) {
            if (!callType) {
                return "showingBool";
            }
            else {
                if (client.isConnected()) {
                    client.disconnect();
                    UpdateStaticSettingsIfInSettings();
                }
                else {
                    settingsInfo["$settings.mqtt.connection"] = "Verbinden...";
                    staticElementsData["$settings.mqtt.connection"] = undefined;
                    connect();
                }
                return "";
            }
        },
        "$settings.mqtt.changeData": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                myTopic = sprompt("Topic");
                myUser = sprompt("User");
                myPass = sprompt("Pass");
                setStorage();
                reconnect();
                return "";
            }
        },
        "$settings.mqtt.deleteData": function (callType) { if (!callType) {
            return "button";
        }
        else {
            myTopic = "";
            myUser = "";
            myPass = "";
            if (client.isConnected()) {
                client.disconnect();
            }
            ;
            return "";
        } },
        "$settings.mqtt.viewData": function (callType) { if (!callType) {
            return "button";
        }
        else {
            aalert("Topic: " + myTopic + " | User: " + myUser + " | Password: " + myPass);
            return "";
        } },
        /*"Daten Von Server Einsetzen": function (callType) {
            if (!callType) { return "button"; } else {
                settingsInfo["Daten Von Server Anzeigen"] = "Laden...";
                $.ajax({
                    type: "POST",
                    url: "/api/v0/getDat",
                    success: function (e) {
                        settingsInfo["Daten Von Server Anzeigen"] = "";
                        myTopic = e.split(" | ")[0];
                        myUser = e.split(" | ")[1];
                        myPass = e.split(" | ")[2];
                    }
                }).fail(function (e) {
                    settingsInfo["Daten Von Server Anzeigen"] = "FEHLER! Laden fehlgeschlagen";
                    aalert("Laden fehlgeschlagen")
                });
                return "";
            }
        },*/
        //"Neu Verbinden": function (callType) { if (!callType) { return "button"; } else { reconnect(); return ""; } },
        "$settings.mqtt.showNameOnSend": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "$settings.mqtt.delay": function (callType) { if (!callType) {
            return "num";
        }
        else {
            return "";
        } },
        "$settings.mqtt.hostChange": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                host = sprompt("Server/Host/SRV (" + host + ")");
                setStorage();
                reconnect();
                return "";
            }
        },
    },
    "$settings.look": {
        "$settings.look.showAnimations": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "$settings.look.showPicture": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            updateCach();
            return "";
        } },
        "$settings.look.backgroundGrid": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            updateSettingsBackground();
            return "";
        } },
        "$settings.look.hideElementMenu": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "$settings.look.startGridSnap": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "$settings.look.fullscreen": function (callType) {
            if (!callType) {
                return "bool";
            }
            else {
                updateFullscreen();
                return "";
            }
        },
        "  ": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        "$settings.look.info.colors:": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        "$settings.look.darkmode": function (callType) {
            if (!callType) {
                return "bool";
            }
            else {
                settingsInfo["$settings.look.ownDesign"] = "BETA!";
                setSettings["$settings.look.ownDesign"] = "";
                if (setSettings["$settings.look.darkmode"] == "true") {
                    currentColor = presetColors["dark"];
                }
                else {
                    currentColor = presetColors["light"];
                }
                updateColor();
                return "";
            }
        },
        "": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        "$settings.look.ownDesign": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                var l = localStorage.getItem("!designs");
                if (l != undefined) {
                    var d = JSON.parse(l);
                }
                else {
                    aalert("$alert.noCustomDesign");
                    return "";
                } //set JSON parsed var d
                goTo("Question", 1);
                var a = {};
                var dK = Object.keys(d);
                for (var x = 0; x < dK.length; x++) {
                    var v = dK[x];
                    setSettings["$settings.look.darkmode"] = "undefined";
                    a[v] = function (seId) {
                        var l = localStorage.getItem("!designs");
                        if (l != undefined) {
                            var d = JSON.parse(l);
                            var dK = Object.keys(d);
                            settingsInfo["$settings.look.ownDesign"] = dK[seId];
                            setSettings["$settings.look.ownDesign"] = dK[seId];
                            currentColor = d[dK[seId]];
                            updateColor();
                            setStorage();
                        }
                        goTo("Settings", 1);
                    };
                }
                Question = ["", a];
                return "";
            }
        },
        "$settings.look.deleteDesign": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                console.log("del");
                goTo("Question", 1);
                var a = {};
                var l = localStorage.getItem("!designs");
                if (l == undefined) {
                    return "";
                }
                var d = JSON.parse(l);
                var lK = Object.keys(d);
                for (var x = 0; x < lK.length; x++) {
                    a[lK[x]] = function (seId) {
                        var l = localStorage.getItem("!designs");
                        if (l == undefined) {
                            return;
                        }
                        var d = JSON.parse(l);
                        delete d[Object.keys(d)[seId]];
                        localStorage.setItem("!designs", JSON.stringify(d));
                        console.log("rem: " + Object.keys(localStorage)[seId]);
                        goTo("Settings", 1);
                    };
                }
                Question = ["$question.deleteDesign", a];
                return "";
            }
        },
        "$settings.look.addDesignJson": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                var n = sprompt("name") /* + "_userId_userName"*/;
                var j = sprompt("json");
                var l = localStorage.getItem("!designs");
                if (l != undefined) {
                    var d = JSON.parse(l);
                }
                else {
                    var d = {};
                } //set JSON parsed var d
                //ask override
                if (d[n] != undefined) {
                    if (window.confirm("override") == undefined) {
                        aalert("$alert.canceled");
                        return "";
                    }
                }
                d[n] = JSON.parse(j);
                localStorage.setItem("!designs", JSON.stringify(d));
                settingsInfo["$settings.look.ownDesign"] = n;
                currentColor = JSON.parse(j);
                return "";
            }
        },
        "$settings.look.createOwnDesign": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                openWindow("colorMaker/");
                return "";
            }
        },
        " ": function () {
            return "info";
        },
        "$settings.look.maxFPS": function (callType) { if (!callType) {
            return "num";
        } return ""; },
        "$settings.look.showFPS": function (callType) {
            if (!callType) {
                return "bool";
            }
            else {
                return "";
            }
        },
        "$settings.look.asyncElementLoading": function (callType) {
            return "bool";
        }
        //"test": function (callType) { if (!callType) { return "str"; } else { return ""; } },
    },
    "$settings.moodlight": {
        "$settings.moodlight.firmware": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                asyncStuff("firmware");
                return "";
            }
        },
        "$settings.moodlight.size": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                var p = prompt("Welche größe hat dein Moodlight (6/8)");
                if (p != undefined) {
                    var r = parseInt(p);
                    moodLightSizeX = r;
                    moodLightSizeY = r;
                    UpdateSizeMoodlightSize();
                }
                return "";
            }
        },
        "$settings.moodlight.ledType": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                Question = ["Welchen LED Typ hat dein MoodLight (6x6: snake, 8x8: line by line)", {
                        "snake": () => {
                            ledSortType = 0;
                            goTo("Settings", 1);
                            autoSave();
                        },
                        "line by line": () => {
                            ledSortType = 1;
                            goTo("Settings", 1);
                            autoSave();
                        }
                    }];
                goTo("Question", 1);
                return "";
            }
        },
        "$settings.moodlight.live": function (callType) {
            if (!callType) {
                return "bool";
            }
            else {
                return "";
            }
        },
        "$settings.moodlight.passiveLive": function (callType) {
            if (!callType) {
                return "bool";
            }
            else {
                return "";
            }
        },
        "$settings.moodlight.setBank": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                var a = {};
                for (var i = 0; i < alphabet.length; i++) {
                    a[alphabet[i]] = function (seId) {
                        send("$" + alphabet[seId]);
                        send("L00");
                        goTo("Settings", 1);
                    };
                }
                Question = ["$question.changeBank", a];
                goTo("Question", 1);
                return "";
            }
        },
        "$settings.moodlight.askMoodLightSizeProjectSizeDiff": function (callType) {
            if (!callType) {
                return "bool";
            }
            else {
                return "";
            }
        },
        "$settings.moodlight.checkProjectSize": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                sizeCheck(moodLightGotSizeX, moodLightGotSizeY, true);
                return "";
            }
        },
    },
    "$settings.sheduler": {
        "$settings.sheduler.send": function (callType) {
            if (!callType) {
                return "bool";
            }
            else {
                return "";
            }
        },
        /*"Vor dem Hochladen alte Schedules löschen": function (callType) {
            if (!callType) {
                return "bool";
            } else {
                return "";
            }
        },
        "Bei Projekt Laden Schedules zu dem Aktuellen Projekt ändern": function (callType) {
            if (!callType) {
                return "bool";
            } else {
                return "";
            }
        }*/
    },
    "$settings.language": {
        "$settings.language.change": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                var a = {};
                for (var x of availTranslations) {
                    a[x] = function (seId) {
                        loadTranslation(availTranslations[seId]);
                        goTo("Settings", 1);
                    };
                }
                Question = ["$settings.language.change.question", a];
                goTo("Question", 1);
                return "";
            }
        },
        "$settings.language.update": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                loadTranslation(currentLanguage);
                return "";
            }
        },
        "$settings.language.byGoogle": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
    },
    "$settings.about": {
        "$settings.about.1": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        "": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        " ": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        "  ": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        "$settings.about.2": function (callType) { if (!callType) {
            return "info";
        }
        else { /*openWindow("https://floripro.github.io/?page=Home");*/
            return "";
        } },
    }
};
settings["$settings.about"]["Version " + version] = function (callType) { if (!callType) {
    return "info";
}
else {
    return "";
} };
let settingsOnLoad = {
    /*"Anmelde Status": function () {
        settingsInfo["Anmelde Status"] = "Aktualisieren...";
        $.ajax({
            type: "POST",
            url: "/api/v0/checkLogin",
            success: function (e) {
                if (e[0] == "t") {
                    settingsInfo["Anmelde Status"] = e.substring(1) + " (Klick zu ändern)";
                    staticElementsData["Anmelde Status"] = true;
                } else {
                    settingsInfo["Anmelde Status"] = "(Klick zu ändern)";
                    staticElementsData["Anmelde Status"] = false;
                }
            }
        }).fail(function (e) {
            settingsInfo["Anmelde Status"] = "FEHLER";
            staticElementsData["Anmelde Status"] = undefined;
        });
    },
    "Server MQTT Daten": function () {
        settingsInfo["Server MQTT Daten"] = "Aktualisieren...";
        $.ajax({
            type: "POST",
            url: "/api/v0/checkDat",
            success: function (e) {
                if (e[0] == "t") {
                    settingsInfo["Server MQTT Daten"] = "(Klick zu ändern)";
                    settingsInfo["AServer MQTT Daten"] = e.substring(1);
                    staticElementsData["Server MQTT Daten"] = true;
                } else {
                    settingsInfo["Server MQTT Daten"] = "(Klick zu ändern)";
                    staticElementsData["Server MQTT Daten"] = false;
                }
            }
        }).fail(function (e) {
            settingsInfo["Anmelde Status"] = "FEHLER";
            staticElementsData["Anmelde Status"] = undefined;
        });
    },*/
    "$settings.mqtt.connection": function () {
        staticElementsData["$settings.mqtt.connection"] = client.isConnected();
        if (client.isConnected()) {
            settingsInfo["$settings.mqtt.connection"] = client.host;
        }
        else if (settingsInfo["$settings.mqtt.connection"] != undefined && !settingsInfo["$settings.mqtt.connection"].startsWith("Failed")) {
            settingsInfo["$settings.mqtt.connection"] = "";
        }
        else if (settingsInfo["$settings.mqtt.connection"] == undefined) {
            settingsInfo["$settings.mqtt.connection"] = "";
        }
    },
};
let staticElementsData = { "Anmelde Status": undefined, "$settings.mqtt.connection": undefined };
let settingsInfo = { "$settings.about.2": /*$settings.about.2.info*/ "", "$settings.look.maxFPS": "$settings.look.maxFPS.info", "$settings.general.autoSaveImage": "$settings.general.autoSaveImage.info", "$settings.moodlight.passiveLive": "$settings.moodlight.passiveLive.info", "$settings.general.rightclick": "$settings.general.rightclick.info", "$settings.moodlight.live": "$settings.moodlight.live.info", "$settings.look.darkmode": "$settings.look.darkmode.info", "$settings.look.ownDesign": "$settings.look.ownDesign.info", "$settings.look.createOwnDesign": "$settings.look.createOwnDesign.info", "$settings.look.addDesignJson": "$settings.look.addDesignJson.info", "$settings.look.deleteDesign": "$settings.look.deleteDesign.info", "$settings.look.showAnimations": "$settings.look.showAnimations.info" };
let setSettings = { "$settings.moodlight.askMoodLightSizeProjectSizeDiff": "true", "$settings.look.hideElementMenu": "false", "$settings.look.startGridSnap": "true", "$settings.look.maxFPS": "60", "$settings.general.autoSaveImage": "true", "$settings.look.fullscreen": "false", "$settings.look.asyncElementLoading": "true", "$settings.look.showFPS": "false", "$settings.look.backgroundGrid": "true", "$settings.moodlight.passiveLive": "false", "$settings.general.rightclick": "false", "$settings.sheduler.send": "true", /*"Bei Projekt Laden Schedules zu dem Aktuellen Projekt ändern": "true", "Vor dem Hochladen alte Schedules löschen": "true"*/ "$settings.moodlight.live": "false", "$settings.general.autoSave": "true", "$settings.look.darkmode": "false", "$settings.general.promptInput": "false", "$settings.mqtt.showNameOnSend": "false", "$settings.look.showAnimations": "true", "$settings.look.showPicture": "true", "$settings.mqtt.delay": "70" };
let settingsSelLeft = 0;
let schedulerList = [];
let pictureId = -1;
let animationId = -1;
/**
123456
789abc
defghi
jklmno
pqrstu
vwxyz.
*/
let pictureValues = [];
/**0=Bild,1=Animation */
let pictureEditType = 0;
let pictureEditTool = 0;
let pictureEditLineStart = [0, 0];
pictureEditMarkUsedTool();
let page = 0;
resetPicEdit();
let sidebarSize = 250;
let sidebarFadeIn = 100;
let sidebarFadeInTimer = 0;
let textLength = 0;
let mouseSelectionLeft = -1;
let mouseDataLeft = -1;
let HoldingEnd = -1;
let mouseSelectionRight = -1;
let mouseDataRight = [-1, -1];
let EditMenuEdeting = -1;
let draw = new drawAdder();
let drawReal = new drawApp();
const errorImg = { "MAX": "ff00ff".repeat(100 * 100), "6": "ff00ffff00ffff00ff000000000000000000000000000000000000ff00ffff00ffff00ffff00ffff00ffff00ff000000000000000000ffffffffffffffffff00ff0000ff0000ff0000ff0000ff0000ff00ffffffffffffffffffffffffffffffffffff00ff0000ff0000ff00", "8": "ff00ffff00ffff00ffff00ff000000000000000000000000000000000000000000000000ff00ffff00ffff00ffff00ffff00ffff00ffff00ffff00ff000000000000000000000000000000000000000000000000ff00ffff00ffff00ffff00ff00ff0000ff0000ff0000ff00ffffffffffffffffffffffffffffffffffffffffffffffff00ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff00ffffffffffffffffffffffffffffffffffffffffffffffff00ff0000ff0000ff0000ff00" };
const available = [
    ["$element.picture", ["0", "0"]],
    ["$element.animation", ["0", "0", "10"]],
    ["$element.wait", ["0.25"]],
    ["$element.text", ["Text", "10", "ffffff", "000000"]],
    ["$element.time", ["10", "ffffff", "000000"]],
    ["$element.fill", ["000000"]],
    ["$element.loop", ["2"]],
    ["$element.infiniteLoop", []],
    ["$element.custom", [""]],
    ["$element.move", ["$element.move.verschiebenlinks", "000000"]],
    ["$element.colors", ["ffffff", "000000"]],
    ["$element.load", ["0"]],
    ["$element.pixel", ["0", "ff0000"]],
    ["$element.sound", ["1000", "100"]],
    //["$element.music",["1000,4000"]],
    ["$element.addPortTrigger", ["10", "0", "0", "0"]],
    ["$element.comment", [""]],
];
const description = {
    "$element.wait": ["$element.wait.seconds"],
    "$element.load": ["$element.load.number"],
    "$element.text": ["$element.text.text", "$element.text.speed", "$element.text.foregroundColor", "$element.text.backgroundColor"],
    "$element.time": ["$element.time.speed", "$element.time.foregroundColor", "$element.time.backgroundColor"],
    "$element.picture": ["$element.picture.picture", "$element.picture.transitionTime"],
    "$element.animation": ["$element.animation.animation", "$element.animation.transitionTime", "$element.animation.waitingTime"],
    "$element.fill": ["$element.fill.color"],
    "$element.loop": ["$element.loop.loops"],
    "$element.custom": ["$element.custom.code"],
    "$element.colors": ["$element.colors.foregroundColor", "$element.colors.backgroundColor"],
    "$element.move": ["$element.move.direction", "$element.move.backgroundColor"],
    "$element.pixel": ["$element.pixel.position", "$element.pixel.color"],
    "$element.sound": ["HZ", "dauer"],
    "$element.addPortTrigger": ["Port", "Hight -> Low trigger", "Low -> Hight trigger", "?"],
    //"$element.music": ["Töne"],
    "$element.comment": ["$element.comment.information"],
};
const joggAvailLookup = { "$element.move.pixelverschiebennachvorne": 0, "$element.move.pixelverschiebennachhinten": 1, "$element.move.verschiebenlinks": 9, "$element.move.verschiebenrechts": 7, "$element.move.verschiebenoben": 6, "$element.move.verschiebenunten": 8, "$element.move.drehenlinks": 5, "$element.move.drehenrechts": 3, "$element.move.drehenoben": 2, "$element.move.drehenunten": 4 };
const joggAvail = Object.keys(joggAvailLookup);
const notDragable = ["$element.start"];
const dropdownMenuButtons = {
    "$element.picture": {
        "Bearbeiten": function () {
            console.log("Bearbeiten");
        },
        "Anzeigen": function () {
            console.log("Anzeigen");
        }
    }, "$element.animation": {
        "Bearbeiten": function () {
            console.log("Bearbeiten");
        }
    }
}; //TODO
const allwaysRedo = { "$element.animation": [0] };
const specialRender = {
    "$element.picture": {
        0: [24, function (inputNum, posx, posy) {
                if (setSettings["$settings.look.showPicture"] == "true") {
                    renderPicture(pictures[parseInt(inputNum)], 30, 30, posx - 2, posy - 2, drawReal, ctxPreDraw);
                }
            }]
    },
    "$element.animation": {
        0: [24, function (inputNum, posx, posy) {
                toDrawAnimations.push([inputNum, posx, posy]);
            }]
    },
    "$element.text": {
        2: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }],
        3: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }]
    },
    "$element.time": {
        1: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }],
        2: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }]
    },
    "$element.colors": {
        0: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }],
        1: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }]
    },
    "$element.fill": {
        0: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }]
    },
    "$element.pixel": {
        1: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }]
    },
    "$element.move": {
        1: [24, function (inputNum, posx, posy) {
                drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctxPreDraw, drawReal);
            }]
    }
};
const specialBlockEditClick = {
    "$element.picture": {
        0: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting];
            var qAnsw = {};
            for (var i = 0; i < pictures.length; i++) {
                qAnsw["_P" + i] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = "" + selId;
                    goTo("standartEdit", 1);
                };
            }
            mouse[0] = false;
            Question = ["$question.blockPictureChange", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        }
    },
    "$element.animation": {
        0: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting];
            var qAnsw = {};
            for (var i = 0; i < animations.length; i++) {
                qAnsw["_A" + i] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = "" + selId;
                    goTo("standartEdit", 1);
                };
            }
            mouse[0] = false;
            Question = ["$question.blockAnimationChange", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        }
    },
    "$element.text": {
        2: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        },
        3: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        }
    },
    "$element.time": {
        1: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        },
        2: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        }
    },
    "$element.colors": {
        0: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        },
        1: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        }
    },
    "$element.fill": {
        0: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        }
    },
    "$element.pixel": {
        1: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        }
    },
    "$element.move": {
        0: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting];
            var qAnsw = {};
            for (var i = 0; i < joggAvail.length; i++) {
                qAnsw[joggAvail[i]] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = joggAvail[selId];
                    goTo("standartEdit", 1);
                };
            }
            mouse[0] = false;
            Question = ["$question.blockMoveChange", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        },
        1: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement");
        }
    },
    "$element.load": {
        0: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting];
            var qAnsw = {};
            for (var i = 0; i < Elements.length; i++) {
                qAnsw["_E" + mapElement(["$element.start", ["" + i]])] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = "" + selId;
                    goTo("standartEdit", 1);
                };
            }
            mouse[0] = false;
            Question = ["$question.blockLoadChange", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        }
    },
    "$element.addPortTrigger": {
        1: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting];
            var qAnsw = {};
            for (var i = 0; i < Elements.length; i++) {
                qAnsw["_E" + mapElement(["$element.start", ["" + i]])] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = "" + selId;
                    goTo("standartEdit", 1);
                };
            }
            mouse[0] = false;
            Question = ["$question.blockLoadChange", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        },
        2: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting];
            var qAnsw = {};
            for (var i = 0; i < Elements.length; i++) {
                qAnsw["_E" + mapElement(["$element.start", ["" + i]])] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = "" + selId;
                    goTo("standartEdit", 1);
                };
            }
            mouse[0] = false;
            Question = ["$question.blockLoadChange", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        }
    },
};
const specialBlockDropdownRender = {
    "$element.animation": {
        0: function (inputNum, posx, posy) {
            toDrawAnimations.push([inputNum, posx + 6, posy - 24 + 2]);
        }
    },
    "$element.picture": {
        0: function (inputNum, posx, posy) {
            if (setSettings["$settings.look.showPicture"] == "true") {
                renderPicture(pictures[parseInt(inputNum)], 30, 30, posx - 2 + 6, posy - 2 - 22, draw, ctx);
            }
        }
    },
    "$element.fill": {
        0: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        }
    },
    "$element.pixel": {
        1: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        }
    },
    "$element.move": {
        1: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        }
    },
    "$element.text": {
        2: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        },
        3: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        }
    },
    "$element.time": {
        1: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        },
        2: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        }
    },
    "$element.colors": {
        0: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        },
        1: function (inputNum, posx, posy) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx, draw);
        }
    }
};
function drawColerRect(posx, posy, sizeX, sizeY, colorStr, ctx, draw) {
    if (colorStr == "#R") {
        draw.roundedRect(posx + 5, posy + 5, 25 - 5 * 2, 30 - 5 * 2, "#ffffff", 15, ctx);
        draw.text(posx, posy + 28, "R", "#ff0000", "left", font, ctx);
    }
    else if (colorStr == "#V") {
        draw.roundedRect(posx + 5, posy + 5, 25 - 5 * 2, 30 - 5 * 2, "#ffffff", 15, ctx);
        draw.text(posx, posy + 28, "V", "#ff0000", "left", font, ctx);
    }
    else {
        draw.rect(posx, posy, sizeX, sizeY, colorStr, ctx);
    }
}
let dropdownCursorBlink = 0;
let tempData;
const presetColors = { "light": { "buttonBackground": "#d2d2d2", "buttonBackgroundHover": "#bebebe", "settingsBoolUndefined": "#5e5e5e", "QuestionTitleBackground": "#ffffff", "GrayBlock": "#f0f0f0", "GrayBlockAccent": "#ffffff", "background": "#fcfcfc", "backgroundGrid": "#dbdbdb", "blockArgBackground": "#ffffff", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#b0b0b0", "EditMenu": "#d0f7e9", "EditMenuAccent": "#7bc9ac", "NormalText": "#000000", "MenuButtons": "#000000", "MenuBackground": "#000000", "MenuText": "#ffffff", "settingsBoolTrue": "#00ff00", "settingsBoolFalse": "#ff0000", "settingsSelMouseOver": "#d2d2d2", "settingsSelStandard": "#dcdcdc", "settingsSelSelected": "#c8c8c8", "backgroundBlur": "#000000", "settingsBackground": "#ffffff", "settingsBackgroundHighlight": "#f0f0f0", "questionRedBackgroundBlur": "#960000", "questionBackground": "#aaaaaa", "objectSidebarBlur": "#c0c0c0", "ProjectName": "#4287f5" }, "dark": { "buttonBackground": "#6b6b6b", "buttonBackgroundHover": "#4a4a4a", "settingsBoolUndefined": "#5e5e5e", "QuestionTitleBackground": "#000000", "GrayBlock": "#f0f0f0", "GrayBlockAccent": "#ffffff", "background": "#030303", "backgroundGrid": "#9b9b9b", "blockArgBackground": "#000000", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#4f4f4f", "EditMenu": "#2f0816", "EditMenuAccent": "#843653", "NormalText": "#ffffff", "MenuButtons": "#ffffff", "MenuBackground": "#ffffff", "MenuText": "#000000", "settingsBoolTrue": "#00ff00", "settingsBoolFalse": "#ff0000", "settingsSelMouseOver": "#2d2d2d", "settingsSelStandard": "#232323", "settingsSelSelected": "#373737", "backgroundBlur": "#ffffff", "settingsBackground": "#000000", "settingsBackgroundHighlight": "#0f0f0f", "questionRedBackgroundBlur": "#69ffff", "questionBackground": "#555555", "objectSidebarBlur": "#3f3f3f", "ProjectName": "#4287f5" } };
let currentColor = { "buttonBackground": "", "buttonBackgroundHover": "", "settingsBoolUndefined": "", "QuestionTitleBackground": "", "GrayBlock": "", "GrayBlockAccent": "", "background": "", "backgroundGrid": "", "blueBlock": "", "blockArgBackground": "", "blueBlockAccent": "", "YellowBlock": "", "YellowBlockAccent": "", "PurpleBlock": "", "PurpleBlockAccent": "", "MoveBlockShaddow": "", "EditMenu": "", "EditMenuAccent": "", "NormalText": "", "MenuButtons": "", "MenuBackground": "", "MenuText": "", "settingsBoolTrue": "", "settingsBoolFalse": "", "settingsSelMouseOver": "", "settingsSelStandard": "", "settingsSelSelected": "", "backgroundBlur": "", "settingsBackground": "", "settingsBackgroundHighlight": "", "questionRedBackgroundBlur": "", "questionBackground": "", "objectSidebarBlur": "", "ProjectName": "", };
let setYellow = ["$element.loop", "$element.infiniteLoop", "$element.start", "$element.end", "$element.load"];
let setPurple = ["$element.picture", "$element.animation", "$element.colors", "$element.pixel"];
let setGray = ["$element.comment"];
let pictures = [];
let animations = [];
let animationProgression = [];
let toDrawAnimations = [];
let Elements = [[["$element.start", ["0"]]]];
let ElementPositions = [[0, 0]];
let ElementPositionEdit = [0, 0];
let FreeElements = [];
let drawcolor = "";
let drawcolorAccent = "";
let drawcolorO = "";
let drawcolorAccentO = "";
let cursorMessage = "";
let oldMouseX = 0;
let oldMouseY = 0;
let posx = 275;
let posy = 75;
let px = 0;
let py = 0;
let pyC = 0;
let maxOutsideBounds = 500;
let blockheight = 38;
let backgroundGridStr;
let backgroundGrid = new Image;
setTimeout(window.onresize, 100, null);
//end of variables
getStorage();
setStorage();
setTimeout(updateFullscreen, 100);
mqttConstructor();
if (setSettings["$settings.look.ownDesign"] == "" || setSettings["$settings.look.ownDesign"] == undefined) {
    if (setSettings["$settings.look.darkmode"] == "true") {
        currentColor = presetColors["dark"];
    }
    else {
        currentColor = presetColors["light"];
    }
}
else {
    var l = localStorage.getItem("!designs");
    if (l != undefined) {
        var d = JSON.parse(l);
        if (d[setSettings["$settings.look.ownDesign"]] != undefined) {
            currentColor = d[setSettings["$settings.look.ownDesign"]];
        }
        else {
            aalert("$alert.customDesignError");
            currentColor = presetColors["light"];
        }
    }
    else {
        aalert("Eigenes Design nicht vorhanden!");
        currentColor = presetColors["light"];
    }
}
let moodLightSizeX = 6;
let moodLightSizeY = 6;
let moodLightGotSizeX = -1;
let moodLightGotSizeY = -1;
/**
 * 0: snake
 * 1: line by line
 */
let ledSortType = 0;
var la = getCookie("lastUsed");
if (la != "" && localStorage[la] != undefined) {
    loadProject(JSON.parse(localStorage[la]), true);
}
function UpdateSizeMoodlightSize() {
    //gen color selection Table
    colorSelTable.innerHTML = "";
    LiveMoodLight.innerHTML = "";
    LiveMoodLight.style.width = 23 * moodLightSizeX + "px";
    LiveMoodLight.style.height = 23 * moodLightSizeY + "px";
    for (var x = 0; x < moodLightSizeY; x++) {
        var i = '<tr>';
        var i2 = '';
        for (var y = 0; y < moodLightSizeX; y++) {
            i += '<th style="background:white" class="ColorSelContainer"><div class="ColorSelButton" style="background:black" id="y' + y + "x" + x + '"></div></th>';
            i2 += '<div class="LiveDisplay" style="background:black" id="2_y' + x + "x" + y + '"></div>';
        }
        i2 += '<div class="break"></div>';
        colorSelTable.innerHTML += i + "</tr>";
        LiveMoodLight.innerHTML += i2;
    }
}
UpdateSizeMoodlightSize();
function setFont(font, ctx) {
    if (ctx.font != font) {
        ctx.font = font;
    }
}
function loadAnim() {
    var imgDat = "3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3fffd4ecfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3fffd4efffd4ecfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e8fffd4e3d85c6#3d85c6fffd4e9fc5e8fffd4e3d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e8fffd4e3d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4ea72828ff0000ff0000a72828cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3fffd4efffd4ecfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000fffd4ecfe2f3ff0000a72828a72828ff0000fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c6fffd4e9fc5e83d85c63d85c6#3d85c63d85c6fffd4e9fc5e8fffd4e3d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3fffd4ea72828ff0000ff0000a72828cfe2f3fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c6fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c63d85c69fc5e89fc5e83d85c6fffd4e#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3fffd4efffd4ecfe2f3cfe2f3fffd4e3d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3fffd4ecfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c6fffd4e9fc5e8fffd4e3d85c6#3d85c6fffd4e9fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#fffd4e3d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3fffd4ecfe2f3cfe2f3cfe2f3fffd4eff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3a72828ff0000ff0000a72828fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828fffd4ecfe2f3a72828ff0000ff0000a72828cfe2f3fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3fffd4eff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c6fffd4e#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c63d85c69fc5e89fc5e83d85c63d85c6".split("#");
    pictureValues = [];
    for (var i = 0; i < imgDat.length; i++) {
        pictureValues.push(pictureString2Value(imgDat[i]));
    }
}
let pictureSave = {};
function renderPicture(picString, sizeX, sizeY, posx, posy, drawer, canvasCTX) {
    posx = Math.floor(posx);
    posy = Math.floor(posy);
    if (pictureSave[picString + "_" + sizeX + "_" + sizeY] == undefined) {
        canvasPreDraw2.width = sizeX;
        canvasPreDraw2.height = sizeY;
        ctxPreDraw2.clearRect(0, 0, sizeX, sizeY);
        var py = 0;
        var px = 0;
        var dat = pictureString2Value(picString);
        for (var i = 0; i < moodLightSizeY; i++) {
            for (var ii = 0; ii < moodLightSizeX; ii++) {
                drawReal.rect(px + i * (sizeX / moodLightSizeY), py + ii * (sizeY / moodLightSizeX), sizeX / moodLightSizeY, sizeY / moodLightSizeX, "#" + dat[ii * moodLightSizeY + i], ctxPreDraw2);
                drawer.rect(posx + i * (sizeX / moodLightSizeY), posy + ii * (sizeY / moodLightSizeX), sizeX / moodLightSizeY, sizeY / moodLightSizeX, "#" + dat[ii * moodLightSizeY + i], canvasCTX);
            }
        }
        //save
        var img = new Image;
        img.src = canvasPreDraw2.toDataURL("image/png");
        pictureSave[picString + "_" + sizeX + "_" + sizeY] = img;
    }
    //canvasCTX.drawImage(pictureSave[picString + "_" + sizeX + "_" + sizeY], posx, posy)
    drawer.image(pictureSave[picString + "_" + sizeX + "_" + sizeY], posx, posy, canvasCTX);
}
function pictureString2Value(input) {
    try {
        var out = [];
        for (var i = 0; i < moodLightSizeY; i++) {
            if (ledSortType == 0) {
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
            else if (ledSortType == 1) {
                for (var ii = 0; ii < moodLightSizeX; ii++) {
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
function pictureValue2String(input) {
    var out = "";
    for (var i = 0; i < moodLightSizeY; i++) {
        if (ledSortType == 0) {
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
        else {
            for (var ii = 0; ii < moodLightSizeX; ii++) {
                if (input[i * moodLightSizeY + ii] == "") {
                    input[i * moodLightSizeY + ii] = "000000";
                }
                out = out + input[i * moodLightSizeY + ii];
            }
        }
    }
    return out;
}
let justfinsishedPicture = false;
function finishPicture() {
    if (pictureId != -1 || animationId != -1) {
        if (pictureEditType == 0) {
            //udpate all elements with this picture
            for (var x of Object.keys(imgStore)) {
                if (x.startsWith("$element.picture|!|!" + pictureId + "|!|!")) {
                    imgStore[x] = undefined;
                    justfinsishedPicture = true;
                    console.log(x);
                    //delete imgStore[x]
                    //var l = x.split("|!|!")
                    //delete l[0]
                    //elementLenghtAndDraw(["$element.picture", l], -5000, -5000);
                }
            }
            pictures[pictureId] = pictureValue2String(pictureValues[0]);
        }
        else {
            var anim = [];
            for (var i = 0; i < pictureValues.length; i++) {
                anim.push(pictureValue2String(pictureValues[i]));
            }
            animations[animationId] = anim;
        }
        animationId = -1;
        pictureId = -1;
        //return to main edit
        goTo("standartEdit", 0);
    }
    else {
        aalert("$alert.pictureNoIdError");
    }
    autoSave();
}
function genProjectJson() {
    return JSON.stringify({ "sizeX": moodLightSizeX, "ledSortType": ledSortType, "Elements": Elements, "pictures": pictures, "ElementPositions": ElementPositions, "FreeElements": FreeElements, "animations": animations, "projectName": projectName, "Scheduler": getSchedulerDat() });
}
function downloadProject() {
    var filename = projectName;
    if (filename == "") {
        filename = "Unnamed";
    }
    filename = filename + ".moproj";
    download(genProjectJson(), "json", filename);
}
function saveProject() {
    try {
        localStorage.setItem(projectName, genProjectJson());
    }
    catch (_a) {
        console.error("Counld not save!");
    }
}
function getErrorIMG() {
    if (errorImg[moodLightSizeX] == undefined) {
        return errorImg["MAX"];
    }
    return errorImg[moodLightSizeX];
}
function autoSave() {
    if (setSettings["$settings.general.autoSave"] == "true") {
        saveProject();
    }
}
let transitionFunction;
/**
* type: 0=fadein+fadeout; 1=cut
* standartEdit, PictureEdit, Question, Settings, Actions, Sheduler, Console
*/
function goTo(übergangTo, type, transitionFunc) {
    if (transitionFunc != undefined) {
        transitionFunction = transitionFunc;
    }
    if (editType != "Question") {
        latestCanvasPicStr = canvas.toDataURL("image/png");
        latestCanvasPic.src = latestCanvasPicStr;
    }
    else {
        questionScroll = 0;
    }
    cursorMessage = "";
    comesFrom = editType;
    if (type == 0) {
        Übergang = 1;
        ÜbergangZu = übergangTo;
    }
    else if (type == 1) {
        editType = übergangTo;
        updateRects();
    }
    checkDisplay();
    if (übergangTo == "PictureEdit") {
        page = 0;
    }
    if (übergangTo == "Settings") {
        var sK = Object.keys(settingsOnLoad);
        for (var i = 0; i < sK.length; i++) {
            settingsOnLoad[sK[i]]();
        }
    }
}
function hexstr(number) {
    var chars = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
    var low = number & 0xf;
    var high = (number >> 4) & 0xf;
    return "" + chars[high] + chars[low];
}
function rgb2hex(r, g, b) {
    return hexstr(Math.round(r)) + hexstr(Math.round(g)) + hexstr(Math.round(b));
}
function resetPicEdit() {
    page = 0;
    var elem = document.getElementsByClassName("ColorSelButton");
    pictureValues = [[]];
    for (var x = 0; x < elem.length; x++) {
        pictureValues[0].push("000000");
        var e = elem[x];
        e.style.background = "black";
    }
}
function loadPicture(id) {
    page = 0;
    var dat = pictureString2Value(pictures[id]);
    pictureValues[0] = dat;
    for (var x = 0; x < moodLightSizeX; x++) {
        for (var y = 0; y < moodLightSizeY; y++) {
            var d = document.getElementById("y" + y + "x" + x);
            d.style.background = "#" + dat[x * moodLightSizeY + y];
        }
    }
}
function loadPictureVal(dat) {
    pictureValues[page] = dat;
    for (var x = 0; x < moodLightSizeX; x++) {
        for (var y = 0; y < moodLightSizeY; y++) {
            var d = document.getElementById("y" + y + "x" + x);
            d.style.background = "#" + dat[x * moodLightSizeY + y];
        }
    }
}
function download(content, mimeType, filename) {
    const a = document.createElement('a');
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
}
let drawActions = -1;
let backgroundGridSize = blockheight * 2;
function drawBoard() {
    ctx.globalAlpha = 1;
    var bw = ctx.canvas.width;
    var bh = ctx.canvas.height;
    var p = 0;
    var px = -6; // posx - (Math.floor(posx / s) * s);
    var py = 5; // posy - (Math.floor(posy / s) * s);
    ctx.lineWidth = 3;
    for (var x = 0; x <= bw; x += backgroundGridSize) {
        ctx.moveTo(0.5 + x + p + px, py + p - backgroundGridSize);
        ctx.lineTo(0.5 + x + p + px, py + bh + p + backgroundGridSize);
    }
    for (var x = 0; x <= bh; x += backgroundGridSize) {
        ctx.moveTo(p + px - backgroundGridSize, py + 0.5 + x + p);
        ctx.lineTo(bw + p + px + backgroundGridSize, py + 0.5 + x + p);
    }
    ctx.strokeStyle = currentColor["backgroundGrid"];
    ctx.stroke();
}
function drawScreen() {
    var drawStart = performance.now();
    var px = 0;
    var py = 0;
    if (editType == "standartEdit") {
        //move cam
        if (mouse[1] || mouseSelectionLeft == 0) {
            posx += mouseX - oldMouseX;
            posy += mouseY - oldMouseY;
            oldMouseX = mouseX;
            oldMouseY = mouseY;
        }
        px = posx;
        py = posy;
        //background
        drawReal.fill(currentColor["background"], ctx);
        if (setSettings["$settings.look.backgroundGrid"] == "true") {
            var x = posx - (Math.floor(posx / backgroundGridSize) * backgroundGridSize) - backgroundGridSize;
            var y = posy - (Math.floor(posy / backgroundGridSize) * backgroundGridSize) - backgroundGridSize;
            drawReal.image(backgroundGrid, x, y, ctx);
            //drawBoard();
        }
    }
    drawActions = 0;
    ToDraw.forEach(value => {
        var key = Object.keys(value)[0];
        var i = value[key];
        ctx.shadowColor = i[i.length - 2];
        ctx.shadowBlur = i[i.length - 1];
        ctx.globalAlpha = i[i.length - 3];
        if (key == "rect") {
            drawReal.rect(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5]);
        }
        else if (key == "roundedRect") {
            drawReal.roundedRect(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5], i[6]);
        }
        else if (key == "circle") {
            drawReal.circle(i[0] + px, i[1] + py, i[2], i[3], i[4]);
        }
        else if (key == "fill") {
            drawReal.fill(i[0], i[1]);
        }
        else if (key == "text") {
            drawReal.text(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5], i[6]);
        }
        else if (key == "polygon") {
            drawReal.polygon(i[0], i[1], i[2]);
        }
        else if (key == "polygonOutline") {
            drawReal.polygonOutline(i[0], i[1], i[2], i[3]);
        }
        else if (key == "image") {
            drawReal.image(i[0], i[1] + px, i[2] + py, ctx);
        }
        else if (key == "imageWH") {
            drawReal.imageWH(i[0], i[1] + px, i[2] + py, i[3], i[4], ctx);
        }
        drawActions++;
    });
    allwaysDraw();
    if (cursorMessage != "" && cursorMessage != undefined) {
        setFont(font, ctx);
        drawReal.rect(mouseX - 1, mouseY - 1, measureText(cursorMessage, ctx).width + 2, 35 + 2, "#bebebe", ctx); //outline
        drawReal.rect(mouseX, mouseY, measureText(cursorMessage, ctx).width, 35, "#d9d9d9", ctx); //background
        drawReal.text(mouseX, mouseY + 30, cursorMessage, currentColor["NormalText"], "left", font, ctx);
    }
    var drawEnd = performance.now();
    msPerDrawCach.push(drawEnd - drawStart);
    //console.log((drawEnd - drawStart) + ' ms.');
}
function updateScreen(onlyDraw) {
    var dStartTime = performance.now();
    if (onlyDraw == undefined) {
        var update = updatefunction();
        ctx.globalAlpha = 1;
        if (preloadedInCycle < 20 || editType != "standartEdit") {
            if (update) {
                updateRects();
            }
            var dEndTime = performance.now();
            msPerUpdateCach.push(dEndTime - dStartTime);
        }
    }
    else {
        updateRects();
        var dEndTime = performance.now();
        msPerUpdateCach.push(dEndTime - dStartTime);
    }
    preloadedInCycle = 0;
}
function updatefunction() {
    //size change
    if (sizeChange) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        sizeChange = false;
    }
    if (Übergang >= 1) {
        Übergang += 1;
    }
    if (Übergang >= 50) {
        Übergang = -1;
        hider.style.opacity = "0%";
    }
    var update = false;
    if (editType == "standartEdit") {
        ////////////
        // Update //
        ////////////
        // mouseSelectionLeft types: 0=move Screen; 1=move Elements; 2=move Start; -2=none;
        //right mouse click
        if ((mouse[2] || (setSettings["$settings.general.rightclick"] == "true" && clickTime <= waitClickTime && clickStart != -1 && !mouse[0] && mouseSelectionRight == -1)) && (mouseSelectionRight == -1 || mouseSelectionRight == 0) && HoldingEnd == -1) {
            update = true;
            let c = true;
            for (let ElementLoadPos = 0; ElementLoadPos < Elements.length; ElementLoadPos++) {
                for (let ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
                    let px = posx + ElementPositions[ElementLoadPos][0];
                    let py = posy + ElementPositions[ElementLoadPos][1] + ElementList * blockheight;
                    textLength = elementLenght(Elements[ElementLoadPos][ElementList]);
                    if (mouseX > px && mouseX < px + textLength && mouseY < py && mouseY > py - blockheight && notDragable.indexOf(Elements[ElementLoadPos][ElementList][0]) == -1) {
                        c = false;
                        mouseDataRight = [ElementLoadPos, ElementList];
                        EditMenuEdeting = -1;
                        //1=EditMenu Geöffnet; 2=EditMenu Text Bearbeiten
                        mouseSelectionRight = 10;
                    }
                }
            }
            if (c) {
                mouseSelectionRight = -1;
                cursorMessage = "";
                //TODO:open context-menu?
            }
        }
        if (mouseSelectionRight == 10 && !mouse[2]) {
            mouseSelectionRight = 0;
        }
        //left mouse click
        if (mouse[0] && mouseSelectionLeft == -1 && HoldingEnd == -1 && (setSettings["$settings.general.rightclick"] != "true" || (clickTime >= waitClickTime || mouseSelectionRight != -1))) {
            update = true;
            //if EditMenu closed
            if (mouseSelectionRight == -1) {
                //open Menu
                if (mouseSelectionLeft == -1) {
                    if (mouseX > canvas.width - 50 && mouseY < 50) {
                        if (menuOpen == 0) {
                            mouseSelectionLeft = -2;
                            menuOpen = 0.01;
                        }
                        else if (menuOpen == 1) {
                            mouseSelectionLeft = -2;
                            menuOpen = -0.01;
                        }
                    }
                }
                //change project name
                if (mouseSelectionLeft == -1) {
                    if (menuOpen == 1 && mouseY < 40 && mouseX < canvas.width - 60 && mouseX > canvas.width - 60 - measureText(projectName, ctx).width) {
                        var r = pprompt("", projectName);
                        if (r != undefined) {
                            localStorage.removeItem(projectName);
                            projectName = r;
                            localStorage.setItem(projectName, genProjectJson());
                            setCookie("lastUsed", projectName, 0.5);
                        }
                    }
                }
                //use Menu
                if (mouseSelectionLeft == -1) {
                    if (menuOpen == 1 && mouseX > canvas.width - menuWidth) {
                        mouseSelectionLeft = -2;
                        try {
                            menuButtons[Object.keys(menuButtons)[Math.round((mouseY - (90 - (35 / 2))) / 35)]]();
                        }
                        catch (_a) { }
                    }
                }
                //new Element
                if (mouseSelectionLeft == -1) {
                    if (mouseX < sidebarSize) {
                        let sel = Math.ceil((-blockheight + mouseY - 10) / (blockheight + 10));
                        if (sel < available.length) {
                            oldMouseX = mouseX - 10 + mouseX;
                            oldMouseY = mouseY - (blockheight / 2);
                            mouseSelectionLeft = 1;
                            mouseDataLeft = FreeElements.length;
                            FreeElements.push([[...available[sel][0]].join(""), [...available[sel][1]], [mouseX - posx, mouseY - posy]]);
                        }
                    }
                }
                //search Free Elements
                if (mouseSelectionLeft == -1) {
                    for (let ElementLoadPos = 0; ElementLoadPos < FreeElements.length; ElementLoadPos++) {
                        let px = posx + FreeElements[ElementLoadPos][2][0];
                        let py = posy + FreeElements[ElementLoadPos][2][1];
                        textLength = elementLenght([FreeElements[ElementLoadPos][0], FreeElements[ElementLoadPos][1]]);
                        if (mouseX > px && mouseX < px + textLength && mouseY < py && mouseY > py - blockheight) {
                            mouseSelectionLeft = 1;
                            FreeElements.push(FreeElements[ElementLoadPos]);
                            FreeElements.splice(ElementLoadPos, 1);
                            mouseDataLeft = FreeElements.length - 1;
                            break;
                        }
                    }
                }
                //search non Free Elements
                if (mouseSelectionLeft == -1) {
                    for (let ElementLoadPos = 0; ElementLoadPos < Elements.length; ElementLoadPos++) {
                        for (let ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
                            let px = posx + ElementPositions[ElementLoadPos][0];
                            let py = posy + ElementPositions[ElementLoadPos][1] + ElementList * blockheight;
                            textLength = elementLenght(Elements[ElementLoadPos][ElementList]);
                            if (mouseX > px && mouseX < px + textLength && mouseY < py && mouseY > py - blockheight) {
                                if (notDragable.indexOf(Elements[ElementLoadPos][ElementList][0]) == -1) {
                                    if (Elements[ElementLoadPos][ElementList][0] == "$element.end") {
                                        Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList);
                                        HoldingEnd = ElementLoadPos;
                                        oldMouseX = mouseX - 10 + mouseX;
                                        oldMouseY = mouseY - (blockheight / 2);
                                        mouseDataLeft = FreeElements.length;
                                        FreeElements.push(["$element.end", [], [mouseX - posx, mouseY - posy]]);
                                        mouseSelectionLeft = 1;
                                    }
                                    else {
                                        oldMouseX = mouseX + (mouseX - px);
                                        oldMouseY = mouseY + (mouseY - py);
                                        mouseSelectionLeft = 1;
                                        mouseDataLeft = FreeElements.length;
                                        let i = Elements[ElementLoadPos][ElementList];
                                        FreeElements.push([[...Elements[ElementLoadPos][ElementList][0]].join(""), [...Elements[ElementLoadPos][ElementList][1]], [mouseX - posx, mouseY - posy]]);
                                        if (!isKeyDown("alt")) {
                                            //search End
                                            if (["$element.loop", "$element.infiniteLoop"].includes(Elements[ElementLoadPos][ElementList][0])) {
                                                let it = ElementList;
                                                let indentation = 1;
                                                while (indentation > 0) {
                                                    it++;
                                                    if (["$element.loop", "$element.infiniteLoop"].includes(Elements[ElementLoadPos][it][0])) {
                                                        indentation++;
                                                    }
                                                    if ("$element.end" == Elements[ElementLoadPos][it][0]) {
                                                        indentation--;
                                                    }
                                                }
                                                Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], it);
                                                Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList);
                                            }
                                            else {
                                                Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList);
                                            }
                                        }
                                        else {
                                            console.log("ALT");
                                        }
                                    }
                                    break;
                                }
                                else if (Elements[ElementLoadPos][ElementList][0] == "$element.start") {
                                    mouseSelectionLeft = 2;
                                    mouseDataLeft = ElementLoadPos;
                                    ElementPositionEdit = [ElementPositions[mouseDataLeft][0], ElementPositions[mouseDataLeft][1]];
                                }
                            }
                        }
                    }
                }
                //else
                if (mouseSelectionLeft == -1) {
                    oldMouseX = mouseX;
                    oldMouseY = mouseY;
                    mouseSelectionLeft = 0;
                }
            }
            //if EditMenu open
            else {
                //if Mouse in EditMenu
                let hei = Elements[mouseDataRight[0]][mouseDataRight[1]][1].length;
                let px = ElementPositions[mouseDataRight[0]][0] + posx;
                let py = ElementPositions[mouseDataRight[0]][1] + mouseDataRight[1] * blockheight + posy;
                let pxM = px + 250;
                let pyM = py + hei * blockheight + blockheight;
                if (mouseX > px && mouseX < pxM && mouseY > py && mouseY < pyM) {
                    EditMenuEdeting = Math.floor((mouseY - 20 - py) / blockheight);
                    if (EditMenuEdeting < Elements[mouseDataRight[0]][mouseDataRight[1]][1].length) {
                        var edited = false;
                        if (Elements[mouseDataRight[0]][mouseDataRight[1]][0] in specialBlockEditClick) {
                            if (EditMenuEdeting in specialBlockEditClick[Elements[mouseDataRight[0]][mouseDataRight[1]][0]]) {
                                edited = true;
                                specialBlockEditClick[Elements[mouseDataRight[0]][mouseDataRight[1]][0]][EditMenuEdeting]();
                            }
                        }
                        if (!edited) {
                            if (setSettings["$settings.general.promptInput"] == "false") {
                                mouseSelectionRight = 1;
                                //console.log(mouseY-20-py);
                                mouseSelectionLeft = -2;
                            }
                            else if (EditMenuEdeting >= 0) {
                                mouse[0] = false;
                                //mouseSelectionLeft = -1;
                                var r = pprompt("", Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting]);
                                if (r != undefined) {
                                    Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = r;
                                }
                            }
                        }
                    }
                    else {
                        EditMenuEdeting = -1;
                    }
                }
                //if not in menu decrease number:
                else {
                    autoSave();
                    EditMenuEdeting = -1;
                    mouseSelectionRight--;
                    mouseSelectionLeft = -2;
                    cursorMessage = "";
                }
            }
        }
        //left mouse let go
        if (mouseSelectionLeft != -1 && !mouse[0] && HoldingEnd == -1) {
            update = true;
            //remove Element
            if (mouseX < sidebarSize && mouseSelectionLeft == 1) {
                FreeElements = removeItem(FreeElements, mouseDataLeft);
                mouseSelectionLeft = -1;
                autoSave();
            }
            //dropFree Element
            if (mouseSelectionLeft == 1) {
                for (let ElementList = 0; ElementList < Elements.length; ElementList++) {
                    //if x matches
                    if (ElementPositions[ElementList][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementList][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                        //if not over max len or below
                        if (FreeElements[mouseDataLeft][2][1] > ElementPositions[ElementList][1] + (blockheight - 20) && FreeElements[mouseDataLeft][2][1] < ElementPositions[ElementList][1] + blockheight * (Elements[ElementList].length + 1)) {
                            //Elements[ElementList].push()
                            let insertY = 0;
                            if (["$element.loop", "$element.infiniteLoop"].includes(FreeElements[mouseDataLeft][0])) {
                                insertY = Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementList][1]) / blockheight);
                                Elements[ElementList].splice(insertY, 0, [FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                                //Elements[ElementList]=insertArrayAt([FreeElements[mouseDataLeft][0], FreeElements[mouseSelectionLeft][1]],0,Elements[ElementList])
                                FreeElements = removeItem(FreeElements, mouseDataLeft);
                                HoldingEnd = ElementList;
                                oldMouseX = mouseX - 10 + mouseX;
                                oldMouseY = mouseY - (blockheight / 2);
                                mouseSelectionLeft = 500;
                                mouse[0] = true;
                                mouseDataLeft = FreeElements.length;
                                FreeElements.push(["$element.end", [], [mouseX - posx, mouseY - posy]]);
                            }
                            else {
                                insertY = Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementList][1]) / blockheight);
                                Elements[ElementList].splice(insertY, 0, [FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                                //Elements[ElementList]=insertArrayAt([FreeElements[mouseDataLeft][0], FreeElements[mouseSelectionLeft][1]],0,Elements[ElementList])
                                FreeElements = removeItem(FreeElements, mouseDataLeft);
                            }
                            ;
                            break;
                        }
                    }
                }
                autoSave();
            }
            if (mouseSelectionLeft != 500) {
                mouseSelectionLeft = -1;
            }
            else {
                mouseSelectionLeft = 1;
            }
        }
        //HoldingEnd let go
        if (mouseSelectionLeft != -1 && !mouse[0] && HoldingEnd != -1) {
            update = true;
            if (ElementPositions[HoldingEnd][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[HoldingEnd][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                //if not over max len or below
                if (FreeElements[mouseDataLeft][2][1] > ElementPositions[HoldingEnd][1] + (blockheight - 20) && FreeElements[mouseDataLeft][2][1] < ElementPositions[HoldingEnd][1] + blockheight * (Elements[HoldingEnd].length + 1)) {
                    //test if Indentation bigger 0
                    let i = 1;
                    let indentation = 0;
                    let insertY = Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[HoldingEnd][1]) / blockheight);
                    while (true) {
                        if (i == insertY) {
                            break;
                        }
                        if (Elements[HoldingEnd][i] != undefined) {
                            if (Elements[HoldingEnd][i][0] == "$element.end") {
                                indentation--;
                            }
                            if (["$element.loop", "$element.infiniteLoop"].includes(Elements[HoldingEnd][i][0])) {
                                indentation++;
                            }
                        }
                        i++;
                    }
                    console.log(indentation);
                    if (indentation >= 1) {
                        Elements[HoldingEnd].splice(insertY, 0, [FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                        FreeElements = removeItem(FreeElements, mouseDataLeft);
                        mouseSelectionLeft = -1;
                        HoldingEnd = -1;
                        autoSave();
                    }
                    else {
                        mouse[0] = true;
                    }
                }
                else {
                    mouse[0] = true;
                }
            }
            else {
                mouse[0] = true;
            }
        }
        //move Free Element
        if (mouseSelectionLeft == 1 && !mouse[1]) {
            update = true;
            FreeElements[mouseDataLeft][2][0] += mouseX - oldMouseX;
            FreeElements[mouseDataLeft][2][1] += mouseY - oldMouseY;
        }
        //move Start
        if (mouseSelectionLeft == 2) {
            update = true;
            if (setSettings["$settings.look.startGridSnap"] != "true") {
                ElementPositions[mouseDataLeft][0] += mouseX - oldMouseX;
                ElementPositions[mouseDataLeft][1] += mouseY - oldMouseY;
            }
            else {
                ElementPositionEdit[0] += mouseX - oldMouseX;
                ElementPositionEdit[1] += mouseY - oldMouseY;
                ElementPositions[mouseDataLeft][0] = Math.round(ElementPositionEdit[0] / backgroundGridSize) * backgroundGridSize;
                ElementPositions[mouseDataLeft][1] = Math.round(ElementPositionEdit[1] / backgroundGridSize) * backgroundGridSize;
            }
        }
        //move HoldingEnd
        if (HoldingEnd != -1) {
            FreeElements[FreeElements.length - 1][2][0] = ElementPositions[HoldingEnd][0];
        }
        if (!(mouse[1] || mouseSelectionLeft == 0)) {
            oldMouseX = mouseX;
            oldMouseY = mouseY;
        }
        if (mouseSelectionRight == 1) {
            update = true;
        }
    }
    else {
        update = true;
    }
    if (!mouse[0]) {
        clickStart = -1;
    }
    if (Übergang != -1) {
        update = true;
    }
    return update;
}
function allwaysDraw() {
    if (editType == "standartEdit") {
        //Animations
        if (setSettings["$settings.look.showAnimations"] == "true") {
            ctx.globalAlpha = 1;
            for (var x = 0; x < toDrawAnimations.length; x++) {
                var inputNum = parseInt(toDrawAnimations[x][0]);
                var pox = toDrawAnimations[x][1];
                var poy = toDrawAnimations[x][2];
                //function (inputNum: string, posx: number, posy: number) {
                if (animations[inputNum] != undefined && animationProgression.length <= inputNum) {
                    animationProgression.push(0);
                }
                if (animations[inputNum] != undefined) {
                    if (isNaN(animationProgression[inputNum])) {
                        animationProgression[inputNum] = 0;
                    }
                    renderPicture(animations[inputNum][Math.round(animationProgression[inputNum])], 30, 30, pox - 2 + posx, poy - 2 + posy, drawReal, ctx);
                }
                else {
                    renderPicture(getErrorIMG(), 30, 30, pox - 2 + posx, poy - 2 + posy, drawReal, ctx);
                }
            }
            for (var x = 0; x < animationProgression.length; x++) {
                animationProgression[x] += 0.1;
                if (animations[x] != undefined) {
                    if (animationProgression[x] >= animations[x].length - 0.5) {
                        animationProgression[x] = 0;
                    }
                }
            }
        }
        setFont("47px msyi", ctx);
        //Object sidebar
        if (mouseX < (sidebarSize + sidebarFadeIn) || sidebarFadeInTimer >= 0.05 || setSettings["$settings.look.hideElementMenu"] != "true") {
            if (sidebarFadeInTimer < 0) {
                sidebarFadeInTimer = 0;
            }
            let mul = ((sidebarFadeIn - (mouseX - sidebarSize)) / sidebarFadeIn);
            if (mul > 1) {
                mul = 1;
            }
            if (mul > sidebarFadeInTimer) {
                sidebarFadeInTimer += 0.05;
            }
            if (mul < sidebarFadeInTimer) {
                sidebarFadeInTimer -= 0.05;
            }
            ctx.globalAlpha = 0.5 * sidebarFadeInTimer;
            drawReal.rect(0, 0, sidebarSize, canvas.height, currentColor["objectSidebarBlur"], ctx);
            ctx.globalAlpha = sidebarFadeInTimer;
            if (setSettings["$settings.look.hideElementMenu"] != "true") {
                sidebarFadeInTimer = 1;
            }
            for (let i = 0; i < available.length; i++) {
                let text = available[i][0];
                textLength = measureText(text, ctx).width;
                px = 10;
                py = i * (blockheight + 10) + blockheight;
                if (setYellow.indexOf(text) != -1) {
                    drawcolor = currentColor["YellowBlock"];
                    drawcolorAccent = currentColor["YellowBlockAccent"];
                }
                else if (setPurple.indexOf(text) != -1) {
                    drawcolor = currentColor["PurpleBlock"];
                    drawcolorAccent = currentColor["PurpleBlockAccent"];
                }
                else if (setGray.indexOf(text) != -1) {
                    drawcolor = currentColor["GrayBlock"];
                    drawcolorAccent = currentColor["GrayBlockAccent"];
                }
                else {
                    drawcolor = currentColor["blueBlock"];
                    drawcolorAccent = currentColor["blueBlockAccent"];
                }
                drawReal.roundedRect(px, py, textLength, -(blockheight - 10), drawcolorAccent, 10, ctx); //body outline
                drawReal.roundedRect(px + 1, py - 1, textLength - 2, -blockheight + 12, drawcolor, 10, ctx); //body
                drawReal.text(px, py, text, currentColor["NormalText"], "left", font, ctx);
                py += 4;
                py -= posy;
                px -= posx;
                drawReal.polygon(ctx, drawcolor, [[px + 0, py + 0], [px + 5, py + 7], [px + 15, py + 7], [px + 20, py + 0]]); //connector
                drawReal.polygonOutline(ctx, drawcolorAccent, [[px + 0, py + 0], [px + 5, py + 7], [px + 15, py + 7], [px + 20, py + 0]], 1); //connector outline
            }
            ctx.globalAlpha = 1;
        }
        else {
            sidebarFadeInTimer = 0;
        }
        //Menu
        ctx.globalAlpha = 1;
        let mOpen = menuOpen;
        if (mOpen < 0) {
            mOpen = 1 + mOpen;
        }
        if (mOpen != 0) {
            if (mOpen > 1) {
                mOpen = 1;
                menuOpen = 1;
            }
            ctx.globalAlpha = 0.7 * mOpen;
            drawReal.rect(canvas.width - (menuWidth - 100 + (100 * mOpen)), 0, menuWidth + (100 * mOpen), canvas.height * mOpen, currentColor["MenuBackground"], ctx);
            let k = Object.keys(menuButtons);
            ctx.globalAlpha = mOpen;
            for (let x = 0; x < k.length; x++) {
                if (mouseX > canvas.width - 10 - menuWidth && mouseY > 90 + x * 35 - blockheight && mouseY < 90 + x * 35 + blockheight - blockheight) {
                    ctx.globalAlpha = 0.1 * mOpen;
                    drawReal.rect(canvas.width - menuWidth, 90 + x * 35 - blockheight, menuWidth, blockheight, "#ffffff", ctx);
                    ctx.globalAlpha = mOpen;
                }
                drawReal.text(canvas.width - 10, 90 + x * 35, k[x], currentColor["MenuText"], "right", font, ctx);
            }
            ctx.globalAlpha = 0.7 * mOpen;
            drawReal.text(canvas.width - 60, 40, projectName, currentColor["ProjectName"], "right", font, ctx);
            if (menuOpen > 0 && menuOpen < 1) {
                menuOpen += 0.05;
            }
            if (menuOpen < 0) {
                menuOpen -= 0.05;
            }
            if (menuOpen <= -1) {
                menuOpen = 0;
            }
            ctx.globalAlpha = 1;
        }
        let r = 30;
        let s = 30;
        for (let x = 0; x < 3; x++) {
            px = canvas.width - s - r / 2;
            py = 0 + r / 2 + (x * (s / 2));
            drawReal.roundedRect(px, py, s, 1, currentColor["MenuButtons"], 5, ctx);
        }
    }
    else if (editType == "Question") {
        for (var x = 0; x < animationProgression.length; x++) {
            animationProgression[x] += 0.1;
            if (animations[x] != undefined) {
                if (animationProgression[x] >= animations[x].length - 0.5) {
                    animationProgression[x] = 0;
                }
            }
        }
    }
    if (setSettings["$settings.look.showFPS"] == "true") {
        setFont("47px msyi", ctx);
        ctx.globalAlpha = 0.6;
        var text = msPerUpdate + " ms/Update (ups: " + fps + ") | " + msPerDraw + "ms/draw (fps:" + drawFPS + ")";
        drawReal.rect(0, 45, measureText(text, ctx).width, -45, "white", ctx);
        drawReal.text(0, 40, text, "black", "left", "47px msyi", ctx);
        ctx.globalAlpha = 1;
    }
    /*//keysDown debug
    let k = Object.keys(pressedKeys);
    let i = 0;
    for (let x = 0; x < k.length; x++) {
        if (pressedKeys[k[x]]) {
            drawReal.text(0, i * 35 + 35, k[x], currentColor["NormalText"], "left", font, ctx);
            i++
        }
    }*/
}
function LiveMoodLightUpdate(data) {
    var values = pictureString2Value(data);
    for (var x = 0; x < moodLightSizeX; x++) {
        for (var y = 0; y < moodLightSizeY; y++) {
            document.getElementById("2_y" + y + "x" + x).style.background = "#" + values[y * moodLightSizeX + x];
        }
    }
}
function checkDisplay() {
    var _a, _c, _d, _e, _f, _h, _j, _k, _l, _m, _o, _p;
    if (editType != "PictureEdit") {
        //whole pictureEdit
        if (((_a = document.getElementById("pictureEdit")) === null || _a === void 0 ? void 0 : _a.style.display) == "") {
            $("#pictureEdit").css("display", "none");
        }
    }
    else if (editType == "PictureEdit") {
        //whole pictureEdit
        if (((_c = document.getElementById("pictureEdit")) === null || _c === void 0 ? void 0 : _c.style.display) == "none") {
            $("#pictureEdit").css("display", "");
        }
        //arrows
        if (pictureEditType == 0) {
            if (((_d = document.getElementById("multiPage")) === null || _d === void 0 ? void 0 : _d.style.display) != "none") {
                $("#multiPage").css("display", "none");
                $("#LoadAnimationToMoodLight").css("display", "none");
            }
        }
        else if (((_e = document.getElementById("multiPage")) === null || _e === void 0 ? void 0 : _e.style.display) != "") {
            $("#multiPage").css("display", "");
            $("#LoadAnimationToMoodLight").css("display", "");
        }
    }
    if (editType == "Sheduler") {
        if (((_f = document.getElementById("Sheduler")) === null || _f === void 0 ? void 0 : _f.style.display) != "") {
            $("#Sheduler").css("display", "");
        }
    }
    else {
        if (((_h = document.getElementById("Sheduler")) === null || _h === void 0 ? void 0 : _h.style.display) == "") {
            $("#Sheduler").css("display", "none");
        }
    }
    if (editType == "Console") {
        if (((_j = document.getElementById("Console")) === null || _j === void 0 ? void 0 : _j.style.display) != "") {
            $("#Console").css("display", "");
        }
    }
    else {
        if (((_k = document.getElementById("Console")) === null || _k === void 0 ? void 0 : _k.style.display) == "") {
            $("#Console").css("display", "none");
        }
    }
    if (editType == "ColorPicker") {
        if (((_l = document.getElementById("ColorPicker")) === null || _l === void 0 ? void 0 : _l.style.display) != "") {
            $("#ColorPicker").css("display", "");
        }
    }
    else {
        if (((_m = document.getElementById("ColorPicker")) === null || _m === void 0 ? void 0 : _m.style.display) == "") {
            $("#ColorPicker").css("display", "none");
        }
    }
    if (editType == "Console") {
    }
    else {
    }
    //made this here, because of slow Update cycle
    if (setSettings["$settings.moodlight.live"] == "true") {
        if (((_o = document.getElementById("MoodLightDisplay")) === null || _o === void 0 ? void 0 : _o.style.display) != "") {
            $("#MoodLightDisplay").css("display", "");
        }
    }
    else {
        if (((_p = document.getElementById("MoodLightDisplay")) === null || _p === void 0 ? void 0 : _p.style.display) == "") {
            $("#MoodLightDisplay").css("display", "none");
        }
    }
}
function updateRects() {
    ToDraw = [];
    if (editType == "standartEdit") {
        toDrawAnimations = [];
        font = "47px msyi";
        //////////
        // draw //
        //////////
        //Elements
        for (let ElementLoadPos = 0; ElementLoadPos < Elements.length; ElementLoadPos++) {
            let i = 0;
            let lastDragElement = false;
            let indentation = 0;
            for (let ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
                //if dragElement in middle
                if (mouseSelectionLeft == 1) {
                    if (ElementPositions[ElementLoadPos][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementLoadPos][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                        if (ElementList == Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementLoadPos][1]) / blockheight)) {
                            if (ElementList != 0) {
                                if (mouseX > sidebarSize) {
                                    textLength = elementLenght([FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                                    ctx.globalAlpha = 0.4;
                                    ctx.shadowColor = currentColor["MoveBlockShaddow"];
                                    ctx.shadowBlur = 10;
                                    if ("$element.end" == FreeElements[mouseDataLeft][0]) {
                                        draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10) / 2, currentColor["MoveBlockShaddow"], 10, ctx); //end-body
                                    }
                                    else {
                                        draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), currentColor["MoveBlockShaddow"], 10, ctx); //body
                                    }
                                    ctx.shadowColor = "rgba(0,0,0,0)";
                                    ctx.shadowBlur = 0;
                                    ctx.globalAlpha = 1;
                                    i++;
                                    lastDragElement = true;
                                }
                            }
                        }
                    }
                }
                if ("$element.end" == Elements[ElementLoadPos][ElementList][0]) {
                    indentation--;
                }
                px = ElementPositions[ElementLoadPos][0] + (indentation * 10);
                py = ElementPositions[ElementLoadPos][1] + i * blockheight;
                textLength = elementLenghtAndDraw(Elements[ElementLoadPos][ElementList], px, py);
                let text = Elements[ElementLoadPos][ElementList][0];
                if (setYellow.indexOf(text) != -1) {
                    drawcolor = currentColor["YellowBlock"];
                    drawcolorAccent = currentColor["YellowBlockAccent"];
                }
                else if (setPurple.indexOf(text) != -1) {
                    drawcolor = currentColor["PurpleBlock"];
                    drawcolorAccent = currentColor["PurpleBlockAccent"];
                }
                else if (setGray.indexOf(text) != -1) {
                    drawcolor = currentColor["GrayBlock"];
                    drawcolorAccent = currentColor["GrayBlockAccent"];
                }
                else {
                    drawcolor = currentColor["blueBlock"];
                    drawcolorAccent = currentColor["blueBlockAccent"];
                }
                //connector
                if (ElementList != 0) {
                    pyC = (py + 4) - blockheight;
                    if (lastDragElement == true) {
                        pyC -= blockheight;
                        lastDragElement = false;
                    }
                    if ("$element.end" == Elements[ElementLoadPos][ElementList][0]) {
                        px += 10;
                    }
                    draw.polygon(ctx, drawcolorO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]); //connector
                    draw.polygonOutline(ctx, drawcolorAccentO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1); //connector outline
                    if ("$element.end" == Elements[ElementLoadPos][ElementList][0]) {
                        px -= 10;
                    }
                }
                drawcolorO = drawcolor;
                drawcolorAccentO = drawcolorAccent;
                //loop connector
                for (let x = 1; x <= indentation; x++) {
                    draw.rect(px - (x * 10) - 5, py + 10, 10, -blockheight - 9, currentColor["YellowBlockAccent"], ctx);
                    draw.rect(px - (x * 10) - 4, py + 10, 8, -blockheight - 9, currentColor["YellowBlock"], ctx);
                }
                if (["$element.loop", "$element.infiniteLoop"].includes(Elements[ElementLoadPos][ElementList][0])) {
                    indentation++;
                }
                if ("$element.end" == Elements[ElementLoadPos][ElementList][0]) {
                    x = 0;
                    var addit = 20;
                    draw.rect(px - (x * 10) - 5, py + 10 - addit, 10, (-blockheight - 9) + addit, currentColor["YellowBlockAccent"], ctx);
                    draw.rect(px - (x * 10) - 4, py + 10 - addit, 8, (-blockheight - 9) + addit, currentColor["YellowBlock"], ctx);
                }
                i++;
                //make loading easyer
                if (preloadedInCycle >= 20 && setSettings["$settings.look.asyncElementLoading"] != "false") {
                    asyncLoading = true;
                    setTimeout(updateScreen, 1, true);
                    draw.text(0 - posx, 100 - posy, "Loading Elements... (" + Object.keys(imgStore).length + ")", "black", "left", font, ctx);
                    return;
                }
            }
            pyC = (py + 4);
            draw.polygon(ctx, drawcolor, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]); //connector
            draw.polygonOutline(ctx, drawcolorAccent, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1); //connector outline
            //if dragElement at bottom
            if (mouseSelectionLeft == 1) {
                if (ElementPositions[ElementLoadPos][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementLoadPos][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                    if ((Elements[ElementLoadPos].length) == Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementLoadPos][1]) / blockheight)) {
                        if ((Elements[ElementLoadPos].length) != 0) {
                            textLength = elementLenght([FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                            ctx.globalAlpha = 0.4;
                            ctx.shadowColor = currentColor["MoveBlockShaddow"];
                            ctx.shadowBlur = 10;
                            if ("$element.end" == FreeElements[mouseDataLeft][0]) {
                                draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10) / 2, currentColor["MoveBlockShaddow"], 10, ctx); //end-body
                            }
                            else {
                                draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), currentColor["MoveBlockShaddow"], 10, ctx); //body
                            }
                            ctx.shadowColor = "rgba(0,0,0,0)";
                            ctx.shadowBlur = 0;
                            ctx.globalAlpha = 1;
                        }
                    }
                }
            }
        }
        asyncLoading = false;
        syncLoading = false;
        justfinsishedPicture = false;
        //Free Elements
        ctx.globalAlpha = 0.5;
        for (let FreeElementPos = 0; FreeElementPos < FreeElements.length; FreeElementPos++) {
            px = FreeElements[FreeElementPos][2][0];
            py = FreeElements[FreeElementPos][2][1];
            textLength = elementLenghtAndDraw([FreeElements[FreeElementPos][0], FreeElements[FreeElementPos][1]], px, py);
        }
        ;
        ctx.globalAlpha = 1;
        //EditMenu
        if (mouseSelectionRight != -1) {
            let hei = Elements[mouseDataRight[0]][mouseDataRight[1]][1].length;
            let px = ElementPositions[mouseDataRight[0]][0];
            let py = ElementPositions[mouseDataRight[0]][1] + mouseDataRight[1] * blockheight;
            draw.polygon(ctx, currentColor["EditMenu"], [[px, py + 20], [px + 20, py + 20], [px + 30, py + 5], [px + 40, py + 20], [px + 250, py + 20], [px + 250, py + (hei * blockheight) + 20], [px, py + (hei * blockheight) + 20]]); //dropdownMenu
            draw.polygonOutline(ctx, currentColor["EditMenuAccent"], [[px, py + 20], [px + 20, py + 20], [px + 30, py + 5], [px + 40, py + 20], [px + 250, py + 20], [px + 250, py + (hei * blockheight) + 20], [px, py + (hei * blockheight) + 20], [px, py + 20]], 1); //dropdownMenu
            font = "35px msyi";
            setFont(font, ctx);
            for (let x = 0; x < hei; x++) {
                if (specialBlockDropdownRender[Elements[mouseDataRight[0]][mouseDataRight[1]][0]] != undefined) {
                    if (specialBlockDropdownRender[Elements[mouseDataRight[0]][mouseDataRight[1]][0]][x] != undefined) {
                        specialBlockDropdownRender[Elements[mouseDataRight[0]][mouseDataRight[1]][0]][x](Elements[mouseDataRight[0]][mouseDataRight[1]][1][x], px, py + x * blockheight + blockheight + 10);
                    }
                    else {
                        draw.text(px, py + x * blockheight + blockheight + 10, Elements[mouseDataRight[0]][mouseDataRight[1]][1][x], currentColor["NormalText"], "left", font, ctx);
                    }
                }
                else {
                    draw.text(px, py + x * blockheight + blockheight + 10, Elements[mouseDataRight[0]][mouseDataRight[1]][1][x], currentColor["NormalText"], "left", font, ctx);
                }
                if (x == EditMenuEdeting) {
                    if (dropdownCursorBlink < 20) {
                        draw.rect(px + measureText(Elements[mouseDataRight[0]][mouseDataRight[1]][1][x], ctx).width, py + x * blockheight + blockheight + 15, 0.75, -30, currentColor["NormalText"], ctx);
                    }
                    dropdownCursorBlink++;
                    if (dropdownCursorBlink > 20 * 2) {
                        dropdownCursorBlink = 0;
                    }
                }
                if (x != hei - 1) {
                    draw.rect(px, py + x * blockheight + blockheight + 20, 250, 1, currentColor["EditMenuAccent"], ctx);
                }
            }
            font = "47px msyi";
        }
    }
    else if (editType == "Question") {
        let q1 = Object.keys(Question[1]);
        //get max width
        var mW = 0;
        for (let x = 0; x < q1.length; x++) {
            if (q1[x].startsWith("_P")) {
                if (42 > mW) {
                    mW = 42;
                }
            }
            else if (q1[x].startsWith("_p")) {
                if (42 > mW) {
                    mW = 42;
                }
            }
            else if (q1[x].startsWith("_E")) {
                var w = elementLenght(unMapElement(q1[x].substring(2)));
                if (w > mW) {
                    mW = w;
                }
            }
            else {
                if (measureText(q1[x], ctx).width > mW) {
                    mW = measureText(q1[x], ctx).width;
                }
            }
        }
        //mouseDown
        if (mouse[0] && mouseSelectionLeft == -1) {
            if ((mouseY + questionScroll) > 150 - blockheight && (mouseY + questionScroll) < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) {
                mouseSelectionLeft = 0;
                Question[1][q1[Math.ceil(((mouseY + questionScroll) / blockheight) - (150 / blockheight))]](Math.ceil(((mouseY + questionScroll) / blockheight) - (150 / blockheight)));
                setTimeout(updateRects, 1);
                //Übergang = -1
            }
            else {
                mouse[0] = false;
                mouseSelectionLeft = 0;
                if (Question[2] != undefined) {
                    if (typeof Question[2] == 'string') {
                        goTo(Question[2], 1);
                        if (Question[2] == "Settings") {
                            mouse[0] = false;
                        }
                    }
                    else if (typeof Question[2] == 'function') {
                        Question[2]();
                    }
                }
                else if (comesFrom != "Question") {
                    goTo(comesFrom, 1);
                    setTimeout(updateRects, 1);
                    mouse[0] = false;
                }
                else {
                    goTo("standartEdit", 1);
                }
                setTimeout(updateRects, 15);
            }
        }
        //mouseUp
        if (!mouse[0] && mouseSelectionLeft != -1) {
            mouseSelectionLeft = -1;
        }
        //background
        draw.image(latestCanvasPic, 0, 0);
        ctx.globalAlpha = 0.3921;
        if ((mouseY + questionScroll) > 150 - blockheight && (mouseY + questionScroll) < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) {
            draw.fill(currentColor["backgroundBlur"], ctx);
        }
        else {
            draw.fill(currentColor["questionRedBackgroundBlur"], ctx);
        }
        //cap questionScroll
        if (questionScroll < 0) {
            questionScroll = 0;
        }
        if (150 + q1.length * blockheight - window.innerHeight > 0 && questionScroll > 150 + q1.length * blockheight - window.innerHeight) {
            questionScroll = 150 + q1.length * blockheight - window.innerHeight;
        }
        else if (150 + q1.length * blockheight - window.innerHeight < 0) {
            questionScroll = 0;
        }
        //box
        ctx.globalAlpha = 1;
        draw.roundedRect(canvas.width / 2 - (mW / 2 + 5), 122 - questionScroll, mW + 10, q1.length * blockheight - 10, currentColor["questionBackground"], 30, ctx);
        //answers
        font = "47px msyi";
        for (let x = 0; x < q1.length; x++) {
            if (mouseX > canvas.width / 2 - (mW / 2 + 5) && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 && mouseY > 150 + x * blockheight - questionScroll - blockheight && mouseY < 150 + x * blockheight - questionScroll) {
                ctx.globalAlpha = 0.5;
                draw.roundedRect(canvas.width / 2 - (mW / 2 + 5), 150 + x * blockheight - questionScroll, mW + 10, -blockheight + 10, "#ff0000", 20, ctx);
                ctx.globalAlpha = 1;
            }
            if (q1[x].startsWith("_P")) {
                renderPicture(pictures[parseInt(q1[x].substring(2, 100))], 36, 36, canvas.width / 2 - 21 + 3, 150 + x * blockheight - 34 + 3 - questionScroll, draw, ctx);
            }
            else if (q1[x].startsWith("_p")) {
                renderPicture(q1[x].substring(3, 500), 36, 36, canvas.width / 2 - 21 + 3, 150 + x * blockheight - 34 + 3 - questionScroll, draw, ctx);
            }
            else if (q1[x].startsWith("_A")) {
                var inputNum = x;
                //function (inputNum: string, posx: number, posy: number) {
                if (animations[inputNum] != undefined && animationProgression.length <= inputNum) {
                    animationProgression.push(0);
                }
                if (animations[inputNum] != undefined) {
                    if (isNaN(animationProgression[inputNum])) {
                        animationProgression[inputNum] = 0;
                    }
                    renderPicture(animations[inputNum][Math.round(animationProgression[inputNum])], 36, 36, canvas.width / 2 - 21 + 3, 150 + x * blockheight - 30 + 3 - questionScroll, draw, ctx);
                }
            }
            else if (q1[x].startsWith("_E")) {
                var w = elementLenght(unMapElement(q1[x].substring(2)));
                elementLenghtAndDraw(unMapElement(q1[x].substring(2)), canvas.width / 2 - (w / 2), 150 + x * blockheight + 1 - questionScroll);
            }
            else {
                draw.text(canvas.width / 2, 150 + x * blockheight - questionScroll, q1[x], currentColor["NormalText"], "center", font, ctx);
            }
        }
        //Title
        font = "60px msyi";
        setFont(font, ctx);
        var textWidth = measureText(Question[0], ctx).width;
        draw.rect(canvas.width / 2 - textWidth / 2, 80, textWidth, -50, currentColor["QuestionTitleBackground"], ctx);
        draw.text(canvas.width / 2, 70, Question[0], currentColor["NormalText"], "center", font, ctx);
        //draw scroll image, if scroll available
        if (150 + q1.length * blockheight - window.innerHeight > 0) {
            draw.imageWH(scrollImage, canvas.width / 2 - (mW / 2 + 5) - 100, canvas.height - 100, 100, 100);
        }
    }
    else if (editType == "PictureEdit") {
        pageTeller.innerHTML = "Seite " + (page + 1) + "/" + pictureValues.length;
        drawReal.fill(currentColor["background"], ctx);
        if (mouse[0]) {
            mouseSelectionLeft == 0;
            if (mouseX < 60 * moodLightSizeX && mouseY < 60 * moodLightSizeY && mouseY > 1) {
                let x = Math.floor(mouseX / 60);
                let y = Math.floor(mouseY / 60);
                let a = document.getElementById("y" + x + "x" + y);
                if (a != null) {
                    if (!isKeyDown("alt")) {
                        //stift
                        if (pictureEditTool == 0) {
                            //pictuer changed
                            if (pictureValues[page][y * moodLightSizeY + x] != rgb2hex(colorPicker.spectrum("get")._r, colorPicker.spectrum("get")._g, colorPicker.spectrum("get")._b)) {
                                pictureValues[page][y * moodLightSizeY + x] = rgb2hex(colorPicker.spectrum("get")._r, colorPicker.spectrum("get")._g, colorPicker.spectrum("get")._b);
                                a.style.backgroundColor = colorPicker.spectrum("get");
                                //auto upload
                                var au = document.querySelector("#autoUptade");
                                if (au.checked) {
                                    send(pictureValue2String(pictureValues[page]));
                                }
                                //autosave
                                if (setSettings["$settings.general.autoSaveImage"] == "true") {
                                    if (pictureId != -1 || animationId != -1) {
                                        if (pictureEditType == 0) {
                                            pictures[pictureId] = pictureValue2String(pictureValues[0]); //pictureValues.join("");
                                        }
                                        else {
                                            var anim = [];
                                            for (var i = 0; i < pictureValues.length; i++) {
                                                anim.push(pictureValue2String(pictureValues[i]));
                                            }
                                            animations[animationId] = anim;
                                        }
                                    }
                                    else {
                                        aalert("Something went wrong: No ID!");
                                    }
                                    autoSave();
                                }
                            }
                        }
                        //füllen
                        else if (pictureEditTool == 1) {
                            pictureEditFill(x, y);
                            //auto upload
                            var au = document.querySelector("#autoUptade");
                            if (au.checked) {
                                send(pictureValue2String(pictureValues[page]));
                            }
                            //autosave
                            if (setSettings["$settings.general.autoSaveImage"] == "true") {
                                if (pictureId != -1 || animationId != -1) {
                                    if (pictureEditType == 0) {
                                        pictures[pictureId] = pictureValue2String(pictureValues[0]); //pictureValues.join("");
                                    }
                                    else {
                                        var anim = [];
                                        for (var i = 0; i < pictureValues.length; i++) {
                                            anim.push(pictureValue2String(pictureValues[i]));
                                        }
                                        animations[animationId] = anim;
                                    }
                                }
                                else {
                                    aalert("Something went wrong: No ID!");
                                }
                                autoSave();
                            }
                        }
                        //line
                        else if (pictureEditTool == 2 && mouseSelectionLeft == -1) {
                            pictureEditLineStart = [x, y];
                            mouseSelectionLeft = 1;
                        }
                    }
                    else {
                        colorPicker.spectrum("set", a.style.backgroundColor);
                        colorPicker.spectrum('show');
                    }
                }
            }
        }
        if (mouseSelectionLeft == 1 && !mouse[0]) {
            var color = rgb2hex(colorPicker.spectrum("get")._r, colorPicker.spectrum("get")._g, colorPicker.spectrum("get")._b);
            var x = mouseX / 60;
            var y = mouseY / 60;
            var x2 = pictureEditLineStart[0];
            var y2 = pictureEditLineStart[1];
            var r = Math.atan2(x - x2, y - y2);
            for (var i = 0; i < 5000; i++) {
                x2 += Math.sin(r) * 1;
                y2 += Math.cos(r) * 1;
                pictureEditSetPixel(Math.ceil(x2), Math.ceil(y2), color);
                if (Math.ceil(x2) == Math.ceil(x) && Math.ceil(y2) == Math.ceil(y)) {
                    console.log("end");
                    break;
                }
            }
            //auto upload
            var au = document.querySelector("#autoUptade");
            if (au.checked) {
                send(pictureValue2String(pictureValues[page]));
            }
            //autosave
            if (setSettings["$settings.general.autoSaveImage"] == "true") {
                if (pictureId != -1 || animationId != -1) {
                    if (pictureEditType == 0) {
                        pictures[pictureId] = pictureValue2String(pictureValues[0]); //pictureValues.join("");
                    }
                    else {
                        var anim = [];
                        for (var i = 0; i < pictureValues.length; i++) {
                            anim.push(pictureValue2String(pictureValues[i]));
                        }
                        animations[animationId] = anim;
                    }
                }
                else {
                    aalert("Something went wrong: No ID!");
                }
                autoSave();
            }
        }
        if (mouseSelectionLeft != -1 && !mouse[0]) {
            mouseSelectionLeft = -1;
        }
    }
    else if (editType == "Settings") {
        if (document.hasFocus() && isFocused == false) {
            var sK = Object.keys(settingsOnLoad);
            for (var i = 0; i < sK.length; i++) {
                settingsOnLoad[sK[i]]();
            }
        }
        draw.image(latestCanvasPic, 0, 0);
        ctx.globalAlpha = 0.3921;
        draw.fill(currentColor["backgroundBlur"], ctx);
        ctx.globalAlpha = 0.9;
        draw.rect(20, 20, canvas.width - 40, canvas.height - 40, currentColor["settingsBackgroundHighlight"], ctx);
        //exit
        var r = 30;
        var s = 30;
        for (var x = 0; x < 3; x++) {
            px = canvas.width - s - r / 2;
            py = 0 + r / 2 + (x * (s / 2));
            draw.roundedRect(px, py, s, 1, currentColor["MenuButtons"], 5, ctx);
        }
        //left mouse Click
        if (mouse[0] && mouseSelectionLeft == -1 && HoldingEnd == -1) {
            mouseSelectionLeft = 0;
            if (mouseX > canvas.width - 50 - 15 && mouseY < 50 + 15) {
                goTo("standartEdit", 1);
            }
            if (mouseX > 25 && mouseX < 200 + 25) {
                settingsSelLeft = Math.floor((mouseY - 70) / 30);
            }
            if (mouseX > 25 + 200 + 10 && mouseX < canvas.width - 45) {
                var hauptgruppe = Object.keys(settings);
                if (settings[hauptgruppe[settingsSelLeft]] != undefined) {
                    var settinggruppe = Object.keys(settings[hauptgruppe[settingsSelLeft]]);
                    var sel = settinggruppe[Math.floor((mouseY - 70) / 30)];
                    if (sel != undefined) {
                        if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "button") {
                        }
                        else if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "bool") {
                            if (setSettings[sel] == "false") {
                                setSettings[sel] = "true";
                            }
                            else {
                                setSettings[sel] = "false";
                            }
                            settings[hauptgruppe[settingsSelLeft]][sel](true);
                        }
                        else if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "str") {
                            var answer = pprompt(setSettings[sel] + " verändern zu");
                            if (answer != undefined) {
                                setSettings[sel] = answer;
                            }
                            settings[hauptgruppe[settingsSelLeft]][sel](true);
                        }
                        else if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "num") {
                            var answer = pprompt(setSettings[sel] + " verändern zu");
                            if (answer != undefined) {
                                setSettings[sel] = answer;
                            }
                            settings[hauptgruppe[settingsSelLeft]][sel](true);
                        }
                        mouse[0] = false;
                        settings[hauptgruppe[settingsSelLeft]][sel](true);
                        setStorage();
                    }
                }
            }
        }
        //left mouse letgo
        if (mouseSelectionLeft != -1 && !mouse[0]) {
            mouseSelectionLeft = -1;
        }
        font = '47px msyi';
        draw.text(canvas.width / 2, 60, "$settings.title", currentColor["NormalText"], "center", font, ctx);
        //draw left
        font = '35px msyi';
        var hauptgruppe = Object.keys(settings);
        draw.rect(23, 65, 205, canvas.height - 70 - 30 + 5, currentColor["settingsBackground"], ctx);
        for (var h = 0; h < hauptgruppe.length; h++) {
            if (h == settingsSelLeft) {
                draw.rect(25, 70 + h * 30, 200, 27, currentColor["settingsSelSelected"], ctx); //selected: c8c8c8; mouse over: d2d2d2
            }
            else if (mouseX > 25 && mouseX < 200 + 25 && mouseY > 70 + h * 30 && mouseY < 70 + h * 30 + 31) {
                draw.rect(25, 70 + h * 30, 200, 27, currentColor["settingsSelMouseOver"], ctx); //selected: c8c8c8; mouse over: d2d2d2
            }
            else {
                draw.rect(25, 70 + h * 30, 200, 27, currentColor["settingsSelStandard"], ctx); //selected: c8c8c8; mouse over: d2d2d2
            }
            draw.text(27, 93 + h * 30, hauptgruppe[h], currentColor["NormalText"], "left", font, ctx);
        }
        //draw right
        draw.rect(25 + 200 + 5, 65, canvas.width - 260, canvas.height - 70 - 30 + 5, currentColor["settingsBackground"], ctx);
        if (settings[hauptgruppe[settingsSelLeft]] != undefined) {
            var settinggruppe = Object.keys(settings[hauptgruppe[settingsSelLeft]]);
            for (s = 0; s < settinggruppe.length; s++) {
                var type = settings[hauptgruppe[settingsSelLeft]][settinggruppe[s]](false);
                if (type != "info") {
                    if (mouseX > 25 + 200 + 10 && mouseX < canvas.width - 45 && mouseY > 70 + s * 30 && mouseY < 70 + s * 30 + 31 && type != "staticBool") {
                        draw.rect(25 + 200 + 10, 70 + s * 30, canvas.width - 280, 27, currentColor["settingsSelMouseOver"], ctx); //mouse over: d2d2d2}
                    }
                    else {
                        draw.rect(25 + 200 + 10, 70 + s * 30, canvas.width - 280, 27, currentColor["settingsSelStandard"], ctx); //mouse over: d2d2d2}
                    }
                }
                draw.text(25 + 200 + 10, 93 + s * 30, settinggruppe[s], currentColor["NormalText"], "left", font, ctx);
                if (settings[hauptgruppe[settingsSelLeft]][settinggruppe[s]] != undefined && type == "bool") {
                    if (setSettings[settinggruppe[s]] == "false") {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolFalse"], ctx);
                    }
                    else if (setSettings[settinggruppe[s]] == "true") {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolTrue"], ctx);
                    }
                    else {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolUndefined"], ctx);
                    }
                }
                if (settings[hauptgruppe[settingsSelLeft]][settinggruppe[s]] != undefined && (type == "staticBool" || type == "showingBool")) {
                    if (staticElementsData[settinggruppe[s]] == false) {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolFalse"], ctx);
                    }
                    else if (staticElementsData[settinggruppe[s]] == true) {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolTrue"], ctx);
                    }
                    else if (staticElementsData[settinggruppe[s]] == undefined) {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolUndefined"], ctx);
                    }
                }
            }
        }
    }
    else if (editType == "ColorPicker") {
        draw.image(latestCanvasPic, 0, 0);
        ctx.globalAlpha = 0.3921;
        draw.fill(currentColor["backgroundBlur"], ctx);
        ctx.globalAlpha = 0.9;
    }
    else if (editType == "Sheduler") {
        draw.fill(currentColor["background"], ctx);
    }
    else if (editType == "Console") {
        draw.fill(currentColor["background"], ctx);
    }
    else if (editType == "reload") {
        location.reload();
    }
    if (!document.hasFocus()) {
        isFocused = false;
    }
    else {
        isFocused = true;
    }
    //übergang
    if (Übergang >= 1) {
        if (Übergang == 25) {
            if (transitionFunction != undefined) {
                transitionFunction();
                transitionFunction = undefined;
            }
        }
        var alpha = 0;
        if (Übergang <= 25) {
            alpha = Übergang / 25;
        }
        else {
            if (editType != ÜbergangZu) {
                editType = ÜbergangZu;
                checkDisplay();
            }
            alpha = 2 - (Übergang / 25);
        }
        hider.style.opacity = alpha * 100 + "%";
        //console.log(Übergang + ": " + ctx.globalAlpha);
        //draw.fill(colors["background"], ctx);
        ctx.globalAlpha = 1;
    }
}
let asyncLoading = false;
let syncLoading = true;
function cursorUpdate() {
    if (!document.hasFocus()) {
        return;
    }
    let normal = true;
    if (editType == "standartEdit") {
        if (isKeyDown("alt")) {
            c.style.cursor = "copy";
            normal = false;
        }
        if (mouseX > canvas.width - 50 - 15 && mouseY < 50 + 15) {
            c.style.cursor = "pointer";
            normal = false;
        }
        if (menuOpen == 1 && mouseX > canvas.width - menuWidth && mouseY > 90 - 35 && mouseY < 90 + (Object.keys(menuButtons).length - 1) * 35) {
            c.style.cursor = "pointer";
            normal = false;
        }
        if (menuOpen == 1 && mouseY < 40 && mouseX < canvas.width - 60 && mouseX > canvas.width - 60 - measureText(projectName, ctx).width) {
            c.style.cursor = "text";
            normal = false;
        }
        if (mouseSelectionRight != -1) {
            let hei = Elements[mouseDataRight[0]][mouseDataRight[1]][1].length;
            let px = posx + ElementPositions[mouseDataRight[0]][0];
            let py = posy + ElementPositions[mouseDataRight[0]][1] + mouseDataRight[1] * blockheight;
            let pxM = px + 250;
            let pyM = py + hei * blockheight + blockheight;
            if (mouseX > px && mouseX < pxM && mouseY > py && mouseY < pyM) {
                var selectedElement = Elements[mouseDataRight[0]][mouseDataRight[1]][0];
                var curPos = Math.ceil(((mouseY - 20) - (posy + ElementPositions[mouseDataRight[0]][1] + mouseDataRight[1] * blockheight + blockheight)) / blockheight);
                if (curPos >= 0) {
                    c.style.cursor = "text";
                    cursorMessage = description[selectedElement][curPos];
                }
                else {
                    cursorMessage = "";
                }
                normal = false;
            }
            else {
                cursorMessage = "";
            }
        }
        if (mouseX < sidebarSize && mouseSelectionLeft == 1 && !(FreeElements[mouseDataLeft][0] == "$element.end")) {
            c.style.cursor = "no-drop";
            normal = false;
        } //element delete symbol
        else if (mouseSelectionLeft == 1) {
            c.style.cursor = "grabbing";
            normal = false;
        } //element drag symbol
        if (mouseSelectionLeft == 2) {
            c.style.cursor = "all-scroll";
            normal = false;
        }
        if (asyncLoading || syncLoading) {
            c.style.cursor = "wait";
            normal = false;
        }
    }
    if (editType == "Question") {
        let q1 = Object.keys(Question[1]);
        //get max width
        var mW = 0;
        for (let x = 0; x < q1.length; x++) {
            if (q1[x].startsWith("_P")) {
                if (42 > mW) {
                    mW = 42;
                }
            }
            else if (q1[x].startsWith("_p")) {
                if (42 > mW) {
                    mW = 42;
                }
            }
            else {
                if (measureText(q1[x], ctx).width > mW) {
                    mW = measureText(q1[x], ctx).width;
                }
            }
        }
        if ((mouseY + questionScroll) > 150 - blockheight && (mouseY + questionScroll) < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) {
            c.style.cursor = "pointer";
            normal = false;
        }
    }
    if (editType == "Settings") {
        if (mouseX > canvas.width - 50 - 15 && mouseY < 50 + 15) {
            c.style.cursor = "pointer";
            normal = false;
        }
        //messages
        if (settings[Object.keys(settings)[settingsSelLeft]] != undefined) {
            var v = Object.keys(settings[Object.keys(settings)[settingsSelLeft]])[Math.floor((mouseY - 70) / 30)];
            if (mouseX > 25 + 200 + 10 && mouseX < canvas.width - 45 && v in settingsInfo) {
                cursorMessage = settingsInfo[v];
            }
            else {
                cursorMessage = "";
            }
        }
    }
    if (syncLoading) {
        c.style.cursor = "wait";
        normal = false;
    }
    if (currentlyUploading) {
        c.style.cursor = "progress";
        normal = false;
    }
    //else
    if (normal) {
        c.style.cursor = "default";
    }
}
setInterval(cursorUpdate, 100);
setInterval(UpdateStaticSettingsIfInSettings, 10000);
setInterval(checkDisplay, 500);
if (isNaN(parseInt(setSettings["$settings.look.maxFPS"]))) {
    setSettings["$settings.look.maxFPS"] = "60";
}
setInterval(drawScreen, 1000 / parseInt(setSettings["$settings.look.maxFPS"]));
setInterval(function () {
    if (setSettings["$settings.moodlight.live"] == "true" && setSettings["$settings.moodlight.passiveLive"] != "true") {
        send("&");
    }
}, 250);
setInterval(updateScreen, 16);
setTimeout(checkDisplay, 50);
setTimeout(updateRects, 50);
//setTimeout(updateRects, 100);
//setTimeout(updateRects, 150);
//setTimeout(updateRects, 200);
//HTML load events
var a = document.querySelector("#autoUptade");
var o = a.onload;
o();
//check first start
setTimeout(() => {
    var firstTry = getCookie("FirstTry");
    if (firstTry == "") {
        var a = {};
        for (var x of availTranslations) {
            a[x] = function (seId) {
                loadTranslation(availTranslations[seId]);
                firstTry1();
            };
        }
        Question = ["Sprache Auswählen", a, () => { }];
        goTo("Question", 1);
    }
}, 200);
function firstTry1() {
    goTo("Question", 1);
    Question = ["$question.firstTry.1", {
            "$question.firstTry.1.answer.yes": function () {
                host = sprompt("Server/Host/SRV");
                myTopic = sprompt("Topic");
                myUser = sprompt("User");
                myPass = sprompt("Pass");
                setStorage();
                reconnect();
                firstTry2();
                goTo("Question", 1);
            },
            "$question.firstTry.1.answer.no": function () {
                firstTry2();
                goTo("Question", 1);
            }
        }, () => { }];
}
function firstTry2() {
    ctx.globalAlpha = 0.8;
    drawReal.fill("#ffffff", ctx);
    ctx.globalAlpha = 1;
    Question = ["$question.firstTry.2", {
            "$question.firstTry.2.answer.ok": function () {
                firstTry3();
                goTo("Question", 1);
            }
        }, () => { }];
}
function firstTry3() {
    setCookie("FirstTry", "No", 10);
    ctx.globalAlpha = 0.8;
    drawReal.fill("#ffffff", ctx);
    ctx.globalAlpha = 1;
    Question = ["$question.firstTry.3", {
            "$question.firstTry.3.answer.yes": function () {
                goTo("standartEdit", 0);
                aalert("!!!!! Diese informationen sind noch nicht fertig !!!!!");
                aalert("Von Links kannst du elemente in das Bearbeitungs Feld Ziehen. Häfte diese hintereinander unter [Start <0>]. Die Paramenter kannst du nun von den hineingezogenen Elementen mit einem Rechtsklick auf diese verändern.");
                aalert("Wenn du Animationen/Bilder hinzufügen willst, klicken oben rechts auf den Menü Knopf. Dort kannst du unter 'Hinzufügen' Bilder und Animationen hinzufügen. Wenn du diese Wieder bearbeiten willst, kannst du auf 'Bearbeiten' klicken.");
                aalert("Zudem kannst du 'Start' hinzufügen. Dort kannst du andere Elemente hinzufügen. [Start <0>] wird beim Hochfahren des Moodlights geladen. Mit [Laden <id>] kannst du andere Starts laden.");
            },
            "$question.firstTry.3.answer.no": function () {
                goTo("standartEdit", 0);
            },
        }, () => { }];
}
let msPerDrawCach = [];
let msPerDraw = -1;
let msPerUpdateCach = [];
let msPerUpdate = -1;
let drawFPS = 0;
let fps = 0;
setInterval(function () {
    msPerDraw = 0;
    for (var c of msPerDrawCach) {
        msPerDraw += c;
    }
    msPerDraw /= msPerDrawCach.length;
    drawFPS = msPerDrawCach.length;
    msPerDrawCach = [];
    msPerUpdate = 0;
    for (var c of msPerUpdateCach) {
        msPerUpdate += c;
    }
    msPerUpdate /= msPerUpdateCach.length;
    fps = msPerUpdateCach.length;
    msPerUpdateCach = [];
}, 1000);
document.fonts.onloadingdone = () => { updateColor(); };
//# sourceMappingURL=main.js.map