'use strict';
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const connect = require('../functions/db');
const captcha = require('../middleware/captcha');
const sendMail = require('../functions/sendResetMail');
require('dotenv').config();
//const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
router.use(helmet());
router.use(morgan('combined'));
/*router.use(
	cors({
		origin: '*',
	})
); //Uten denne vil man få nettwork error. */

// get usermodel
const User = require('../models/User');
const Token = require('../models/resetPassword');

router.post('/', async (req, res) => {
	res.json('OK');
});

module.exports = router;
