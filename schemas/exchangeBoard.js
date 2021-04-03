const mongoose = require('mongoose');
const { Schema } = mongoose;

const exchangeBoard = new Schema({
	title: { type: String },
	contents: { type: String },
	price: { type: String },
	nickname: { type: String},
	loveCount: { type: Number, default: 0 },
	area: { type: String},
	date: { type: String, required: true, default: Date.now() },
	soldState: { type: String},
	images: { type: String }, // 수정 필요

});

exchangeBoard.virtual('exchangeId').get(function () {
	return this._id.toHexString();
});

exchangeBoard.set('toJSON', {
	virtuals: true
});

module.exports = mongoose.model('ExchangeBoard', exchangeBoard);
