var available = {
    "Bestimmte Uhrzeit": {
        "!strUhrzeit: stunde:min": [],
    },
    "Wiederholung": {
        "sekunden": ["!numZeit: Ganzezahl"],
        "minuten": ["!numZeit: Ganzezahl"],
        "Stunden": ["!numZeit: Ganzezahl"],
        "Tage": ["!numZeit: Ganzezahl"],
    },
    "Server eingang": {
        "GET": ["!strPfad"],
        "POST": ["!strPfad", "!strVariablen(not implemented): 'var1,var2,var3,...'"]
    },
    "Website veränderung": {
        "!strURL mit pfad": [],
        "!strUpdates jede x Minuten": [],
    }
}

let t = false

let nowEdeting = -1;

window.onload = function () {
    var select0Sel = document.getElementById("select0");
    var select1Sel = document.getElementById("select1");
    var select2Sel = document.getElementById("select2");
    for (var x in available) {
        select0Sel.options[select0Sel.options.length] = new Option(x, x);
    }

    select0Sel.onchange = function () {
        for (var x = 0; x < 3; x++) {
            document.getElementById("input" + x).value = "";
        }


        //empty select2s- and select1s- dropdowns
        select2Sel.length = 1;
        select1Sel.length = 1;
        //display correct values

        //hide all input
        for (var i = 0; i < 3; i++) {
            document.getElementById("input" + i).style.display = "none";
        }

        var l = 0;
        var inp = 0;
        for (var y in available[this.value]) {
            if (y[0] != "!") {
                select1Sel.options[select1Sel.options.length] = new Option(y, y);
                l++;
            } else {
                document.getElementById("input" + inp).style.display = "";
                document.getElementById("input" + inp).value = "";
                document.getElementById("input" + inp).placeholder = y.substring(4);
                inp++;
            }
        }
        if (l == 0) {
            select1Sel.style.display = "none";
        } else {
            select1Sel.style.display = "";
        }
    }
    select1Sel.onchange = function () {
        for (var x = 0; x < 3; x++) {
            document.getElementById("input" + x).value = "";
        }


        //empty select2s dropdown
        select2Sel.length = 1;

        //hide all input
        for (var i = 0; i < 3; i++) {
            document.getElementById("input" + i).style.display = "none";
        }

        //display correct values
        var l = 0;
        var inp = 0;
        var z = available[select0Sel.value][this.value];
        if (z != undefined) {
            for (var i = 0; i < z.length; i++) {
                if (z[i][0] != "!") {
                    select2Sel.options[select2Sel.options.length] = new Option(z[i], z[i]);
                    l++;
                } else {
                    document.getElementById("input" + inp).style.display = "";
                    document.getElementById("input" + inp).value = "";
                    document.getElementById("input" + inp).placeholder = z[i].substring(4);
                    inp++;
                }
            }
            if (l == 0) {
                select2Sel.style.display = "none";
            } else {
                select2Sel.style.display = "";
            }
        }
    }
    select0Sel.onchange()
    select1Sel.onchange()

    load()
}

function setElem(elId, text) {
    if (document.getElementById("actionId" + nowEdeting + "Element" + elId) == undefined) {
        document.getElementById("actionId" + nowEdeting).innerHTML += `
        <p onclick="edit(` + nowEdeting + `)" id="actionId` + nowEdeting + `Element` + elId + `" class="actionElement">undef</p>
        <object width=10 height=1></object>
        `;
    }
    document.getElementById("actionId" + nowEdeting + "Element" + elId).innerText = text;
}

function finishEdit() {
    setElem(0, document.getElementById("select0").value);
    if (document.getElementById("select1").style.display != "none") {
        setElem(1, document.getElementById("select1").value);
        setElem(2, document.getElementById("input0").value);
        if (document.getElementById("input1").style.display != "none") {
            setElem(3, document.getElementById("input1").value);
        }
    } else {
        setElem(1, document.getElementById("input0").value);
        if (document.getElementById("input1").style.display != "none") {
            setElem(2, document.getElementById("input1").value);
        }
    }

    document.getElementById("actionId" + nowEdeting).innerHTML += `<button onclick="del(this)" class="remo">Löschen</button>`;

    document.getElementById("change").style.display = "none";
    document.getElementById("All").style.display = "";

    try {
        upload()
    } catch {

    }
}

