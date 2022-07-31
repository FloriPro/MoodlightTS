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
function addZero(i, leng) {
    var ii = i.toString();
    while (ii.length < leng) {
        ii = "0" + ii;
    }
    return ii;
}
function delAll() {
    return __awaiter(this, void 0, void 0, function* () {
        for (var p of alphabet) {
            for (var i = 0; i < 100; i++) {
                yield delay(100);
                send("X" + p + addZero(i, 2));
            }
        }
    });
}
function getMS() {
    var d = new Date();
    return d.getTime();
}
let body = document.querySelector("body");
let oldEditType;
function updateFullscreen() {
    if (typeof setSettings === 'undefined') {
        return;
    }
    if (setSettings["$settings.look.fullscreen"] == "true") {
        if (document.fullscreenElement == null) {
            body.requestFullscreen({ navigationUI: "show" }).catch(() => {
                setTimeout(function () {
                    if (document.fullscreenElement == null) {
                        drawReal.fill(currentColor["background"], ctx);
                        let latestCanvasPicStr = canvas.toDataURL("image/png");
                        latestCanvasPic.src = latestCanvasPicStr;
                        //latestCanvasPic = new Image;
                        if (editType != "Question") {
                            oldEditType = editType;
                            goTo("Question", 1);
                        }
                        updateRects();
                        drawScreen();
                        Question = ["$question.needFullscreen", {
                                "$question.needFullscreen.answer": function (seId) {
                                    body.requestFullscreen({ navigationUI: "show" });
                                    goTo(oldEditType, 1);
                                }
                            }, oldEditType];
                    }
                }, 100);
            });
        }
        else if (editType == "Question") {
            if (Question[0] != "$question.needFullscreen")
                return;
            if (Object.keys(Question[1])[0] != "$question.needFullscreen.answer")
                return;
            goTo(oldEditType, 1);
            setTimeout(updateRects, 50);
        }
    }
    else {
        if (document.fullscreenElement != null) {
            document.exitFullscreen();
        }
    }
}
setInterval(() => {
    updateFullscreen();
}, 500);
function savePictureEdit() {
    if (pictureEditType == 0) {
        download(JSON.stringify([pictureValue2String(pictureValues[0])]), "JSON", "picture.mopic");
    }
    else {
        var anim = [];
        for (var i = 0; i < pictureValues.length; i++) {
            anim.push(pictureValue2String(pictureValues[i]));
        }
        download(JSON.stringify(anim), "JSON", "animation.mopic");
    }
}
function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}
/**
 * only use this/pprompt for prompts
 */
