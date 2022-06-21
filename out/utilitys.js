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
function updateFullscreen() {
    if (setSettings["Vollbild"] == "true") {
        if (document.fullscreenElement == null) {
            body.requestFullscreen({ navigationUI: "show" }).catch(() => {
                setTimeout(function () {
                    if (document.fullscreenElement == null) {
                        drawReal.fill("black", ctx);
                        let latestCanvasPicStr = canvas.toDataURL("image/png");
                        latestCanvasPic.src = latestCanvasPicStr;
                        latestCanvasPic = new Image;
                        goTo("Question", 1);
                        Question = ["", {
                                "Hier Drücken": function (seId) {
                                    body.requestFullscreen({ navigationUI: "show" });
                                    goTo("standartEdit", 1);
                                }
                            }];
                    }
                }, 100);
            });
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
//# sourceMappingURL=utilitys.js.map