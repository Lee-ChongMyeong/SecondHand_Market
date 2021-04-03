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
    const exchangeBoardData = await exchangeBoard.find({});

    res.json({exchangeBoardData: exchangeBoardData})
} )

//중고거래 상세 페이지 뷰 
router.get('/:exchangeId', async(req, res)=> {
    const {exchangeId} = req.params

    const exchangeDetail = await exchangeBoard.find({exchangeId: exchangeId})

    res.json({exchangeDetail: exchangeDetail})
})


module.exports = router;

