const mongoose = require('mongoose');
const { Schema } = mongoose;

const townBoard = new Schema({
	blogContents: { type: String, required: true },
	nickname: { type: String, required: true },
	commentCount: { type: Number, default: 0 },
	area: { type: String, required: true },
	date: { type: String, required: true, default: Date.now() },
	images: { type: String }, // 수정 필요

});

townBoard.virtual('townId').get(function () {
	return this._id.toHexString();
});

townBoard.set('toJSON', {
	virtuals: true
});

module.exports = mongoose.model('TownBoard', townBoard)
