const express = require("express");
const fs = require("fs");
const process = require("process");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/', express.static('static'));

app.listen(port, () => {
	console.log(`Timetable is listening at http://localhost:${port}`);
});

app.get("/api/subjCodes", (req, res) => {
	let subjectCodesArray = getSubjectCodes();
	res.send(subjectCodesArray);
});

let rawdata = fs.readFileSync("data.json");
var text = JSON.parse(rawdata);
let subjectCodes = [];


function getSubjectCodes() {
	var subjectCodes = text.map(function (text) {
		if (text.subject) {
            var content = { subject: text.subject };
			return content;
		}
    });
    return subjectCodes;
}

// .map and . filter
