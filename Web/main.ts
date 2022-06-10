/// <reference path="compiler.ts" />
/// <reference path="utilitys.ts" />

/*
 * TODO:
 *  -Output
 *  -Einstellungen
 */
const empty: string = '{"sizeX":"6","Elements":[[["Start",["0"]]]],"pictures":[],"ElementPositions":[[0,0]],"FreeElements":[],"animations":[],"projectName":"unset"}';

//utility variables
let isFocused = false

let font = "47px msyi";

let host = "";
let myTopic = "";
let myUser = "";
let myPass = "";

let mouseX: number = 500;
let mouseY: number = 500;
let mouse: { [name: number]: boolean } = {};

let pressedKeys: { [name: string]: boolean } = {};

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let colorTextOut = document.getElementById("color") as HTMLInputElement;
let colorPicker = $("#colorpicker") as any;
let colorPicker2 = $("#colorpicker2") as any;
let hider = document.getElementById("hider") as HTMLDivElement;
let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");
let ProjectLoader = document.querySelector("#projectLoader") as HTMLInputElement;
let pageTeller = document.getElementById("pageTeller") as HTMLTitleElement;

let colorSelTable = document.getElementById('colorSelTable') as HTMLCanvasElement;
let LiveMoodLight = document.getElementById('LiveMoodLight') as HTMLCanvasElement;

let latestCanvasPicStr = canvas.toDataURL("image/png");
var latestCanvasPic = new Image;
latestCanvasPic.src = latestCanvasPicStr;

let c = document.getElementById("canvas") as HTMLElement;

let sizeChange = true;

createUserEvents();

function loadProject(jsonLoad: { sizeX: number, Elements: [string, string[]][][]; pictures: string[]; ElementPositions: number[][]; FreeElements: [string, string[], [number, number]][]; animations: string[][]; projectName: string | undefined; }) {
    //get save
    var ElementsSave = Elements;
    var picturesSave = pictures;
    var ElementPositionsSave = ElementPositions;
    var FreeElementsSave = FreeElements;
    var animationsSave = animations;
    var projectNameSave = projectName;
    var sizeXSave = moodLightSizeX;

    try {
        Elements = jsonLoad.Elements;
        pictures = jsonLoad.pictures;
        ElementPositions = jsonLoad.ElementPositions;
        FreeElements = jsonLoad.FreeElements;
        animations = jsonLoad.animations;
        if (jsonLoad.sizeX == undefined) { jsonLoad.sizeX = 6; }
        moodLightSizeX = jsonLoad.sizeX;
        moodLightSizeY = jsonLoad.sizeX;
        if (jsonLoad.projectName != undefined) {
            projectName = jsonLoad.projectName;
        } else {
            projectName = sprompt("projekt name: ")
        }
    } catch {
        Elements = ElementsSave;
        pictures = picturesSave;
        ElementPositions = ElementPositionsSave;
        FreeElements = FreeElementsSave;
        animations = animationsSave;
        projectName = projectNameSave;
        moodLightSizeX = sizeXSave;
        moodLightSizeY = sizeXSave;
        aalert("load failed");
    }
}
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

    ProjectLoader.addEventListener('change', function (e) {
        var fileList = ProjectLoader.files as any;
        console.log(fileList);

        const reader = new FileReader();
        reader.readAsText(fileList[0]);
        reader.addEventListener('load', (event: any) => {
            loadProject(JSON.parse(event.target.result));
            ProjectLoader.value = '';
            setCookie("lastUsed", projectName, 0.5);
            localStorage.setItem(projectName, genProjectJson());
        });
    });


    window.onresize = resize;
    function windowfocus() {
        pressedKeys = {};
    }
    function toutchStart(e: TouchEvent) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        mouse[0] = true;
        offsetX = mouseX;
        offsetY = mouseY;
    }
    function toutchEnd(e: TouchEvent) {
        mouse[0] = false;
    }
    function mousemove(e: MouseEvent | TouchEvent) {
        mouseX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        mouseY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageY :
            (e as MouseEvent).pageY;
    }
    function mousedown(e: MouseEvent) {
        if (e.button == 1 || e.button == 2) {
            e.preventDefault();
        }
        mouse[e.button] = true;
        offsetX = mouseX;
        offsetY = mouseY;
        return true;
    }
    function mouseup(e: MouseEvent) {
        mouse[e.button] = false;
        return true;
    }
    function keyEvent(e: KeyboardEvent) {
        if (e.key == "Alt" || e.key == "Tab") { e.preventDefault(); }
        if (mouseSelectionRight == 1) {
            if (e.type == "keydown") {
                if (e.key == "Backspace") {
                    Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting].slice(0, -1);
                }
                else if (e.key.length == 1) {
                    Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] + e.key
                }
            }
        }
        else {
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
            }
        }

    }
    function resize() {
        sizeChange = true;
    }
}
function keyDown(key: string) {
    if (!(key in pressedKeys)) { return false; }
    if (pressedKeys[key] == false) { return false; }
    return true;
}

//MQTT
let latesMQTTMessage = "";
let client: Paho.MQTT.Client;
function mqttConstructor() {
    client = new Paho.MQTT.Client(host, 10833, "client" + ((new Date).getTime().toString(16) + Math.floor(1E7 * Math.random()).toString(16)));
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    try {
        client.connect({ onSuccess: onConnect, useSSL: true, onFailure: onFailure, userName: myUser, password: myPass });
    } catch (e: any) {
        settingsInfo["Verbindung"] = e.message;
        staticElementsData["Verbindung"] = false;
        console.error(e);
        settings
        //console.error("empty data!")
    }
}
function onConnect() {
    UpdateStaticSettingsIfInSettings();
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(myTopic);
}
function onFailure() {
    UpdateStaticSettingsIfInSettings();
    settingsInfo["Verbindung"] = "Failed: evtl. Passwort/Topic/Username Falsch";
    console.log("on Failure");
}

function onConnectionLost(responseObject: { errorCode: number; errorMessage: string; }) {
    if (responseObject.errorCode != 0) {
        staticElementsData["Verbindung"] = false
        console.log("onConnectionLost:" + responseObject.errorMessage + "\nreconnecting...");
        connect()
    }
}
function reconnect() {
    if (client.isConnected()) {
        client.disconnect()
        UpdateStaticSettingsIfInSettings();
    }
    staticElementsData["Verbindung"] = undefined;
    settingsInfo["Verbindung"] = "Verbinden...";
    connect();
}
function onMessageArrived(message: { payloadString: string; }) {
    //console.log("onMessageArrived:" + message.payloadString);
    var tag = document.createElement("p");
    var text = document.createTextNode(message.payloadString);
    tag.appendChild(text);

    var objDiv: HTMLDivElement = document.querySelector("#consoleOut") as HTMLDivElement;
    objDiv.appendChild(tag)
    objDiv.scrollTop = objDiv.scrollHeight;

    if (message.payloadString.substring(1, 0) == ";" && waitingForMQTTPic) {
        console.log("load");
        pictureValues[page] = pictureString2Value(message.payloadString.substring(1))
        loadPictureVal(pictureValues[page]);
        waitingForMQTTPic = false
    } else if (message.payloadString.substring(1, 0) == ";") {
        LiveMoodLightUpdate(message.payloadString.replace(";", ""));
    }
    latesMQTTMessage = message.payloadString;
}
function send(dat: string) {
    var message = new Paho.MQTT.Message(dat);
    message.destinationName = myTopic;
    client.send(message);
}
function connect() {
    mqttConstructor();
    //client.connect({ onSuccess: onConnect, useSSL: true, onFailure: onFailure, userName: myUser, password: myPass });
}
class drawApp {
    public image(image: HTMLImageElement, posx: number, posy: number) {
        ctx.drawImage(image, posx, posy)
    }
    public rect(posx: any, posy: any, width: any, height: any, color: any, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(posx, posy, width, height);
        ctx.fill();
        ctx.closePath();
    };
    public roundedRect(posx: any, posy: any, width: any, height: any, color: any, radius: number, ctx: any) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineJoin = "round";

        ctx.lineWidth = radius;

        ctx.beginPath();

        ctx.strokeRect(posx, posy, width, height);
        ctx.stroke();
        ctx.closePath();

        if (ctx.globalAlpha != 1) {
            ctx.fillRect(posx + (radius / 2), posy - (radius / 2), width - radius, height + radius);
        } else {
            ctx.fillRect(posx, posy, width, height);
        }
        ctx.fill();

        ctx.closePath();
        ctx.strokeStyle = "";
        ctx.fillStyle = "";
        ctx.lineJoin = "";
        ctx.lineWidth = 0;
    }
    public circle(posx: any, posy: any, radius: any, color: any, ctx: { fillStyle: any; beginPath: () => void; arc: (arg0: any, arg1: any, arg2: any, arg3: number, arg4: number, arg5: boolean) => void; fill: () => void; closePath: () => void; }) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(posx, posy, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    };
    public fill(color: string, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        ctx.closePath();
    };
    public text(pox: any, posy: any, Text: any, color: any, align: any, font: string, ctx: CanvasRenderingContext2D) {
        if (ctx.font != font) { ctx.font = font; }
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(Text, pox, posy);
    };
    public polygon(ctx: CanvasRenderingContext2D, color: string, pos: [number, number][]) {
        ctx.fillStyle = color;

        ctx.beginPath();

        ctx.moveTo(pos[0][0] + posx, pos[0][1] + posy)
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo(pos[i][0] + posx, pos[i][1] + posy)
        }

        ctx.fill();
        ctx.closePath();
    };
    public polygonOutline(ctx: CanvasRenderingContext2D, color: string, pos: [number, number][], width: number) {
        ctx.strokeStyle = color;

        ctx.beginPath();

        ctx.moveTo(pos[0][0] + posx, pos[0][1] + posy)
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo(pos[i][0] + posx, pos[i][1] + posy)
        }
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    };
}

let ToDraw: { rect?: any[]; image?: any[]; roundedRect?: any[]; circle?: any[]; fill?: (string | number | CanvasRenderingContext2D)[]; text?: any[]; polygon?: (string | number | CanvasRenderingContext2D | [number, number][])[]; polygonOutline?: (string | number | CanvasRenderingContext2D | [number, number][])[]; }[] = [];
class drawAdder {
    public image(image: HTMLImageElement, posx: number, posy: number) {
        ToDraw.push({ "image": [image, posx, posy, ctx.globalAlpha] });
    }
    public rect(posx: any, posy: any, width: any, height: any, color: any, ctx: CanvasRenderingContext2D) {
        ToDraw.push({ "rect": [posx, posy, width, height, color, ctx, ctx.globalAlpha] });
    };
    public roundedRect(posx: any, posy: any, width: any, height: any, color: any, radius: number, ctx: any) {
        ToDraw.push({ "roundedRect": [posx, posy, width, height, color, radius, ctx, ctx.globalAlpha] });
    }
    public circle(posx: any, posy: any, radius: any, color: any, ctx: any) {
        ToDraw.push({ "circle": [posx, posy, radius, color, ctx, ctx.globalAlpha] });
    };
    public fill(color: string, ctx: CanvasRenderingContext2D) {
        ToDraw.push({ "fill": [color, ctx, ctx.globalAlpha] });
    };
    public text(posx: any, posy: any, Text: any, color: any, align: any, font: string, ctx: CanvasRenderingContext2D) {
        ToDraw.push({ "text": [posx, posy, Text, color, align, font, ctx, ctx.globalAlpha] });
    };
    public polygon(ctx: CanvasRenderingContext2D, color: string, pos: [number, number][]) {
        ToDraw.push({ "polygon": [ctx, color, pos, ctx.globalAlpha] });
    };
    public polygonOutline(ctx: CanvasRenderingContext2D, color: string, pos: [number, number][], width: number) {
        ToDraw.push({ "polygonOutline": [ctx, color, pos, width, ctx.globalAlpha] });
    };
}

function setCookie(name: string, value: string, days: number) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name: string): string {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return "";
}

