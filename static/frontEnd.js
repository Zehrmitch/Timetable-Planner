function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
}

function createNode(element) {
	return document.createElement(element);
}

function append(parent, el) {
	return parent.appendChild(el);
}

function getSubjects() {
	const ul = document.getElementById("allSubjects");
	fetch("/api/nameAndCodes")
		.then((resp) => resp.json())
		.then(data => {
            console.log(data);
            data.forEach(e => {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(e.className));
                ul.appendChild(item);
        });
    })
}

function hideSubjects(){
    document.getElementById("allSubjects").innerHTML = "";
}

function courseSearch() {
    document.getElementById("courseSearchResults").innerHTML = "";
    var inputVal = document.getElementById("courseCodeInput").value;
    inputVal = sanitize(inputVal);
	const ul = document.getElementById("courseSearchResults");
	fetch("/api/getCourseCodes/" + inputVal)
		.then((resp) => resp.json())
		.then(data => {
            console.log(data);
            data.forEach(e => {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(e.subject + " : " + e.catalog_nbr));
                ul.appendChild(item);
        });
    })
}

function timetableSearch() {
    document.getElementById("timetableSearch").innerHTML = "";
    var SC = document.getElementById("timetableSubject").value;
    var CC = document.getElementById("timetableCourseCode").value;
    var OC = document.getElementById("timetableCourseComponent").value;
    const ul = document.getElementById("timetableSearch");
    SC = sanitize(SC);
    CC = sanitize(CC);
    OC = sanitize(OC);
	fetch("/api/getCourseSearch/" + SC + "/" + String(CC) + "/1")
		.then((resp) => resp.json())
		.then(data => {
            console.log(data);
            if (data.length == 0){
                ul.appendChild(document.createElement('li').appendChild(document.createTextNode(`Error - No matchs found. Please check input`)));
            }
            else{
            data.forEach(e => {
                ul.appendChild(document.createElement('li').appendChild(document.createTextNode("Subject: " + e.subject)));
                ul.appendChild(document.createElement('p'));
                ul.appendChild(document.createElement('li').appendChild(document.createTextNode("Class name: " + e.className)));
                ul.appendChild(document.createElement('p'));
                ul.appendChild(document.createElement('li').appendChild(document.createTextNode("Class Number: "+ e.catalog_nbr)));
                ul.appendChild(document.createElement('p'));
                ul.appendChild(document.createElement('li').appendChild(document.createTextNode("Course Code: "+ e.catalog_nbr)));
                ul.appendChild(document.createElement('p'));
                ul.appendChild(document.createElement('li').appendChild(document.createTextNode("Description: " + e.catalog_description)));
            });
        }
    })
}

function createSchedule() {
    var scheduleName = document.getElementById("scheduleName").value;
    scheduleName = sanitize(scheduleName);
    console.log(scheduleName);
    if (scheduleName.length == 0){
        console.log("No input");
    }
    else{
    fetch("/api/createSchedule/" + scheduleName , {method: 'POST'})
        .then((resp) => resp.json())
        .then(data => {
            console.log(data);
        })
    }
}

function viewSchedules() {
    document.getElementById("viewSchedules").innerHTML = "";
    const ul = document.getElementById("viewSchedules");
    fetch("/api/viewSchedules")
        .then((resp) => resp.json())
		.then(data => {
            console.log(data);
            Object.keys(data).map(function(key, index) {
                let content = 'Schedule Name: ' + key + "  || Number of courses: " + Object.keys(key).length;
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(content));
                ul.appendChild(item);
            });
        })
        .catch()
}

function deleteSchedule() {
    let toBeDeleted = document.getElementById("scheduleToDelete").value;
    toBeDeleted = sanitize(toBeDeleted);
    if (toBeDeleted.length == 0){
        console.log("No input");
    }
    else{
        fetch("/api/deleteSchedule/" + toBeDeleted, {method: 'DELETE'})
            .then(data => {
                console.log("Schedule: " + toBeDeleted + " deleted");
        })
    }
}

function deleteAllSchedules() {
    fetch("/api/deleteAllSchedules", {method: 'DELETE'})
		.then((resp) => resp.json())
		.then(data => {
            console.log("Schedules all deleted");
    })
}

function addCourses() {
    let scheduleName = document.getElementById("updateScheduleName").value;
    let courses = {};
    for(var i = 1; i < 7; i++){
        var key = sanitize(document.getElementById(String(i) + "c").value);
        var val = sanitize(document.getElementById(String(i) + "n").value);
        if (key != "" && val != ""){
            courses[key] = val;
        }
    }
    console.log(courses);
    fetch("/api/updateSchedule/" + scheduleName, {method: 'PUT', body: JSON.stringify(courses), headers: { 'Content-Type': 'application/json' }})
		.then(data => {
            console.log("Schedules are updated");
    })
}

function showSchedule() {
    document.getElementById("showSchedule").innerHTML = "";
    let scheduleName = document.getElementById("showScheduleCourses").value;
    if (scheduleName.length == 0){
        console.log("No input");
    } else{
        fetch("/api/getSchedule/" + scheduleName)
            .then((resp) => resp.json())
            .then(data => {
                console.log(data);
                const ul = document.getElementById("showSchedule");
                Object.keys(data).map(function(key, index) {
                    let content = 'Course Code: ' + key + " Subject Code: " + data[key];
                    const item = document.createElement('li');
                    item.appendChild(document.createTextNode(content));
                    ul.appendChild(item);
                });
            });
    }
}