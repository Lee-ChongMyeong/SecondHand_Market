const express = require('express');
const router = express.Router();
const TownBoard = require('../schemas/townBoard');
const TownComment = require('../schemas/townComment');
const sanitizeHtml = require('sanitize-html');
const townComment = require('../schemas/townComment');
const townBoard = require('../schemas/townBoard');

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
router.get('/', async (req, res, next) => {
	let result = { status: 'success', boards: [] };
	try {
		let area = '강남구'; // 임시데이터
		let boards = await TownBoard.find({ area: area }).sort({ date: -1 });
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
				images: board['images']
			};
			result['boards'].push(temp);
		}
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글 추가
router.post('/', async (req, res) => {
	let result = { status: 'success' };
	try {
		const nickname = '키티'; // 토큰으로 받아올 임시 데이터
		const area = '강남구';
		await TownBoard.create({
			contents: req.body['contents'],
			category: req.body['category'],
			nickname: nickname,
			date: Date.now(),
			area: area,
			images: []
		});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글 수정
router.put('/:townId', async (req, res) => {
	let result = { status: 'success' };
	try {
		const townId = req.params.townId;
		if (req.body["images"]) {
			await TownBoard.updateOne({_id:townId},{
				contents: sanitizeHtml(req.body.contents),
				images : req.body.images
				});
		} else {
			await TownBoard.updateOne({_id:townId},{
				contents: sanitizeHtml(req.body.contents)
				});
		}
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글 상세 정보
router.get('/:townId', async (req, res) => {
	let result = { status: 'success' };
	try {
		const townId = req.params.townId;
		board = await TownBoard.findOne({ _id: townId });
		comment = await TownComment.find({townId})
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
router.delete('/:townId', async (req, res, next) => {
	let result = { status: 'success' };
	try {
		const townId = req.params.townId;
		await TownBoard.deleteOne({_id: townId})
		await TownComment.deleteMany({townId:townId});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글에 대한 댓글 리스트
router.get('/:townId/comment', async (req, res, next) => {
	const townId = req.params.townId;
	let result = { status: 'success', comments: [] };
	try {
		let comments = await TownComment.find({ townId: townId }).sort({ date: -1 });
		for (comment of comments) {
			let temp = {
				commentId : comment.commentId,
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
router.post('/:townId/comment', async (req, res, next) => {
	let result = { status: 'success' };

	try {
		const townId = req.params.townId;
		const nickname = '테스트!';
		const userId = '5413sdfasadf234';
		await TownComment.create({
			townId: townId,
			commentContents: req.body.commentContents,
			nickname: nickname,
			userId: userId,
			date: Date.now()
		});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

//동네생활 글에 대한 댓글 삭제
router.delete('/comment/:commentId', async (req, res, next) => {
	let result = { status: 'success' };
	try {
		const commentId = req.params.commentId;
		await TownComment.deleteOne({ _id: commentId });
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

module.exports = router;