function setStorage() {
    setCookie("setSettings", JSON.stringify(setSettings), 10);
    setCookie("myTopic", myTopic, 10);
    setCookie("myPass", myPass, 10);
    setCookie("myUser", myUser, 10);
    setCookie("host", host, 10);
}
function getStorage() {
    try { setSettings = JSON.parse(getCookie("setSettings")); } catch { setCookie("setSettings", JSON.stringify(setSettings), 10); }
    try { myTopic = getCookie("myTopic"); } catch { setCookie("myTopic", myTopic, 10); }
    try { myPass = getCookie("myPass"); } catch { setCookie("myPass", myPass, 10); }
    try { myUser = getCookie("myUser"); } catch { setCookie("myUser", myUser, 10); }
    try { host = getCookie("host"); } catch { setCookie("host", host, 10); }
}

class Utilitys {
    public normalize(degrees: number, min: number, max: number) {
        var normalized = degrees;
        if (normalized > max) {
            while (normalized > max) {
                normalized -= max;
            }
        }
        if (normalized < min) {
            while (normalized < min) {
                normalized += max;
            }
        }
        return normalized;
    };
    public clamp(i: number, min: number, max: number) {
        if (i < min) {
            i = min;
        }
        if (i > max) {
            i = max;
        }
        return i;
    };
    public Random(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}
function removeItem(data: any[], index: number) {
    var tempList = data;
    data = [];

    for (var j = 0; j < tempList.length; j++) {
        if (j != index)
            data.push(tempList[j]);
    }
    return data;
}

function elementLenghtAndDraw(Element: [string, string[]], plx: number, ply: number) {
    setFont(font);
    let text = Element[0];
    if (setYellow.indexOf(text) != -1) {
        drawcolor = currentColor["YellowBlock"];
        drawcolorAccent = currentColor["YellowBlockAccent"];
    } else if (setPurple.indexOf(text) != -1) {
        drawcolor = currentColor["PurpleBlock"];
        drawcolorAccent = currentColor["PurpleBlockAccent"];
    } else {
        drawcolor = currentColor["blueBlock"];
        drawcolorAccent = currentColor["blueBlockAccent"];
    }
    let l = ctx.measureText(Element[0]).width + 10;
    //space between options: 5;
    for (let x = 0; x < Element[1].length; x++) {
        l += 5;
        let t = Element[1][x];
        if (t == "") { t = " "; }

        if (Element[0] in specialRender && x in specialRender[Element[0]]) {
            l += specialRender[Element[0]][x][0]
        }
        else {
            l += ctx.measureText(t).width
        }
        l += 5;
    }

    if ("End" == text) {
        blockheight /= 2
    }
    draw.roundedRect(plx, ply, l, -(blockheight - 10), drawcolorAccent, 10, ctx) //body outline
    if ("Start" == text) {
        draw.circle(plx + 23, ply - 22, 30 - 3, drawcolorAccent, ctx);
        draw.circle(plx + 23, ply - 22, 29 - 3, drawcolor, ctx);
    }
    draw.roundedRect(plx + 1, ply - 1, l - 2, -blockheight + 12, drawcolor, 10, ctx) //body


    if ("End" != text) {
        draw.text(plx, ply, text, currentColor["NormalText"], "left", font, ctx);
    } else {
        blockheight *= 2
    }
    l = ctx.measureText(text).width + 7;
    for (let x = 0; x < Element[1].length; x++) {
        let t = Element[1][x];
        if (t == "") { t = " "; }
        l += 5;

        if (Element[0] in specialRender && x in specialRender[Element[0]]) {
            try { specialRender[Element[0]][x][1](Element[1][x], plx + l - 5, ply - 22 - 5); } catch { }
            l += specialRender[Element[0]][x][0]
        } else {
            draw.roundedRect(plx + l + 2, ply - 5, ctx.measureText(t).width - 4, -(blockheight - 10) + 10, currentColor["blockArgBackground"], 10, ctx) //body outline
            draw.text(plx + l, ply, t, currentColor["NormalText"], "left", font, ctx);
            l += ctx.measureText(t).width;
        }
        l += 5;
    }
    return l;
}
function elementLenght(Element: [string, string[]]) {
    setFont(font);
    let text = Element[0];

    let l = ctx.measureText(Element[0]).width + 10;
    //space between options: 5;
    for (let x = 0; x < Element[1].length; x++) {
        l += 5;
        let t = Element[1][x];
        if (t == "") { t = " "; }

        if (Element[0] in specialRender && x in specialRender[Element[0]]) {
            l += specialRender[Element[0]][x][0]
        }
        else {
            l += ctx.measureText(t).width
        }
        l += 5;
    }

    return l;
}
/**
 * only use this/pprompt for prompts
 */
function sprompt(question: string, setShit?: string): string {
    var a = prompt(question, setShit);
    if (a == undefined) { a = "" }
    mouse[0] = false;
    return a;
}
/**
 * only use this/sprompt for prompts
 */
function pprompt(question: string, setShit?: string): string | undefined {
    var a: string | null | undefined = prompt(question, setShit);
    if (a == null) { a = undefined }
    mouse[0] = false;
    return a;
}
/**
 * only use this for alerts
 */
function aalert(message: string) {
    alert(message);
    mouse[0] = false;
}
function openWindow(url: string) {
    window.open(url);
    mouse[0] = false;
}


//Game Variables
let waitingForMQTTPic = false;

var comesFrom = "";
/**standartEdit, PictureEdit, Question, Settings, Action, Sheduler, Console, ColorPicker*/
var editType = "standartEdit";
let projectName = "unset"

let pictureEditKeyEvents: { [key: string]: () => void } = {
    "y": function () {
        navigator.clipboard.writeText(pictureValue2String(pictureValues[page]))
    }, "x": function () {
        if (navigator.clipboard.readText != undefined) {
            navigator.clipboard.readText().then(clipText => {
                if (clipText.includes("\n")) {
                    var d = clipText.split("\n");
                    for (var i = 0; i < d.length; i++) {
                        if (pictureValues.length == page + i) {
                            pictureValues.push();
                        } pictureValues[page + i] = pictureString2Value(d[i]);
                    }
                } else {
                    pictureValues[page] = pictureString2Value(clipText);
                }
                loadPictureVal(pictureValues[page]);
            });
        } else {
            var clipText = pprompt("please paste:");
            if (clipText != undefined) {
                if (clipText.includes("\n")) {
                    var d = clipText.split("\n");
                    for (var i = 0; i < d.length; i++) {
                        if (pictureValues.length == page + i) {
                            pictureValues.push();
                        } pictureValues[page + i] = pictureString2Value(d[i]);
                    }
                } else {
                    pictureValues[page] = pictureString2Value(clipText);
                }
                loadPictureVal(pictureValues[page]);
            }
        }
    }
};

var Question: [string, { [name: string]: (seId: number) => void }] = ["ERROR", { "ERROR": function () { console.warn("Question without defenition"); } }]
var Übergang = -1;
var ÜbergangZu = "Question";

let actionElements = [
    ["jede", "minuten", "5"],
    ["server eingang", "GET", "specificPathForMyInput"]
]

let menuOpen = 0;
let menuButtons: { [name: string]: () => void } = {
    "Speichern": saveProject,
    "Laden": function () {
        goTo("Question", 1);
        var a: { [ind: string]: (seId: number) => void; } = {}
        var lK = Object.keys(localStorage);
        for (var x = 0; x < lK.length; x++) {
            if (lK[x][0] != "!")
                a[lK[x]] = function (seId: number) {
                    var i = 0;
                    for (var x = 0; x < Object.keys(localStorage).length; x++) { if (Object.keys(localStorage)[x][0] != "!") { if (i == seId) { break; } i++; } }

                    loadProject(JSON.parse(localStorage[Object.keys(localStorage)[i]]));
                    goTo("standartEdit", 0);
                    setCookie("lastUsed", Object.keys(localStorage)[seId], 0.5);
                }
        }
        Question = ["Welches Projekt willst du laden?", a];
    },
    "Hinzufügen": function () {
        goTo("Question", 1);
        Question = ["Was willst du hinzufügen", {
            "Start": function (seId) { ElementPositions.push([Elements.length * 400, 0]); Elements.push([["Start", [String(Elements.length)]]]); goTo(comesFrom, 1); },
            "Bild": function (seId) { goTo("PictureEdit", 0); mouse[0] = false; resetPicEdit(); pictureId = pictures.length; pictures.push("000000".repeat(32)); pictureEditType = 0; },
            "Animation": function (seId) { goTo("PictureEdit", 0); mouse[0] = false; resetPicEdit(); animationId = animations.length; animations.push(["000000".repeat(32)]); pictureEditType = 1; },
        }]
    },
    "Bearbeiten": function () {
        goTo("Question", 1);
        Question = ["", {
            "Bild": function () {
                mouse[0] = false;
                goTo("Question", 1);
                var qAnsw: { [name: string]: (seId: number) => void } = {}
                for (var i = 0; i < pictures.length; i++) {
                    qAnsw["_P" + i] = function (selId) { goTo("PictureEdit", 0); mouse[0] = false; pictureId = selId; loadPicture(selId); pictureEditType = 0; }
                }
                Question = ["Was willst du bearbeiten", qAnsw];
            },
            "Animation": function () {
                mouse[0] = false;
                goTo("Question", 1);
                var qAnsw: { [name: string]: (seId: number) => void } = {}
                for (var i = 0; i < animations.length; i++) {
                    qAnsw["_A" + i] = function (selId) {
                        goTo("PictureEdit", 0);
                        mouse[0] = false;
                        animationId = selId;
                        pictureEditType = 1;
                        pictureValues = [];
                        for (var i = 0; i < animations[selId].length; i++) {
                            pictureValues[i] = pictureString2Value(animations[selId][i]);
                        } loadPictureVal(pictureValues[0]);
                    }
                }
                Question = ["Was willst du bearbeiten", qAnsw];
            },
            //"Aktionen": function () {
            //    goTo("Action", 0);
            //}
        }]

    },
    "Einstellungen": function () { goTo("Settings", 1); },
    "Senden": function () { compileProject() },
    "Neues Projekt": function () {
        var empt = JSON.parse(empty);
        empt.projectName = pprompt("Name");
        loadProject(empt)
        setCookie("lastUsed", projectName, 0.5);
    },
    "Zu Datei Speichern": downloadProject,
    "Von Datei Laden": function () { console.log("clickedLoad"); ProjectLoader.click(); },
    "": function () { },
    "Experimental:": function () { },
    "Sheduler": function () {
        goTo("Sheduler", 0)
    },
    "Console": function () {
        goTo("Console", 0)
    }
    //"actions": function () { openWindow("/action"); },
}
let menuWidth = 350


function delay(milliseconds: number) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function asyncStuff(stuff: string) {
    if (stuff == "firmware") {
        send("V");
        var i = 0;
        while (!latesMQTTMessage.startsWith(";V") && i < 20) {
            await delay(100);
            i++;
        }
        if (i >= 20) {
            aalert("ERROR: Timeout");
        } else {
            aalert(latesMQTTMessage);
        }
    }
    else if (stuff == "colorPickerOfElement") {
        //tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting]
        colorPicker2.spectrum('set', "#" + Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting])
        colorPicker2.spectrum('show');
        tempData = undefined;
        cursorMessage = "";
        console.log(tempData);
        while (tempData == undefined) {
            await delay(100);
        }
        Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = tempData;
        updateRects();
        await delay(100);
        updateRects();
    }
}

