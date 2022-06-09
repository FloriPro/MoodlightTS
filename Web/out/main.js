"use strict";
/// <reference path="compiler.ts" />
/// <reference path="utilitys.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
 * TODO:
 *  -Output
 *  -Einstellungen
 */
const empty = '{"Elements":[[["Start",["0"]]]],"pictures":["000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d70000000000000000001e12001e12001e12001e12000000000000000000001e12001e1200000000000000"],"ElementPositions":[[0,0]],"FreeElements":[],"animations":[],"projectName":"unset"}';
//utility variables
let isFocused = false;
let font = "47px msyi";
let host = "hotti.info";
let myTopic = ""; //"fablab114/ML";
let myUser = ""; //"fablab114";
let myPass = ""; //"fab!FG1Dw9";
let mouseX = 500;
let mouseY = 500;
let mouse = {};
let pressedKeys = {};
let canvas = document.getElementById('canvas');
let colorTextOut = document.getElementById("color");
let colorPicker = $("#colorpicker");
let hider = document.getElementById("hider");
let ctx = canvas.getContext("2d");
let ProjectLoader = document.querySelector("#projectLoader");
let pageTeller = document.getElementById("pageTeller");
let latestCanvasPicStr = canvas.toDataURL("image/png");
var latestCanvasPic = new Image;
latestCanvasPic.src = latestCanvasPicStr;
let c = document.getElementById("canvas");
let sizeChange = true;
createUserEvents();
function loadProject(jsonLoad) {
    //get save
    var ElementsSave = Elements;
    var picturesSave = pictures;
    var ElementPositionsSave = ElementPositions;
    var FreeElementsSave = FreeElements;
    var animationsSave = animations;
    var projectNameSave = projectName;
    try {
        Elements = jsonLoad.Elements;
        pictures = jsonLoad.pictures;
        ElementPositions = jsonLoad.ElementPositions;
        FreeElements = jsonLoad.FreeElements;
        animations = jsonLoad.animations;
        if (jsonLoad.projectName != undefined) {
            projectName = jsonLoad.projectName;
        }
        else {
            projectName = sprompt("projekt name: ");
        }
    }
    catch (_a) {
        Elements = ElementsSave;
        pictures = picturesSave;
        ElementPositions = ElementPositionsSave;
        FreeElements = FreeElementsSave;
        animations = animationsSave;
        projectName = projectNameSave;
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
    window.onresize = resize;
    function windowfocus() {
        pressedKeys = {};
    }
    function toutchStart(e) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        mouse[0] = true;
        offsetX = mouseX;
        offsetY = mouseY;
    }
    function toutchEnd(e) {
        mouse[0] = false;
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
        offsetX = mouseX;
        offsetY = mouseY;
        return true;
    }
    function mouseup(e) {
        mouse[e.button] = false;
        return true;
    }
    function keyEvent(e) {
        if (e.key == "Alt" || e.key == "Tab") {
            e.preventDefault();
        }
        if (mouseSelectionRight == 1) {
            if (e.type == "keydown") {
                if (e.key == "Backspace") {
                    Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting].slice(0, -1);
                }
                else if (e.key.length == 1) {
                    Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] = Elements[mouseDataRight[0]][mouseDataRight[1]][1][EditMenuEdeting] + e.key;
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
function keyDown(key) {
    if (!(key in pressedKeys)) {
        return false;
    }
    if (pressedKeys[key] == false) {
        return false;
    }
    return true;
}
//MQTT
let latesMQTTMessage = "";
var client = new Paho.MQTT.Client('hotti.info', 10833, "client" + ((new Date).getTime().toString(16) + Math.floor(1E7 * Math.random()).toString(16)));
function mqttConstructor() {
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    if (myUser != "" && myPass != "" && myTopic != "") {
        client.connect({ onSuccess: onConnect, useSSL: true, onFailure: onFailure, userName: myUser, password: myPass });
    }
    else {
        //TODO
    }
}
function onConnect() {
    UpdateStaticSettingsIfInSettings();
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(myTopic);
}
function onFailure() { console.log("on Failure"); }
function onConnectionLost(responseObject) {
    if (responseObject.errorCode != 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage + "\nreconnecting...");
        connect();
    }
}
function reconnect() {
    if (client.isConnected()) {
        client.disconnect();
    }
    connect();
}
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    if (message.payloadString.substring(1, 0) == ";" && waitingForMQTTPic) {
        console.log("load");
        pictureValues[page] = pictureString2Value(message.payloadString.substring(1));
        loadPictureVal(pictureValues[page]);
        waitingForMQTTPic = false;
    }
    else {
        latesMQTTMessage = message.payloadString;
    }
}
function send(dat) {
    var message = new Paho.MQTT.Message(dat);
    message.destinationName = myTopic;
    client.send(message);
}
function connect() {
    client.connect({ onSuccess: onConnect, useSSL: true, onFailure: onFailure, userName: myUser, password: myPass });
}
class drawApp {
    image(image, posx, posy) {
        ctx.drawImage(image, posx, posy);
    }
    rect(posx, posy, width, height, color, ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(posx, posy, width, height);
        ctx.fill();
        ctx.closePath();
    }
    ;
    roundedRect(posx, posy, width, height, color, radius, ctx) {
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
        }
        else {
            ctx.fillRect(posx, posy, width, height);
        }
        ctx.fill();
        ctx.closePath();
        ctx.strokeStyle = "";
        ctx.fillStyle = "";
        ctx.lineJoin = "";
        ctx.lineWidth = 0;
    }
    circle(posx, posy, radius, color, ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(posx, posy, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
    ;
    fill(color, ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        ctx.closePath();
    }
    ;
    text(pox, posy, Text, color, align, font, ctx) {
        if (ctx.font != font) {
            ctx.font = font;
        }
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(Text, pox, posy);
    }
    ;
    polygon(ctx, color, pos) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(pos[0][0] + posx, pos[0][1] + posy);
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo(pos[i][0] + posx, pos[i][1] + posy);
        }
        ctx.fill();
        ctx.closePath();
    }
    ;
    polygonOutline(ctx, color, pos, width) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(pos[0][0] + posx, pos[0][1] + posy);
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo(pos[i][0] + posx, pos[i][1] + posy);
        }
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    }
    ;
}
let ToDraw = [];
class drawAdder {
    image(image, posx, posy) {
        ToDraw.push({ "image": [image, posx, posy, ctx.globalAlpha] });
    }
    rect(posx, posy, width, height, color, ctx) {
        ToDraw.push({ "rect": [posx, posy, width, height, color, ctx, ctx.globalAlpha] });
    }
    ;
    roundedRect(posx, posy, width, height, color, radius, ctx) {
        ToDraw.push({ "roundedRect": [posx, posy, width, height, color, radius, ctx, ctx.globalAlpha] });
    }
    circle(posx, posy, radius, color, ctx) {
        ToDraw.push({ "circle": [posx, posy, radius, color, ctx, ctx.globalAlpha] });
    }
    ;
    fill(color, ctx) {
        ToDraw.push({ "fill": [color, ctx, ctx.globalAlpha] });
    }
    ;
    text(posx, posy, Text, color, align, font, ctx) {
        ToDraw.push({ "text": [posx, posy, Text, color, align, font, ctx, ctx.globalAlpha] });
    }
    ;
    polygon(ctx, color, pos) {
        ToDraw.push({ "polygon": [ctx, color, pos, ctx.globalAlpha] });
    }
    ;
    polygonOutline(ctx, color, pos, width) {
        ToDraw.push({ "polygonOutline": [ctx, color, pos, width, ctx.globalAlpha] });
    }
    ;
}
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return "";
}
function setStorage() {
    setCookie("setSettings", JSON.stringify(setSettings), 10);
    setCookie("myTopic", myTopic, 10);
    setCookie("myPass", myPass, 10);
    setCookie("myUser", myUser, 10);
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
}
class Utilitys {
    normalize(degrees, min, max) {
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
    }
    ;
    clamp(i, min, max) {
        if (i < min) {
            i = min;
        }
        if (i > max) {
            i = max;
        }
        return i;
    }
    ;
    Random(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    ;
}
function removeItem(data, index) {
    var tempList = data;
    data = [];
    for (var j = 0; j < tempList.length; j++) {
        if (j != index)
            data.push(tempList[j]);
    }
    return data;
}
function elementLenghtAndDraw(Element, plx, ply) {
    setFont(font);
    let text = Element[0];
    if (setYellow.indexOf(text) != -1) {
        drawcolor = currentColor["YellowBlock"];
        drawcolorAccent = currentColor["YellowBlockAccent"];
    }
    else if (setPurple.indexOf(text) != -1) {
        drawcolor = currentColor["PurpleBlock"];
        drawcolorAccent = currentColor["PurpleBlockAccent"];
    }
    else {
        drawcolor = currentColor["blueBlock"];
        drawcolorAccent = currentColor["blueBlockAccent"];
    }
    let l = ctx.measureText(Element[0]).width + 10;
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
            l += ctx.measureText(t).width;
        }
        l += 5;
    }
    if ("End" == text) {
        blockheight /= 2;
    }
    draw.roundedRect(plx, ply, l, -(blockheight - 10), drawcolorAccent, 10, ctx); //body outline
    draw.roundedRect(plx + 1, ply - 1, l - 2, -blockheight + 12, drawcolor, 10, ctx); //body
    if ("End" != text) {
        draw.text(plx, ply, text, currentColor["NormalText"], "left", font, ctx);
    }
    else {
        blockheight *= 2;
    }
    l = ctx.measureText(text).width + 7;
    for (let x = 0; x < Element[1].length; x++) {
        let t = Element[1][x];
        if (t == "") {
            t = " ";
        }
        l += 5;
        if (Element[0] in specialRender && x in specialRender[Element[0]]) {
            try {
                specialRender[Element[0]][x][1](Element[1][x], plx + l - 5, ply - 22 - 5);
            }
            catch (_a) { }
            l += specialRender[Element[0]][x][0];
        }
        else {
            draw.roundedRect(plx + l + 2, ply - 5, ctx.measureText(t).width - 4, -(blockheight - 10) + 10, currentColor["blockArgBackground"], 10, ctx); //body outline
            draw.text(plx + l, ply, t, currentColor["NormalText"], "left", font, ctx);
            l += ctx.measureText(t).width;
        }
        l += 5;
    }
    return l;
}
function elementLenght(Element) {
    setFont(font);
    let text = Element[0];
    let l = ctx.measureText(Element[0]).width + 10;
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
            l += ctx.measureText(t).width;
        }
        l += 5;
    }
    return l;
}
/**
 * only use this/pprompt for prompts
 */
