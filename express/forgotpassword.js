'use strict';
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const connect = require('../functions/db');
const captcha = require('../middleware/captcha');
require('dotenv').config();
const cors = require('cors');
app.use(cors());

const User = require('../models/User');
const Token = require('../models/resetPassword');
app.post('/', async (req, res) => {
	const { email } = req.body.data;
	connect();
	const user = await User.find({ email });
	res.json(user);
	return;
});

module.exports = app;
/*
router.post('/', async (req, res) => {
	//destructure email from request
	const { email } = req.body.data;
	//connecting to database
	connect();
	//see if a token exists
	try {
		//const user = await User.find({ email });
		res.json('ok');
		return;
	} catch (err) {
		console.log(err);
		res.status(400).json({ msg: err });
		return;
	}
});

module.exports = router;
*/
