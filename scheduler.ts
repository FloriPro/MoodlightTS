let schedulerListHTML = document.querySelector("#SchedulerList") as HTMLDivElement;
const schedulPreset = `<div class="schedule"><input type="text" class="time" value="_v_time" oninput="sheduleTimeChange(this)" onfocusout="sheduleTimeFormat(this)" placeholder="Uhrzeit xx:yy (e.g. '23:00')"><input type="text" class="id" value="_v_id" oninput="sheduleIdChange(this)" onfocusout="sheduleIdFormat(this)" placeholder="Start id zz (e.g. '0')"><button onclick="this.parentNode.remove();autoSave();scheduleChanged = true;">X</button></div>`;
const scheduleOk = "lawngreen";
const scheduleError = "red"

function addShedule() {
    schedulerListHTML.innerHTML += schedulPreset.replace("_v_time", "").replace("_v_id", "");
}

function sheduleIdChange(t: HTMLInputElement) {
    var error = false;
    var v = parseInt(t.value);
    if (isNaN(v)) {
        error = true;
    }
    else if (v >= Elements.length) {
        error = true;
    }
    if (error) {
        t.style.background = scheduleError;
    } else {
        t.style.background = scheduleOk;
    }
}

function sheduleTimeChange(t: HTMLInputElement) {
    var error = false;
    var v = t.value;
    var s = v.split(":");

    if (s.length != 2) {
        error = true;
    } else if (isNaN(parseInt(s[0]))) {
        error = true;
    } else if (parseInt(s[0]) > 24 || parseInt(s[0]) < 0) {
        error = true;
    }
    else if (isNaN(parseInt(s[1]))) {
        error = true;
    } else if (parseInt(s[1]) > 60 || parseInt(s[1]) < 0) {
        error = true;
    }

    if (error) {
        t.style.background = scheduleError;
    } else {
        t.style.background = scheduleOk;
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
        out.push([id.value, time.value])
    }

    return out;
}


function loadSchedules() {
    schedulerListHTML.innerHTML = "";
    for (var s of schedulerList) {
        schedulerListHTML.innerHTML += schedulPreset.replace("_v_time", s[1]).replace("_v_id", s[0]);
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
        out.push("@" + schedule[1] + ",A" + schedule[0] + ",f")
    }


    //TODO
    return out.join(";");
}