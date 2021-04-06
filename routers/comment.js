const express = require('express');
const router = express.Router();
const TownComment = require('../schemas/townComment');
const sanitizeHtml = require('sanitize-html');
const authMiddleware = require('../middlewares/auth-middleware');

function calTime(before) {
	before = parseInt((Date.now() - before) / 1000);
	let result = '';
	if (before > 60 * 60 * 24 * 365) result = parseInt(before / (60 * 60 * 24 * 365)) + '년 전';
	else if (before > 60 * 60 * 24 * 31) result = parseInt(before / (60 * 60 * 24 * 31)) + '달 전';
	else if (before > 60 * 60 * 24) result = parseInt(before / (60 * 60 * 24)) + '일 전';
	else if (before > 60 * 60) result = parseInt(before / (60 * 60)) + '시간 전';
	else if (before > 60) result = parseInt(before / 60) + '분 전';
	else result = parseInt(before) + '초 전';

	return result;
}

// 동네생활 글에 대한 댓글 리스트
router.get('/:townId', authMiddleware, async (req, res, next) => {
	const townId = req.params.townId;
	let result = { status: 'success', comments: [] };
	try {
		let comments = await TownComment.find({ townId: townId }).sort({ date: -1 });
		for (comment of comments) {
			let temp = {
				commentId: comment.commentId,
				townId: townId,
				commentContents: sanitizeHtml(comment.commentContents),
				nickname: sanitizeHtml(comment.nickname),
				userId: comment.userId,
				date: calTime(comment.date)
			};
			result['comments'].push(temp);
		}
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글에 대한 댓글 작성
router.post('/:townId', authMiddleware, async (req, res, next) => {
	let result = { status: 'success' };

	try {
		const user = res.locals.user;
		await TownComment.create({
			townId: req.params.townId,
			commentContents: req.body.commentContents,
			nickname: user.nickname,
			userId: user.id,
			date: Date.now()
		});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

//동네생활 글에 대한 댓글 삭제
router.delete('/:commentId', authMiddleware, async (req, res, next) => {
	let result = { status: 'success' };
	try {
		const user = res.locals.user;
		const commentId = req.params.commentId;
		const { deletedCount } = await TownComment.deleteOne({ _id: commentId, userId: user.id });
		if (!deletedCount) result['status'] = 'fail';
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

module.exports = router;
