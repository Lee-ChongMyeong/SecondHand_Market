const express = require('express');
const router = express.Router();
const exchangeBoard = require('../schemas/exchangeBoard')

//중고거래 데이터 저장
router.post('/', async(req, res)=>{
    const {images, title, price, contents} = req.body

    await exchangeBoard.create({images, title, price, contents})

    console.log("추가 완료")
})

//중고거래 데이터 뷰
router.get('/', async(req, res)=> {
    const exchangeBoardData = await exchangeBoard.find({})

    res.json({exchangeBoardData: exchangeBoardData})
} )

//중고거래 상세 페이지 뷰
router.get('/:exchangeId', async(req, res)=> {
    const {exchangeId} = req.params

    const exchangeDetail = await exchangeBoard.find({exchangeId: exchangeId})

    if(exchangeDetail.length>0){
        await exchangeBoard.create({images, title, price, contents})
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

