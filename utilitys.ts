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
                        goTo("Question", 1)
                        Question = ["", {
                            "Hier Drücken": function (seId) {
                                body.requestFullscreen({ navigationUI: "show" })
                                goTo("standartEdit", 1);
                            }
                        }]
                    }
                }, 100)
            })
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