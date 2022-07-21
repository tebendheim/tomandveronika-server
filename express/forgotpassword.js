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
router.use(express.json());
//const bcrypt = require('bcrypt');

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
		const oldToken = await Token.findOne({ userId: user._id });
		if (oldToken) {
			await oldToken.deleteOne();
		}

		const payload = {
			user: {
				id: user._id,
			},
		};

		const secret = process.env.JWT_RESET_PASSWORD;

		const webToken = jwt.sign(payload, secret, {
			algorithm: 'HS256',
			expiresIn: 3600,
		});

		//hash
		//const salt = await bcrypt.genSalt(10);
		//const hash = await bcrypt.hash(webToken, salt);

		const token = new Token({
			userId: user._id,
			token: webToken,
		});
		await token.save();

		//@ Sending mail:
		const name = `${user.name}`;
		const UrlLink = `https://www.tomandveronika.com/forgotpassword/reset/${webToken}`; //webToken er uhashet token
		const sender = {
			email: process.env.MY_EMAIL,
			name: 'Tom & Veronika',
		};
		const receivers = [
			{
				email: `${email}`,
			},
		];
		const msg = {
			sender,
			to: receivers,
			subject: 'Reset your password',
			textContent: `
Hi ${name},

To reset your password, please follow this link: ${UrlLink}

Best regards
Tom & Veronika
`,
			htmlContent: `
<h1>Hi ${name}</h1>
<h3>To reset your password, please follow this <a href=${UrlLink}>link</a>.</h3>

<p>Best Regards</p>
<p>Tom & Veronika</p>
`,
			params: {
				role: 'frontend',
			},
		};
		sendMail(msg);
		res.status(200).json({ link: webToken, url: UrlLink });
		return;
	} catch (err) {
		res.status(400).json({ msg: err });
		return;
	}
});

module.exports = router;
