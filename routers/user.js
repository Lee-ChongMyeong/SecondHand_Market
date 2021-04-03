const jwt = require("jsonwebtoken");
const express = require('express');
const User = require('../schemas/user');
const router = express.Router();
const mongoose = require('mongoose')
const authMiddleware = require("../middlewares/auth-middleware")
const bcrypt = require('bcrypt');


//// [회원가입]
router.post("/register", async (req, res) => {
    const { id, password, confirmPassword,nickname} = req.body;

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage : '패스워드가 패스워드 확인란과 동일하지 않습니다.',
        });
        return;
    }
    const existUsers = await User.findOne({
        $or : [{ id }, { nickname }],
    });
    if (existUsers){
        res.status(400).send({
            errorMessage : '이미 가입된 이메일 또는 닉네임이 있습니다.',
        });
        return;
    }

    const user = new User({ id, nickname, password})
    await user.save();

    res.status(201).send({});
});



//// [로그인]
router.post("/", async (req, res) => {
    const { id, password } = req.body;

    const user = await User.findOne({ id, password}).exec();

    if (!user || password !== user.password) {
        res.status(400).send({
            errorMessage : '이메일 또는 패스워드가 잘못됐습니다.'
        });
        return;
    }

    const token = jwt.sign({ userId : user.userId }, "fake_carrot_market")

    res.send({
        token,
    });
  });


//// [미들웨어]
router.get("/users/me", authMiddleware, async(req, res) =>{
    console.log(res.locals);
    const { user } = res.locals;
    console.log(user);

    res.send({
        user
    })
})

module.exports = router;
