const express = require('express');
const router = express.Router();
const TownBoard = require('../schemas/townBoard');
const TownComment = require('../schemas/townComment');
const moment = require('moment');
const sanitizeHtml = require('sanitize-html');

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
	let area = '강남구'; // 임시데이터
	let result = { status: 'success', boards: [] };
	try {
		let boards = await TownBoard.find({ area: area }).sort({ _id: -1 });
		for (board of boards) {
			let temp = {
				townId: board['_id'],
				nickname: board['nickname'],
				area: board['area'],
				contents: board['contents'],
				date: calTime(board['date']),
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

// 동네생활 글 목록
router.post('/', async (req, res) => {
	let result = { status: 'success' };
	const nickname = '키티'; // 토큰으로 받아올 임시 데이터
	const area = '강남구';
	try {
		await TownBoard.create({
			contents: req.body['contents'],
			nickname: nickname,
			date: Date.now(),
			area: area,
			images: ['파일1', '파일2', '파일이름3']
		});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

// 동네생활 글 상세 정보
router.get('/:townId', async (req, res) => {
	let result = { status: 'success' };
	const townId = req.params.townId;
	try {
		board = await TownBoard.findOne({ _id: townId });
		result['board'] = {
			townId: board['_id'],
			nickname: board['nickname'],
			beforeTime: calTime(board['date']),
			area: board['area'],
			contents: board['contents'],
			images: board['images']
		};
	} catch (err) {
		result['status'] = 'fail';
	}
	console.log(result);
	res.json(result);
});

module.exports = router;
