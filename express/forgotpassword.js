const express = require('express');
const router = express.Router();
//const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connect = require('../functions/db');
const captcha = require('../middleware/captcha');
const sendMail = require('../functions/sendResetMail');

require('dotenv').config();
// get usermodel
const User = require('../models/User');
const Token = require('../models/resetPassword');

//@path: /forgotpassword
//@ public
// @todo	Lage token med JWT som skal sendes ved på linken. her må også databasen oppdateres med token.
//@todo: lage link som skal sendes i mailen og teste om mailen fungerer. Må også oppdatere user for å sette token

router.post(
	'/',
	captcha,
	/**/ async (req, res) => {
		const { email } = req.body.data;
		console.log(email);
		connect();
		try {
			// See if user exists
			const user = await User.findOne({ email });
			if (!user) {
				console.log('no user'); //fjernes
				return res.status(200).json({
					errors: [{ msg: 'If user Exists, an email will be sendt' }],
				});
			}
			const extToken = await Token.findOne({ userId: user._id });
			if (extToken) {
				await extToken.deleteOne();
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

			const salt = await bcrypt.genSalt(10);
			const tokenHash = await bcrypt.hash(webToken, salt);

			const token = new Token({
				userId: user._id,
				token: tokenHash,
			});
			await token.save();

			/* @note: nytt token skal sjekkes mot lagret token i database.
					deretter vil jeg bruke token som var med i linken når jeg skal finne user.*/

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
			res
				.status(200)
				.header('Access-Control-Allow-Origin', '*')
				.json({ link: webToken, url: UrlLink });
			return;
		} catch (err) {
			res.status(400).json(err); //.json({ errors: [{ msg: err }] });
			return;
		}
	}
); //*/
module.exports = router;