/**type: bool, staticBool, showingBool, str, num, button, info */
let settings: { [hauptgruppe: string]: { [einstellung: string]: (callType/* false: lookup, true: click*/: boolean) => string /*<- type*/ } } = {
    "Allgemein": {
        "Automatisch speichert": function (callType) { if (!callType) { return "bool"; } else { return ""; } },
        "Bestimmtes Projekt löschen": function (callType) {
            if (!callType) { return "button"; } else {
                goTo("Question", 1);
                var a: { [ind: string]: (seId: number) => void; } = {}
                var lK = Object.keys(localStorage);
                for (var x = 0; x < lK.length; x++) {
                    if (lK[x][0] != "!") {
                        a[lK[x]] = function (seId: number) {
                            var i = 0;
                            for (var x = 0; x < Object.keys(localStorage).length; x++) { if (Object.keys(localStorage)[x][0] != "!") { if (i == seId) { break; } i++; } }
                            console.log("rem: " + Object.keys(localStorage)[i]); goTo("Settings", 1);
                            localStorage.removeItem(Object.keys(localStorage)[i]);
                        }
                    }
                }
                Question = ["Welches Projekt willst du löschen?", a];

                return "";
            }
        },
        "Promt als eingabe": function (callType) { if (!callType) { return "bool"; } else { return ""; } },
        "Farben Informationen": function (callType) {
            if (!callType) { return "button"; } else {
                aalert("Bei Farben Wird eine Zufällige Farbe mit 'R' und die Selbe Farbe, welche vorher benutzt wurde mit 'V' gekenzeichnet. Wenn Zwei Farben ausgewählt werden und mindestens eine Random ist, sind beide Farben Random. Das gleiche auch mit dem Vorherigen!");
                return "";
            }
        },
    },
    "MQTT": {
        "Verbindung": function (callType) {
            if (!callType) { return "showingBool"; } else {
                if (client.isConnected()) {
                    client.disconnect();
                    UpdateStaticSettingsIfInSettings();
                } else {
                    settingsInfo["Verbindung"] = "Verbinden...";
                    staticElementsData["Verbindung"] = undefined;
                    connect();
                } return "";
            }
        },
        "Daten ändern": function (callType) {
            if (!callType) { return "button"; } else {
                myTopic = sprompt("Topic");
                myUser = sprompt("User");
                myPass = sprompt("Pass");
                setStorage();
                reconnect();
                return "";
            }
        },
        "Daten löschen": function (callType) { if (!callType) { return "button"; } else { myTopic = ""; myUser = ""; myPass = ""; if (client.isConnected()) { client.disconnect() }; return ""; } },
        "Daten einsehen": function (callType) { if (!callType) { return "button"; } else { aalert("Topic: " + myTopic + " | User: " + myUser + " | Password: " + myPass); return ""; } },
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
        "Projekt namen anzeigen bei senden": function (callType) { if (!callType) { return "bool"; } else { return ""; } },
        "Upload Delay": function (callType) { if (!callType) { return "num"; } else { return ""; } },
        "Host Verändern": function (callType) {
            if (!callType) { return "button"; } else {
                host = sprompt("Host (" + host + ")");
                setStorage();
                reconnect();
                return "";
            }
        },
    },
    "Aussehen": {
        "Animationen Anzeigen": function (callType) { if (!callType) { return "bool"; } else { return ""; } },
        "Bilder Anzeigen": function (callType) { if (!callType) { return "bool"; } else { return ""; } },
        "  ": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        "Farben:": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        "Darkmode": function (callType) { if (!callType) { return "bool"; } else { settingsInfo["Eigenens design"] = "BETA!"; if (setSettings["Darkmode"] == "true") { currentColor = colors["dark"]; } else { currentColor = colors["light"]; } return ""; } },
        "": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        "Eigenens design": function (callType) {
            if (!callType) { return "button"; } else {
                var l = localStorage.getItem("!designs");
                if (l != undefined) { var d: { [name: string]: string } = JSON.parse(l); } else { aalert("no custom design"); return ""; } //set JSON parsed var d
                goTo("Question", 1);
                var a: { [n: string]: (seId: number) => void } = {};
                var dK = Object.keys(d);
                for (var x = 0; x < dK.length; x++) {
                    var v = dK[x]
                    setSettings["Darkmode"] = "undefined"
                    a[v] = function (seId) {
                        var l = localStorage.getItem("!designs");
                        if (l != undefined) {
                            var d: { [n: string]: any } = JSON.parse(l);
                            var dK: string[] = Object.keys(d);
                            settingsInfo["Eigenens design"] = dK[seId]
                            currentColor = d[dK[seId]];
                        }
                        goTo("Settings", 1);
                    }
                }

                Question = ["", a]
                return "";
            }
        },
        "Design löschen": function (callType) {
            if (!callType) { return "button"; } else {
                console.log("del");
                goTo("Question", 1);
                var a: { [ind: string]: (seId: number) => void; } = {}
                var l = localStorage.getItem("!designs")
                if (l == undefined) { return ""; }
                var d = JSON.parse(l);

                var lK = Object.keys(d);
                for (var x = 0; x < lK.length; x++) {
                    a[lK[x]] = function (seId: number) {
                        var l = localStorage.getItem("!designs")
                        if (l == undefined) { return; }
                        var d = JSON.parse(l);
                        delete d[Object.keys(d)[seId]];

                        localStorage.setItem("!designs", JSON.stringify(d));
                        console.log("rem: " + Object.keys(localStorage)[seId]);
                        goTo("Settings", 1, false);
                    }
                }
                Question = ["Welches design willst du löschen?", a];

                return "";
            }
        },
        //"Design Durchstöbern": function (callType) {
        //    if (!callType) { return "button"; } else {
        //        window.open("/Designs/");
        //        return "";
        //    }
        //},
        //" ": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        //"Dev:": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        "Design JSON Hinzufügen": function (callType) {
            if (!callType) { return "button"; } else {
                var n = sprompt("name")/* + "_userId_userName"*/;
                var j = sprompt("json");
                var l = localStorage.getItem("!designs");
                if (l != undefined) {
                    var d: { [name: string]: string } = JSON.parse(l);
                } else {
                    var d: { [name: string]: string } = {};
                } //set JSON parsed var d

                //ask override
                if (d[n] != undefined) {
                    if (window.confirm("override") == undefined) {
                        aalert("canceled")
                        return "";
                    }
                }

                d[n] = JSON.parse(j);
                localStorage.setItem("!designs", JSON.stringify(d));
                settingsInfo["Eigenens design"] = n;
                currentColor = JSON.parse(j);
                return "";
            }
        },
        "Eigenens design erstellen": function (callType) {
            if (!callType) {
                return "button";
            } else {
                openWindow("/colorMaker/");
                return "";
            }
        },

        //"test": function (callType) { if (!callType) { return "str"; } else { return ""; } },
    },
    "MoodLight": {
        "Firmware": function (callType) {
            if (!callType) {
                return "button";
            } else {
                asyncStuff("firmware");
                return "";
            }
        },
        "MoodLight Größe": function (callType) {
            if (!callType) {
                return "button";
            } else {
                var p = prompt("Welche größe hat dein Moodlight (6/8)")
                if (p != undefined) {
                    var r = parseInt(p);
                    moodLightSizeX = r;
                    moodLightSizeY = r;
                    UpdateSizeMoodlightSize();
                }
                return "";
            }
        },
        "Live MoodLight": function (callType) {
            if (!callType) {
                return "bool";
            } else {
                return "";
            }
        },
    },
    "Über":{
        "Einfaches Code Bearbeitungsprogramm für HOTTIs MoodLight": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        "": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        " ": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        "  ": function (callType) { if (!callType) { return "info"; } else { return ""; } },
        "©Florian Lohner": function (callType) { if (!callType) { return "info"; } else { return ""; } },
    }
}
let settingsOnLoad: any = {
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
    "Verbindung": function () {
        staticElementsData["Verbindung"] = client.isConnected();
        if (client.isConnected()) {
            settingsInfo["Verbindung"] = client.host;
        } else if (settingsInfo["Verbindung"] != undefined && !settingsInfo["Verbindung"].startsWith("Failed")) {
            settingsInfo["Verbindung"] = "";
        } else if (settingsInfo["Verbindung"] == undefined) {
            settingsInfo["Verbindung"] = "";
        }
    },
}
let staticElementsData: any = { "Anmelde Status": undefined, "Verbindung": undefined };
let settingsInfo: { [einstellung: string]: string } = { "Live MoodLight": "Stetiges Abfragen der MoodLight LEDs", "Darkmode": "größtenteils nur invertiert!", "Eigenens design": "BETA! überschreibt 'Darkmode'!", "Eigenens design erstellen": "BETA!", "Design Hinzufügen": "BETA! Designs können dieses Programm zerstören!", "Design löschen": "BETA!", "Animationen Anzeigen": "Sehr Performance intensiv" }
let setSettings: { [einstellung: string]: string } = { "Live MoodLight": "false", "Automatisch speichert": "true", "Darkmode": "false", "Promt als eingabe": "false", "Projekt namen anzeigen bei senden": "false", "Animationen Anzeigen": "true", "Bilder Anzeigen": "true", "Upload Delay": "0" };
let settingsSelLeft = 0;
function UpdateStaticSettingsIfInSettings() {
    if (editType == "Settings") {
        var sK = Object.keys(settingsOnLoad);
        for (var i = 0; i < sK.length; i++) {
            settingsOnLoad[sK[i]]();
        }
    }
}


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
let pictureValues: string[][] = []
/**0=Bild,1=Animation */
let pictureEditType = 0;
let page = 0;
resetPicEdit();

let sidebarSize = 250;
let sidebarFadeIn = 100;
let sidebarFadeInTimer = 0;

let textLength = 0;

let mouseSelectionLeft: number = -1;
let mouseDataLeft: number = -1;
let HoldingEnd = -1;

let mouseSelectionRight: number = -1;
let mouseDataRight = [-1, -1];
let EditMenuEdeting = -1;

let draw = new drawAdder();
let drawReal = new drawApp();
let util = new Utilitys();

const errorImg: { [stuff: string]: string } = { "MAX": "ff00ff".repeat(100 * 100), "6": "ff00ffff00ffff00ff000000000000000000000000000000000000ff00ffff00ffff00ffff00ffff00ffff00ff000000000000000000ffffffffffffffffff00ff0000ff0000ff0000ff0000ff0000ff00ffffffffffffffffffffffffffffffffffff00ff0000ff0000ff00", "8": "ff00ffff00ffff00ffff00ff000000000000000000000000000000000000000000000000ff00ffff00ffff00ffff00ffff00ffff00ffff00ffff00ff000000000000000000000000000000000000000000000000ff00ffff00ffff00ffff00ff00ff0000ff0000ff0000ff00ffffffffffffffffffffffffffffffffffffffffffffffff00ff0000ff0000ff0000ff0000ff0000ff0000ff0000ff00ffffffffffffffffffffffffffffffffffffffffffffffff00ff0000ff0000ff0000ff00" };
const available: [string, string[]][] = [
    ["Bild anzeigen", ["0", "0"]],
    ["Animationen", ["0", "0", "10"]],
    ["Wait", ["0.25"]],
    ["Text", ["Text", "10", "ffffff", "000000"]],
    ["Uhrzeit", ["10", "ffffff", "000000"]],
    ["Füllen", ["000000"]],
    ["Loop", ["2"]],
    ["Unendlich", []],
    ["Custom", [""]],
    ["Bewegen", ["verschieben links", "000000"]],
    ["Farben", ["ffffff", "000000"]],
    ["Laden", ["0"]],
    ["Pixel", ["0", "ff0000"]]
];
const description = {
    "Wait": ["Sekunden"],
    "Laden": ["Nummer"],
    "Text": ["Text", "Geschwindigkeit", "Vordergrund Farbe", "Hintergrund Farbe"],
    "Uhrzeit": ["Geschwindigkeit", "Vordergrund Farbe", "Hintergrund Farbe"],
    "Bild anzeigen": ["Bild", "Übergangszeit"],
    "Animationen": ["Animation", "Übergangszeit", "Wartezeit (Sekunden X 100)"],
    "Füllen": ["Farbe"],
    "Loop": ["Wiederholungen"],
    "Custom": ["Code"],
    "Farben": ["Vordergrund", "Hintergrund"],
    "Bewegen": ["Richtung", "Hintergrund"],
    "Pixel": ["Pixel Position (R für zufällige Position)", "Farbe"],
};
const joggAvailLookup: { [key: string]: number } = { "pixel verschieben nach vorne": 0, "pixel verschieben nach hinten": 1, "verschieben links": 9, "verschieben rechts": 7, "verschieben oben": 6, "verschieben unten": 8, "drehen links": 5, "drehen rechts": 3, "drehen oben": 2, "drehen unten": 4 }
const joggAvail = Object.keys(joggAvailLookup);

