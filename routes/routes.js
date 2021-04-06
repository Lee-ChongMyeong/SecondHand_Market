const express = require('express');
const router = express.Router();

const userRouter = require('../routers/user');
router.use('/user', [userRouter]);

const authRouter = require('../routers/auth');
router.use('/auth', [authRouter]);

const exchangeRouter = require('../routers/exchange');
router.use('/exchange', [exchangeRouter]);

const townRouter = require('../routers/town');
router.use('/town', [townRouter]);

const imageRouter = require('../routers/image');
router.use('/image', [imageRouter]);

const profileRouter = require('../routers/profile');
router.use('/profile', [profileRouter]);

const commentRouter = require('../routers/comment.js');
router.use('/comment', [commentRouter]);

module.exports = router
