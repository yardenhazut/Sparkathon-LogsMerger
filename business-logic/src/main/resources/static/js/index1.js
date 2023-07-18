
const parseDate = (d) => {
    let [dt, tm] = d.split("T");
    let dtParts = dt.split("-");
    let tmParts = tm.split(":");
    let str = `${dtParts[1]}/${dtParts[2]}/${dtParts[0]} ${tmParts[0]}:${tmParts[1]}:00`
    return str;
}

new datedreamer.calendar({
    element: "#calendar",
    selectedDate: nowStr,

    // callback
    onChange: (e) => {
        console.log(e.detail);
        g_lmnt.value = parseDate(e.detail);
        let calendarDiv = document.getElementById('calendar');
        calendarDiv.style.display = 'none';
    },
    onRender: (e) => {
        console.log(e.detail.calendar);
    },
})