const notDragable = ["Start"];
const dropdownMenuButtons = {
    "Bild anzeigen": {
        "Bearbeiten": function () {
            console.log("Bearbeiten");
        },
        "Anzeigen": function () {
            console.log("Anzeigen");
        }
    }, "Animationen": {
        "Bearbeiten": function () {
            console.log("Bearbeiten");
        }
    }
}//TODO
const specialRender: { [key: string]: { [key2: number]: [number, (inputNum: string, posx: number, posy: number) => void] } } = {
    "Bild anzeigen": {
        0: [24, function (inputNum: string, posx: number, posy: number) {
            if (setSettings["Bilder Anzeigen"] == "true") {
                renderPicture(pictures[parseInt(inputNum)], 30, 30, posx - 2, posy - 2, draw);
            }
        }]
    },
    "Animationen": {
        0: [24, function (inputNum: string, posx: number, posy: number) {
            toDrawAnimations.push([inputNum, posx, posy]);
        }]
    },
    "Text": {
        2: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }],
        3: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }]
    },
    "Uhrzeit": {
        1: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }],
        2: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }]
    },
    "Farben": {
        0: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }],
        1: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }]
    },
    "Füllen": {
        0: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }]
    },
    "Pixel": {
        1: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }]
    },
    "Bewegen": {
        1: [24, function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 2, posy - 2, 30, 30, "#" + inputNum, ctx);
        }]
    }
};
const specialBlockEditClick: { [key: string]: { [key2: number]: () => void } } = {
    "Bild anzeigen": {
        0: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting]
            var qAnsw: { [name: string]: (seId: number) => void } = {}
            for (var i = 0; i < pictures.length; i++) {
                qAnsw["_P" + i] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = "" + selId;
                    goTo("standartEdit", 1);
                }
            }
            mouse[0] = false;
            Question = ["welches Bild?", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        }
    },
    "Animationen": {
        0: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting]
            var qAnsw: { [name: string]: (seId: number) => void } = {}
            for (var i = 0; i < animations.length; i++) {
                qAnsw["_A" + i] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = "" + selId;
                    goTo("standartEdit", 1);
                }
            }
            mouse[0] = false;
            Question = ["Welche Art von Bewegung?", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        }
    },
    "Text": {
        2: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        },
        3: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        }
    },
    "Uhrzeit": {
        1: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        },
        2: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        }
    },
    "Farben": {
        0: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        },
        1: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        }
    },
    "Füllen": {
        0: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        }
    },
    "Pixel": {
        1: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        }
    },
    "Bewegen": {
        0: function () {
            tempData = [mouseDataRight[0], mouseDataRight[1], EditMenuEdeting]
            var qAnsw: { [name: string]: (seId: number) => void } = {}
            for (var i = 0; i < joggAvail.length; i++) {
                qAnsw[joggAvail[i]] = function (selId) {
                    Elements[tempData[0]][tempData[1]][1][tempData[2]] = joggAvail[selId];
                    goTo("standartEdit", 1);
                }
            }
            mouse[0] = false;
            Question = ["welche Bewegung?", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        },
        1: function () {
            goTo("ColorPicker", 1);
            asyncStuff("colorPickerOfElement")
        }
    }
};
const specialBlockDropdownRender: { [key: string]: { [key2: number]: (inputNum: string, posx: number, posy: number) => void } } = {
    "Animationen": {
        0: function (inputNum: string, posx: number, posy: number) {
            toDrawAnimations.push([inputNum, posx + 6, posy - 24 + 2]);
        }
    },
    "Bild anzeigen": {
        0: function (inputNum: string, posx: number, posy: number) {
            if (setSettings["Bilder Anzeigen"] == "true") {
                renderPicture(pictures[parseInt(inputNum)], 30, 30, posx - 2 + 6, posy - 2 - 22, draw);
            }
        }
    },
    "Füllen": {
        0: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        }
    },
    "Pixel": {
        1: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        }
    },
    "Bewegen": {
        1: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        }
    },
    "Text": {
        2: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        },
        3: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        }
    },
    "Uhrzeit": {
        1: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        },
        2: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        }
    },
    "Farben": {
        0: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        },
        1: function (inputNum: string, posx: number, posy: number) {
            drawColerRect(posx + 4, posy - 24, 30, 30, "#" + inputNum, ctx);
        }
    }
}
function drawColerRect(posx: number, posy: number, sizeX: number, sizeY: number, colorStr: string, ctx: any) {
    if (colorStr == "#R") {
        draw.roundedRect(posx + 5, posy + 5, 25 - 5 * 2, 30 - 5 * 2, "#ffffff", 15, ctx);
        draw.text(posx, posy + 28, "R", "#ff0000", "left", font, ctx);
    } else if (colorStr == "#V") {
        draw.roundedRect(posx + 5, posy + 5, 25 - 5 * 2, 30 - 5 * 2, "#ffffff", 15, ctx);
        draw.text(posx, posy + 28, "V", "#ff0000", "left", font, ctx);
    } else {
        draw.rect(posx, posy, sizeX, sizeY, colorStr, ctx);
    }
}

let tempData: any;