function sprompt(question, setShit) {
    var a = prompt(question, setShit);
    if (a == undefined) {
        a = "";
    }
    mouse[0] = false;
    return a;
}
/**
 * only use this/sprompt for prompts
 */
function pprompt(question, setShit) {
    var a = prompt(question, setShit);
    if (a == null) {
        a = undefined;
    }
    mouse[0] = false;
    return a;
}
/**
 * only use this for alerts
 */
function aalert(message) {
    alert(message);
    mouse[0] = false;
}
function openWindow(url) {
    window.open(url);
    mouse[0] = false;
}
//Game Variables
let waitingForMQTTPic = false;
var comesFrom = "";
/**standartEdit, PictureEdit, Question, Settings, Action*/
var editType = "standartEdit";
let projectName = "unset";
let pictureEditKeyEvents = {
    "c": function () {
        navigator.clipboard.writeText(pictureValue2String(pictureValues[page]));
    }, "v": function () {
        if (navigator.clipboard.readText != undefined) {
            navigator.clipboard.readText().then(clipText => {
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
            });
        }
        else {
            var clipText = pprompt("please paste:");
            if (clipText != undefined) {
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
        }
    }
};
var Question = ["ERROR", { "ERROR": function () { console.warn("Question without defenition"); } }];
var Übergang = -1;
var ÜbergangZu = "Question";
let actionElements = [
    ["jede", "minuten", "5"],
    ["server eingang", "GET", "specificPathForMyInput"]
];
let menuOpen = 0;
let menuButtons = {
    "Speichern": saveProject,
    "Laden": function () {
        goTo("Question", 1);
        var a = {};
        var lK = Object.keys(localStorage);
        for (var x = 0; x < lK.length; x++) {
            if (lK[x][0] != "!")
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
                    loadProject(JSON.parse(localStorage[Object.keys(localStorage)[i]]));
                    goTo("standartEdit", 0);
                    setCookie("lastUsed", Object.keys(localStorage)[seId], 0.5);
                };
        }
        Question = ["Welches Projekt willst du laden?", a];
    },
    "Hinzufügen": function () {
        goTo("Question", 1);
        Question = ["Was willst du hinzufügen", {
                "Start": function (seId) { ElementPositions.push([Elements.length * 400, 0]); Elements.push([["Start", [String(Elements.length)]]]); goTo(comesFrom, 1); },
                "Bild": function (seId) { goTo("PictureEdit", 0); mouse[0] = false; resetPicEdit(); pictureId = pictures.length; pictures.push("000000".repeat(32)); pictureEditType = 0; },
                "Animation": function (seId) { goTo("PictureEdit", 0); mouse[0] = false; resetPicEdit(); animationId = animations.length; animations.push(["000000".repeat(32)]); pictureEditType = 1; },
            }];
    },
    "Bearbeiten": function () {
        goTo("Question", 1);
        Question = ["", {
                "Bild": function () {
                    mouse[0] = false;
                    goTo("Question", 1);
                    var qAnsw = {};
                    for (var i = 0; i < pictures.length; i++) {
                        qAnsw["_P" + i] = function (selId) { goTo("PictureEdit", 0); mouse[0] = false; pictureId = selId; loadPicture(selId); pictureEditType = 0; };
                    }
                    Question = ["Was willst du bearbeiten", qAnsw];
                },
                "Animation": function () {
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
                    Question = ["Was willst du bearbeiten", qAnsw];
                },
                //"Aktionen": function () {
                //    goTo("Action", 0);
                //}
            }];
    },
    "Einstellungen": function () { goTo("Settings", 1); },
    "Senden": function () { compileProject(); },
    "Neues Projekt": function () { loadProject(JSON.parse(empty)); },
    "Zu Datei Speichern": downloadProject,
    "Von Datei Laden": function () { console.log("clickedLoad"); ProjectLoader.click(); },
    //"actions": function () { openWindow("/action"); },
};
let menuWidth = 350;
/**type: bool, staticBool, showingBool, str, num, button, info */
let settings = {
    "Allgemein": {
        "Automatisch speichert": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "Bestimmtes Projekt löschen": function (callType) {
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
                Question = ["Welches Projekt willst du löschen?", a];
                return "";
            }
        },
        "Promt als eingabe": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
    },
    "MQTT": {
        "Verbindung": function (callType) {
            if (!callType) {
                return "showingBool";
            }
            else {
                if (client.isConnected()) {
                    client.disconnect();
                    UpdateStaticSettingsIfInSettings();
                }
                else {
                    settingsInfo["Verbindung"] = "Verbinden...";
                    staticElementsData["Verbindung"] = undefined;
                    connect();
                }
                return "";
            }
        },
        "Daten ändern": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                myTopic = sprompt("Topic");
                myUser = sprompt("User");
                myPass = sprompt("Pass");
                reconnect();
                return "";
            }
        },
        "Daten löschen": function (callType) { if (!callType) {
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
        "Daten einsehen": function (callType) { if (!callType) {
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
        "Projekt namen anzeigen bei senden": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "Upload Delay": function (callType) { if (!callType) {
            return "num";
        }
        else {
            return "";
        } },
    },
    "Aussehen": {
        "Animationen Anzeigen": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            return "";
        } },
        "Bilder Anzeigen": function (callType) { if (!callType) {
            return "bool";
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
        "Farben:": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        "Darkmode": function (callType) { if (!callType) {
            return "bool";
        }
        else {
            settingsInfo["Eigenens design"] = "BETA!";
            if (setSettings["Darkmode"] == "true") {
                currentColor = colors["dark"];
            }
            else {
                currentColor = colors["light"];
            }
            return "";
        } },
        "": function (callType) { if (!callType) {
            return "info";
        }
        else {
            return "";
        } },
        "Eigenens design": function (callType) {
            if (!callType) {
                return "button";
            }
            else {
                var l = localStorage.getItem("!designs");
                if (l != undefined) {
                    var d = JSON.parse(l);
                }
                else {
                    aalert("no custom design");
                    return "";
                } //set JSON parsed var d
                goTo("Question", 1);
                var a = {};
                var dK = Object.keys(d);
                for (var x = 0; x < dK.length; x++) {
                    var v = dK[x];
                    setSettings["Darkmode"] = "undefined";
                    a[v] = function (seId) {
                        var l = localStorage.getItem("!designs");
                        if (l != undefined) {
                            var d = JSON.parse(l);
                            var dK = Object.keys(d);
                            settingsInfo["Eigenens design"] = dK[seId];
                            currentColor = d[dK[seId]];
                        }
                        goTo("Settings", 1);
                    };
                }
                Question = ["", a];
                return "";
            }
        },
        "Design löschen": function (callType) {
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
                        goTo("Settings", 1, false);
                    };
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
                        aalert("canceled");
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
            }
            else {
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
            }
            else {
                asyncStuff("firmware");
                return "";
            }
        },
        "MoodLight Größe": function (callType) {
            if (!callType) {
                return "num";
            }
            else {
                UpdateSizeMoodlightSize();
                return "";
            }
        },
    },
};
function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
function asyncStuff(stuff) {
    return __awaiter(this, void 0, void 0, function* () {
        if (stuff == "firmware") {
            send("V");
            var i = 0;
            while (!latesMQTTMessage.startsWith(";V") && i < 200) {
                yield delay(100);
                i++;
            }
            if (i >= 200) {
                aalert("ERROR");
            }
            else {
                aalert(latesMQTTMessage);
            }
        }
    });
}
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
    "Verbindung": function () {
        staticElementsData["Verbindung"] = client.isConnected();
        if (client.isConnected()) {
            settingsInfo["Verbindung"] = host;
        }
        else {
            settingsInfo["Verbindung"] = "";
        }
    },
};
let staticElementsData = { "Anmelde Status": undefined, "Verbindung": undefined };
let settingsInfo = { "Darkmode": "größtenteils nur invertiert!", "Eigenens design": "BETA! überschreibt 'Darkmode'!", "Eigenens design erstellen": "BETA!", "Design Hinzufügen": "BETA! Designs können dieses Programm zerstören!", "Design löschen": "BETA!", "Animationen Anzeigen": "Sehr Performance intensiv" };
let setSettings = { "Automatisch speichert": "true", "Darkmode": "false", "Promt als eingabe": "false", "Projekt namen anzeigen bei senden": "false", "Animationen Anzeigen": "true", "Bilder Anzeigen": "true", "MoodLight Größe": "6", "Upload Delay": "0" };
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
let pictureValues = [];
/**0=Bild,1=Animation */
let pictureEditType = 0;
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
let util = new Utilitys();
const errorImg = "000000ff0000ff00ff000000ff0000ff00ff000000000000ff00ffff0000000000ff00ffff0000ff00ff000000ff0000ff00ffff0000ff00ffff0000000000ff00ffff0000000000ff00ff000000ff0000ff00ff000000ff0000000000ff00ffff0000000000ff00ffff0000";
const available = [["Wait", ["0.25"]], ["Laden", ["0"]], ["Text", ["Text", "10"]], ["Uhrzeit", ["10"]], ["Bild anzeigen", ["0", "0"]], ["Animationen", ["0", "0", "10"]], ["Füllen", ["0", "0", "0"]], ["Loop", ["2"]], ["Unendlich", []], ["Custom", [""]]];
const description = { "Wait": ["Sekunden"], "Laden": ["Nummer"], "Text": ["Text", "Geschwindigkeit"], "Uhrzeit": ["Geschwindigkeit"], "Bild anzeigen": ["Bild", "Übergangszeit"], "Animationen": ["Animation", "Übergangszeit", "Wartezeit (Sekunden X 100)"], "Füllen": ["R 0-255", "G 0-255", "B 0-255"], "Loop": ["Wiederholungen"], "Custom": ["Code"] };
const notDragable = ["Start"];
const dropdownMenuButtons = { "Bild anzeigen": { "Bearbeiten": function () { console.log("Bearbeiten"); }, "Anzeigen": function () { console.log("Anzeigen"); } }, "Animationen": { "Bearbeiten": function () { console.log("Bearbeiten"); } } }; //TODO
const specialRender = {
    "Bild anzeigen": {
        0: [24, function (inputNum, posx, posy) {
                if (setSettings["Bilder Anzeigen"] == "true") {
                    renderPicture(pictures[parseInt(inputNum)], 30, 30, posx - 2, posy - 2, draw);
                }
            }]
    },
    "Animationen": {
        0: [24, function (inputNum, posx, posy) {
                toDrawAnimations.push([inputNum, posx, posy]);
            }]
    },
};
const specialBlockEditClick = {
    "Bild anzeigen": {
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
            Question = ["welches Bild?", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        }
    },
    "Animationen": {
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
            Question = ["welche Animation?", qAnsw];
            cursorMessage = "";
            goTo("Question", 1);
        }
    }
};
let tempData;
let colors = { "light": { "background": "#fcfcfc", "backgroundPoints": "#646464", "blockArgBackground": "#ffffff", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#b0b0b0", "EditMenu": "#d0f7e9", "EditMenuAccent": "#7bc9ac", "NormalText": "#000000", "MenuButtons": "#000000", "MenuBackground": "#000000", "MenuText": "#ffffff", "settingsBoolTrue": "#00ff00", "settingsBoolFalse": "#ff0000", "settingsSelMouseOver": "#d2d2d2", "settingsSelStandard": "#dcdcdc", "settingsSelSelected": "#c8c8c8", "backgroundBlur": "#000000", "settingsBackground": "#ffffff", "settingsBackgroundHighlight": "#f0f0f0", "questionRedBackgroundBlur": "#960000", "questionBackground": "#aaaaaa", "objectSidebarBlur": "#c0c0c0", "ProjectName": "#4287f5" }, "dark": { "background": "#030303", "backgroundPoints": "#9b9b9b", "blockArgBackground": "#000000", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#4f4f4f", "EditMenu": "#2f0816", "EditMenuAccent": "#843653", "NormalText": "#ffffff", "MenuButtons": "#ffffff", "MenuBackground": "#ffffff", "MenuText": "#000000", "settingsBoolTrue": "#00ff00", "settingsBoolFalse": "#ff0000", "settingsSelMouseOver": "#2d2d2d", "settingsSelStandard": "#232323", "settingsSelSelected": "#373737", "backgroundBlur": "#ffffff", "settingsBackground": "#000000", "settingsBackgroundHighlight": "#0f0f0f", "questionRedBackgroundBlur": "#69ffff", "questionBackground": "#555555", "objectSidebarBlur": "#3f3f3f", "ProjectName": "#4287f5" } };
let currentColor = { "background": "", "backgroundPoints": "", "blueBlock": "", "blockArgBackground": "", "blueBlockAccent": "", "YellowBlock": "", "YellowBlockAccent": "", "PurpleBlock": "", "PurpleBlockAccent": "", "MoveBlockShaddow": "", "EditMenu": "", "EditMenuAccent": "", "NormalText": "", "MenuButtons": "", "MenuBackground": "", "MenuText": "", "settingsBoolTrue": "", "settingsBoolFalse": "", "settingsSelMouseOver": "", "settingsSelStandard": "", "settingsSelSelected": "", "backgroundBlur": "", "settingsBackground": "", "settingsBackgroundHighlight": "", "questionRedBackgroundBlur": "", "questionBackground": "", "objectSidebarBlur": "", "ProjectName": "", };
let setYellow = ["Loop", "Unendlich", "Start", "End"];
let setPurple = ["Bild anzeigen", "Animationen", "Laden"];
let pictures = ["000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d70000000000000000001e12001e12001e12001e12000000000000000000001e12001e1200000000000000"];
let animations = [];
let animationProgression = [];
let toDrawAnimations = [];
let Elements = [[["Start", ["0"]]]];
let ElementPositions = [[0, 0]];
let FreeElements = [];
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
let px = 0;
let py = 0;
let pyC = 0;
let maxOutsideBounds = 500;
let blockheight = 38;
//end of variables
getStorage();
setStorage();
mqttConstructor();
var la = getCookie("lastUsed");
if (la != "" && localStorage[la] != undefined) {
    loadProject(JSON.parse(localStorage[la]));
}
if (setSettings["Darkmode"] == "true") {
    currentColor = colors["dark"];
}
else {
    currentColor = colors["light"];
}
let moodLightSizeX = 0;
let moodLightSizeY = 0;
function UpdateSizeMoodlightSize() {
    moodLightSizeX = parseInt(setSettings["MoodLight Größe"]);
    moodLightSizeY = parseInt(setSettings["MoodLight Größe"]);
    //gen color selection Table
    let colorSelTable = document.getElementById('colorSelTable');
    colorSelTable.innerHTML = "";
    for (var x = 0; x < moodLightSizeY; x++) {
        var i = '<tr>';
        for (var y = 0; y < moodLightSizeX; y++) {
            i += '<th style="background:white" class="ColorSelContainer"><div class="ColorSelButton" style="background:black" id="y' + y + "x" + x + '"></div></th>';
        }
        colorSelTable.innerHTML += i + "</tr>";
    }
}
UpdateSizeMoodlightSize();
function setFont(font) {
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
function renderPicture(picString, sizeX, sizeY, posx, posy, drawer) {
    posx = Math.floor(posx);
    posy = Math.floor(posy);
    var dat = pictureString2Value(picString);
    for (var i = 0; i < moodLightSizeY; i++) {
        for (var ii = 0; ii < moodLightSizeX; ii++) {
            drawer.rect(posx + i * (sizeX / moodLightSizeY), posy + ii * (sizeY / moodLightSizeX), sizeX / moodLightSizeY, sizeY / moodLightSizeX, "#" + dat[ii * moodLightSizeY + i], ctx);
        }
    }
}
function pictureString2Value(input) {
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
        out = pictureString2Value(errorImg);
    }
    return out;
}
function pictureValue2String(input) {
    var out = "";
    for (var i = 0; i < moodLightSizeY; i++) {
        if (i % 2 == 0) {
            for (var ii = 0; ii < moodLightSizeX; ii++) {
                out = out + input[i * moodLightSizeY + ii];
            }
        }
        else {
            for (var ii = moodLightSizeX - 1; ii >= 0; ii--) {
                out = out + input[i * moodLightSizeY + ii];
            }
        }
    }
    return out;
}
function finishPicture() {
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
        animationId = -1;
        pictureId = -1;
        //return to main edit
        goTo("standartEdit", 0);
    }
    else {
        aalert("Something went wrong: No ID!");
    }
    autoSave();
}
function genProjectJson() {
    return JSON.stringify({ "Elements": Elements, "pictures": pictures, "ElementPositions": ElementPositions, "FreeElements": FreeElements, "animations": animations, "projectName": projectName });
}
function downloadProject() {
    var filename = projectName;
    if (filename == "") {
        filename = "Unnamed";
    }
    filename = filename + ".moproj";
    download(genProjectJson(), "text", filename);
}
function saveProject() {
    localStorage.setItem(projectName, genProjectJson());
}
function autoSave() {
    if (setSettings["Automatisch speichert"] == "true") {
        saveProject();
    }
}
/**
* type: 0=fadein+fadeout; 1=cut
*/
function goTo(übergangTo, type, settingsSelLef) {
    latestCanvasPicStr = canvas.toDataURL("image/png");
    latestCanvasPic.src = latestCanvasPicStr;
    comesFrom = editType;
    if (type == 0) {
        Übergang = 1;
        ÜbergangZu = übergangTo;
    }
    else if (type == 1) {
        editType = übergangTo;
    }
    if (übergangTo == "PictureEdit") {
        page = 0;
    }
    if (übergangTo == "Settings") {
        if (settingsSelLef) {
            settingsSelLeft = 0;
        }
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
function drawScreen() {
    var px = 0;
    if (editType == "standartEdit") {
        px = posx;
    }
    var py = 0;
    if (editType == "standartEdit") {
        py = posy;
    }
    ToDraw.forEach(value => {
        var key = Object.keys(value)[0];
        if (key == "rect") {
            var i = value[key];
            ctx.globalAlpha = i[i.length - 1];
            drawReal.rect(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5]);
        }
        else if (key == "roundedRect") {
            var i = value[key];
            ctx.globalAlpha = i[i.length - 1];
            drawReal.roundedRect(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5], i[6]);
        }
        else if (key == "circle") {
            var i = value[key];
            ctx.globalAlpha = i[i.length - 1];
            drawReal.circle(i[0] + px, i[1] + py, i[2], i[3], i[4]);
        }
        else if (key == "fill") {
            var i = value[key];
            ctx.globalAlpha = i[i.length - 1];
            drawReal.fill(i[0], i[1]);
        }
        else if (key == "text") {
            var i = value[key];
            ctx.globalAlpha = i[i.length - 1];
            drawReal.text(i[0] + px, i[1] + py, i[2], i[3], i[4], i[5], i[6]);
        }
        else if (key == "polygon") {
            var i = value[key];
            ctx.globalAlpha = i[i.length - 1];
            drawReal.polygon(i[0], i[1], i[2]);
        }
        else if (key == "polygonOutline") {
            var i = value[key];
            ctx.globalAlpha = i[i.length - 1];
            drawReal.polygonOutline(i[0], i[1], i[2], i[3]);
        }
        else if (key == "image") {
            var i = value[key];
            ctx.globalAlpha = i[i.length - 1];
            drawReal.image(i[0], i[1], i[2]);
        }
    });
    harddraw();
    if (cursorMessage != "" && cursorMessage != undefined) {
        setFont(font);
        drawReal.rect(mouseX, mouseY, ctx.measureText(cursorMessage).width, 35, "#bebebe", ctx);
        drawReal.text(mouseX, mouseY + 30, cursorMessage, currentColor["NormalText"], "left", font, ctx);
    }
}
function updateScreen() {
    var update = updatefunction();
    ctx.globalAlpha = 1;
    if (update) {
        updateRects();
    }
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
        // mouseSelectionLeft types: 0=move Screen; 1=move Elements; -2=none;
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
                        EditMenuEdeting = -1;
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
        if (mouseSelectionRight == 10 && !mouse[2]) {
            mouseSelectionRight = 0;
        }
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
                            menuOpen = -0.01;
                        }
                    }
                }
                //change name
                if (mouseSelectionLeft == -1) {
                    if (menuOpen == 1 && mouseY < 40 && mouseX < canvas.width - 60 && mouseX > canvas.width - 60 - ctx.measureText(projectName).width) {
                        var r = pprompt("", projectName);
                        if (r != undefined) {
                            localStorage.removeItem(projectName);
                            projectName = r;
                            localStorage.setItem(projectName, genProjectJson());
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
                            offsetX = mouseX - 10 + mouseX;
                            offsetY = mouseY - (blockheight / 2);
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
                            if (mouseX > px && mouseX < px + textLength && mouseY < py && mouseY > py - blockheight && notDragable.indexOf(Elements[ElementLoadPos][ElementList][0]) == -1) {
                                if (Elements[ElementLoadPos][ElementList][0] == "End") {
                                    Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList);
                                    HoldingEnd = ElementLoadPos;
                                    offsetX = mouseX - 10 + mouseX;
                                    offsetY = mouseY - (blockheight / 2);
                                    mouseDataLeft = FreeElements.length;
                                    FreeElements.push(["End", [], [mouseX - posx, mouseY - posy]]);
                                    mouseSelectionLeft = 1;
                                }
                                else {
                                    offsetX = mouseX + (mouseX - px);
                                    offsetY = mouseY + (mouseY - py);
                                    mouseSelectionLeft = 1;
                                    mouseDataLeft = FreeElements.length;
                                    let i = Elements[ElementLoadPos][ElementList];
                                    FreeElements.push([[...Elements[ElementLoadPos][ElementList][0]].join(""), [...Elements[ElementLoadPos][ElementList][1]], [mouseX - posx, mouseY - posy]]);
                                    if (!keyDown("alt")) {
                                        //search End
                                        if (["Loop", "Unendlich"].includes(Elements[ElementLoadPos][ElementList][0])) {
                                            let it = ElementList;
                                            let indentation = 1;
                                            while (indentation > 0) {
                                                it++;
                                                if (["Loop", "Unendlich"].includes(Elements[ElementLoadPos][it][0])) {
                                                    indentation++;
                                                }
                                                if ("End" == Elements[ElementLoadPos][it][0]) {
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
                            }
                            else {
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
                                FreeElements = removeItem(FreeElements, mouseDataLeft);
                                HoldingEnd = ElementList;
                                offsetX = mouseX - 10 + mouseX;
                                offsetY = mouseY - (blockheight / 2);
                                mouseSelectionLeft = 500;
                                mouse[0] = true;
                                mouseDataLeft = FreeElements.length;
                                FreeElements.push(["End", [], [mouseX - posx, mouseY - posy]]);
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
                        if (Elements[HoldingEnd][i][0] == "End") {
                            indentation--;
                        }
                        if (["Loop", "Unendlich"].includes(Elements[HoldingEnd][i][0])) {
                            indentation++;
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
        //move HoldingEnd
        if (HoldingEnd != -1) {
            FreeElements[FreeElements.length - 1][2][0] = ElementPositions[HoldingEnd][0];
        }
        offsetX = mouseX;
        offsetY = mouseY;
        if (mouseSelectionRight == 1) {
            update = true;
        }
    }
    else {
        update = true;
    }
    if (Übergang != -1) {
        update = true;
    }
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
            for (let i = 0; i < available.length; i++) {
                let text = available[i][0];
                textLength = ctx.measureText(text).width;
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
    //keysDown debug
    let k = Object.keys(pressedKeys);
    let i = 0;
    for (let x = 0; x < k.length; x++) {
        if (pressedKeys[k[x]]) {
            drawReal.text(0, i * 35 + 35, k[x], currentColor["NormalText"], "left", font, ctx);
            i++;
        }
    }
}
function checkDisplay() {
    var _a, _c, _d, _e;
    if (editType != "PictureEdit") {
        //whole pictureEdit
        if (((_a = document.getElementById("pictureEdit")) === null || _a === void 0 ? void 0 : _a.style.display) == "") {
            $("#pictureEdit").css("display", "none");
        }
    }
    else {
        //whole pictureEdit
        if (((_c = document.getElementById("pictureEdit")) === null || _c === void 0 ? void 0 : _c.style.display) == "none") {
            $("#pictureEdit").css("display", "");
        }
        //arrows
        if (pictureEditType == 0) {
            if (((_d = document.getElementById("multiPage")) === null || _d === void 0 ? void 0 : _d.style.display) != "none") {
                $("#multiPage").css("display", "none");
            }
        }
        else if (((_e = document.getElementById("multiPage")) === null || _e === void 0 ? void 0 : _e.style.display) != "") {
            $("#multiPage").css("display", "");
        }
    }
}
function updateRects() {
    ToDraw = [];
    checkDisplay();
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
            let i = 0;
            let lastDragElement = false;
            let indentation = 0;
            for (let ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
                //if dragElement in middle
                if (mouseSelectionLeft == 1) {
                    if (ElementPositions[ElementLoadPos][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementLoadPos][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                        if (ElementList == Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementLoadPos][1]) / blockheight)) {
                            if (ElementList != 0) {
                                textLength = elementLenght([FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                                ctx.globalAlpha = 0.6;
                                draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), currentColor["MoveBlockShaddow"], 10, ctx); //body
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
                }
                else if (setPurple.indexOf(text) != -1) {
                    drawcolor = currentColor["PurpleBlock"];
                    drawcolorAccent = currentColor["PurpleBlockAccent"];
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
                    if ("End" == Elements[ElementLoadPos][ElementList][0]) {
                        px += 10;
                    }
                    draw.polygon(ctx, drawcolorO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]); //connector
                    draw.polygonOutline(ctx, drawcolorAccentO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1); //connector outline
                    if ("End" == Elements[ElementLoadPos][ElementList][0]) {
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
                if (["Loop", "Unendlich"].includes(Elements[ElementLoadPos][ElementList][0])) {
                    indentation++;
                }
                if ("End" == Elements[ElementLoadPos][ElementList][0]) {
                    x = 0;
                    var addit = 20;
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
                            textLength = elementLenght([FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                            ctx.globalAlpha = 0.6;
                            draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), currentColor["MoveBlockShaddow"], 10, ctx); //body
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
            draw.polygon(ctx, currentColor["EditMenu"], [[px, py + 20], [px + 20, py + 20], [px + 30, py + 5], [px + 40, py + 20], [px + 250, py + 20], [px + 250, py + (hei * blockheight) + 20], [px, py + (hei * blockheight) + 20]]); //dropdownMenu
            draw.polygonOutline(ctx, currentColor["EditMenuAccent"], [[px, py + 20], [px + 20, py + 20], [px + 30, py + 5], [px + 40, py + 20], [px + 250, py + 20], [px + 250, py + (hei * blockheight) + 20], [px, py + (hei * blockheight) + 20], [px, py + 20]], 1); //dropdownMenu
            font = "35px msyi";
            setFont(font);
            for (let x = 0; x < hei; x++) {
                draw.text(px, py + x * blockheight + blockheight + 10, Elements[mouseDataRight[0]][mouseDataRight[1]][1][x], currentColor["NormalText"], "left", font, ctx);
                if (x == EditMenuEdeting) {
                    draw.rect(px + ctx.measureText(Elements[mouseDataRight[0]][mouseDataRight[1]][1][x]).width, py + x * blockheight + blockheight + 15, 0.75, -30, currentColor["NormalText"], ctx);
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
            else {
                if (ctx.measureText(q1[x]).width > mW) {
                    mW = ctx.measureText(q1[x]).width;
                }
            }
        }
        //mouseDown
        if (mouse[0] && mouseSelectionLeft == -1) {
            if (mouseY > 150 - blockheight && mouseY < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) {
                Question[1][q1[Math.ceil((mouseY / blockheight) - (150 / blockheight))]](Math.ceil((mouseY / blockheight) - (150 / blockheight)));
                //Übergang = -1
            }
            else {
                if (comesFrom != "Question") {
                    goTo(comesFrom, 1);
                    setTimeout(updateRects, 15);
                    mouse[0] = false;
                }
                else {
                    goTo("standartEdit", 1);
                    setTimeout(updateRects, 15);
                    mouse[0] = false;
                }
            }
            mouseSelectionLeft = 0;
        }
        //mouseUp
        if (!mouse[0] && mouseSelectionLeft != -1) {
            mouseSelectionLeft = -1;
        }
        draw.image(latestCanvasPic, 0, 0);
        ctx.globalAlpha = 0.3921;
        if (mouseY > 150 - blockheight && mouseY < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) {
            draw.fill(currentColor["backgroundBlur"], ctx);
        }
        else {
            draw.fill(currentColor["questionRedBackgroundBlur"], ctx);
        }
        ctx.globalAlpha = 1;
        //box
        draw.roundedRect(canvas.width / 2 - (mW / 2 + 5), 150 - 47 + 3 + 15, mW + 10, q1.length * blockheight + 5, currentColor["questionBackground"], 30, ctx);
        font = "60px msyi";
        draw.text(canvas.width / 2, 70, Question[0], currentColor["NormalText"], "center", font, ctx);
        font = "47px msyi";
        for (let x = 0; x < q1.length; x++) {
            if (q1[x].startsWith("_P")) {
                renderPicture(pictures[parseInt(q1[x].substring(2, 100))], 36, 36, canvas.width / 2 - 21 + 3, 150 + x * blockheight - 30 + 3, draw);
            }
            else if (q1[x].startsWith("_p")) {
                renderPicture(q1[x].substring(3, 500), 36, 36, canvas.width / 2 - 21 + 3, 150 + x * blockheight - 30 + 3, draw);
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
                let a = document.getElementById("y" + x + "x" + y);
                if (a != null) {
                    if (!keyDown("alt")) {
                        pictureValues[page][y * moodLightSizeY + x] = rgb2hex(colorPicker.spectrum("get")._r, colorPicker.spectrum("get")._g, colorPicker.spectrum("get")._b);
                        a.style.backgroundColor = colorPicker.spectrum("get");
                    }
                    else {
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
                            setSettings[sel] = sprompt(setSettings[sel] + " verändern zu");
                            settings[hauptgruppe[settingsSelLeft]][sel](true);
                        }
                        else if (settings[hauptgruppe[settingsSelLeft]][sel](false) == "num") {
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
        font = '47px msyi';
        draw.text(canvas.width / 2, 60, "EINSTELLUNGEN", currentColor["NormalText"], "center", font, ctx);
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
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, "#5e5e5e", ctx);
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
                        draw.rect(canvas.width - 45 - 3 - 21, 70 + s * 30 + 3, 21, 21, "#5e5e5e", ctx);
                    }
                }
            }
        }
    }
    if (!document.hasFocus()) {
        isFocused = false;
    }
    else {
        isFocused = true;
    }
    //übergang
    if (Übergang >= 1) {
        var alpha = 0;
        if (Übergang <= 25) {
            alpha = Übergang / 25;
        }
        else {
            if (editType != ÜbergangZu) {
                editType = ÜbergangZu;
            }
            alpha = 2 - (Übergang / 25);
        }
        hider.style.opacity = alpha * 100 + "%";
        //console.log(Übergang + ": " + ctx.globalAlpha);
        //draw.fill(colors["background"], ctx);
        ctx.globalAlpha = 1;
    }
}
function cursorUpdate() {
    if (!document.hasFocus()) {
        return;
    }
    let normal = true;
    if (editType == "standartEdit") {
        if (keyDown("alt")) {
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
        if (menuOpen == 1 && mouseY < 40 && mouseX < canvas.width - 60 && mouseX > canvas.width - 60 - ctx.measureText(projectName).width) {
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
                if (ctx.measureText(q1[x]).width > mW) {
                    mW = ctx.measureText(q1[x]).width;
                }
            }
        }
        if (mouseY > 150 - blockheight && mouseY < 150 + q1.length * blockheight - blockheight && mouseX > canvas.width / 2 - (mW / 2 + 5) - 15 && mouseX < canvas.width / 2 - (mW / 2 + 5) + mW + 10 + 15) {
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
    //else
    if (normal) {
        c.style.cursor = "default";
    }
}
setInterval(cursorUpdate, 100);
setInterval(UpdateStaticSettingsIfInSettings, 10000);
setInterval(drawScreen, 10);
setInterval(updateScreen, 16);
setTimeout(updateRects, 50);
setTimeout(updateRects, 100);
setTimeout(updateRects, 150);
setTimeout(updateRects, 200);
//# sourceMappingURL=main.js.map