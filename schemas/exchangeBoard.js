const mongoose = require('mongoose');
const { Schema } = mongoose;

const exchangeBoard = new Schema({
	title: { type: String, required: true },
	contents: { type: String, required: true },
	price: { type: String, required: true },
	nickname: { type: String, required: true },
	id: { type: String, required: true },
	loveCount: { type: Number, default: 0 },
	area: { type: String, required: true },
	date: { type: String, required: true, default: Date.now() },
	soldState: { type: String, default: "판매 중" },
	images: { type: Array, required: true }
});

exchangeBoard.virtual('exchangeId').get(function () {
	return this._id.toHexString();
});

exchangeBoard.set('toJSON', {
	virtuals: true
});

module.exports = mongoose.model('ExchangeBoard', exchangeBoard);
