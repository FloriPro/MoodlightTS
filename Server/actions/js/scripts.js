let actions = {
    "laden": "",
    "ausführen": "",
}
let ausloeser = {
    "Zeit Uhrzeit": [["num"]],
    "Zeit Abstand": [["num"]],
    "RSS": [["str"], ["str"]],
    "Seiten veränderung": [["str"]],
    "Server request": [["sel", { "POST": [], "GET": [] }], ["str"]],
};

let dat = []

function add() {
    var dat = "";
    var o = Object.keys(ausloeser);
    for (var x = 0; x < o.length; x++) {
        dat += `
        <option value="`+ o[x] + `">` + o[x] + `</option>
        `;
    }
    document.querySelector("#actions").innerHTML += `
        <div class="action">
        <select onchange="u(this);">`+
        dat +
        `</select>
        </div>
    `;
}

function u(thi) {
    //get start
    var t = thi
    while (t.parentElement.id != "actions") {
        t = t.parentElement;
    }
    var f = t.querySelectorAll(".actionU")
    for (var ii = 0; ii < f.length; ii++) {
        f[ii].remove();
    }
    update(t,ausloeser[t.querySelector("select").value])
}

function update(t,a) {
    console.log(t);
    for (var i = 0; i < a.length; i++) {
        if (a[i][0] == "sel") {
            aK = a[1];
            for (var x = 0; x < aK.length; x++) {
                if (t.querySelector(".action" + x) == undefined) {
                    var dat = "";
                    var o = Object.keys(a[x][1]);
                    for (var y = 0; y < o.length; y++) {
                        dat += `<option value="` + o[y] + `">` + o[y] + `</option>`;
                    }

                    t.innerHTML += `<div class="actionU action` + x + `">
                        <select onchange="u(this);">`+ dat + `</select>
                    </div>`;
                    //update(t.querySelector(".action" + x),);
                }
            }
        } else if (a[i][0] == "str" || a[i][0] == "num") {

        }
    }
}







add()