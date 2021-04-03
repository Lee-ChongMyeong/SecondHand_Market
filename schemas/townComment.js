const mongoose = require('mongoose');
const { Schema } = mongoose;

const townComment = new Schema({
	townId: { type: String, required: true },
	commentContents: { type: String, required: true },
	nickname: { type: String, required: true },
	userId: { type: String, required: true },
	date: { type: String, required: true, default: Date.now() },
});

user.virtual('commentId').get(function () {
	return this._id.toHexString();
});

user.set('toJSON', {
	virtuals: true
});

module.exports = mongoose.model('TownComment', townComment);
