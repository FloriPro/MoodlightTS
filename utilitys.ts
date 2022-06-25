function addZero(i: number | string, leng: number) {
    var ii = i.toString();
    while (ii.length < leng) {
        ii = "0" + ii;
    }
    return ii;
}
async function delAll() {
    for (var p of alphabet) {
        for (var i = 0; i < 100; i++) {
            await delay(100)
            send("X" + p + addZero(i, 2))
        }
    }
}
function getMS(): number {
    var d = new Date();
    return d.getTime()
}

let body = document.querySelector("body") as HTMLBodyElement;

let oldEditType: string;
function updateFullscreen() {
    if (setSettings["Vollbild"] == "true") {
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
                        drawScreen()
                        Question = ["Vollbild benötigt!", {
                            "Hier Drücken": function (seId) {
                                body.requestFullscreen({ navigationUI: "show" })
                                goTo(oldEditType, 1);
                            }
                        }, oldEditType]
                    }
                }, 100)
            })
        } else if (editType == "Question") {
            if (Question[0] != "Vollbild benötigt!") return;
            if (Object.keys(Question[1])[0] != "Hier Drücken") return;
            goTo(oldEditType, 1);
            setTimeout(updateRects, 50);
        }
    } else {
        if (document.fullscreenElement != null) {
            document.exitFullscreen();
        }
    }
}
setInterval(() => {
    updateFullscreen()
}, 500)


function savePictureEdit() {
    if (pictureEditType == 0) {
        download(JSON.stringify([pictureValue2String(pictureValues[0])]), "JSON", "picture.mopic");
    } else {
        var anim = []
        for (var i = 0; i < pictureValues.length; i++) {
            anim.push(pictureValue2String(pictureValues[i]));
        }
        download(JSON.stringify(anim), "JSON", "animation.mopic");
    }
}