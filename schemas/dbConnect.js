const mongoose = require('mongoose');
require("dotenv").config()

const connect = () => {
	console.log(process.env.DB_PORT)
	mongoose
		.connect(`mongodb://localhost:${process.env.DB_PORT}/Carrot`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			ignoreUndefined: true
		})
		.catch((err) => console.error(err));
};

mongoose.connection.on('error', (err) => {
	console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
