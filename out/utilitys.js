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
class drawApp {
    image(image, posx, posy, ctx) {
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
//# sourceMappingURL=utilitys.js.map