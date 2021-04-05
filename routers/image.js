const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({ dest: 'public/images/' });

router.post('/', upload.array('images'), async (req, res) => {
	result = { status: "success", images: [] }
	try {
		if (req.files) {
			for (value of req.files) {
				result['images'].push(value.filename)
			}
		}
	} catch (err) {
		result['status'] = 'fail'
	}
	res.json(result)
});

module.exports = router
