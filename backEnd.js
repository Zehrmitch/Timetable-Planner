const express = require("express");
const fs = require("fs");
const process = require("process");
var flatCache = require('flat-cache');
const app = express();
const port = process.env.PORT || 3000;
let rawdata = fs.readFileSync("data.json");
var text = JSON.parse(rawdata);
var router = express.Router();
var cache = flatCache.load('scheduleCache');

// REST
app.use(express.json());
app.use('/', express.static('static'));

router.get("/nameAndCodes", function(req, res) {
	let nameAndCodesArray = getNameAndCode();
	res.send(nameAndCodesArray);
});

router.get("/getCourseCodes/:id", function(req, res) {
	let nameAndCodesArray = getCourseCodes(req.params.id);
	res.send(nameAndCodesArray);
});

router.get("/getCourseSearch/:SC/:CC/:OC", function(req, res) {
	let courseSearch = getCourseSearch(req.params.SC, req.params.CC, req.params.OC);
	res.send(courseSearch);
});

router.get("/getSchedule/:scheduleName", function(req, res) {
    let scheduleSearch = getSchedule(req.params.scheduleName);
	res.send(scheduleSearch);
});

router.get("/viewSchedules", function(req, res) {
    let allSchedules = getSchedules();
	res.send(allSchedules);
});

router.post("/createSchedule/:SN", function(req, res) {
    let newSchedule = createSchedule(req.params.SN);
	res.send(newSchedule);
});

router.put("/updateSchedule/:scheduleName", function(req, res) {
    let updatedSchedule = updateSchedule(req.params.scheduleName, req.body);
	res.send(updatedSchedule);
});

router.delete("/deleteSchedule/:scheduleName", function(req, res) {
    let deleteASchedule = deleteSchedule(req.params.scheduleName);
	res.send(deleteASchedule);
});

router.delete("/deleteAllSchedules", function(req, res) {
    let deleteAllSchedule = deleteAllSchedules();
	res.send(deleteAllSchedule);
});

app.use('/api', router);

app.listen(port, () => {
    console.log(`Timetable is listening at http://localhost:${port}`);
});

// Functions

function updateSchedule(sName, sCourses) {
    cache.setKey(sName, sCourses);
    cache.save(true);
    let schedule = cache.getKey(sName);
    return schedule;
}

function getSchedules(){
    let allSchedules = cache.all();
    console.log(allSchedules);
    return allSchedules;
}

function getSchedule(sName){
    let schedule = cache.getKey(sName);
    console.log(schedule);
    return schedule;
}

function deleteSchedule(sName) {
    cache.removeKey(sName);
    cache.save(true);
    let scheduleDelete = "removed";
    return scheduleDelete;
}

function deleteAllSchedules() {
    let allSchedule = cache.all();
    for (var key in allSchedule){
        cache.removeKey(key);
    }
    cache.save(true);
    return allSchedule;
}

function createSchedule(sName) {
    if(cache.getKey(sName) == undefined){
        cache.setKey(sName, { });
        cache.save(true);
        let schedule = cache.getKey(sName);
        console.log(schedule);
        return schedule;
    }
    else{
        let resposeToCreate = { info: 'Schedule already exists' };
        return resposeToCreate;
    }
}

function getNameAndCode() {
	var nameAndCodes = text.map(function (text) {
        var content = { subject: text.subject, className: text.className };
        return content;
    });
    return nameAndCodes;
}

function getCourseCodes(SC) {
    var courseCodes = text.filter(function (text) {
        if (SC === text.subject){
            return text;
        }
    });
    var courseCode = courseCodes.map(function (text) {
        if (SC === text.subject){
            var content = { subject: text.subject, catalog_nbr: text.catalog_nbr };
            return content;
        }
    });
    return courseCode;
}

function getCourseSearch(SC, CC, OC) {
    var subjectCodes = text.filter(function (text) {
        if (SC === text.subject && String(CC) === String(text.catalog_nbr)){
            return text;
        }
    });
    return subjectCodes;
}
