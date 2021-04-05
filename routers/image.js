const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/');
	},
	filename: function (req, file, cb) {
		cb(null, 'img' + Date.now() + '_' + file.originalname);
	}
});

const upload = multer({ storage: storage });

router.post('/', upload.array('images'), authMiddleware, async (req, res) => {
	result = { status: 'success', images: [] };
	try {
		if (req.files) {
			for (value of req.files) {
				result['images'].push(value.filename);
			}
		}
	} catch (err) {
		result['status'] = 'fail';
	}
	res.json(result);
});

module.exports = router;
