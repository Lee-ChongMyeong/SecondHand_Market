const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../schemas/user');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

// [아이디, 비밀번호 회원가입간 확인]
function check_id(id) {
	if (id.length < 3) {
		return false;
	}
	const available_char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
	for (char of id) {
		if (!available_char.includes(char)) {
			return false;
		}
	}
	return true;
}

function check_password(id, password) {
	if (password.length < 4) {
		return false;
	}
	if (password.includes(id)) {
		return false;
	}
	if (id.includes(password)) {
		return false;
	}
	if (password.includes(' ')) {
		return false;
	}
	return true;
}

function check_nickname(nickname) {
	if (nickname.length < 3) {
		return false;
	}
	if (nickname.length > 10) {
		return false;
	}
	if (nickname.includes(' ')) {
		return false;
	}
	return true;
}

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

	if (!check_id(id)) {
		res.json({ msg: 'incorrect_id' });
		return;
	}
	if (!check_password(id, password)) {
		res.json({ msg: 'incorrect_password' });
		return;
	}

	if (!check_nickname(nickname)) {
		res.json({ msg: 'incorrect_nickname' });
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
			id: sanitizeHtml(id),
			password: bcrypt.hashSync(password, 10),
			nickname: sanitizeHtml(nickname),
			area: sanitizeHtml(area)
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
