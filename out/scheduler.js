"use strict";
let schedulerList = document.querySelector("#SchedulerList");
const schedulPreset = `<div class="schedule"><input type="text" class="time" value="_v_time" oninput="sheduleTimeChange(this)" onfocusout="sheduleTimeFormat(this)" placeholder="Uhrzeit xx:yy (e.g. '23:00')"><input type="text" class="id" value="_v_id" oninput="sheduleIdChange(this)" onfocusout="sheduleIdFormat(this)" placeholder="Start id zz (e.g. '0')"><button onclick="this.parentNode.remove();autoSave();scheduleChanged = true;">X</button></div>`;
const scheduleOk = "lawngreen";
const scheduleError = "red";
let scheduleChanged = false;
function loadSchedule(data) {
    schedulerList.innerHTML = "";
    for (var d of data) {
        schedulerList.innerHTML += schedulPreset.replace("_v_time", d[1]).replace("_v_id", d[0]);
    }
    var allElements = document.querySelectorAll(".schedule");
    for (var elem of allElements) {
        var id = elem.querySelector(".id");
        var time = elem.querySelector(".time");
        sheduleIdChange(id);
        sheduleTimeChange(time);
    }
    scheduleChanged = false;
}
function addShedule() {
    schedulerList.innerHTML += schedulPreset.replace("_v_time", "").replace("_v_id", "");
}
function sheduleIdChange(t) {
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
    }
    else {
        t.style.background = scheduleOk;
    }
    scheduleChanged = true;
    autoSave();
}
function sheduleTimeChange(t) {
    var error = false;
    var v = t.value;
    var s = v.split(":");
    if (s.length != 2) {
        error = true;
    }
    else if (isNaN(parseInt(s[0]))) {
        error = true;
    }
    else if (parseInt(s[0]) > 24 || parseInt(s[0]) < 0) {
        error = true;
    }
    else if (isNaN(parseInt(s[1]))) {
        error = true;
    }
    else if (parseInt(s[1]) > 60 || parseInt(s[1]) < 0) {
        error = true;
    }
    if (error) {
        t.style.background = scheduleError;
    }
    else {
        t.style.background = scheduleOk;
    }
    scheduleChanged = true;
    autoSave();
}
function sheduleTimeFormat(t) {
    if (t.style.background != scheduleOk) {
        return;
    }
    var v = t.value;
    var s = v.split(":");
    t.value = addZero(s[0], 2) + ":" + addZero(s[1], 2);
    scheduleChanged = true;
    autoSave();
}
function sheduleIdFormat(t) {
    if (t.style.background != scheduleOk) {
        return;
    }
    var v = t.value;
    t.value = addZero(v, 2);
    scheduleChanged = true;
    autoSave();
}
function getSchedulerDat() {
    var out = [];
    var d = document.querySelectorAll(".schedule");
    for (var elem of d) {
        var id = elem.querySelector(".id");
        var time = elem.querySelector(".time");
        out.push([id.value, time.value]);
    }
    return out;
}
//# sourceMappingURL=scheduler.js.map