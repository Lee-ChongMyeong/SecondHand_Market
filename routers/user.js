const jwt = require("jsonwebtoken");
const express = require('express');
const User = require('../schemas/user');
const router = express.Router();
const mongoose = require('mongoose')
const authMiddleware = require("../middlewares/auth-middleware")
const bcrypt = require('bcrypt');
require("dotenv").config()

//// [회원가입]
router.post("/register", async (req, res) => {
    const { id, password, confirmPassword,nickname} = req.body;

    if (password !== confirmPassword) {
        res.json({ msg : 'fail' })
        return;
    }
    const existUsers = await User.findOne({
        $or : [{ id }, { nickname }],
    });
    if (existUsers){
        res.json({ msg : 'fail' })
        return;
    }

    const user = new User({
        id,
        password : bcrypt.hashSync(password, 10),
        nickname});

    await user.save();

    res.status(201).send({});
});



//// [로그인]
router.post("/", async (req, res) => {
    const { id, password } = req.body;

    const user = await User.findOne({ id, password }).exec();

    if (!id || !password) {
		res.json({ msg : 'fail' });
		return;
	}

    if (!user || password !== user.password) {
        res.json({ msg : 'fail' })
        return;
    }

    if(user) {
        await bcrypt.compare(password, user.password, (err, match) => {

            if(match){
                const token = jwt.sign({ userId : user.userId }, process.SECRET_KEY );
                res.json({ msg : 'success', token})
            }else{
                res.json({ msg : 'fail' });
            }
        }
    )}else{
        res.json({ msg : "fail" });
    }
});

//// [내정보 조회]
router.get("/users/me", authMiddleware, async (req, res) => {
    res.send({ user: res.locals.user });
  });


module.exports = router;
