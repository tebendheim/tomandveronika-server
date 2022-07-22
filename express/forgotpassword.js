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
router.use(
	cors({
		origin: '*',
	})
); //Uten denne vil man få nettwork error. */

// get usermodel
const User = require('../models/User');
const Token = require('../models/resetPassword');

router.post('/', async (req, res) => {
	//destructure email from request
	const { email } = req.body.data;
	//connecting to database
	connect();
	try {
		//see if user exists
		const user = await User.findOne({ email });
		if (!user) {
			res.status(200).json({
				errors: [{ msg: 'If user Exists, an email will be sendt' }],
			});
			return;
		}

		//see if a token exists

		res.header('Access-Control-Allow-Origin', '*').send('OK');
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
