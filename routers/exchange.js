const express = require('express');
const router = express.Router();
const exchangeBoard = require('../schemas/exchangeBoard')

//중고거래 데이터 저장
router.post('/', async (req, res) => {
	let result = { status: 'success' };
	const nickname = 'junhee916'; // 토큰으로 받아올 임시 데이터
	const area = '강남구';
	try {
		await exchangeBoard.create({
			contents: req.body['contents'],
            title: req.body['title'],
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

//중고거래 데이터 뷰
router.get('/', async(req, res, next)=> {
    let area = '강남구'; // 임시데이터
	let result = { status: 'success', exchangeBoardData: [] };
	try {
		let exchangeBoardData = await exchangeBoard.find({area: area}).sort({ _id: -1 });
		for (exchangeBoard of exchangeBoardData) {
			let temp = {
				exchangeBoardId: exchangeBoard['_id'],
				nickname: exchangeBoard['nickname'],
				area: exchangeBoard['area'],
				contents: exchangeBoard['contents'],
				date: calTime(exchangeBoard['date']),
			};
			result['exchangeBoardData'].push(temp);
		}
	} catch (err) {
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