function sprompt(question, setShit) {
    if (currentTranslation[question] != undefined) {
        question = currentTranslation[question];
    }
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
    if (currentTranslation[question] != undefined) {
        question = currentTranslation[question];
    }
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
    if (currentTranslation[message] != undefined) {
        message = currentTranslation[message];
    }
    alert(message);
    mouse[0] = false;
}
function openWindow(url) {
    window.open(url);
    mouse[0] = false;
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
function normalize(degrees, min, max) {
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
function clamp(i, min, max) {
    if (i < min) {
        i = min;
    }
    if (i > max) {
        i = max;
    }
    return i;
}
;
function Random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
;
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
class drawAdder {
    image(image, posx, posy) {
        ToDraw.push({ "image": [image, posx, posy, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    imageWH(image, posx, posy, width, height) {
        ToDraw.push({ "imageWH": [image, posx, posy, width, height, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    rect(posx, posy, width, height, color, ctx) {
        ToDraw.push({ "rect": [posx, posy, width, height, color, ctx, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    ;
    roundedRect(posx, posy, width, height, color, radius, ctx) {
        ToDraw.push({ "roundedRect": [posx, posy, width, height, color, radius, ctx, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    circle(posx, posy, radius, color, ctx) {
        ToDraw.push({ "circle": [posx, posy, radius, color, ctx, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    ;
    fill(color, ctx) {
        ToDraw.push({ "fill": [color, ctx, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    ;
    text(posx, posy, Text, color, align, font, ctx) {
        ToDraw.push({ "text": [posx, posy, Text, color, align, font, ctx, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    ;
    polygon(ctx, color, pos) {
        ToDraw.push({ "polygon": [ctx, color, pos, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    ;
    polygonOutline(ctx, color, pos, width) {
        ToDraw.push({ "polygonOutline": [ctx, color, pos, width, ctx.globalAlpha, ctx.shadowColor, ctx.shadowBlur] });
    }
    ;
}
class drawApp {
    image(image, posx, posy, ctx) {
        ctx.drawImage(image, posx, posy);
    }
    imageWH(image, posx, posy, width, height, ctx) {
        ctx.drawImage(image, posx, posy, width, height);
    }
    rect(posx, posy, width, height, color, ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(posx, posy, width, height);
        ctx.fill();
        ctx.closePath();
    }
    ;
    roundedRect(x, y, width, height, color, radius, ctx) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        if (height < 0) {
            height = height * -1;
            y -= height;
        }
        if (width < 0) {
            width = width * -1;
            x -= width;
        }
        x -= radius / 2;
        width += radius;
        y -= radius / 2;
        height += radius;
        radius = radius / 3 * 2;
        ctx.beginPath();
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
        /*ctx.beginPath();
        ctx.lineJoin = "round";

        ctx.lineWidth = radius;

        ctx.beginPath();

        ctx.strokeRect(x, y, width, height);
        ctx.fill()

        if (ctx.globalAlpha != 1) {
            ctx.fillRect(x + (radius / 2), y - (radius / 2), width - radius, height + radius);
        } else {
            ctx.fillRect(x, y, width, height);
        }
        ctx.fill();

        ctx.closePath();*/
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
        if (currentTranslation[Text] != undefined) {
            Text = currentTranslation[Text];
        }
        ctx.fillText(Text, pox, posy);
    }
    ;
    polygon(ctx, color, pos) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo((pos[0][0] + posx), (pos[0][1] + posy));
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo((pos[i][0] + posx), (pos[i][1] + posy));
        }
        ctx.fill();
        ctx.closePath();
    }
    ;
    polygonOutline(ctx, color, pos, width) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo((pos[0][0] + posx), (pos[0][1] + posy));
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo((pos[i][0] + posx), (pos[i][1] + posy));
        }
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    }
    ;
}
function measureText(text, ctx) {
    if (currentTranslation[text] != undefined) {
        text = currentTranslation[text];
    }
    return ctx.measureText(text);
}
function pictureEditGetPixel(px, py) {
    if (px < 0) {
        return "_" + Math.floor(1E7 * Math.random()).toString(16);
    }
    if (py < 0) {
        return "_" + Math.floor(1E7 * Math.random()).toString(16);
    }
    if (py >= moodLightSizeY) {
        return "_" + Math.floor(1E7 * Math.random()).toString(16);
    }
    if (px >= moodLightSizeX) {
        return "_" + Math.floor(1E7 * Math.random()).toString(16);
    }
    return pictureValues[page][py * moodLightSizeY + px];
}
function pictureEditSetPixel(px, py, value) {
    pictureValues[page][py * moodLightSizeY + px] = value;
    var a = document.getElementById("y" + px + "x" + py);
    if (!value.startsWith("#")) {
        value = "#" + value;
    }
    if (a == null) {
        return;
    }
    a.style.backgroundColor = value;
}
function pictureEditFill(px, py) {
    var ogColor = pictureEditGetPixel(px, py);
    var color = rgb2hex(colorPicker.spectrum("get")._r, colorPicker.spectrum("get")._g, colorPicker.spectrum("get")._b);
    if (pictureEditGetPixel(px, py) == color) {
        return;
    }
    else {
        pictureEditSetPixel(px, py, color);
        if (pictureEditGetPixel(px + 1, py) == ogColor) {
            pictureEditFill(px + 1, py);
        }
        if (pictureEditGetPixel(px - 1, py) == ogColor) {
            pictureEditFill(px - 1, py);
        }
        if (pictureEditGetPixel(px, py + 1) == ogColor) {
            pictureEditFill(px, py + 1);
        }
        if (pictureEditGetPixel(px, py - 1) == ogColor) {
            pictureEditFill(px, py - 1);
        }
    }
}
function pictureEditMarkUsedTool() {
    for (var x = 0; x < 10; x++) {
        if (document.getElementById("pictureEditTool_" + x) != undefined) {
            document.getElementById("pictureEditTool_" + x).className = "pictureEditTool";
        }
    }
    document.getElementById("pictureEditTool_" + pictureEditTool).className = "pictureEditTool_sel";
}
/**
 * 0: Off, 1: Responses, 2: sends connect
 */
let moodLightStatus = 0;
//MQTT
let latesMQTTMessage = "";
let client;
function mqttConstructor() {
    client = new Paho.MQTT.Client(host, 10833, "client" + ((new Date).getTime().toString(16) + Math.floor(1E7 * Math.random()).toString(16)));
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    try {
        client.connect({ onSuccess: onConnect, useSSL: true, onFailure: onFailure, userName: myUser, password: myPass });
    }
    catch (e) {
        if (e.message == "Failed to construct 'WebSocket': The URL 'wss://:10833/mqtt' is invalid.") {
            settingsInfo["$settings.mqtt.connection"] = "Es wird ein Host für eine Verbindung benötigt.";
        }
        else {
            settingsInfo["$settings.mqtt.connection"] = e.message;
        }
        staticElementsData["$settings.mqtt.connection"] = false;
        console.error(e);
        //console.error("empty data!")
    }
}
function onConnect() {
    UpdateStaticSettingsIfInSettings();
    console.log("onConnect");
    client.subscribe(myTopic);
    //check firmware
    send("V");
    waitForFirmware = true;
}
function onFailure() {
    UpdateStaticSettingsIfInSettings();
    settingsInfo["$settings.mqtt.connection"] = "Failed: evtl. Passwort/Topic/Username Falsch";
    console.log("on Failure");
}
function onConnectionLost(responseObject) {
    if (responseObject.errorCode != 0) {
        staticElementsData["$settings.mqtt.connection"] = false;
        console.log("onConnectionLost:" + responseObject.errorMessage + "\nreconnecting...");
        connect();
    }
}
function reconnect() {
    if (client.isConnected()) {
        client.disconnect();
        UpdateStaticSettingsIfInSettings();
    }
    staticElementsData["$settings.mqtt.connection"] = undefined;
    settingsInfo["$settings.mqtt.connection"] = "Verbinden...";
    connect();
}
function onMessageArrived(message) {
    //console.log("onMessageArrived:" + message.payloadString);
    var tag = document.createElement("p");
    var text = document.createTextNode(message.payloadString);
    tag.appendChild(text);
    tag.innerHTML = highlight(tag.innerHTML);
    var objDiv = document.querySelector("#consoleOut");
    var objDiv2 = document.querySelector("#consoleOut2");
    objDiv.appendChild(tag);
    objDiv2.scrollTop = objDiv2.scrollHeight;
    if (waitForFirmware && message.payloadString.startsWith(";V") && message.payloadString.includes("x")) {
        moodLightStatus = 1;
        firmwareToSettingsCheck(message.payloadString);
    }
    else if (message.payloadString.startsWith(";;connected")) {
        moodLightStatus = 2;
    }
    else if (message.payloadString.substring(1, 0) == ";" && waitingForMQTTPic) {
        console.log("load");
        pictureValues[page] = pictureString2Value(message.payloadString.substring(1));
        loadPictureVal(pictureValues[page]);
        waitingForMQTTPic = false;
    }
    else if (message.payloadString.substring(1, 0) == ";") {
        LiveMoodLightUpdate(message.payloadString.replace(";", ""));
    }
    latesMQTTMessage = message.payloadString;
    setHighLightInformation();
}
function send(dat) {
    var message = new Paho.MQTT.Message(dat);
    message.destinationName = myTopic;
    client.send(message);
}
function connect() {
    mqttConstructor();
    //client.connect({ onSuccess: onConnect, useSSL: true, onFailure: onFailure, userName: myUser, password: myPass });
}
//# sourceMappingURL=utilitys.js.map