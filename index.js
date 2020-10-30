const Joi = require('joi');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const courses = [
    { id: 1, name: "course1"},
    { id: 2, name: "course2"},
    { id: 3, name: "course3"},
];

app.get('/', (req, res) => {
  res.send('Hello World!!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).end('No course id found');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); // get result.error
    if (error) {
        res.status(400).send('Name is required');
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => { // Update
    // look up course return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).end('No course id found');

    const { error } = validateCourse(req.body); // get result.error
    if (error) {
        res.status(400).send('Name is required');
        return;
    }

    course.name = req.body.name;
    res.send(course);
});


function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().required()
    });

   return schema.validate(course);
    
}

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).end('No course id found');
        return;
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});