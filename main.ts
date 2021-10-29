//utility variables
let host = "hotti.info";
let port = 10833;
let myTopic = "fablab114/ML";
let myUser = "fablab114";
let myPass = "fab!FG1Dw9";

let mouseX: number = 500;
let mouseY: number = 500;
let mouse: { [name: number]: boolean } = {};

let pressedKeys: { [name: string]: boolean } = {};

let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");

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

    function mousemove(e: MouseEvent | TouchEvent) {
        mouseX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        mouseY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageY :
            (e as MouseEvent).pageY;
    }
    function mousedown(e: MouseEvent) {
        mouse[e.button] = true;
        offsetX = mouseX;
        offsetY = mouseY;
    }
    function mouseup(e: MouseEvent) {
        mouse[e.button] = false;
        if (e.button == 0) {
        }
    }
    function keyEvent(e: KeyboardEvent) {
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
function keyDown(key: string) {
    if (!(key in pressedKeys)) { return false; }
    if (pressedKeys[key] == false) { return false; }
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
function onConnectionLost(responseObject: { errorCode: number; errorMessage: string; }) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}
function onMessageArrived(message: { payloadString: string; }) {
    console.log("onMessageArrived:" + message.payloadString);
}
function send(dat: string | number | boolean) {
    var rawString = encodeURIComponent(dat);
    var formData = { topic: myTopic, user: myUser, password: myPass };
    var settings = {
        url: "http://dyn.hotti.info/fabuser/ml6/setcolor.php?c=" + rawString,
        method: "POST",
        data: formData,
        timeout: 1000,
        crossDomain: true,
        retries: 0,
        success: function (result: any) {
            console.log("Success!");
            console.log(result);
        }
    };
    $.ajax(settings);
}
//END


class drawApp {
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

        ctx.fillRect(posx, posy, width, height);

        ctx.stroke();
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
    public text(pox: any, posy: any, Text: any, color: any, align: any, ctx: CanvasRenderingContext2D) {
        if (ctx.font != '37px sans-serif') { ctx.font = '37px sans-serif'; }
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(Text, pox, posy);
    };
    public polygon(ctx: CanvasRenderingContext2D, color: string, pos: [number, number][]) {
        ctx.fillStyle = color;

        ctx.beginPath();

        ctx.moveTo(pos[0][0], pos[0][1])
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo(pos[i][0], pos[i][1])
        }

        ctx.fill();
        ctx.closePath();
    };
    public polygonOutline(ctx: CanvasRenderingContext2D, color: string, pos: [number, number][], width: number) {
        ctx.strokeStyle = color;

        ctx.beginPath();

        ctx.moveTo(pos[0][0], pos[0][1])
        for (var i = 0; i < pos.length; i++) {
            ctx.lineTo(pos[i][0], pos[i][1])
        }
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    };
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

//Game Variables
let sidebarSize = 250;
let sidebarFadeIn = 100;

let textLength = 0;

let mouseSelectionLeft = -1;
let mouseDataLeft: any = -1;

mqttConstructor();

let draw = new drawApp();
let util = new Utilitys();

let available: [string, string[]][] = [["Füllen", ["R", "G", "B"]], ["Bild anzeigen", ["Bild id"]]];
let colors = { "background": "#f7f7f7", "backgroundPoints": "#646464", "blueBlock": "#0082ff", "blueBlockAccent": "#0056aa", "YellowBlock": "#ffd000", "YellowBlockAccent": "#aa8a00", "PurpleBlock": "#d900ff", "PurpleBlockAccent": "#9000aa", "MoveBlockShaddow": "#b0b0b0" };
let setYellow = ["Loop", "Unendlich", "Start", "End"];
let setPurple = ["Bild anzeigen", "Animationen", "Laden"];
let notDragable = ["Start", "End"];


let pictures: string[] = ["000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d7000000000000000000000000d7d7d7d7d7d70000000000000000001e12001e12001e12001e12000000000000000000001e12001e1200000000000000"]
let Elements: [string, string[]][][] = [[["Start", ["0"]], ["Füllen1", ["0", "255", "255"]], ["Bild anzeigen", ["0"]]], [["Start", ["1"]]]];
let ElementPositions = [[0, 0], [255, 0]];
let FreeElements: [string, string[], [number, number]][] = [["Füllen2", ["255", "255", "0"], [300, 300]], ["Füllen3", ["255", "255", "0"], [600, 300]]];
let drawcolor = "";
let drawcolorAccent = "";
let drawcolorO = "";
let drawcolorAccentO = "";

console.log(Elements)

let backgroundPointSize = 20;
function removeItem(data: any[], index: number) {
    var tempList = data;
    data = [];

    for (var j = 0; j < tempList.length; j++) {
        if (j != index)
            data.push(tempList[j]);
    }
    return data;
}

let offsetX = 0;
let offsetY = 0;

let posx = 0;
let posy = 0;

let px: number = 0;
let py: number = 0;
let pyC: number = 0;

let blockheight = 38;


function drawScreen() {
    ////////////
    // Update //
    ////////////

    // mouseSelectionLeft types: 0=move Screen; 1=move Element; 

    //check what mouse Should doo
    if (mouse[0] && mouseSelectionLeft == -1) {
        //search Free Elements
        for (let ElementLoadPos = 0; ElementLoadPos < FreeElements.length; ElementLoadPos++) {
            let px = posx + FreeElements[ElementLoadPos][2][0];
            let py = posy + FreeElements[ElementLoadPos][2][1];
            let text = FreeElements[ElementLoadPos][0];
            textLength = ctx.measureText(text).width
            if (mouseX > px && mouseX < px + textLength && mouseY < py && mouseY > py - blockheight) {
                mouseSelectionLeft = 1;
                mouseDataLeft = ElementLoadPos;
                break;
            }
        }

        if (mouseSelectionLeft == -1) {
            //search non Free Elements
            for (let ElementLoadPos = 0; ElementLoadPos < Elements.length; ElementLoadPos++) {
                for (let ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
                    let px = posx + ElementPositions[ElementLoadPos][0];
                    let py = posy + ElementPositions[ElementLoadPos][1] + ElementList * blockheight;
                    textLength = ctx.measureText(Elements[ElementLoadPos][ElementList][0]).width
                    if (mouseX > px && mouseX < px + textLength && mouseY < py && mouseY > py - blockheight && notDragable.indexOf(Elements[ElementLoadPos][ElementList][0]) == -1) {
                        offsetX = mouseX + (mouseX - px);
                        offsetY = mouseY + (mouseY - py);
                        mouseSelectionLeft = 1;
                        mouseDataLeft = FreeElements.length;
                        let i = Elements[ElementLoadPos][ElementList];
                        FreeElements.push([i[0], i[1], [mouseX - posx, mouseY - posy]])
                        if (!keyDown("Alt")) {
                            Elements[ElementLoadPos] = removeItem(Elements[ElementLoadPos], ElementList)
                        }
                        break;
                    }
                }
            }
        }



        if (mouseSelectionLeft == -1) {
            offsetX = mouseX;
            offsetY = mouseY;
            mouseSelectionLeft = 0;
        }
    }

    //mouse let go
    if (mouseSelectionLeft != -1 && !mouse[0]) {

        //dropFree Element
        if (mouseSelectionLeft == 1) {
            for (let ElementList = 0; ElementList < Elements.length; ElementList++) {
                //if x matches
                if (ElementPositions[ElementList][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementList][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                    //if not over max len or below
                    if (FreeElements[mouseDataLeft][2][1] > ElementPositions[ElementList][1] + (blockheight - 20) && FreeElements[mouseDataLeft][2][1] < ElementPositions[ElementList][1] + blockheight * (Elements[ElementList].length + 1)) {
                        //Elements[ElementList].push()
                        let insertY = 0;
                        insertY = Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementList][1]) / blockheight);
                        Elements[ElementList].splice(insertY, 0, [FreeElements[mouseDataLeft][0], FreeElements[mouseDataLeft][1]]);
                        //Elements[ElementList]=insertArrayAt([FreeElements[mouseDataLeft][0], FreeElements[mouseSelectionLeft][1]],0,Elements[ElementList])
                        FreeElements = removeItem(FreeElements, mouseDataLeft);
                        break;
                    }
                }
            }
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
    for (let x = 0; x < Math.ceil((canvas.width + 10) / backgroundPointSize); x++) {
        for (let y = 0; y < Math.ceil((canvas.height + 10) / backgroundPointSize); y++) {
            let px = x * backgroundPointSize + posx + 10;
            px = util.normalize(px, 0, canvas.width)
            let py = y * backgroundPointSize + posy + 10;
            py = util.normalize(py, 0, canvas.height)
            draw.rect(px - 5, py - 5, 2, 2, colors["backgroundPoints"], ctx);
        }
    }


    //Elements
    for (let ElementLoadPos = 0; ElementLoadPos < Elements.length; ElementLoadPos++) {
        let i = 0
        for (let ElementList = 0; ElementList < Elements[ElementLoadPos].length; ElementList++) {
            //if dragElement in middle
            if (mouseSelectionLeft == 1) {
                if (ElementPositions[ElementLoadPos][0] - 50 < FreeElements[mouseDataLeft][2][0] && ElementPositions[ElementLoadPos][0] + 200 > FreeElements[mouseDataLeft][2][0]) {
                    if (ElementList == Math.round((FreeElements[mouseDataLeft][2][1] - ElementPositions[ElementLoadPos][1]) / blockheight)) {
                        if (ElementList != 0) {
                            textLength = ctx.measureText(FreeElements[mouseDataLeft][0]).width;
                            ctx.globalAlpha = 0.6;
                            draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), colors["MoveBlockShaddow"], 10, ctx) //body
                            ctx.globalAlpha = 1;
                            i++;
                        }
                    }
                }
            }

            px = posx + ElementPositions[ElementLoadPos][0];
            py = posy + ElementPositions[ElementLoadPos][1] + i * blockheight;

            let text = Elements[ElementLoadPos][ElementList][0];

            if (setYellow.indexOf(text) != -1) {
                drawcolor = colors["YellowBlock"];
                drawcolorAccent = colors["YellowBlockAccent"];
            } else if (setPurple.indexOf(text) != -1) {
                drawcolor = colors["PurpleBlock"];
                drawcolorAccent = colors["PurpleBlockAccent"];
            } else {
                drawcolor = colors["blueBlock"];
                drawcolorAccent = colors["blueBlockAccent"];
            }

            textLength = ctx.measureText(text).width;
            draw.roundedRect(px, py, textLength, -(blockheight - 10), drawcolorAccent, 10, ctx) //body outline
            draw.roundedRect(px + 1, py - 1, textLength - 2, -blockheight + 12, drawcolor, 10, ctx) //body

            if (ElementList != 0) {
                pyC = (py + 4) - blockheight;
                draw.polygon(ctx, drawcolorO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]) //connector
                draw.polygonOutline(ctx, drawcolorAccentO, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1) //connector outline}
            }
            drawcolorO = drawcolor;
            drawcolorAccentO = drawcolorAccent;
            draw.text(px, py, text, "#000000", "left", ctx);

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
                        textLength = ctx.measureText(FreeElements[mouseDataLeft][0]).width;
                        ctx.globalAlpha = 0.6;
                        draw.roundedRect(px, py + blockheight, textLength, -(blockheight - 10), colors["MoveBlockShaddow"], 10, ctx) //body
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }
    }

    //Free Elements
    ctx.globalAlpha = 0.5;
    for (let FreeElementPos = 0; FreeElementPos < FreeElements.length; FreeElementPos++) {
        let text = FreeElements[FreeElementPos][0];
        textLength = ctx.measureText(text).width;
        if (setYellow.indexOf(text) != -1) {
            drawcolor = colors["YellowBlock"];
            drawcolorAccent = colors["YellowBlockAccent"];
        } else if (setPurple.indexOf(text) != -1) {
            drawcolor = colors["PurpleBlock"];
            drawcolorAccent = colors["PurpleBlockAccent"];
        } else {
            drawcolor = colors["blueBlock"];
            drawcolorAccent = colors["blueBlockAccent"];
        }


        px = FreeElements[FreeElementPos][2][0] + posx;
        py = FreeElements[FreeElementPos][2][1] + posy;

        draw.roundedRect(px, py, textLength, -(blockheight - 10), drawcolorAccent, 10, ctx) //body outline
        draw.roundedRect(px + 1, py - 1, textLength - 2, -blockheight + 12, drawcolor, 10, ctx) //body

        pyC = (py + 4);
        draw.polygon(ctx, drawcolor, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]]); //connector
        draw.polygonOutline(ctx, drawcolorAccent, [[px + 0, pyC + 0], [px + 5, pyC + 7], [px + 15, pyC + 7], [px + 20, pyC + 0]], 1); //connector outline

        draw.text(px, py, text, "#000000", "left", ctx);
    }
    ctx.globalAlpha = 1;

    //rightClickMenu
    if (false) {
        let hei = 1;
        let px = 0;
        let py = 0;
        draw.polygon(ctx, "#ff0000", [[px, py + 20], [px + 20, py + 20], [px + 30, py + 5], [px + 40, py + 20], [px + 250, py + 20], [px + 250, py + (hei * blockheight) + 10], [px, py + (hei * blockheight) + 10]]) //dropdownMenu
    }

    //new Object
    if (mouseX < (sidebarSize + sidebarFadeIn)) {
        let mul = ((sidebarFadeIn - (mouseX - sidebarSize)) / sidebarFadeIn);
        if (mul > 1) { mul = 1; }
        ctx.globalAlpha = 0.5 * mul;
        draw.rect(0, 0, sidebarSize, canvas.height, "#c0c0c0", ctx);
        ctx.globalAlpha = mul;

        for (let i = 0; i < available.length; i++) {
            let text = available[i][0];
            textLength = ctx.measureText(text).width;
            px = 10;
            py = i * (blockheight + 10) + blockheight;

            if (setYellow.indexOf(text) != -1) {
                drawcolor = colors["YellowBlock"];
                drawcolorAccent = colors["YellowBlockAccent"];
            } else if (setPurple.indexOf(text) != -1) {
                drawcolor = colors["PurpleBlock"];
                drawcolorAccent = colors["PurpleBlockAccent"];
            } else {
                drawcolor = colors["blueBlock"];
                drawcolorAccent = colors["blueBlockAccent"];
            }

            draw.roundedRect(px, py, textLength, -(blockheight - 10), drawcolorAccent, 10, ctx) //body outline
            draw.roundedRect(px + 1, py - 1, textLength - 2, -blockheight + 12, drawcolor, 10, ctx) //body
            py += 4;
            draw.polygon(ctx, drawcolor, [[px + 0, py + 0], [px + 5, py + 7], [px + 15, py + 7], [px + 20, py + 0]]); //connector
            draw.polygonOutline(ctx, drawcolorAccent, [[px + 0, py + 0], [px + 5, py + 7], [px + 15, py + 7], [px + 20, py + 0]], 1); //connector outline
            draw.text(px, py - 4, text, "#000000", "left", ctx);
        }
        ctx.globalAlpha = 1;
    }
}

setInterval(drawScreen, 5);