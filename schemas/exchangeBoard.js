const mongoose = require('mongoose');
const { Schema } = mongoose;

const exchangeBoard = new Schema({
	title: { type: String, required: true },
	contents: { type: String, required: true },
	price: { type: String, required: true },
	nickname: { type: String, required: true },
	loveCount: { type: Number, default: 0 },
	area: { type: String, required: true },
	date: { type: String, required: true, default: Date.now() },
	soldState: { type: String},
	images: { type: String }, // 수정 필요

});

user.virtual('exchangeId').get(function () {
	return this._id.toHexString();
});

user.set('toJSON', {
	virtuals: true
});

module.exports = mongoose.model('ExchangeBoard', exchangeBoard);