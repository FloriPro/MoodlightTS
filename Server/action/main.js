var subjectObject = {
    "Bestimmte Uhrzeit": {
        "!strUhrzeit: sek:min:stunde": [],
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
        "!strURL mit pfad": []
    }
}
window.onload = function () {
    var subjectSel = document.getElementById("subject");
    var topicSel = document.getElementById("topic");
    var chapterSel = document.getElementById("chapter");
    for (var x in subjectObject) {
        subjectSel.options[subjectSel.options.length] = new Option(x, x);
    }

    subjectSel.onchange = function () {
        //empty Chapters- and Topics- dropdowns
        chapterSel.length = 1;
        topicSel.length = 1;
        //display correct values

        //hide all input
        for (var i = 0; i < 3; i++) {
            document.getElementById("input" + i).style.display = "none";
        }

        var l = 0;
        var inp = 0;
        for (var y in subjectObject[this.value]) {
            if (y[0] != "!") {
                topicSel.options[topicSel.options.length] = new Option(y, y);
                l++;
            } else {
                document.getElementById("input" + inp).style.display = "";
                document.getElementById("input" + inp).value = "";
                document.getElementById("input" + inp).placeholder = y.substring(4);
                inp++;
            }
        }
        if (l == 0) {
            topicSel.style.display = "none";
        } else {
            topicSel.style.display = "";
        }
    }
    topicSel.onchange = function () {
        //empty Chapters dropdown
        chapterSel.length = 1;

        //hide all input
        for (var i = 0; i < 3; i++) {
            document.getElementById("input" + i).style.display = "none";
        }

        //display correct values
        var l = 0;
        var inp = 0;
        var z = subjectObject[subjectSel.value][this.value];
        if (z != undefined) {
            for (var i = 0; i < z.length; i++) {
                if (z[i][0] != "!") {
                    chapterSel.options[chapterSel.options.length] = new Option(z[i], z[i]);
                    l++;
                } else {
                    document.getElementById("input" + inp).style.display = "";
                    document.getElementById("input" + inp).value = "";
                    document.getElementById("input" + inp).placeholder = z[i].substring(4);
                    inp++;
                }
            }
            if (l == 0) {
                chapterSel.style.display = "none";
            } else {
                chapterSel.style.display = "";
            }
        }
    }
    subjectSel.onchange()
}

function edit(id) {
    var s = document.getElementById("actionId" + id)
    //TODO: DO EDIT
}

function add() {
    document.getElementById("list").innerHTML += `
    <div id="actionId`+ document.getElementsByClassName("action").length + `" class="action" onclick="edit(` + document.getElementsByClassName("action").length + `)">
        <p id="actionId`+ document.getElementsByClassName("action").length + `Element1" class="actionElement">Wiederholung</p>
        <object width=10 height=1></object>
        <p id="actionId`+ document.getElementsByClassName("action").length + `Element2" class="actionElement">sekunden</p>
        <object width=10 height=1></object>
        <p id="actionId`+ document.getElementsByClassName("action").length + `Element3" class="actionElement">5</p>
    </div>`
}