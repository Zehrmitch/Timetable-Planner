function createNode(element) {
	return document.createElement(element);
}

function append(parent, el) {
	return parent.appendChild(el);
}

function getUsers() {
	const ul = document.getElementById("allSubjects");
	const url = "http://localhost:3000/api/subjCodes";
	fetch(url)
		.then((resp) => resp.json())
		.then(data => {
            console.log(data);
            data.forEach(e => {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${e.subject}`));
                ul.appendChild(item);
        });
    })
}


// Error catching for fetches in front end
// Timetable search, show all courses, search by subject code
