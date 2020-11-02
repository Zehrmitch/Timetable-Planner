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
                item.appendChild(document.createTextNode(`${e.className}`));
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
	const ul = document.getElementById("courseSearchResults");
	fetch("/api/getCourseCodes/" + inputVal)
		.then((resp) => resp.json())
		.then(data => {
            console.log(data);
            data.forEach(e => {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.subject} : ${e.catalog_nbr}`));
                ul.appendChild(item);
        });
    })
}

// Error catching for fetches in front end
// Timetable search, show all courses, search by subject code