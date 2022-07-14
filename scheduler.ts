let schedulerListHTML = document.querySelector("#SchedulerList") as HTMLDivElement;
const schedulPreset = `
<div class="schedule">
    <p class="hover"><input type="text" class="time" value="_v_time" oninput="sheduleTimeChange(this)" onfocusout="sheduleTimeFormat(this)" placeholder="Uhrzeit xx:yy (e.g. '23:00')"></p>
    <p class="hover"><input type="text" class="id" value="_v_id" oninput="sheduleIdChange(this)" onfocusout="sheduleIdFormat(this)" placeholder="Start id zz (e.g. '0')"></p>
    <select class="runOnStartup">
        <option _sel_N value="n">Nur bei uhrzeit ausführen</option>
        <option _sel_Y value="j">Wenn in vergangenheit beim hochfahren, dann ausführen</option>
    </select>
    <button onclick="this.parentNode.remove();autoSave();scheduleChanged = true;">X</button>
</div>`;
const scheduleOk = "lawngreen";
const scheduleError = "red"

function addShedule() {
    schedulerListHTML.innerHTML += schedulPreset.replace("_v_time", "").replace("_v_id", "").replace("_sel_Y", "").replace("_sel_N", "selected");
}
function isPositiveInteger(str: string) {
    if (typeof str !== 'string') {
        return false;
    }
    if (str == "") {
        return false
    }

    const num = Number(str);
    if (isNaN(num)) {
        return false
    }
    return true;

}
function sheduleIdChange(t: HTMLInputElement) {
    var error = false;
    var v = parseInt(t.value);
    if (!isPositiveInteger(t.value)) {
        error = true;
        (t.parentElement as HTMLParagraphElement).title = "Fehler: keine Zahl"
    }
    else if (v >= Elements.length) {
        error = true;
        (t.parentElement as HTMLParagraphElement).title = "Fehler: Start nicht vorhanden"
    } else if (v < 0) {
        error = true;
        (t.parentElement as HTMLParagraphElement).title = "Fehler: Start nur im Positiven vorhanden"
    }
    if (error) {
        t.style.background = scheduleError;
    } else {
        t.style.background = scheduleOk;
        (t.parentElement as HTMLParagraphElement).title = "";
    }
}

function sheduleTimeChange(t: HTMLInputElement) {
    var error = false;
    var v = t.value;
    var s = v.split(":");

    if (s.length != 2) {
        (t.parentElement as HTMLParagraphElement).title = "Fehler: Keine Uhrzeit (xx:yy)"
        error = true;
    } else if (!isPositiveInteger(s[0])) {
        (t.parentElement as HTMLParagraphElement).title = "Fehler: keine Zahl als Stunde"
        error = true;
    } else if (parseInt(s[0]) >= 24 || parseInt(s[0]) < 0) {
        (t.parentElement as HTMLParagraphElement).title = "Fehler: Stunden zu groß/klein"
        error = true;
    }
    else if (!isPositiveInteger(s[1])) {
        error = true;
        (t.parentElement as HTMLParagraphElement).title = "Fehler: keine Zahl als Minute"
    } else if (parseInt(s[1]) >= 60 || parseInt(s[1]) < 0) {
        (t.parentElement as HTMLParagraphElement).title = "Fehler: Minuten zu groß/klein"
        error = true;
    }

    if (error) {
        t.style.background = scheduleError;
    } else {
        t.style.background = scheduleOk;
        (t.parentElement as HTMLParagraphElement).title = "";
    }
}

function sheduleTimeFormat(t: HTMLInputElement) {
    if (t.style.background != scheduleOk) { return; }

    var v = t.value;
    var s = v.split(":");

    t.value = addZero(s[0], 2) + ":" + addZero(s[1], 2)
}

function sheduleIdFormat(t: HTMLInputElement) {
    if (t.style.background != scheduleOk) { return; }

    var v = t.value;
    t.value = addZero(v, 2);
}

function getSchedulerHTMLDat() {

    var out = [];

    var d: NodeListOf<Element> = document.querySelectorAll(".schedule") as NodeListOf<Element>;
    for (var elem of d) {
        var id = elem.querySelector(".id") as HTMLInputElement;
        var time = elem.querySelector(".time") as HTMLInputElement;
        var runOnStartup = elem.querySelector(".runOnStartup") as HTMLSelectElement;
        out.push([id.value, time.value, runOnStartup.value])
    }

    return out;
}


function loadSchedules() {
    schedulerListHTML.innerHTML = "";
    for (var s of schedulerList) {
        var v = schedulPreset.replace("_v_time", s[1]).replace("_v_id", s[0]);
        if (s[2] == "j") {
            v = v.replace("_sel_Y", "selected").replace("_sel_N", "");
        } else {
            v = v.replace("_sel_N", "selected").replace("_sel_Y", "");
        }
        schedulerListHTML.innerHTML += v;
    }

    //update information
    var allElements: NodeListOf<Element> = document.querySelectorAll(".schedule") as NodeListOf<Element>;
    for (var elem of allElements) {
        var id = elem.querySelector(".id") as HTMLInputElement;
        var time = elem.querySelector(".time") as HTMLInputElement;
        sheduleIdChange(id);
        sheduleTimeChange(time);
    }
}

function finishShedule() {
    schedulerList = getSchedulerHTMLDat();
    goTo('standartEdit', 0);
    autoSave();
    //TODO Save schedules to schedluerList
}

function getSchedulerDat() {
    //schedulerList = getSchedulerHTMLDat();
    return schedulerList;
}

function genCompiledScheduler() {
    var dat = getSchedulerDat();
    var out = []

    for (var schedule of dat) {
        if (schedule[2] == "j") var s2 = "1"
        else var s2 = "0"
        out.push("@" + schedule[1] + ",A" + schedule[0] + "," + s2)
    }
    //TODO
    return out.join(";");
}