function setData(id) {
    var el = document.getElementById("actionId" + id)

    console.log(id);

    document.getElementById("select0").value = el.querySelector("#actionId" + id + "Element0").innerText;
    document.getElementById("select0").onchange();
    if (Object.keys(available[document.getElementById("select0").value]).includes(el.querySelector("#actionId" + id + "Element1").innerText)) {
        document.getElementById("select1").value = el.querySelector("#actionId" + id + "Element1").innerText;
        document.getElementById("select1").onchange();

        if (el.querySelector("#actionId" + id + "Element2") != null) {
            document.getElementById("input0").value = el.querySelector("#actionId" + id + "Element2").innerText;
            if (el.querySelector("#actionId" + id + "Element3") != null) {
                document.getElementById("input1").value = el.querySelector("#actionId" + id + "Element3").innerText;
            }
        }
    } else {
        document.getElementById("input0").value = el.querySelector("#actionId" + id + "Element1").innerText;

        if (el.querySelector("#actionId" + id + "Element2") != null) {
            document.getElementById("input1").value = el.querySelector("#actionId" + id + "Element2").innerText;
        }
    }
}

function edit(id) {
    for (var x = 0; x < 3; x++) {
        document.getElementById("select" + x).value = "";
        document.getElementById("input" + x).value = "";
    }

    nowEdeting = id
    setData(id)

    var el = document.getElementById("actionId" + id)
    el.innerHTML = "";

    document.getElementById("change").style.display = "";
    document.getElementById("All").style.display = "none";
}

function del(thi) {
    thi.parentNode.remove();
    var og = parseInt(thi.parentNode.id.substring(8));
    console.log(og)
    while (document.getElementById("actionId" + (og + 1)) != undefined) {
        document.getElementById("actionId" + (og + 1)).id = "actionId" + og
        var i = 0
        while (document.getElementById("actionId" + (og + 1) + "Element" + i) != undefined) {
            document.getElementById("actionId" + (og + 1) + "Element" + i).id = "actionId" + og + "Element" + i;
            i++;
        }
        og++;
    }
    var d=JSON.stringify(genSendData());
    document.getElementById("list").innerHTML="";
    loadData(d);
    try {
        upload()
    } catch { }
}

function add() {
    document.getElementById("list").innerHTML += `
    <div id="actionId`+ document.getElementsByClassName("action").length + `" class="action">
        <p onclick="edit(` + document.getElementsByClassName("action").length + `)" id="actionId` + document.getElementsByClassName("action").length + `Element0" class="actionElement">Bestimmte Uhrzeit</p>
        <p onclick="edit(` + document.getElementsByClassName("action").length + `)" id="actionId` + document.getElementsByClassName("action").length + `Element1" class="actionElement"></p>
        <button onclick="del(this)" class="remo">Löschen</button>
    </div>`;
    edit(document.getElementsByClassName("action").length - 1);
}

function loadData(e) {
    try {
        data = JSON.parse(e);
    } catch {
        alert("auf dem Server gespeicherte daten sind nicht korrekt! Es werden keine geladen!")
        document.getElementById("notMessage").style.display = "";
        document.getElementById("loadingDataSign").style.display = "none";
        return;
    }
    for (var x = 0; x < data.length; x++) {
        toAdd = `<div id="actionId` + document.getElementsByClassName("action").length + `" class="action">`;
        var yy = 0
        for (var y = 0; y < data[x].length; y++) {
            if (data[x][y] != "") {
                toAdd += `<p onclick="edit(` + document.getElementsByClassName("action").length + `)" id="actionId` + x + `Element` + yy + `" class="actionElement">` + data[x][y] + `</p>
                    <object width=10 height=1></object>`;
                yy++
            }
        }
        toAdd += `<button onclick="del(this)" class="remo">Löschen</button></div>`;
        document.getElementById("list").innerHTML += toAdd;
    }
}

function load() {
    console.log("start load")
    document.getElementById("loadingDataSign").style.color = "rgb(0, 255, 0)";
    document.getElementById("loadingDataSign").innerText = "Loading Data...";
    $.ajax({
        type: "POST",
        url: "/api/v0/getActionData",
        success: function (e) {
            if (!e.startsWith("ERROR")) {
                loadData(e)
            } else {
                alert(e)
            }
            document.getElementById("notMessage").style.display = "";
            document.getElementById("loadingDataSign").style.display = "none";
        }
    });
}

function genSendData() {
    data = []
    for (var x = 0; x < document.getElementsByClassName("action").length; x++) {
        setData(x)
        data.push([]);
        data[data.length - 1].push(document.getElementById("select0").value);
        data[data.length - 1].push(document.getElementById("select1").value);
        data[data.length - 1].push(document.getElementById("select2").value);
        data[data.length - 1].push(document.getElementById("input0").value);
        data[data.length - 1].push(document.getElementById("input1").value);
        data[data.length - 1].push(document.getElementById("input2").value);
    }
    return data;
}

function upload() {
    console.log("update");
    data = genSendData()
    $.ajax({
        type: "POST",
        url: "/api/v0/updateActionData",
        data: JSON.stringify(data),
        success: function (e) {
            if (e != "ok") {
                alert(e)
            }
        }
    }).fail(function (e) {
        alert("UPDATE FAILED: Error code " + e.status);
    });
}