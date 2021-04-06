const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();

router.get('/', authMiddleware, async (req, res, next) => {
	let result = { status: 'success', profileData: [] };

	try {
		const user = res.locals.user;

		let temp = {
			id: user.id,
			nickname: user.nickname,
			area: user.area
		};
		result['profileData'].push(temp);
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

module.exports = router;