let colors = { "light": { "background": "#fcfcfc", "backgroundPoints": "#646464", "blockArgBackground": "#ffffff", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#b0b0b0", "EditMenu": "#d0f7e9", "EditMenuAccent": "#7bc9ac", "NormalText": "#000000", "MenuButtons": "#000000", "MenuBackground": "#000000", "MenuText": "#ffffff", "settingsBoolTrue": "#00ff00", "settingsBoolFalse": "#ff0000", "settingsSelMouseOver": "#d2d2d2", "settingsSelStandard": "#dcdcdc", "settingsSelSelected": "#c8c8c8", "backgroundBlur": "#000000", "settingsBackground": "#ffffff", "settingsBackgroundHighlight": "#f0f0f0", "questionRedBackgroundBlur": "#960000", "questionBackground": "#aaaaaa", "objectSidebarBlur": "#c0c0c0", "ProjectName": "#4287f5" }, "dark": { "background": "#030303", "backgroundPoints": "#9b9b9b", "blockArgBackground": "#000000", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#4f4f4f", "EditMenu": "#2f0816", "EditMenuAccent": "#843653", "NormalText": "#ffffff", "MenuButtons": "#ffffff", "MenuBackground": "#ffffff", "MenuText": "#000000", "settingsBoolTrue": "#00ff00", "settingsBoolFalse": "#ff0000", "settingsSelMouseOver": "#2d2d2d", "settingsSelStandard": "#232323", "settingsSelSelected": "#373737", "backgroundBlur": "#ffffff", "settingsBackground": "#000000", "settingsBackgroundHighlight": "#0f0f0f", "questionRedBackgroundBlur": "#69ffff", "questionBackground": "#555555", "objectSidebarBlur": "#3f3f3f", "ProjectName": "#4287f5" } };
let currentColor = { "background": "", "backgroundPoints": "", "blueBlock": "", "blockArgBackground": "", "blueBlockAccent": "", "YellowBlock": "", "YellowBlockAccent": "", "PurpleBlock": "", "PurpleBlockAccent": "", "MoveBlockShaddow": "", "EditMenu": "", "EditMenuAccent": "", "NormalText": "", "MenuButtons": "", "MenuBackground": "", "MenuText": "", "settingsBoolTrue": "", "settingsBoolFalse": "", "settingsSelMouseOver": "", "settingsSelStandard": "", "settingsSelSelected": "", "backgroundBlur": "", "settingsBackground": "", "settingsBackgroundHighlight": "", "questionRedBackgroundBlur": "", "questionBackground": "", "objectSidebarBlur": "", "ProjectName": "", };
let setYellow = ["Loop", "Unendlich", "Start", "End"];
let setPurple = ["Bild anzeigen", "Animationen", "Laden", "Farben", "Pixel"];

let pictures: string[] = []
let animations: string[][] = [];
let animationProgression: number[] = [];
let toDrawAnimations: [string, number, number][] = [];
let Elements: [string, string[]][][] = [[["Start", ["0"]]]];
let ElementPositions = [[0, 0]];
let FreeElements: [string, string[], [number, number]][] = [];
let drawcolor = "";
let drawcolorAccent = "";
let drawcolorO = "";
let drawcolorAccentO = "";

let backgroundPointSize = 50;

let cursorMessage = "";

let offsetX = 0;
let offsetY = 0;

let posx = 300;
let posy = 100;

let px: number = 0;
let py: number = 0;
let pyC: number = 0;

let maxOutsideBounds = 500

let blockheight = 38;

//end of variables
getStorage();
setStorage();

mqttConstructor();


if (setSettings["Darkmode"] == "true") {
    currentColor = colors["dark"]
} else {
    currentColor = colors["light"]
}
let moodLightSizeX = 6;
let moodLightSizeY = 6;

var la = getCookie("lastUsed");
if (la != "" && localStorage[la] != undefined) {
    loadProject(JSON.parse(localStorage[la]));
}

function UpdateSizeMoodlightSize() {
    //gen color selection Table
    colorSelTable.innerHTML = "";
    LiveMoodLight.innerHTML = "";
    for (var x = 0; x < moodLightSizeY; x++) {
        var i = '<tr>';
        var i2 = ''
        for (var y = 0; y < moodLightSizeX; y++) {
            i += '<th style="background:white" class="ColorSelContainer"><div class="ColorSelButton" style="background:black" id="y' + y + "x" + x + '"></div></th>';
            i2 += '<div class="LiveDisplay" style="background:black" id="2_y' + x + "x" + y + '"></div>'
        }
        i2 += '<div class="break"></div>'
        colorSelTable.innerHTML += i + "</tr>";
        LiveMoodLight.innerHTML += i2;
    }
}
UpdateSizeMoodlightSize();


function setFont(font: string) {
    if (ctx.font != font) { ctx.font = font; }
}

function loadAnim() {
    var imgDat = "3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3fffd4ecfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3fffd4efffd4ecfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e8fffd4e3d85c6#3d85c6fffd4e9fc5e8fffd4e3d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e8fffd4e3d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4ea72828ff0000ff0000a72828cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3fffd4efffd4ecfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000fffd4ecfe2f3ff0000a72828a72828ff0000fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c6fffd4e9fc5e83d85c63d85c6#3d85c63d85c6fffd4e9fc5e8fffd4e3d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3fffd4ea72828ff0000ff0000a72828cfe2f3fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c6fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c63d85c69fc5e89fc5e83d85c6fffd4e#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3fffd4efffd4ecfe2f3cfe2f3fffd4e3d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3fffd4ecfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c6fffd4e9fc5e8fffd4e3d85c6#3d85c6fffd4e9fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#fffd4e3d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f3a72828ff0000ff0000a72828cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3fffd4ecfe2f3cfe2f3cfe2f3fffd4eff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4ecfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3a72828ff0000ff0000a72828fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828fffd4ecfe2f3a72828ff0000ff0000a72828cfe2f3fffd4ecfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c63d85c6#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3a72828ff0000ff0000a72828cfe2f3fffd4eff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f33d85c63d85c69fc5e89fc5e83d85c6fffd4e#3d85c63d85c69fc5e89fc5e83d85c63d85c6cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3ff0000a72828a72828ff0000cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3cfe2f3fffd4e3d85c63d85c69fc5e89fc5e83d85c63d85c6".split("#")
    pictureValues = [];
    for (var i = 0; i < imgDat.length; i++) { pictureValues.push(pictureString2Value(imgDat[i])) }
}
function renderPicture(picString: string, sizeX: number, sizeY: number, posx: number, posy: number, drawer: any) {
    posx = Math.floor(posx);
    posy = Math.floor(posy);

    var dat = pictureString2Value(picString);
    for (var i = 0; i < moodLightSizeY; i++) {
        for (var ii = 0; ii < moodLightSizeX; ii++) {
            drawer.rect(posx + i * (sizeX / moodLightSizeY), posy + ii * (sizeY / moodLightSizeX), sizeX / moodLightSizeY, sizeY / moodLightSizeX, "#" + dat[ii * moodLightSizeY + i], ctx);
        }
    }

}

function pictureString2Value(input: string): string[] {
    try {
        var out: string[] = [];
        for (var i = 0; i < moodLightSizeY; i++) {
            if (i % 2 == 0) {
                for (var ii = 0; ii < moodLightSizeX; ii++) {
                    var s = i * moodLightSizeY + ii
                    out.push(input.substring(s * 6, s * 6 + 6));
                }
            } else {
                for (var ii = moodLightSizeX - 1; ii >= 0; ii--) {
                    var s = i * moodLightSizeY + ii
                    out.push(input.substring(s * 6, s * 6 + 6));
                }
            }
        }
    } catch {
        out = pictureString2Value(getErrorIMG());
    }
    return out;
}

function pictureValue2String(input: string[]): string {
    var out: string = "";
    for (var i = 0; i < moodLightSizeY; i++) {
        if (i % 2 == 0) {
            for (var ii = 0; ii < moodLightSizeX; ii++) {
                if (input[i * moodLightSizeY + ii] == "") {
                    input[i * moodLightSizeY + ii] = "000000";
                }
                out = out + input[i * moodLightSizeY + ii]
            }
        } else {
            for (var ii = moodLightSizeX - 1; ii >= 0; ii--) {
                if (input[i * moodLightSizeY + ii] == "") {
                    input[i * moodLightSizeY + ii] = "000000";
                }
                out = out + input[i * moodLightSizeY + ii]
            }
        }
    }
    return out;
}

function finishPicture() {
    if (pictureId != -1 || animationId != -1) {
        if (pictureEditType == 0) {
            pictures[pictureId] = pictureValue2String(pictureValues[0]);//pictureValues.join("");
        } else {
            var anim = []
            for (var i = 0; i < pictureValues.length; i++) {
                anim.push(pictureValue2String(pictureValues[i]));
            }
            animations[animationId] = anim;
        }
        animationId = -1;
        pictureId = -1;

        //return to main edit
        goTo("standartEdit", 0)
    } else {
        aalert("Something went wrong: No ID!")
    }
    autoSave();
}

function genProjectJson(): string {
    return JSON.stringify({ "sizeX": moodLightSizeX, "Elements": Elements, "pictures": pictures, "ElementPositions": ElementPositions, "FreeElements": FreeElements, "animations": animations, "projectName": projectName });
}
function downloadProject() {
    var filename = projectName
    if (filename == "") { filename = "Unnamed"; }
    filename = filename + ".moproj";
    download(genProjectJson(), "text", filename);
}
function saveProject() {
    localStorage.setItem(projectName, genProjectJson());
}

function getErrorIMG(): string {
    if (errorImg[moodLightSizeX] == undefined) {
        return errorImg["MAX"]
    }
    return errorImg[moodLightSizeX]
}

function autoSave() {
    if (setSettings["Automatisch speichert"] == "true") {
        saveProject();
    }
}

/**
* type: 0=fadein+fadeout; 1=cut
* standartEdit, PictureEdit, Question, Settings, Actions, Sheduler, Console
*/
function goTo(übergangTo: string, type: number, settingsSelLef?: boolean) {
    latestCanvasPicStr = canvas.toDataURL("image/png");
    latestCanvasPic.src = latestCanvasPicStr;
    comesFrom = editType;
    if (type == 0) {
        Übergang = 1;
        ÜbergangZu = übergangTo;
    } else if (type == 1) {
        editType = übergangTo;
    }

    checkDisplay();

    if (übergangTo == "PictureEdit") {
        page = 0;
    }
    if (übergangTo == "Settings") {
        if (settingsSelLef) { settingsSelLeft = 0; }
        var sK = Object.keys(settingsOnLoad);
        for (var i = 0; i < sK.length; i++) {
            settingsOnLoad[sK[i]]();
        }
    }

}

function hexstr(number: number) {
    var chars = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
    var low = number & 0xf;
    var high = (number >> 4) & 0xf;
    return "" + chars[high] + chars[low];
}

function rgb2hex(r: number, g: number, b: number) {
    return hexstr(Math.round(r)) + hexstr(Math.round(g)) + hexstr(Math.round(b));
}

function resetPicEdit() {
    page = 0;
    var elem = document.getElementsByClassName("ColorSelButton")
    pictureValues = [[]]
    for (var x = 0; x < elem.length; x++) {
        pictureValues[0].push("000000");
        var e = elem[x] as any;
        e.style.background = "black";
    }
}

function loadPicture(id: number) {
    page = 0;
    var dat = pictureString2Value(pictures[id])
    pictureValues[0] = dat;
    for (var x = 0; x < moodLightSizeX; x++) {
        for (var y = 0; y < moodLightSizeY; y++) {
            var d = document.getElementById("y" + y + "x" + x) as HTMLDivElement;
            d.style.background = "#" + dat[x * moodLightSizeY + y];
        }
    }
}
function loadPictureVal(dat: string[]) {
    pictureValues[page] = dat;
    for (var x = 0; x < moodLightSizeX; x++) {
        for (var y = 0; y < moodLightSizeY; y++) {
            var d = document.getElementById("y" + y + "x" + x) as HTMLDivElement;
            d.style.background = "#" + dat[x * moodLightSizeY + y];
        }
    }
}

function download(content: BlobPart, mimeType: string, filename: string) {
    const a = document.createElement('a')
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    a.setAttribute('href', url)
    a.setAttribute('download', filename)
    a.click()
}


function drawScreen() {
    var px = 0;
    if (editType == "standartEdit") { px = posx; }
    var py = 0;
    if (editType == "standartEdit") { py = posy; }

    ToDraw.forEach(value => {
        var key = Object.keys(value)[0]

        if (key == "rect") {
            var i = value[key] as any;
            ctx.globalAlpha = i[i.length - 1]
            drawReal.rect(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5]);
        }
        else if (key == "roundedRect") {
            var i = value[key] as any;
            ctx.globalAlpha = i[i.length - 1]
            drawReal.roundedRect(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5], i[6]);
        }
        else if (key == "circle") {
            var i = value[key] as any;
            ctx.globalAlpha = i[i.length - 1]
            drawReal.circle(i[0] + px, i[1] + py, i[2], i[3], i[4]);
        }
        else if (key == "fill") {
            var i = value[key] as any;
            ctx.globalAlpha = i[i.length - 1]
            drawReal.fill(i[0], i[1]);
        }
        else if (key == "text") {
            var i = value[key] as any;
            ctx.globalAlpha = i[i.length - 1]
            drawReal.text(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5], i[6]);
        }
        else if (key == "polygon") {
            var i = value[key] as any;
            ctx.globalAlpha = i[i.length - 1]
            drawReal.polygon(i[0], i[1], i[2]);
        }
        else if (key == "polygonOutline") {
            var i = value[key] as any;
            ctx.globalAlpha = i[i.length - 1]
            drawReal.polygonOutline(i[0], i[1], i[2], i[3]);
        }
        else if (key == "image") {
            var i = value[key] as any;
            ctx.globalAlpha = i[i.length - 1]
            drawReal.image(i[0], i[1], i[2]);
        }
    });
    harddraw();
    if (cursorMessage != "" && cursorMessage != undefined) {
        setFont(font);
        drawReal.rect(mouseX - 1, mouseY - 1, ctx.measureText(cursorMessage).width + 2, 35 + 2, "#bebebe", ctx);//outline
        drawReal.rect(mouseX, mouseY, ctx.measureText(cursorMessage).width, 35, "#d9d9d9", ctx);//background
        drawReal.text(mouseX, mouseY + 30, cursorMessage, currentColor["NormalText"], "left", font, ctx);
    }
}

function updateScreen() {
    var update = updatefunction();
    ctx.globalAlpha = 1;
    if (update) {
        console.log("update");
        updateRects();
    }
}

