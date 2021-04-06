const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const exchangeBoard = require('../schemas/exchangeBoard');
const authMiddleware = require('../middlewares/auth-middleware')

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
//중고거래 데이터 저장
router.post('/', authMiddleware, async (req, res) => {
	let result = { status: 'success' };
	const soldState = 1;
	const user = res.locals.user;
	try {
		await exchangeBoard.create({
			contents: req.body['contents'],
            title: req.body['title'],
			nickname: user.nickname,
			date: Date.now(),
			area: user.area,
			images: req.body['images'],
			soldState: soldState
		});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

//중고거래 데이터 뷰
router.get('/', authMiddleware, async(req, res)=> {
	const user = res.locals.user;
	let area = user.area;
	let result = { status: 'success', exchangeBoardData: [] };
	try {
		let exchangeBoardData = await exchangeBoard.find({area: area}).sort({ date: -1 });
		console.log(exchangeBoardData)
		for (exchangeBoards of exchangeBoardData) {

			let temp = {
				exchangeId: exchangeBoards['_id'],
				nickname: sanitizeHtml(exchangeBoards['nickname']),
				area: sanitizeHtml(exchangeBoards['area']),
				contents: sanitizeHtml(exchangeBoards['contents']),
				date: calTime(exchangeBoards['date']),
				soldState: sanitizeHtml(exchangeBoards['soldState']),
				images: exchangeBoards['images']
			};
			result['exchangeBoardData'].push(temp);
		}
	} catch (err) {
		console.log(err)
		result['status'] = 'fail';
	}
	res.json(result);
} )

//중고거래 상세 페이지 뷰
router.get('/:exchangeId', authMiddleware, async(req, res)=> {
    const {exchangeId} = req.params

	try {
		let exchangeBoardData = await exchangeBoard.find({exchangeId: exchangeId}).sort({ date: -1 });
		console.log(exchangeBoardData)
		for (exchangeBoards of exchangeBoardData) {

			let temp = {
				exchangeId: exchangeBoards['_id'],
				nickname: sanitizeHtml(exchangeBoards['nickname']),
				area: sanitizeHtml(exchangeBoards['area']),
				contents: sanitizeHtml(exchangeBoards['contents']),
				date: calTime(exchangeBoards['date']),
				soldState: sanitizeHtml(exchangeBoards['soldState']),
				images: exchangeBoards['images']
			};
			result['exchangeBoardData'].push(temp);
		}
	} catch (err) {
		console.log(err)
		result['status'] = 'fail';
	}
	
    res.json(result)
})

//중고거래 상세 페이지 수정
router.patch('/:exchangeId', authMiddleware, async(req, res, next)=> {
	let result = { status: 'success' };
    const {exchangeId} = req.params
    const {images, title, price, contents} = req.body

	await exchangeBoard.updateOne({_id:exchangeId}, {title, price, images, contents})

	res.json(result)

})

//중고거래 상세 페이지 제거
router.delete('/:exchangeId', authMiddleware, async(req, res)=>{
	let result = { status: 'success' };

	try {
		const exchangeIds = req.params.exchangeId;
		const user = res.locals.user;
		await exchangeBoard.deleteOne({ _id: exchangeIds, userId: user.id });

	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
})


module.exports = router;