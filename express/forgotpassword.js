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

router.post('/', (req, res) => {
	res.json('OK');
});

module.exports = router;
