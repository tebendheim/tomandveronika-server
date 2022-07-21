const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const connect = require('../functions/db');
const captcha = require('../middleware/captcha');
const sendMail = require('../functions/sendResetMail');
require('dotenv').config();
// get usermodel
const User = require('../models/User');
const Token = require('../models/resetPassword');

router.post('/', async (req, res) => {
	//destructure email from request
	const { email } = req.body.data;
	//connecting to database
	connect();
	try {
		res.json(email);
		return;
	} catch (err) {
		res.status(400).json({ msg: err });
		return;
	}
});

module.exports = router;
