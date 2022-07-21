const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const normalize = require('normalize-url');
const auth = require('../middleware/auth');
const connect = require('../functions/db');
const captcha = require('../middleware/captcha');
const sendMail = require('../functions/sendResetMail');

require('dotenv').config();
// get usermodel
const User = require('../models/User');
const Token = require('../models/resetPassword');

// get usermodel
// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

//@route    POST api/auth
// @desc    register user
// @access  Public
// @todo	Denne må sjekkes om fungerer. Her er koden bare hentet fra tidligere prosjekt.

router.post(
	'/',
	[
		check('email', 'Please enter a valid email').isEmail(),
		check('password', 'Password is required').exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { email, password } = req.body;

		try {
			// See if user exists
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			// check password
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid credentials' }] });
			}

			// Retur json webtoken
			const payload = {
				user: {
					id: user.id,
				},
			};
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000,
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	}
);

//@path: login/forgotpassword
//@ public
// @todo	Lage token med JWT som skal sendes ved på linken. her må også databasen oppdateres med token.
//@todo: lage link som skal sendes i mailen og teste om mailen fungerer. Må også oppdatere user for å sette token

router.post(
	'/forgotpassword',
	//captcha,
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
			const UrlLink = `http://www.tomandveronika.com/forgotpassword/reset/${webToken}`; //webToken er uhashet token
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
			res.status(200).json({ link: webToken, url: UrlLink }); // dette må endres fjernes før deployment. riktig token skal ikke sendes til frontend
			return;
		} catch (err) {
			res.status(400).json(err); //.json({ errors: [{ msg: err }] });
			return;
		}
	}
); //*/

//@path	/login/resetpassword
/*@todo
	Sjekke om JWT er gyldig,
	oppdatere database med nytt passord
	slette linken fra databasen, slik at den ikke kan brukes igjen.
	sørge for at en token MÅ være inkludert for å sette nytt passord.
	bør kanskje sette denne linken i databasen til å være en eller annen form for hashet passord i mellomtiden, slik at det ikke er mulig å utnytte dette.
	
*/
/* @ Må sendes: 
	headers: x-auth-token
	body: newPassword, repeatPassword */

router.post(
	'/resetpassword',
	captcha,
	/**/ async (req, res) => {
		connect();
		try {
			const secret = process.env.JWT_RESET_PASSWORD;
			const reqToken = req.headers['x-auth-token'];
			let decoded;
			if (!reqToken) {
				return res.status(400).json({ errors: [{ msg: 'missing token' }] });
			}
			//@destructure token & // @check if valid token
			try {
				decoded = jwt.verify(reqToken, secret, { algorithm: 'HS256' });
			} catch (err) {
				return res.status(400).json({ errors: [{ msg: 'token error' }] });
			}

			//@find user._id fra token
			const user = decoded.user.id;

			//@connect to database and get token from database

			const databaseToken = await Token.findOne({ userId: user });
			const storedToken = databaseToken.token;

			//@comparing reqToken and storedToken.
			const validPassword = bcrypt.compare(reqToken, storedToken);
			//@sending error if token is not equal to each other.
			if (!validPassword) {
				return res.status(400).json({ errors: [{ msg: 'Server Error' }] });
			}

			//@ getting new password from req
			const { newPassword, repeatPassword } = req.body;

			if (newPassword != repeatPassword) {
				return res.status(400).json({ errors: [{ msg: 'Server Error' }] });
			}
			// hasing new password
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(newPassword, salt);

			//@getting user and updating password.
			const baseUser = await User.findOne({ _id: user });
			await baseUser.updateOne({ password: hash });
			res.json('Password is updated.');
		} catch (err) {
			console.error(err);
		}
	}
);
//*/

module.exports = router;
