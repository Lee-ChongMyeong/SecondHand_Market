const jwt = require("jsonwebtoken");
const express = require('express');
const User = require('../schemas/user');
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")
const bcrypt = require('bcrypt');
require("dotenv").config()


//// [로그인]
router.post("/", async (req, res) => {
    const { id, password } = req.body;

    const user = await User.findOne({ id}).exec();

    if (!id || !password) {
		res.json({ msg : 'fail' });
		return;
	}

    if(user) {
        await bcrypt.compare(password, user.password, (err, match) => {

            if(match){
                const token = jwt.sign({ userId : user.userId }, process.env.SECRET_KEY );
                res.json({ msg : 'success', token})
            }else{
                res.json({ msg : 'fail' });
            }
        }
    )}else{
        res.json({ msg : "fail" });
    }
});

module.exports = router;