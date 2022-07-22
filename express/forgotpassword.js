'use strict';
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const connect = require('../functions/db');
const captcha = require('../middleware/captcha');
const sendMail = require('../functions/sendResetMail');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
router.use(helmet());
router.use(morgan('combined'));
/*router.use(
	cors({
		origin: '*',
	})
); */ //Uten denne vil man få nettwork error. */

// get usermodel
const User = require('../models/User');
const Token = require('../models/resetPassword');

router.post('/', async (req, res) => {
	//destructure email from request
	const { email } = req.body.data;
	//connecting to database
	connect();
	//see if a token exists
	try {
		const user = await User.find({ email });
		res.header('Content-Type', 'application/json');
		res.header('Access-Control-Allow-Origin', '*');
		res.json(user);
		return;
	} catch (err) {
		res
			.status(400)
			.header('Access-Control-Allow-Origin', '*')
			.json({ msg: err });
		return;
	}
});

module.exports = router;
