const express = require('express');
const router = express.Router();
const TownBoard = require('../schemas/townBoard');
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

// 동네생활 글 목록
router.get('/', authMiddleware, async (req, res, next) => {
	let result = { status: 'success', boards: [] };
	try {
		const user = res.locals.user; // 현재 접속 유저 정보
		const print_count = 5
		let area = user.area;
		let lastId = req.body["lastId"]; // 무한 스크롤 마지막으로 불러온 글 ID
		let boards;
		if (lastId) { // 무한 스크롤 이전 페이지가 있을 경우
			boards = await TownBoard.find({ area: area }).sort({ date: -1 })
				.where('_id').lt(lastId).limit(print_count);
		} else { // 무한 스크롤 첫 페이지일 경우
			boards = await TownBoard.find({ area: area }).sort({ date: -1 }).limit(print_count);
		}
		for (board of boards) {
			comment = await TownComment.find({ townId: board['townId'] });
			let temp = {
				townId: board['_id'],
				nickname: sanitizeHtml(board['nickname']),
				area: sanitizeHtml(board['area']),
				contents: sanitizeHtml(board['contents']),
				category: board['category'],
				date: calTime(board['date']),
				commentCount: comment.length,
				imoticon: board['imoticon'],
				images: board['images'],
				userId: board['userId']
			};
			result['boards'].push(temp);
		}
		if (boards.length < print_count) result['status'] = 'end';
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글 추가
router.post('/', authMiddleware, async (req, res) => {
	let result = { status: 'success' };
	try {
		const user = res.locals.user;
		await TownBoard.create({
			contents: req.body['contents'],
			category: req.body['category'],
			nickname: user.nickname,
			userId: user.id,
			date: Date.now(),
			area: user.area,
			images: req.body['images']
		});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글 수정
router.put('/:townId', authMiddleware, async (req, res) => {
	let result = { status: 'success' };
	try {
		const user = res.locals.user;
		const townId = req.params.townId;
		if (req.body['images']) {
			const { n } = await TownBoard.updateOne(
				{ _id: townId, userId: user.id },
				{ contents: sanitizeHtml(req.body.contents), images: req.body.images }
			);
			if (!n) {
				result['status'] = 'fail';
			}
		} else {
			const { n } = await TownBoard.updateOne({ _id: townId, userId: user.id }, { contents: sanitizeHtml(req.body.contents) });
			if (!n) {
				result['status'] = 'fail';
			}
		}
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글 상세 정보
router.get('/:townId', authMiddleware, async (req, res) => {
	let result = { status: 'success' };
	try {
		const townId = req.params.townId;
		board = await TownBoard.findOne({ _id: townId });
		comment = await TownComment.find({ townId });
		result['board'] = {
			townId: sanitizeHtml(board['_id']),
			nickname: sanitizeHtml(board['nickname']),
			beforeTime: calTime(board['date']),
			area: sanitizeHtml(board['area']),
			commentCount: comment.length,
			contents: sanitizeHtml(board['contents']),
			images: board['images']
		};
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

//동네생활 글 삭제
router.delete('/:townId', authMiddleware, async (req, res, next) => {
	let result = { status: 'success' };
	try {
		const townId = req.params.townId;
		const user = res.locals.user;
		const { deletedCount } = await TownBoard.deleteOne({ _id: townId, userId: user.id });
		if (deletedCount) {
			await TownComment.deleteMany({ townId: townId });
		} else {
			result['status'] = 'fail';
		}
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글에 대한 댓글 리스트
router.get('/:townId/comment', authMiddleware, async (req, res, next) => {
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
router.post('/:townId/comment', authMiddleware, async (req, res, next) => {
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
router.delete('/comment/:commentId', authMiddleware, async (req, res, next) => {
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
