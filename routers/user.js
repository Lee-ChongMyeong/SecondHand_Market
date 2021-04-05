const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../schemas/user');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

//// [회원가입]
router.post('/', async (req, res) => {
	const { id, password, confirmPassword, nickname, area } = req.body;

	if (!(id && password && confirmPassword && nickname && area)) {
		res.json({ msg: 'empty' });
		return;
	}

	if (password !== confirmPassword) {
		res.json({ msg: 'not_match' });
		return;
	}

	try {
		const existUsers = await User.findOne({
			$or: [{ id }, { nickname }]
		});

		if (existUsers) {
			res.json({ msg: 'exist_user' });
			return;
		}
		
		await User.create({
			id : sanitizeHtml(id),
			password: bcrypt.hashSync(password, 10),
			nickname : sanitizeHtml(nickname),
			area : sanitizeHtml(area)
		});
	} catch {
		res.json({ msg: 'error' });
		return;
	}
	res.json({ msg: 'success' });
});

//// [내정보 조회]
router.get('/me', authMiddleware, async (req, res) => {
	res.send({ user: res.locals.user });
});

module.exports = router;
