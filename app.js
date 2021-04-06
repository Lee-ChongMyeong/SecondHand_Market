const express = require('express');
const app = express();
require("dotenv").config()
const port = process.env.EXPRESS_PORT;

const connect = require('./schemas/dbConnect');
connect();

const cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const routes = require('./routes/routes');
app.use([routes])

app.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`)
})
