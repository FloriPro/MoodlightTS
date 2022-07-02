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
//# sourceMappingURL=utilitys.js.map