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

const userRouter = require('./routers/user');
app.use('/user', [userRouter]);

const authRouter = require('./routers/auth');
app.use('/auth', [authRouter]);

const exchangeRouter = require('./routers/exchange');
app.use('/exchange', [exchangeRouter]);

const townRouter = require('./routers/town');
app.use('/town', [townRouter]);

const imageRouter = require('./routers/image');
app.use('/image', [imageRouter]);


app.listen(port, () => {
	console.log(`Server start at http://localhost:${port}`)
})