function updatefunction(): boolean {
    //size change
    if (sizeChange) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        sizeChange = false;
    }

    if (Übergang >= 1) { Übergang += 1; }
    if (Übergang >= 50) { Übergang = -1; hider.style.opacity = "0%"; }


    var update = false;
    if (editType == "standartEdit") {
        ////////////
        // Update //
        ////////////

        // mouseSelectionLeft types: 0=move Screen; 1=move Elements; 2=move Start; -2=none;


        //right mouse click
        if (mouse[2] && (mouseSelectionRight == -1 || mouseSelectionRight == 0) && HoldingEnd == -1) {
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
                        EditMenuEdeting = -1

                        //1=EditMenu Geöffnet; 2=EditMenu Text Bearbeiten
                        mouseSelectionRight = 10;
                    }
                }
            }

            if (c) {
                mouseSelectionRight = -1;
                //TODO:open context-menu?
            }
        }
        if (mouseSelectionRight == 10 && !mouse[2]) { mouseSelectionRight = 0; }


        //left mouse click
        if (mouse[0] && mouseSelectionLeft == -1 && HoldingEnd == -1) {
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
                            menuOpen = -0.01
                        }
                    }
                }
                //change name
                if (mouseSelectionLeft == -1) {
                    if (menuOpen == 1 && mouseY < 40 && mouseX < canvas.width - 60 && mouseX > canvas.width - 60 - ctx.measureText(projectName).width) {
                        var r = pprompt("", projectName); if (r != undefined) { localStorage.removeItem(projectName); projectName = r; localStorage.setItem(projectName, genProjectJson()); }
                    }
                }
                //use Menu
                if (mouseSelectionLeft == -1) {
                    if (menuOpen == 1 && mouseX > canvas.width - menuWidth) {
                        mouseSelectionLeft = -2;
                        try {
                            menuButtons[Object.keys(menuButtons)[Math.round((mouseY - (90 - (35 / 2))) / 35)]]();
                        } catch { }
                    }
                }

                //new Element
                if (mouseSelectionLeft == -1) {
                    if (mouseX < sidebarSize) {
                        let sel = Math.ceil((-blockheight + mouseY - 10) / (blockheight + 10))

                        if (sel < available.length) {
                            offsetX = mouseX - 10 + mouseX;
                            offsetY = mouseY - (blockheight / 2);
                            mouseSelectionLeft = 1;
                            mouseDataLeft = FreeElements.length;
                            FreeElements.push([[...available[sel][0]].join(""), [...available[sel][1]], [mouseX - posx, mouseY - posy]])
                        }
                    }
                }

                //search Free Elements
                if (mouseSelectionLeft == -1) {
                    for (let ElementLoadPos = 0; ElementLoadPos < FreeElements.length; ElementLoadPos++) {
                        let px = posx + FreeElements[ElementLoadPos][2][0];
                        let py = posy + FreeElements[ElementLoadPos][2][1];
                        textLength = elementLenght([FreeElements[ElementLoadPos][0], FreeElements[ElementLoadPos][1]])
                        if (mouseX > px && mouseX < px + textLength && mouseY < py && mouseY > py - blockheight) {
                            mouseSelectionLeft = 1;
                            FreeElements.push(FreeElements[ElementLoadPos])
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
                                    if (Elements[ElementLoadPos][ElementList][0] == "End") {
                                        Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList)

                                        HoldingEnd = ElementLoadPos;
                                        offsetX = mouseX - 10 + mouseX;
                                        offsetY = mouseY - (blockheight / 2);
                                        mouseDataLeft = FreeElements.length;
                                        FreeElements.push(["End", [], [mouseX - posx, mouseY - posy]])
                                        mouseSelectionLeft = 1;
                                    } else {
                                        offsetX = mouseX + (mouseX - px);
                                        offsetY = mouseY + (mouseY - py);
                                        mouseSelectionLeft = 1;
                                        mouseDataLeft = FreeElements.length;
                                        let i = Elements[ElementLoadPos][ElementList];
                                        FreeElements.push([[...Elements[ElementLoadPos][ElementList][0]].join(""), [...Elements[ElementLoadPos][ElementList][1]], [mouseX - posx, mouseY - posy]])
                                        if (!keyDown("alt")) {
                                            //search End
                                            if (["Loop", "Unendlich"].includes(Elements[ElementLoadPos][ElementList][0])) {
                                                let it = ElementList;
                                                let indentation = 1;
                                                while (indentation > 0) {
                                                    it++;
                                                    if (["Loop", "Unendlich"].includes(Elements[ElementLoadPos][it][0])) { indentation++; }
                                                    if ("End" == Elements[ElementLoadPos][it][0]) { indentation--; }
                                                }
                                                Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], it)
                                                Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList)

                                            }
                                            else {
                                                Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList)
                                            }
                                        } else { console.log("ALT"); }
                                    }
                                    break;
                                } else if (Elements[ElementLoadPos][ElementList][0] == "Start") {
                                    mouseSelectionLeft = 2;
                                    mouseDataLeft = ElementLoadPos;
                                }
                            }
                        }
                    }
                }


                //else
                if (mouseSelectionLeft == -1) {
                    offsetX = mouseX;
                    offsetY = mouseY;
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
                            if (setSettings["Promt als eingabe"] == "false") {
                                mouseSelectionRight = 1;
                                //console.log(mouseY-20-py);
                                mouseSelectionLeft = -2;
                            } else {
                                mouse[0] = false;
                                //mouseSelectionLeft = -1;
                                var r = pprompt("", Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting])
                                if (r != undefined) {
                                    Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = r;
                                }
                            }
                        }
                    } else {
                        EditMenuEdeting = -1
                    }
                }

                //if not in menu decrease number:
                else {
                    autoSave();
                    EditMenuEdeting = -1
                    mouseSelectionRight--;
                    mouseSelectionLeft = -2;
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
                            if (["Loop", "Unendlich"].includes(FreeElements[mouseDataLeft][0])) {

                                insertY = Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementList][1]) / blockheight);
                                Elements[ElementList].splice(insertY, 0, [FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                                //Elements[ElementList]=insertArrayAt([FreeElements[mouseDataLeft][0], FreeElements[mouseSelectionLeft][1]],0,Elements[ElementList])
                                FreeElements = removeItem(FreeElements, mouseDataLeft)

                                HoldingEnd = ElementList;

                                offsetX = mouseX - 10 + mouseX;
                                offsetY = mouseY - (blockheight / 2);
                                mouseSelectionLeft = 500;
                                mouse[0] = true
                                mouseDataLeft = FreeElements.length;
                                FreeElements.push(["End", [], [mouseX - posx, mouseY - posy]])
                            }
                            else {
                                insertY = Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementList][1]) / blockheight);
                                Elements[ElementList].splice(insertY, 0, [FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                                //Elements[ElementList]=insertArrayAt([FreeElements[mouseDataLeft][0], FreeElements[mouseSelectionLeft][1]],0,Elements[ElementList])
                                FreeElements = removeItem(FreeElements, mouseDataLeft)

                            };
                            break;
                        }
                    }
                }
                autoSave();
            }

            if (mouseSelectionLeft != 500) { mouseSelectionLeft = -1; } else { mouseSelectionLeft = 1; }
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
                        if (i == insertY) { break; }
                        if (Elements[HoldingEnd][i] != undefined) {
                            if (Elements[HoldingEnd][i][0] == "End") { indentation--; }
                            if (["Loop", "Unendlich"].includes(Elements[HoldingEnd][i][0])) { indentation++; }
                        }
                        i++;
                    }
                    console.log(indentation);
                    if (indentation >= 1) {
                        Elements[HoldingEnd].splice(insertY, 0, [FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                        FreeElements = removeItem(FreeElements, mouseDataLeft)
                        mouseSelectionLeft = -1;
                        HoldingEnd = -1;

                        autoSave()
                    } else {
                        mouse[0] = true
                    }
                } else {
                    mouse[0] = true
                }
            } else {
                mouse[0] = true
            }
        }


        //move cam
        if (mouse[1] || mouseSelectionLeft == 0) {
            posx += mouseX - offsetX;
            posy += mouseY - offsetY;
        }

        //move Free Element
        if (mouseSelectionLeft == 1 && !mouse[1]) {
            update = true;
            FreeElements[mouseDataLeft][2][0] += mouseX - offsetX;
            FreeElements[mouseDataLeft][2][1] += mouseY - offsetY;
        }
        //move Start
        if (mouseSelectionLeft == 2) {
            update = true;
            ElementPositions[mouseDataLeft][0] += mouseX - offsetX;
            ElementPositions[mouseDataLeft][1] += mouseY - offsetY;
        }

        //move HoldingEnd
        if (HoldingEnd != -1) {
            FreeElements[FreeElements.length - 1][2][0] = ElementPositions[HoldingEnd][0];
        }

        offsetX = mouseX;
        offsetY = mouseY;

        if (mouseSelectionRight == 1) { update = true; }
    }
    else {
        update = true;
    }
    if (Übergang != -1) { update = true; }
    return update;
}

