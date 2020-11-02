const express = require("express");
const fs = require("fs");
const process = require("process");
const app = express();
const port = process.env.PORT || 3000;
let rawdata = fs.readFileSync("data.json");
var text = JSON.parse(rawdata);
var http = require("http");
var router = express.Router();

// REST
app.use(express.json());
app.use('/', express.static('static'));

router.get("/nameAndCodes", function(req, res) {
	let nameAndCodesArray = getNameAndCode();
	res.send(nameAndCodesArray);
});

app.get("/api/getCourseCodes/:id", (req, res) => {
	let nameAndCodesArray = getCourseCodes(req.params.id);
	res.send(nameAndCodesArray);
});

app.get("/api/getCourseSearch/:SC/:CC/:OC", (req, res) => {
	let courseSearch = getCourseSearch(req.params.SC, req.params.CC, req.params.OC);
	res.send(courseSearch);
});

app.use('/api', router);

app.listen(port, () => {
	console.log(`Timetable is listening at http://localhost:${port}`);
});

// Functions
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
        if (SC === text.subject && CC === text.catalog_nbr){
            return text;
        }
    });
    return subjectCodes;
}
