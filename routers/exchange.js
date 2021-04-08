const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const exchangeBoard = require('../schemas/exchangeBoard');
const authMiddleware = require('../middlewares/auth-middleware');
const calTime = require('./calTime');

//중고거래 글 추가
router.post('/', authMiddleware, async (req, res) => {
	let result = { status: 'success' };
	const user = res.locals.user;
	try {
		await exchangeBoard.create({
			contents: req.body['contents'],
			title: req.body['title'],
			price: req.body['price'],
			nickname: user.nickname,
			id: user.id,
			date: Date.now(),
			area: user.area,
			images: req.body['images']
		});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

//중고거래 글 조회
router.get('/', authMiddleware, async (req, res) => {
	const user = res.locals.user;
	let area = user.area;
	let result = { status: 'success', exchangeBoardData: [] };
	try {
		let exchangeBoardData = await exchangeBoard.find({ area: area }).sort({ date: -1 });
		for (exchangeBoards of exchangeBoardData) {
			let temp = {
				title: sanitizeHtml(exchangeBoards['title']),
				contents: sanitizeHtml(exchangeBoards['contents']),
				nickname: sanitizeHtml(exchangeBoards['nickname']),
				price: sanitizeHtml(exchangeBoards['price']),
				soldState: sanitizeHtml(exchangeBoards['soldState']),
				exchangeId: exchangeBoards['_id'],
				userId: sanitizeHtml(exchangeBoards['id']),
				area: sanitizeHtml(exchangeBoards['area']),
				date: calTime(exchangeBoards['date']),
				images: exchangeBoards['images']
			};
			result['exchangeBoardData'].push(temp);
		}
	} catch (err) {
		console.log(err);
		result['status'] = 'fail';
	}
	res.json(result);
});

//중고거래 글 상세 정보
router.get('/:exchangeId', authMiddleware, async (req, res) => {
	const { exchangeId } = req.params;

	try {
		let exchangeBoardData = await exchangeBoard.find({ exchangeId: exchangeId }).sort({ date: -1 });
		for (exchangeBoards of exchangeBoardData) {
			let temp = {
				exchangeId: exchangeBoards['_id'],
				nickname: sanitizeHtml(exchangeBoards['nickname']),
				userId: exchangeBoard['id'],
				area: sanitizeHtml(exchangeBoards['area']),
				contents: sanitizeHtml(exchangeBoards['contents']),
				date: calTime(exchangeBoards['date']),
				soldState: sanitizeHtml(exchangeBoards['soldState']),
				images: exchangeBoards['images']
			};
			result['exchangeBoardData'].push(temp);
		}
	} catch (err) {
		console.log(err);
		result['status'] = 'fail';
	}
	res.json(result);
});

//중고거래 글 수정
router.put('/:exchangeId', authMiddleware, async (req, res, next) => {
	let result = { status: 'success' };
	try {
		const user = res.locals.user;
		const { exchangeId } = req.params;
		const { images, title, price, contents } = req.body;

		const { n } = await exchangeBoard.updateOne({ _id: exchangeId, id: user.id }, { title, price, images, contents });
		if (!n) {
			result['status'] = 'fail';
		}
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

//중고거래 글 삭제
router.delete('/:exchangeId', authMiddleware, async (req, res) => {
	let result = { status: 'success' };

	try {
		const exchangeIds = req.params.exchangeId;
		const user = res.locals.user;
		const { deletedCount } = await exchangeBoard.deleteOne({ _id: exchangeIds, id: user.id });
		if (!deletedCount) {
			result['status'] = 'fail';
		}
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

module.exports = router;