function harddraw() {
    if (editType == "standartEdit") {
        //Animations
        if (setSettings["Animationen Anzeigen"] == "true") {
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
                    renderPicture(animations[inputNum][Math.round(animationProgression[inputNum])], 30, 30, pox - 2 + posx, poy - 2 + posy, drawReal);
                } else {
                    renderPicture(getErrorIMG(), 30, 30, pox - 2 + posx, poy - 2 + posy, drawReal);
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

        font = "47px msyi";
        //Object sidebar
        if (mouseX < (sidebarSize + sidebarFadeIn) || sidebarFadeInTimer >= 0.05) {
            let mul = ((sidebarFadeIn - (mouseX - sidebarSize)) / sidebarFadeIn);
            if (mul > 1) { mul = 1; }
            if (mul > sidebarFadeInTimer) { sidebarFadeInTimer += 0.05; }
            if (mul < sidebarFadeInTimer) { sidebarFadeInTimer -= 0.05; }
            ctx.globalAlpha = 0.5 * sidebarFadeInTimer;
            drawReal.rect(0, 0, sidebarSize, canvas.height, currentColor["objectSidebarBlur"], ctx);
            ctx.globalAlpha = sidebarFadeInTimer;

            for (let i = 0; i < available.length; i++) {
                let text = available[i][0];
                textLength = ctx.measureText(text).width;
                px = 10;
                py = i * (blockheight + 10) + blockheight;

                if (setYellow.indexOf(text) != -1) {
                    drawcolor = currentColor["YellowBlock"];
                    drawcolorAccent = currentColor["YellowBlockAccent"];
                } else if (setPurple.indexOf(text) != -1) {
                    drawcolor = currentColor["PurpleBlock"];
                    drawcolorAccent = currentColor["PurpleBlockAccent"];
                } else {
                    drawcolor = currentColor["blueBlock"];
                    drawcolorAccent = currentColor["blueBlockAccent"];
                }

                drawReal.roundedRect(px, py, textLength, -(blockheight - 10), drawcolorAccent, 10, ctx) //body outline
                drawReal.roundedRect(px + 1, py - 1, textLength - 2, -blockheight + 12, drawcolor, 10, ctx) //body
                drawReal.text(px, py, text, currentColor["NormalText"], "left", font, ctx);
                py += 4;
                py -= posy;
                px -= posx;
                drawReal.polygon(ctx, drawcolor, [[px + 0, py + 0], [px + 5, py + 7], [px + 15, py + 7], [px + 20, py + 0]]); //connector
                drawReal.polygonOutline(ctx, drawcolorAccent, [[px + 0, py + 0], [px + 5, py + 7], [px + 15, py + 7], [px + 20, py + 0]], 1); //connector outline
            }
            ctx.globalAlpha = 1;
        } else {
            sidebarFadeInTimer = 0;
        }

        //Menu
        ctx.globalAlpha = 1;
        let mOpen = menuOpen;
        if (mOpen < 0) { mOpen = 1 + mOpen }
        if (mOpen != 0) {
            if (mOpen > 1) { mOpen = 1; menuOpen = 1; }
            ctx.globalAlpha = 0.7 * mOpen;
            drawReal.rect(canvas.width - (menuWidth - 100 + (100 * mOpen)), 0, menuWidth + (100 * mOpen), canvas.height * mOpen, currentColor["MenuBackground"], ctx);
            let k = Object.keys(menuButtons);

            ctx.globalAlpha = mOpen;
            for (let x = 0; x < k.length; x++) {
                drawReal.text(canvas.width - 10, 90 + x * 35, k[x], currentColor["MenuText"], "right", font, ctx);
            }

            ctx.globalAlpha = 0.7 * mOpen;
            drawReal.text(canvas.width - 60, 40, projectName, currentColor["ProjectName"], "right", font, ctx);

            if (menuOpen > 0 && menuOpen < 1) { menuOpen += 0.05; }
            if (menuOpen < 0) { menuOpen -= 0.05 }
            if (menuOpen <= -1) { menuOpen = 0; }
            ctx.globalAlpha = 1;
        }
        let r = 30;
        let s = 30;
        for (let x = 0; x < 3; x++) {
            px = canvas.width - s - r / 2;
            py = 0 + r / 2 + (x * (s / 2));
            drawReal.roundedRect(px, py, s, 1, currentColor["MenuButtons"], 5, ctx);
        }
    } else if (editType == "Question") {
        for (var x = 0; x < animationProgression.length; x++) {
            animationProgression[x] += 0.1;
            if (animations[x] != undefined) {
                if (animationProgression[x] >= animations[x].length - 0.5) {
                    animationProgression[x] = 0;
                }
            }
        }
    }

    //keysDown debug
    let k = Object.keys(pressedKeys);
    let i = 0;
    for (let x = 0; x < k.length; x++) {
        if (pressedKeys[k[x]]) {
            drawReal.text(0, i * 35 + 35, k[x], currentColor["NormalText"], "left", font, ctx);
            i++
        }
    }
}

function LiveMoodLightUpdate(data: string) {
    var values: string[] = pictureString2Value(data)
    console.log(values);
    for (var x = 0; x < moodLightSizeX; x++) {
        for (var y = 0; y < moodLightSizeY; y++) {
            (document.getElementById("2_y" + y + "x" + x) as HTMLDivElement).style.background = "#" + values[y * moodLightSizeX + x];
        }
    }
}

function checkDisplay() {
    if (editType != "PictureEdit") {
        //whole pictureEdit
        if (document.getElementById("pictureEdit")?.style.display == "") {
            $("#pictureEdit").css("display", "none")
        }
    } else if (editType == "PictureEdit") {
        //whole pictureEdit
        if (document.getElementById("pictureEdit")?.style.display == "none") {
            $("#pictureEdit").css("display", "")
        }

        //arrows
        if (pictureEditType == 0) {
            if (document.getElementById("multiPage")?.style.display != "none") {
                $("#multiPage").css("display", "none");
                $("#LoadAnimationToMoodLight").css("display", "none");
            }
        } else if (document.getElementById("multiPage")?.style.display != "") {
            $("#multiPage").css("display", "");
            $("#LoadAnimationToMoodLight").css("display", "");
        }
    }

    if (editType == "Sheduler") {
        if (document.getElementById("Sheduler")?.style.display != "") {
            $("#Sheduler").css("display", "")
        }
    } else {
        if (document.getElementById("Sheduler")?.style.display == "") {
            $("#Sheduler").css("display", "none")
        }
    }

    if (editType == "Console") {
        if (document.getElementById("Console")?.style.display != "") {
            $("#Console").css("display", "")
        }
    } else {
        if (document.getElementById("Console")?.style.display == "") {
            $("#Console").css("display", "none")
        }
    }

    if (editType == "ColorPicker") {
        if (document.getElementById("ColorPicker")?.style.display != "") {
            $("#ColorPicker").css("display", "")
        }
    } else {
        if (document.getElementById("ColorPicker")?.style.display == "") {
            $("#ColorPicker").css("display", "none")
        }
    }

    if (editType == "Console") {
    } else {
    }
    //made this here, because of slow Update cycle
    if (setSettings["Live MoodLight"] == "true") {
        if (document.getElementById("MoodLightDisplay")?.style.display != "") {
            $("#MoodLightDisplay").css("display", "")
        }
    } else {
        if (document.getElementById("MoodLightDisplay")?.style.display == "") {
            $("#MoodLightDisplay").css("display", "none")
        }
    }
}

function updateRects() {
    ToDraw = [];

    if (editType == "standartEdit") {
        toDrawAnimations = [];
        font = "47px msyi";

        //updatefunction();
        //////////
        // draw //
        //////////

        //random error removal
        if (mouseSelectionRight != -1) {
            elementLenghtAndDraw(["-", ["-"]], -100, -100);
        }

        //background
        draw.fill(currentColor["background"], ctx);
        /*for (let x = 0; x < (canvas.width) / backgroundPointSize; x++) {
            for (let y = 0; y < (canvas.height) / backgroundPointSize; y++) {
                let px = x * backgroundPointSize;
                px = util.normalize(px, 0, canvas.width)
                let py = y * backgroundPointSize;
                py = util.normalize(py, 0, canvas.height)
                draw.rect(px - 5, py - 5, 2, 2, colors["backgroundPoints"], ctx);
            }
        }*/


        //Elements
        for (let ElementLoadPos = 0; ElementLoadPos < Elements.length; ElementLoadPos++) {
            let i = 0
            let lastDragElement = false;
            let indentation = 0;
            for (let ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
                //if dragElement in middle
                if (mouseSelectionLeft == 1) {
                    if (ElementPositions[ElementLoadPos][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementLoadPos][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                        if (ElementList == Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementLoadPos][1]) / blockheight)) {
                            if (ElementList != 0) {
                                textLength = elementLenght([FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]])
                                ctx.globalAlpha = 0.6;
                                draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), currentColor["MoveBlockShaddow"], 10, ctx) //body
                                ctx.globalAlpha = 1;
                                i++;
                                lastDragElement = true;
                            }
                        }
                    }
                }

                if ("End" == Elements[ElementLoadPos][ElementList][0]) {
                    indentation--;
                }

                px = ElementPositions[ElementLoadPos][0] + (indentation * 10);
                py = ElementPositions[ElementLoadPos][1] + i * blockheight;

                textLength = elementLenghtAndDraw(Elements[ElementLoadPos][ElementList], px, py);

                let text = Elements[ElementLoadPos][ElementList][0];

                if (setYellow.indexOf(text) != -1) {
                    drawcolor = currentColor["YellowBlock"];
                    drawcolorAccent = currentColor["YellowBlockAccent"];
                } else if (setPurple.indexOf(text) != -1) {
                    drawcolor = currentColor["PurpleBlock"];
                    drawcolorAccent = currentColor["PurpleBlockAccent"];
                } else {
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

                    if ("End" == Elements[ElementLoadPos][ElementList][0]) { px += 10 }
                    draw.polygon(ctx, drawcolorO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]) //connector
                    draw.polygonOutline(ctx, drawcolorAccentO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1) //connector outline

                    if ("End" == Elements[ElementLoadPos][ElementList][0]) { px -= 10 }
                }

                drawcolorO = drawcolor;
                drawcolorAccentO = drawcolorAccent;

                //loop connector
                for (let x = 1; x <= indentation; x++) {
                    draw.rect(px - (x * 10) - 5, py + 10, 10, -blockheight - 9, currentColor["YellowBlockAccent"], ctx);
                    draw.rect(px - (x * 10) - 4, py + 10, 8, -blockheight - 9, currentColor["YellowBlock"], ctx);
                }

                if (["Loop", "Unendlich"].includes(Elements[ElementLoadPos][ElementList][0])) { indentation++; }
                if ("End" == Elements[ElementLoadPos][ElementList][0]) {
                    x = 0
                    var addit = 20
                    draw.rect(px - (x * 10) - 5, py + 10 - addit, 10, (-blockheight - 9) + addit, currentColor["YellowBlockAccent"], ctx);
                    draw.rect(px - (x * 10) - 4, py + 10 - addit, 8, (-blockheight - 9) + addit, currentColor["YellowBlock"], ctx);
                }
                i++;
            }
            pyC = (py + 4);
            draw.polygon(ctx, drawcolor, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]); //connector
            draw.polygonOutline(ctx, drawcolorAccent, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1); //connector outline

            //if dragElement at bottom
            if (mouseSelectionLeft == 1) {
                if (ElementPositions[ElementLoadPos][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementLoadPos][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                    if ((Elements[ElementLoadPos].length) == Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementLoadPos][1]) / blockheight)) {
                        if ((Elements[ElementLoadPos].length) != 0) {
                            textLength = elementLenght([FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]])
                            ctx.globalAlpha = 0.6;
                            draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), currentColor["MoveBlockShaddow"], 10, ctx) //body
                            ctx.globalAlpha = 1;
                        }
                    }
                }
            }
        }

        //Free Elements
        ctx.globalAlpha = 0.5;
        for (let FreeElementPos = 0; FreeElementPos < FreeElements.length; FreeElementPos++) {
            px = FreeElements[FreeElementPos][2][0];
            py = FreeElements[FreeElementPos][2][1];
            textLength = elementLenghtAndDraw([FreeElements[FreeElementPos][0], FreeElements[FreeElementPos][1]], px, py);



            //draw.roundedRect(px, py, textLength, -(blockheight - 10), drawcolorAccent, 10, ctx) //body outline
            //draw.roundedRect(px + 1, py - 1, textLength - 2, -blockheight + 12, drawcolor, 10, ctx) //body

            pyC = (py + 4);
            draw.polygon(ctx, drawcolor, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]); //connector
            draw.polygonOutline(ctx, drawcolorAccent, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1); //connector outline

            //draw.text(px, py, text, colors["NormalText"], "left", ctx);
        }
        ctx.globalAlpha = 1;

        //EditMenu
        if (mouseSelectionRight != -1) {
            let hei = Elements[mouseDataRight[0]][mouseDataRight[1]][1].length;
            let px = ElementPositions[mouseDataRight[0]][0];
            let py = ElementPositions[mouseDataRight[0]][1] + mouseDataRight[1] * blockheight;
            draw.polygon(ctx, currentColor["EditMenu"], [[px, py + 20], [px + 20, py + 20], [px + 30, py + 5], [px + 40, py + 20], [px + 250, py + 20], [px + 250, py + (hei * blockheight) + 20], [px, py + (hei * blockheight) + 20]]) //dropdownMenu
            draw.polygonOutline(ctx, currentColor["EditMenuAccent"], [[px, py + 20], [px + 20, py + 20], [px + 30, py + 5], [px + 40, py + 20], [px + 250, py + 20], [px + 250, py + (hei * blockheight) + 20], [px, py + (hei * blockheight) + 20], [px, py + 20]], 1) //dropdownMenu
            font = "35px msyi";
            setFont(font)
            for (let x = 0; x < hei; x++) {
                if (specialBlockDropdownRender[Elements[mouseDataRight[0]][mouseDataRight[1]][0]] != undefined) {
                    if (specialBlockDropdownRender[Elements[mouseDataRight[0]][mouseDataRight[1]][0]][x] != undefined) {
                        specialBlockDropdownRender[Elements[mouseDataRight[0]][mouseDataRight[1]][0]][x](Elements[mouseDataRight[0]][mouseDataRight[1]][1][x], px, py + x * blockheight + blockheight + 10);
                    } else {
                        draw.text(px, py + x * blockheight + blockheight + 10, Elements[mouseDataRight[0]][mouseDataRight[1]][1][x], currentColor["NormalText"], "left", font, ctx);
                    }
                } else {
                    draw.text(px, py + x * blockheight + blockheight + 10, Elements[mouseDataRight[0]][mouseDataRight[1]][1][x], currentColor["NormalText"], "left", font, ctx);
                }

                if (x == EditMenuEdeting) { draw.rect(px + ctx.measureText(Elements[mouseDataRight[0]][mouseDataRight[1]][1][x]).width, py + x * blockheight + blockheight + 15, 0.75, -30, currentColor["NormalText"], ctx); }
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
        var mW = 0
        for (let x = 0; x < q1.length; x++) {
            if (q1[x].startsWith("_P")) {
                if (42 > mW) { mW = 42 }
            }
            else if (q1[x].startsWith("_p")) {
                if (42 > mW) { mW = 42 }
            } else {
                if (ctx.measureText(q1[x]).width > mW) { mW = ctx.measureText(q1[x]).width }
            }
        }

        //mouseDown
        if (mouse[0] && mouseSelectionLeft == -1) {
            if (mouseY > 150 - blockheight && mouseY < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) {
                Question[1][q1[Math.ceil((mouseY / blockheight) - (150 / blockheight))]](Math.ceil((mouseY / blockheight) - (150 / blockheight)));
                //Übergang = -1
            } else {
                if (comesFrom != "Question") {
                    goTo(comesFrom, 1);
                    setTimeout(updateRects, 15);
                    mouse[0] = false;
                } else {
                    goTo("standartEdit", 1);
                    setTimeout(updateRects, 15);
                    mouse[0] = false;
                }
            }
            mouseSelectionLeft = 0
        }

        //mouseUp
        if (!mouse[0] && mouseSelectionLeft != -1) {
            mouseSelectionLeft = -1;
        }
        draw.image(latestCanvasPic, 0, 0);
        ctx.globalAlpha = 0.3921;
        if (mouseY > 150 - blockheight && mouseY < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) {
            draw.fill(currentColor["backgroundBlur"], ctx);
        } else {
            draw.fill(currentColor["questionRedBackgroundBlur"], ctx);
        }
        ctx.globalAlpha = 1;

        //box
        draw.roundedRect(canvas.width / 2 - (mW / 2 + 5), 150 - 47 + 3 + 15, mW + 10, q1.length * blockheight + 5, currentColor["questionBackground"], 30, ctx);

        font = "60px msyi"
        draw.text(canvas.width / 2, 70, Question[0], currentColor["NormalText"], "center", font, ctx);
        font = "47px msyi"
        for (let x = 0; x < q1.length; x++) {
            if (q1[x].startsWith("_P")) {
                renderPicture(pictures[parseInt(q1[x].substring(2, 100))], 36, 36, canvas.width / 2 - 21 + 3, 150 + x * blockheight - 30 + 3, draw);
            } else if (q1[x].startsWith("_p")) {
                renderPicture(q1[x].substring(3, 500), 36, 36, canvas.width / 2 - 21 + 3, 150 + x * blockheight - 30 + 3, draw);
            } else if (q1[x].startsWith("_A")) {
                var inputNum = x;
                //function (inputNum: string, posx: number, posy: number) {
                if (animations[inputNum] != undefined && animationProgression.length <= inputNum) {
                    animationProgression.push(0);
                }
                if (animations[inputNum] != undefined) {
                    if (isNaN(animationProgression[inputNum])) {
                        animationProgression[inputNum] = 0;
                    }
                    renderPicture(animations[inputNum][Math.round(animationProgression[inputNum])], 36, 36, canvas.width / 2 - 21 + 3, 150 + x * blockheight - 30 + 3, draw);
                }
            }
            else {
                draw.text(canvas.width / 2, 150 + x * blockheight, q1[x], currentColor["NormalText"], "center", font, ctx);
            }
        }
    }
    else if (editType == "PictureEdit") {
        pageTeller.innerHTML = "Seite " + (page + 1) + "/" + pictureValues.length;

        drawReal.fill(currentColor["background"], ctx);

        if (mouse[0]) {
            if (mouseX < 60 * moodLightSizeX && mouseY < 60 * moodLightSizeY && mouseY > 1) {
                let x = Math.floor(mouseX / 60);
                let y = Math.floor(mouseY / 60);
                let a = document.getElementById("y" + x + "x" + y) as unknown as HTMLElement;
                if (a != null) {
                    if (!keyDown("alt")) {
                        if (pictureValues[page][y * moodLightSizeY + x] != rgb2hex(colorPicker.spectrum("get")._r, colorPicker.spectrum("get")._g, colorPicker.spectrum("get")._b)) {
                            pictureValues[page][y * moodLightSizeY + x] = rgb2hex(colorPicker.spectrum("get")._r, colorPicker.spectrum("get")._g, colorPicker.spectrum("get")._b)
                            a.style.backgroundColor = colorPicker.spectrum("get");
                            var au = document.querySelector("#autoUptade") as HTMLInputElement;
                            if (au.checked) {
                                send(pictureValue2String(pictureValues[page]));
                            }
                        }
                    } else {
                        colorPicker.spectrum("set", a.style.backgroundColor);
                    }
                }
            }
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
                goTo("standartEdit", 1)
            }
            if (mouseX > 25 && mouseX < 200 + 25) {
                settingsSelLeft = Math.floor((mouseY - 70) / 30)
            }
            if (mouseX > 25 + 200 + 10 && mouseX < canvas.width - 45) {
                var hauptgruppe = Object.keys(settings);
                if (settings[hauptgruppe[settingsSelLeft]] != undefined) {
                    var settinggruppe = Object.keys(settings[hauptgruppe[settingsSelLeft]]);
                    var sel: string = settinggruppe[Math.floor((mouseY - 70) / 30)]
                    if (sel != undefined) {
                        if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "button") {
                        } else if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "bool") {
                            if (setSettings[sel] == "false") {
                                setSettings[sel] = "true"
                            } else {
                                setSettings[sel] = "false"
                            }
                            settings[hauptgruppe[settingsSelLeft]][sel](true);
                        } else if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "str") {
                            setSettings[sel] = sprompt(setSettings[sel] + " verändern zu");
                            settings[hauptgruppe[settingsSelLeft]][sel](true);
                        } else if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "num") {
                            setSettings[sel] = sprompt(setSettings[sel] + " verändern zu");
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

        font = '47px msyi'
        draw.text(canvas.width / 2, 60, "EINSTELLUNGEN", currentColor["NormalText"], "center", font, ctx);

        //draw left
        font = '35px msyi'
        var hauptgruppe = Object.keys(settings);
        draw.rect(23, 65, 205, canvas.height - 70 - 30 + 5, currentColor["settingsBackground"], ctx);
        for (var h = 0; h < hauptgruppe.length; h++) {
            if (h == settingsSelLeft) {
                draw.rect(25, 70 + h * 30, 200, 27, currentColor["settingsSelSelected"], ctx); //selected: c8c8c8; mouse over: d2d2d2
            } else if (mouseX > 25 && mouseX < 200 + 25 && mouseY > 70 + h * 30 && mouseY < 70 + h * 30 + 31) {
                draw.rect(25, 70 + h * 30, 200, 27, currentColor["settingsSelMouseOver"], ctx); //selected: c8c8c8; mouse over: d2d2d2
            } else {
                draw.rect(25, 70 + h * 30, 200, 27, currentColor["settingsSelStandard"], ctx); //selected: c8c8c8; mouse over: d2d2d2
            }
            draw.text(27, 93 + h * 30, hauptgruppe[h], currentColor["NormalText"], "left", font, ctx);
        }
        //draw right
        draw.rect(25 + 200 + 5, 65, canvas.width - 260, canvas.height - 70 - 30 + 5, currentColor["settingsBackground"], ctx);
        if (settings[hauptgruppe[settingsSelLeft]] != undefined) {
            var settinggruppe: string[] = Object.keys(settings[hauptgruppe[settingsSelLeft]]);
            for (s = 0; s < settinggruppe.length; s++) {
                var type = settings[hauptgruppe[settingsSelLeft]][settinggruppe[s]](false);

                if (type != "info") {
                    if (mouseX > 25 + 200 + 10 && mouseX < canvas.width - 45 && mouseY > 70 + s * 30 && mouseY < 70 + s * 30 + 31 && type != "staticBool") {
                        draw.rect(25 + 200 + 10, 70 + s * 30, canvas.width - 280, 27, currentColor["settingsSelMouseOver"], ctx); //mouse over: d2d2d2}
                    } else {
                        draw.rect(25 + 200 + 10, 70 + s * 30, canvas.width - 280, 27, currentColor["settingsSelStandard"], ctx); //mouse over: d2d2d2}
                    }
                }
                draw.text(25 + 200 + 10, 93 + s * 30, settinggruppe[s], currentColor["NormalText"], "left", font, ctx);
                if (settings[hauptgruppe[settingsSelLeft]][settinggruppe[s]] != undefined && type == "bool") {
                    if (setSettings[settinggruppe[s]] == "false") {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolFalse"], ctx);
                    } else if (setSettings[settinggruppe[s]] == "true") {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolTrue"], ctx);
                    } else {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, "#5e5e5e", ctx);
                    }
                }
                if (settings[hauptgruppe[settingsSelLeft]][settinggruppe[s]] != undefined && (type == "staticBool" || type == "showingBool")) {
                    if (staticElementsData[settinggruppe[s]] == false) {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolFalse"], ctx);
                    } else if (staticElementsData[settinggruppe[s]] == true) {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, currentColor["settingsBoolTrue"], ctx);
                    } else if (staticElementsData[settinggruppe[s]] == undefined) {
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, "#5e5e5e", ctx);
                    }
                }
            }
        }
    }
    else if (editType == "ColorPicker") {
        draw.image(latestCanvasPic, 0, 0);
    }

    if (!document.hasFocus()) {
        isFocused = false;
    } else {
        isFocused = true;
    }

    //übergang
    if (Übergang >= 1) {
        var alpha = 0;
        if (Übergang <= 25) {
            alpha = Übergang / 25;
        } else {
            if (editType != ÜbergangZu) {
                editType = ÜbergangZu;
                checkDisplay();
            }
            alpha = 2 - (Übergang / 25);
        }
        hider.style.opacity = alpha * 100 + "%"
        //console.log(Übergang + ": " + ctx.globalAlpha);
        //draw.fill(colors["background"], ctx);
        ctx.globalAlpha = 1;
    }
}

