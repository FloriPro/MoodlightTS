"use strict";
//utility variables
var font = "47px msyi";
var host = "hotti.info";
var port = 10833;
var myTopic = "fablab114/ML";
var myUser = "fablab114";
var myPass = "fab!FG1Dw9";
var mouseX = 500;
var mouseY = 500;
var mouse = {};
var pressedKeys = {};
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var c = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
createUserEvents();
function createUserEvents() {
    canvas.addEventListener("mousedown", mousedown);
    canvas.addEventListener("mouseup", mouseup);
    canvas.addEventListener("mousemove", mousemove);
    document.addEventListener("keydown", keyEvent);
    document.addEventListener("keyup", keyEvent);
    window.onresize = resize;
    function mousemove(e) {
        mouseX = e.changedTouches ?
            e.changedTouches[0].pageX :
            e.pageX;
        mouseY = e.changedTouches ?
            e.changedTouches[0].pageY :
            e.pageY;
    }
    function mousedown(e) {
        mouse[e.button] = true;
        offsetX = mouseX;
        offsetY = mouseY;
    }
    function mouseup(e) {
        mouse[e.button] = false;
        if (e.button == 0) {
        }
    }
    function keyEvent(e) {
        if (e.key == "Alt") {
            e.preventDefault();
        }
        if (e.type == "keyup") {
            pressedKeys[e.key] = false;
        }
        if (e.type == "keydown") {
            pressedKeys[e.key] = true;
        }
    }
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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
var client = new Paho.MQTT.Client('hotti.info', 10833, "clientId123" + ((new Date).getTime().toString(16) + Math.floor(1E7 * Math.random()).toString(16)));
function mqttConstructor() {
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({ onSuccess: onConnect, useSSL: true, onFailure: onFailure, userName: myUser, password: myPass });
}
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe(myTopic);
}
function onFailure() { console.log("onFailure"); }
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
}
function send(dat) {
    var rawString = encodeURIComponent(dat);
    var formData = { topic: myTopic, user: myUser, password: myPass };
    var settings = {
        url: "http://dyn.hotti.info/fabuser/ml6/setcolor.php?c=" + rawString,
        method: "POST",
        data: formData,
        timeout: 1000,
        crossDomain: true,
        retries: 0,
        success: function (result) {
            console.log("Success!");
            console.log(result);
        }
    };
    $.ajax(settings);
}
//END
var drawApp = /** @class */ (function () {
    function drawApp() {
    }
    drawApp.prototype.rect = function (posx, posy, width, height, color, ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(posx, posy, width, height);
        ctx.fill();
        ctx.closePath();
    };
    ;
    drawApp.prototype.roundedRect = function (posx, posy, width, height, color, radius, ctx) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineJoin = "round";
        ctx.lineWidth = radius;
        ctx.beginPath();
        ctx.strokeRect(posx, posy, width, height);
        ctx.stroke();
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
    };
    drawApp.prototype.circle = function (posx, posy, radius, color, ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(posx, posy, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    };
    ;
    drawApp.prototype.fill = function (color, ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
        ctx.closePath();
    };
    ;
    drawApp.prototype.text = function (pox, posy, Text, color, align, ctx) {
        if (ctx.font != font) {
            ctx.font = font;
        }
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(Text, pox, posy);
    };
    ;
    drawApp.prototype.polygon = function (ctx, color, pos) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(pos[0][0], pos[0][1]);
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo(pos[i][0], pos[i][1]);
        }
        ctx.fill();
        ctx.closePath();
    };
    ;
    drawApp.prototype.polygonOutline = function (ctx, color, pos, width) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(pos[0][0], pos[0][1]);
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo(pos[i][0], pos[i][1]);
        }
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    };
    ;
    return drawApp;
}());
var Utilitys = /** @class */ (function () {
    function Utilitys() {
    }
    Utilitys.prototype.normalize = function (degrees, min, max) {
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
    ;
    Utilitys.prototype.clamp = function (i, min, max) {
        if (i < min) {
            i = min;
        }
        if (i > max) {
            i = max;
        }
        return i;
    };
    ;
    Utilitys.prototype.Random = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    ;
    return Utilitys;
}());
function removeItem(data, index) {
    var tempList = data;
    data = [];
    for (var j = 0; j < tempList.length; j++) {
        if (j != index)
            data.push(tempList[j]);
    }
    return data;
}
function elementLenghtAndDraw(Element, px, py) {
    var text = Element[0];
    if (setYellow.indexOf(text) != -1) {
        drawcolor = colors["YellowBlock"];
        drawcolorAccent = colors["YellowBlockAccent"];
    }
    else if (setPurple.indexOf(text) != -1) {
        drawcolor = colors["PurpleBlock"];
        drawcolorAccent = colors["PurpleBlockAccent"];
    }
    else {
        drawcolor = colors["blueBlock"];
        drawcolorAccent = colors["blueBlockAccent"];
    }
    var l = ctx.measureText(Element[0]).width + 10;
    //space between options: 5;
    for (var x = 0; x < Element[1].length; x++) {
        l += 5;
        var t = Element[1][x];
        if (t == "") {
            t = " ";
        }
        l += ctx.measureText(t).width;
        l += 5;
    }
    draw.roundedRect(px, py, l, -(blockheight - 10), drawcolorAccent, 10, ctx); //body outline
    draw.roundedRect(px + 1, py - 1, l - 2, -blockheight + 12, drawcolor, 10, ctx); //body
    draw.text(px, py, text, "#000000", "left", ctx);
    l = ctx.measureText(text).width + 7;
    for (var x = 0; x < Element[1].length; x++) {
        var t = Element[1][x];
        if (t == "") {
            t = " ";
        }
        l += 5;
        draw.roundedRect(px + l + 2, py - 5, ctx.measureText(t).width - 4, -(blockheight - 10) + 10, "#ffffff", 10, ctx); //body outline
        draw.text(px + l, py, t, "#000000", "left", ctx);
        l += 5;
        l += ctx.measureText(t).width;
    }
    return l;
}
function elementLenght(Element) {
    var text = Element[0];
    var l = ctx.measureText(Element[0]).width + 10;
    //space between options: 5;
    for (var x = 0; x < Element[1].length; x++) {
        l += 5;
        var t = Element[1][x];
        if (t == "") {
            t = " ";
        }
        l += ctx.measureText(t).width;
        l += 5;
    }
    return l;
}
//Game Variables
var menuOpen = 0;
var menuImg = new Image();
menuImg.src = '/files/menu.png';
var menuButtons = { "Speichern": downloadProject, "Laden": function () { var i = document.getElementById("avatar"); i.click(); }, "Hinzufügen": function () { console.log("hinzufügen"); }, "Einstellungen": function () { console.log("einstellungen"); } };
var sidebarSize = 250;
var sidebarFadeIn = 100;
var textLength = 0;
var mouseSelectionLeft = -1;
var mouseDataLeft = -1;
mqttConstructor();
var draw = new drawApp();
var util = new Utilitys();
var available = [["Wait", ["0"]], ["Laden", ["0"]], ["Text", ["Text", "10"]], ["Uhrzeit", ["10"]], ["Bild anzeigen", ["0", "0"]], ["Animationen", ["0", "0", "10"]], ["Füllen", ["0", "0", "0"]], ["Loop", ["2"]], ["Unendlich", []], ["Custom", [""]]];
var description = [["Wait", ["Sekunden"]], ["Laden", ["Nummer"]], ["Text", ["Text", "Geschwindigkeit"]], ["Uhrzeit", ["Geschwindigkeit"]], ["Bild anzeigen", ["[Bild]", "Übergangszeit"]], ["Animationen", ["[Animation]", "Übergangszeit", "Wartezeit"]], ["Füllen", ["R", "G", "B"]], ["Loop", ["Wiederholungen"]], ["Unendlich", []], ["Custom", ["Code"]]];
var colors = { "background": "#f7f7f7", "backgroundPoints": "#646464", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#b0b0b0" };
var setYellow = ["Loop", "Unendlich", "Start", "End"];
var setPurple = ["Bild anzeigen", "Animationen", "Laden"];
var notDragable = ["Start", "End"];
var pictures = ["000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d70000000000000000001e12001e12001e12001e12000000000000000000001e12001e1200000000000000"];
var Elements = [[["Start", ["0"]], ["Füllen1", ["0", "255", "255"]], ["Bild anzeigen", ["0"]]], [["Start", ["1"]]]];
var ElementPositions = [[0, 0], [370, -50]];
var FreeElements = [["Füllen2", ["255", "255", "0"], [300, 300]], ["Füllen3", ["255", "255", "0"], [600, 300]]];
var drawcolor = "";
var drawcolorAccent = "";
var drawcolorO = "";
var drawcolorAccentO = "";
console.log(Elements);
var backgroundPointSize = 20;
var offsetX = 0;
var offsetY = 0;
var posx = 100;
var posy = 100;
var px = 0;
var py = 0;
var pyC = 0;
var blockheight = 38;
function download(content, mimeType, filename) {
    var a = document.createElement('a');
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
}
function downloadProject() {
    var filename = "data.moproj";
    var myJSON = JSON.stringify(Elements);
    download(myJSON, "text", filename);
}
function drawScreen() {
    ////////////
    // Update //
    ////////////
    // mouseSelectionLeft types: 0=move Screen; 1=move Elements; -2=none;
    //check what mouse Should doo
    if (mouse[0] && mouseSelectionLeft == -1) {
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
        //use Menu
        if (mouseSelectionLeft == -1) {
            if (menuOpen == 1 && mouseX > canvas.width - 250) {
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
                var sel = Math.ceil((-blockheight + mouseY - 10) / (blockheight + 10));
                if (sel < available.length) {
                    offsetX = mouseX - 10 + mouseX;
                    offsetY = mouseY - (blockheight / 2);
                    mouseSelectionLeft = 1;
                    mouseDataLeft = FreeElements.length;
                    var i_1 = available[sel];
                    FreeElements.push([i_1[0], i_1[1], [mouseX - posx, mouseY - posy]]);
                }
            }
        }
        //search Free Elements
        if (mouseSelectionLeft == -1) {
            for (var ElementLoadPos = 0; ElementLoadPos < FreeElements.length; ElementLoadPos++) {
                var px_1 = posx + FreeElements[ElementLoadPos][2][0];
                var py_1 = posy + FreeElements[ElementLoadPos][2][1];
                textLength = elementLenght([FreeElements[ElementLoadPos][0], FreeElements[ElementLoadPos][1]]);
                if (mouseX > px_1 && mouseX < px_1 + textLength && mouseY < py_1 && mouseY > py_1 - blockheight) {
                    mouseSelectionLeft = 1;
                    mouseDataLeft = ElementLoadPos;
                    break;
                }
            }
        }
        //search non Free Elements
        if (mouseSelectionLeft == -1) {
            for (var ElementLoadPos = 0; ElementLoadPos < Elements.length; ElementLoadPos++) {
                for (var ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
                    var px_2 = posx + ElementPositions[ElementLoadPos][0];
                    var py_2 = posy + ElementPositions[ElementLoadPos][1] + ElementList * blockheight;
                    textLength = elementLenght(Elements[ElementLoadPos][ElementList]);
                    if (mouseX > px_2 && mouseX < px_2 + textLength && mouseY < py_2 && mouseY > py_2 - blockheight && notDragable.indexOf(Elements[ElementLoadPos][ElementList][0]) == -1) {
                        offsetX = mouseX + (mouseX - px_2);
                        offsetY = mouseY + (mouseY - py_2);
                        mouseSelectionLeft = 1;
                        mouseDataLeft = FreeElements.length;
                        var i_2 = Elements[ElementLoadPos][ElementList];
                        FreeElements.push([i_2[0], i_2[1], [mouseX - posx, mouseY - posy]]);
                        if (!keyDown("Alt")) {
                            Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList);
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
    //mouse let go
    if (mouseSelectionLeft != -1 && !mouse[0]) {
        if (mouseX < sidebarSize && mouseSelectionLeft == 1) {
            FreeElements = removeItem(FreeElements, mouseDataLeft);
            mouseSelectionLeft = -1;
        }
        //dropFree Element
        if (mouseSelectionLeft == 1) {
            for (var ElementList = 0; ElementList < Elements.length; ElementList++) {
                //if x matches
                if (ElementPositions[ElementList][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementList][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                    //if not over max len or below
                    if (FreeElements[mouseDataLeft][2][1] > ElementPositions[ElementList][1] + (blockheight - 20) && FreeElements[mouseDataLeft][2][1] < ElementPositions[ElementList][1] + blockheight * (Elements[ElementList].length + 1)) {
                        //Elements[ElementList].push()
                        var insertY = 0;
                        insertY = Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementList][1]) / blockheight);
                        Elements[ElementList].splice(insertY, 0, [FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                        //Elements[ElementList]=insertArrayAt([FreeElements[mouseDataLeft][0], FreeElements[mouseSelectionLeft][1]],0,Elements[ElementList])
                        FreeElements = removeItem(FreeElements, mouseDataLeft);
                        break;
                    }
                }
            }
            mouseSelectionLeft = -1;
        }
        mouseSelectionLeft = -1;
    }
    //move cam
    if (mouse[1] || mouseSelectionLeft == 0) {
        posx += mouseX - offsetX;
        posy += mouseY - offsetY;
    }
    //move Free Element
    if (mouseSelectionLeft == 1 && !mouse[1]) {
        FreeElements[mouseDataLeft][2][0] += mouseX - offsetX;
        FreeElements[mouseDataLeft][2][1] += mouseY - offsetY;
    }
    offsetX = mouseX;
    offsetY = mouseY;
    //////////
    // draw //
    //////////
    //background
    draw.fill(colors["background"], ctx);
    for (var x = 0; x < Math.ceil((canvas.width + 10) / backgroundPointSize); x++) {
        for (var y = 0; y < Math.ceil((canvas.height + 10) / backgroundPointSize); y++) {
            var px_3 = x * backgroundPointSize + posx + 10;
            px_3 = util.normalize(px_3, 0, canvas.width);
            var py_3 = y * backgroundPointSize + posy + 10;
            py_3 = util.normalize(py_3, 0, canvas.height);
            draw.rect(px_3 - 5, py_3 - 5, 2, 2, colors["backgroundPoints"], ctx);
        }
    }
    //Elements
    for (var ElementLoadPos = 0; ElementLoadPos < Elements.length; ElementLoadPos++) {
        var i_3 = 0;
        for (var ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
            //if dragElement in middle
            if (mouseSelectionLeft == 1) {
                if (ElementPositions[ElementLoadPos][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementLoadPos][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                    if (ElementList == Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementLoadPos][1]) / blockheight)) {
                        if (ElementList != 0) {
                            textLength = elementLenght([FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                            ctx.globalAlpha = 0.6;
                            draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), colors["MoveBlockShaddow"], 10, ctx); //body
                            ctx.globalAlpha = 1;
                            i_3++;
                        }
                    }
                }
            }
            px = posx + ElementPositions[ElementLoadPos][0];
            py = posy + ElementPositions[ElementLoadPos][1] + i_3 * blockheight;
            textLength = elementLenghtAndDraw(Elements[ElementLoadPos][ElementList], px, py);
            var text = Elements[ElementLoadPos][ElementList][0];
            if (setYellow.indexOf(text) != -1) {
                drawcolor = colors["YellowBlock"];
                drawcolorAccent = colors["YellowBlockAccent"];
            }
            else if (setPurple.indexOf(text) != -1) {
                drawcolor = colors["PurpleBlock"];
                drawcolorAccent = colors["PurpleBlockAccent"];
            }
            else {
                drawcolor = colors["blueBlock"];
                drawcolorAccent = colors["blueBlockAccent"];
            }
            //connector
            if (ElementList != 0) {
                pyC = (py + 4) - blockheight;
                draw.polygon(ctx, drawcolorO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]); //connector
                draw.polygonOutline(ctx, drawcolorAccentO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1); //connector outline}
            }
            drawcolorO = drawcolor;
            drawcolorAccentO = drawcolorAccent;
            i_3++;
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
                        draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), colors["MoveBlockShaddow"], 10, ctx); //body
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }
    }
    //Free Elements
    ctx.globalAlpha = 0.5;
    for (var FreeElementPos = 0; FreeElementPos < FreeElements.length; FreeElementPos++) {
        var text = FreeElements[FreeElementPos][0] + " |" + FreeElements[FreeElementPos][1].join("|") + "|";
        px = FreeElements[FreeElementPos][2][0] + posx;
        py = FreeElements[FreeElementPos][2][1] + posy;
        textLength = elementLenghtAndDraw([FreeElements[FreeElementPos][0], FreeElements[FreeElementPos][1]], px, py);
        //draw.roundedRect(px, py, textLength, -(blockheight - 10), drawcolorAccent, 10, ctx) //body outline
        //draw.roundedRect(px + 1, py - 1, textLength - 2, -blockheight + 12, drawcolor, 10, ctx) //body
        pyC = (py + 4);
        draw.polygon(ctx, drawcolor, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]); //connector
        draw.polygonOutline(ctx, drawcolorAccent, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1); //connector outline
        //draw.text(px, py, text, "#000000", "left", ctx);
    }
    ctx.globalAlpha = 1;
    //rightClickMenu
    if (false) {
        var hei = 1;
        var px_4 = 0;
        var py_4 = 0;
        draw.polygon(ctx, "#ff0000", [[px_4, py_4 + 20], [px_4 + 20, py_4 + 20], [px_4 + 30, py_4 + 5], [px_4 + 40, py_4 + 20], [px_4 + 250, py_4 + 20], [px_4 + 250, py_4 + (hei * blockheight) + 10], [px_4, py_4 + (hei * blockheight) + 10]]); //dropdownMenu
    }
    //new Object
    if (mouseX < (sidebarSize + sidebarFadeIn)) {
        var mul = ((sidebarFadeIn - (mouseX - sidebarSize)) / sidebarFadeIn);
        if (mul > 1) {
            mul = 1;
        }
        ctx.globalAlpha = 0.5 * mul;
        draw.rect(0, 0, sidebarSize, canvas.height, "#c0c0c0", ctx);
        ctx.globalAlpha = mul;
        for (var i_4 = 0; i_4 < available.length; i_4++) {
            var text = available[i_4][0];
            textLength = ctx.measureText(text).width;
            px = 10;
            py = i_4 * (blockheight + 10) + blockheight;
            if (setYellow.indexOf(text) != -1) {
                drawcolor = colors["YellowBlock"];
                drawcolorAccent = colors["YellowBlockAccent"];
            }
            else if (setPurple.indexOf(text) != -1) {
                drawcolor = colors["PurpleBlock"];
                drawcolorAccent = colors["PurpleBlockAccent"];
            }
            else {
                drawcolor = colors["blueBlock"];
                drawcolorAccent = colors["blueBlockAccent"];
            }
            draw.roundedRect(px, py, textLength, -(blockheight - 10), drawcolorAccent, 10, ctx); //body outline
            draw.roundedRect(px + 1, py - 1, textLength - 2, -blockheight + 12, drawcolor, 10, ctx); //body
            py += 4;
            draw.polygon(ctx, drawcolor, [[px + 0, py + 0], [px + 5, py + 7], [px + 15, py + 7], [px + 20, py + 0]]); //connector
            draw.polygonOutline(ctx, drawcolorAccent, [[px + 0, py + 0], [px + 5, py + 7], [px + 15, py + 7], [px + 20, py + 0]], 1); //connector outline
            draw.text(px, py - 4, text, "#000000", "left", ctx);
        }
        ctx.globalAlpha = 1;
    }
    //Menu
    var mOpen = menuOpen;
    if (mOpen < 0) {
        mOpen = 1 + mOpen;
    }
    if (mOpen != 0) {
        if (mOpen > 1) {
            mOpen = 1;
            menuOpen = 1;
        }
        ctx.globalAlpha = 0.7 * mOpen;
        draw.rect(canvas.width - (150 + (100 * mOpen)), 0, 150 + (100 * mOpen), canvas.height * mOpen, "#000000", ctx);
        var k_1 = Object.keys(menuButtons);
        ctx.globalAlpha = mOpen;
        for (var x = 0; x < k_1.length; x++) {
            draw.text(canvas.width - 10, 90 + x * 35, k_1[x], "#ffffff", "right", ctx);
        }
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
    var r = 30;
    var s = 30;
    for (var x = 0; x < 3; x++) {
        px = canvas.width - s - r / 2;
        py = 0 + r / 2 + (x * (s / 2));
        draw.roundedRect(px, py, s, 1, "#000000", 5, ctx);
    }
    //keysDown
    var k = Object.keys(pressedKeys);
    var i = 0;
    for (var x = 0; x < k.length; x++) {
        if (pressedKeys[k[x]]) {
            draw.text(0, i * 35 + 35, k[x], "#000000", "left", ctx);
            i++;
        }
    }
}
function cursorUpdate() {
    var normal = true;
    if (keyDown("Alt")) {
        c.style.cursor = "copy";
        normal = false;
    }
    if (mouseX > canvas.width - 50 - 15 && mouseY < 50 + 15) {
        c.style.cursor = "pointer";
        normal = false;
    }
    if (menuOpen == 1 && mouseX > canvas.width - 250 && mouseY > 90 - 35 && mouseY < 90 + (Object.keys(menuButtons).length - 1) * 35) {
        c.style.cursor = "pointer";
        normal = false;
    }
    //else
    if (normal) {
        c.style.cursor = "default";
    }
    //other
    if (document.hidden) {
        pressedKeys["Alt"] = false;
    }
}
document.addEventListener("visibilitychange", function () {
    pressedKeys["Alt"] = false;
});
setInterval(cursorUpdate, 100);
setInterval(drawScreen, 5);
//# sourceMappingURL=main.js.map