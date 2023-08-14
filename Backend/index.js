const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;


const coursesRoute = require('./routes/courses');

app.use( express.json() );
app.use(cors());

app.use('/courses', coursesRoute);
app.listen(
    PORT,
    () => console.log(`alive on http://localhost:${PORT}`)
)