function cursorUpdate() {
    if (!document.hasFocus()) {
        return;
    }

    let normal = true

    if (editType == "standartEdit") {
        if (keyDown("alt")) { c.style.cursor = "copy"; normal = false; }
        if (mouseX > canvas.width - 50 - 15 && mouseY < 50 + 15) { c.style.cursor = "pointer"; normal = false; }
        if (menuOpen == 1 && mouseX > canvas.width - menuWidth && mouseY > 90 - 35 && mouseY < 90 + (Object.keys(menuButtons).length - 1) * 35) { c.style.cursor = "pointer"; normal = false; }
        if (menuOpen == 1 && mouseY < 40 && mouseX < canvas.width - 60 && mouseX > canvas.width - 60 - ctx.measureText(projectName).width) { c.style.cursor = "text"; normal = false; }
        if (mouseSelectionRight != -1) {
            let hei = Elements[mouseDataRight[0]][mouseDataRight[1]][1].length;
            let px = posx + ElementPositions[mouseDataRight[0]][0];
            let py = posy + ElementPositions[mouseDataRight[0]][1] + mouseDataRight[1] * blockheight;
            let pxM = px + 250;
            let pyM = py + hei * blockheight + blockheight;
            if (mouseX > px && mouseX < pxM && mouseY > py && mouseY < pyM) {
                var selectedElement: string = Elements[mouseDataRight[0]][mouseDataRight[1]][0];
                var curPos = Math.ceil(((mouseY - 20) - (posy + ElementPositions[mouseDataRight[0]][1] + mouseDataRight[1] * blockheight + blockheight)) / blockheight);
                if (curPos >= 0) {
                    c.style.cursor = "text";
                    cursorMessage = description[selectedElement as keyof typeof description][curPos];
                } else {
                    cursorMessage = "";
                }
                normal = false;
            }
            else { cursorMessage = ""; }
        }
    }
    if (editType == "Question") {
        let q1 = Object.keys(Question[1]);

        //get max width
        var mW = 0
        for (let x = 0; x < q1.length; x++) {
            if (q1[x].startsWith("_P")) {
                if (42 > mW) { mW = 42 }
            }
            else if (q1[x].startsWith("_p")) {
                if (42 > mW) { mW = 42 }
            } else {
                if (ctx.measureText(q1[x]).width > mW) { mW = ctx.measureText(q1[x]).width }
            }
        }
        if (mouseY > 150 - blockheight && mouseY < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) { c.style.cursor = "pointer"; normal = false; }
    }
    if (editType == "Settings") {
        if (mouseX > canvas.width - 50 - 15 && mouseY < 50 + 15) { c.style.cursor = "pointer"; normal = false; }

        //messages
        if (settings[Object.keys(settings)[settingsSelLeft]] != undefined) {
            var v = Object.keys(settings[Object.keys(settings)[settingsSelLeft]])[Math.floor((mouseY - 70) / 30)]
            if (mouseX > 25 + 200 + 10 && mouseX < canvas.width - 45 && v in settingsInfo) {
                cursorMessage = settingsInfo[v];
            } else {
                cursorMessage = "";
            }
        }
    }

    //else
    if (normal) { c.style.cursor = "default"; }
}
setInterval(cursorUpdate, 100);
setInterval(UpdateStaticSettingsIfInSettings, 10000);
setInterval(checkDisplay, 500);
setInterval(drawScreen, 10);
setInterval(function () {
    if (setSettings["Live MoodLight"] == "true") {
        send("&");
    }
}, 250);
setInterval(updateScreen, 16);
setTimeout(checkDisplay, 50);
setTimeout(updateRects, 50);
setTimeout(updateRects, 100);
setTimeout(updateRects, 150);
setTimeout(updateRects, 200);

//HTML load events
var a: HTMLInputElement = document.querySelector("#autoUptade") as HTMLInputElement
var o: () => {} = a.onload as () => {};
o();

//check first start
setTimeout(() => {
    var firstTry = getCookie("FirstTry")
    if (firstTry == "") {
        setCookie("FirstTry", "No", 10);
        goTo("Question", 1);
        Question = ["Wilkommen. Willst du dich mit deinem Moodlight Verbinden?", {
            "Ja": function () {
                host = sprompt("Server/Host");
                myTopic = sprompt("Topic");
                myUser = sprompt("User");
                myPass = sprompt("Pass");
                setStorage();
                reconnect();
                firstTry2();
                goTo("Question", 1)
            },
            "Nein": function () {
                firstTry2();
                goTo("Question", 1)
            }
        }]
    }
}, 200);
function firstTry2() {
    ctx.globalAlpha = 0.8;
    drawReal.fill("#ffffff", ctx);
    ctx.globalAlpha = 1;
    Question = ["Du kannst diese Daten in den Einstellungen under 'MQTT' verändern", {
        "OK": function () {
            firstTry3();
            goTo("Question", 1)
        }
    }]
}
function firstTry3() {
    ctx.globalAlpha = 0.8;
    drawReal.fill("#ffffff", ctx);
    ctx.globalAlpha = 1;
    Question = ["Willst du eine Kurze Liste an informationen?", {
        "Ja": function () {
            goTo("standartEdit", 0);
            aalert("Von Links kannst du elemente in das Bearbeitungs Feld Ziehen. Häfte diese hintereinander unter [Start <0>]. Die Paramenter kannst du nun von den hineingezogenen Elementen mit einem Rechtsklick auf diese verändern.");
            aalert("Wenn du Animationen/Bilder hinzufügen willst, klicken oben rechts auf den Menü Knopf. Dort kannst du unter 'Hinzufügen' Bilder und Animationen hinzufügen. Wenn du diese Wieder bearbeiten willst, kannst du auf 'Bearbeiten' klicken.");
            aalert("Zudem kannst du 'Start' hinzufügen. Dort kannst du andere Elemente hinzufügen. [Start <0>] wird beim Hochfahren des Moodlights geladen. Mit [Laden <id>] kannst du andere Starts laden.")
        },
        "Nein": function () {
            goTo("standartEdit", 0);
        },
    }]
}