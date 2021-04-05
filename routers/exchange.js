const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const exchangeBoard = require('../schemas/exchangeBoard')

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
router.post('/', async (req, res) => {
	let result = { status: 'success' };
	const nickname = 'junhee916'; // 토큰으로 받아올 임시 데이터
	const area = '강남구';
	const soldState = 1;
	try {
		await exchangeBoard.create({
			contents: req.body['contents'],
            title: req.body['title'],
			nickname: nickname,
			date: Date.now(),
			area: area,
			images: req.body['images'],
			soldState: soldState
		});
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

//중고거래 데이터 뷰
router.get('/', async(req, res)=> {
    let area = '강남구'; // 임시데이터
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
				images: ['images']
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
router.get('/:exchangeId', async(req, res)=> {
    const {exchangeId} = req.params

    const exchangeDetail = await exchangeBoard.find({exchangeId: exchangeId})

    if(exchangeDetail.length>0){
        await exchangeBoard.create({title, price, contents, nickname, area})
    }

    res.json({exchangeDetail: exchangeDetail})
})

//중고거래 상세 페이지 수정
router.patch('/:exchangeId/update', async(req, res)=> {
    const {exchangeId} = req.params
    const {images, title, price, contents} = req.body

    const exchangeDetail = await exchangeBoard.find({exchangeId: exchangeId})

})

//중고거래 상세 페이지 제거
router.delete('/:exchangeId/delete', async(req, res)=>{
    const {exchangeId} = req.params

    const exchangeDetail = await exchangeBoard.find({exchangeId: exchangeId})

    await exchangeDetail.deleteOne({exchangeId})

    console.log("제거 성공")

})


module.exports = router;