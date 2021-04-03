const express = require('express');
const app = express();
require("dotenv").config()
const port = process.env.EXPRESS_PORT;

const connect = require('./schemas/dbConnect');
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


const userRouter = require('./routers/user');
app.use('/user', [userRouter]);

const exchangeRouter = require('./routers/exchange');
app.use('/exchange', [exchangeRouter]);

const townRouter = require('./routers/town');
app.use('/town', [townRouter]);



app.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`)
})
